import axios from "axios";
import "dotenv/config";

import { saveHeader, listS3Objects } from "./s3Service";
import { getDecoded, delay, splitIntoChunks, getRequiredEnvString, getRequiredEnvNumber, createSignal } from "../utils/helpers";
import { transactionService } from "./transactionService";
import { eventService } from "./eventService";
import { syncStatusService } from "./syncStatusService";
import { syncErrorService } from "./syncErrorService";
import { transferService } from "./transferService";
import { fetchHeadersWithRetry } from "./sync/header"
import { fetchCut, FetchCutResult } from "./sync/fetch"
import { getCoinTransfers, getNftTransfers } from "./sync/transfers"

import {
  SOURCE_S3,
  SOURCE_API,
  SOURCE_BACKFILL,
  SOURCE_STREAMING,
} from "../models/syncStatus";
import { BlockAttributes } from "../models/block";
import { TransactionAttributes } from "../models/transaction";
import { EventAttributes } from "../models/event";
import { TransferAttributes } from "../models/transfer";
import Contract, { ContractAttributes } from "../models/contract";
import { Transaction } from "sequelize";
import { getPrecision } from "../utils/pact";

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");
const SYNC_MIN_HEIGHT = getRequiredEnvNumber("SYNC_MIN_HEIGHT");
const SYNC_FETCH_INTERVAL_IN_BLOCKS = getRequiredEnvNumber(
  "SYNC_FETCH_INTERVAL_IN_BLOCKS"
);
const SYNC_TIME_BETWEEN_REQUESTS_IN_MS = getRequiredEnvNumber(
  "SYNC_TIME_BETWEEN_REQUESTS_IN_MS"
);
const SYNC_ATTEMPTS_MAX_RETRY = getRequiredEnvNumber("SYNC_ATTEMPTS_MAX_RETRY");
const SYNC_ATTEMPTS_INTERVAL_IN_MS = getRequiredEnvNumber(
  "SYNC_ATTEMPTS_INTERVAL_IN_MS"
);

const shutdownSignal = createSignal();

/**
 * Type definition for a function that processes an individual key.
 *
 * @param {string} network - The identifier for the blockchain network (e.g., 'mainnet01').
 * @param {string} prefix - The S3 object prefix used to locate blockchain header data.
 * @param {string} key - The specific S3 object key that points to the data to be processed.
 * @returns {Promise<void>} A promise that resolves when the processing of the key is complete.
 */
type ProcessKeyFunction = (
  network: string,
  prefix: string,
  key: string
) => Promise<void>;

/**
 * Processes keys from S3 for a specific network and chainId.
 * This method fetches a list of keys from an S3 bucket based on the last synchronization status.
 * For each key, it reads and parses the S3 object to obtain block data, saves the block data to the database,
 * and updates the synchronization status accordingly.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 * @param {number} chainId - The chain ID to process headers for.
 * @param {string} prefix - The prefix for the S3 keys to process.
 * @param {ProcessKeyFunction} processKey - The function to process each key.
 * @param {number} maxKeys - The maximum number of keys to process in a single batch.
 * @param {number} maxIterations - The maximum number of iterations to perform. Unlimited if not specified.
 * @returns {Promise<number>} - A promise that resolves with the total number of keys processed.
 */
export async function processKeys(
  network: string,
  chainId: number,
  prefix: string,
  processKey: ProcessKeyFunction,
  maxKeys: number = 20,
  maxIteractions?: number
): Promise<number> {
  let totalKeysProcessed = 0;

  try {
    const lastSync = await syncStatusService.findWithPrefix(
      chainId,
      network,
      prefix,
      SOURCE_S3
    );

    let startAfter = lastSync ? lastSync.key : undefined;
    let isFinished = false;
    let iterationCount = 0;

    while (
      !isFinished &&
      (!maxIteractions || iterationCount < maxIteractions)
    ) {
      const keys = await listS3Objects(prefix, maxKeys, startAfter);
      if (keys.length > 0) {
        await Promise.all(
          keys.map(async (key) => {
            processKey(network, prefix, key);
          })
        );
        totalKeysProcessed += keys.length;
        startAfter = keys[keys.length - 1];
        iterationCount++;
      } else {
        isFinished = true;
      }
    }

    await syncStatusService.save({
      chainId: chainId,
      network: network,
      key: startAfter,
      prefix: prefix,
      source: SOURCE_S3,
    } as any);
  } catch (error) {
    console.error("Error processing block headers from storage:", error);
  }

  return totalKeysProcessed;
}

/**
 * Processes a single S3 payload key, extracting transaction and event information from the payload data.
 * It parses the payload to save transaction attributes and related events into the database.
 *
 * @param network The blockchain network identifier.
 * @param prefix The S3 object prefix used to locate blockchain data.
 * @param key The specific S3 object key pointing to the payload data to be processed.
 */
export async function processPayloadKey(
  network: string,
  block: BlockAttributes,
  payloadData: any,
  options?: Transaction
) {
  const TRANSACTION_INDEX = 0;
  const RECEIPT_INDEX = 1;

  const payloadHash = payloadData.payloadHash;
  const transactions = payloadData.transactions || [];

  if (transactions.length > 0) {
    console.log("transactions.length", transactions.length);
  }

  for (const transactionArray of transactions) {
    const transactionInfo = transactionArray[TRANSACTION_INDEX];
    const receiptInfo = transactionArray[RECEIPT_INDEX];

    let sigsData = transactionInfo.sigs;
    let cmdData;
    try {
      cmdData = JSON.parse(transactionInfo.cmd);
    } catch (error) {
      console.error(
        `Error parsing cmd JSON for key ${transactionInfo.cmd}: ${error}`
      );
    }

    const eventsData = receiptInfo.events || [];
    const transactionAttributes = {
      blockId: block.id,
      payloadHash: payloadHash,
      code: cmdData.payload.exec ? cmdData.payload.exec.code : null,
      data: cmdData.payload.exec ? cmdData.payload.exec.data : null,
      chainId: cmdData.meta.chainId,
      creationtime: cmdData.meta.creationTime,
      gaslimit: cmdData.meta.gasLimit,
      gasprice: cmdData.meta.gasPrice,
      hash: transactionInfo.hash,
      nonce: cmdData.nonce || "",
      continuation: receiptInfo.continuation || "",
      gas: receiptInfo.gas,
      result: receiptInfo.result || null,
      logs: receiptInfo.logs || null,
      metadata: receiptInfo.metaData || null,
      num_events: eventsData ? eventsData.length : 0,
      requestkey: receiptInfo.reqKey,
      rollback: receiptInfo.result
        ? receiptInfo.result.status != "success"
        : true,
      sender: cmdData.meta.sender || null,
      sigs: sigsData,
      step: receiptInfo.step || null,
      ttl: cmdData.meta.ttl,
      txid: receiptInfo.txId ? receiptInfo.txId.toString() : null,
    } as TransactionAttributes;

    const eventsAttributes = eventsData.map((eventData: any) => {
      return {
        payloadHash: payloadHash,
        chainId: transactionAttributes.chainId,
        module: eventData.module.namespace
          ? `${eventData.module.namespace}.${eventData.module.name}`
          : eventData.module.name,
        modulehash: eventData.moduleHash,
        name: eventData.name,
        params: eventData.params,
        paramtext: eventData.params,
        qualname: eventData.module.namespace
          ? `${eventData.module.namespace}.${eventData.module.name}`
          : eventData.module.name,
        requestkey: receiptInfo.reqKey,
      } as EventAttributes;
    }) as EventAttributes[];

    const transfersCoinAttributes = getCoinTransfers(
      network,
      eventsData,
      payloadHash,
      transactionAttributes,
      receiptInfo
    );

    const transfersNftAttributes = getNftTransfers(
      network,
      transactionAttributes.chainId,
      eventsData,
      payloadHash,
      transactionAttributes,
      receiptInfo
    );

    const transfersAttributes = [
      transfersCoinAttributes,
      transfersNftAttributes,
    ]
      .flat()
      .filter((transfer) => transfer.amount !== undefined);

    try {
      let transactionInstance = await transactionService.save(
        transactionAttributes,
        options
      );

      let transactionId = transactionInstance.id;

      const eventsWithTransactionId = eventsAttributes.map((event) => ({
        ...event,
        transactionId: transactionId,
      })) as EventAttributes[];

      await eventService.saveMany(eventsWithTransactionId, options);

      const transfersWithTransactionId = transfersAttributes.map(
        (transfer) => ({
          ...transfer,
          tokenId: transfer.tokenId,
          contractId: transfer.contractId,
          transactionId: transactionId,
        })
      ) as TransferAttributes[];

      await transferService.saveMany(transfersWithTransactionId, options);
    } catch (error) {
      console.error(`Error saving transaction to the database: ${error}`);
    }
  }
}

export async function saveContract(network: string, chainId: number, modulename: any, contractId: any, type: string, tokenId?: any, manifestData?: any, precision?: number) {
  const contractData = {
    network: network,
    chainId: chainId,
    module: modulename,
    type: type,
    metadata: manifestData,
    tokenId: tokenId,
    precision: precision,
  } as ContractAttributes;

  const existingContract = await Contract.findOne({
    where: {
      network: contractData.network,
      chainId: contractData.chainId,
      module: contractData.module,
      tokenId: tokenId,
    },
  });

  if (!existingContract) {
    const newContract = await Contract.create(contractData);
    contractId = newContract.id;
  } else {
    contractId = existingContract.id;
  }
  return contractId;
}




export async function fetchAndSavePayloadWithRetry(
  network: string,
  chainId: any,
  height: any,
  payloadHash: any,
  blockData: any
) {
  const payload = await fetchPayloadWithRetry(
    network,
    chainId,
    height,
    height,
    [payloadHash]
  );

  if (payload.length === 0) {
    // console.log("payload", payload);
    console.error("No payload found for height and chain:", {
      height,
      chainId,
      blockData,
    });

    return;
  }

  blockData.payload = payload[0];

  await saveHeader(network, chainId, height, blockData);
}

/**
 * Initiates the process of synchronizing blockchain data from a specific point, either from the latest block cut or from the
 * last recorded synchronization status for each chain.
 *
 * The synchronization process involves the following steps:
 * 1. Fetching the latest cut from the Chainweb network to determine the current highest block heights across all chains.
 * 2. Retrieving the last synchronization status for all chains to identify the starting point of the fill process.
 *    If no previous synchronization status is found for a chain, the process starts from the height provided by the latest cut.
 * 3. Processing each chain individually in a round-robin fashion, fetching headers and their corresponding payloads from
 *    the last height down to a specified minimum height. This ensures that the load is evenly distributed across all chains and
 *    that the system remains responsive during the synchronization process.
 * 4. For each chain, headers and payloads are fetched in descending order (from higher blocks to lower blocks), allowing for
 *    efficient catch-up to the current state of the blockchain.
 * 5. The process continues iteratively, moving through each chain in turn, until all chains have reached the minimum required block height.
 *
 * @param {string} network - The identifier of the Chainweb network from which to synchronize data (e.g., 'mainnet01').
 *
 */
export async function startBackFill(network: string): Promise<void> {
  try {
    console.log("Starting filling...");
    let chains = await getLastSync(network);

    console.info("Starting backfill process for chains:", { chains });

    while (chains.length > 0) {
      for (let i = chains.length - 1; i >= 0; i--) {
        const chain = chains[i];

        console.info(`Processing chain:`, {
          chainId: chain.chainId,
          currentHeight: chain.currentHeight,
        });

        let nextHeight = Math.max(
          chain.currentHeight - SYNC_FETCH_INTERVAL_IN_BLOCKS,
          SYNC_MIN_HEIGHT + 1
        );

        console.info(`Fetching headers for chain: ${chain.chainId}`, {
          nextHeight,
        });

        await fetchHeadersWithRetry(
          network,
          chain.chainId,
          nextHeight,
          chain.currentHeight
        );

        chain.currentHeight = nextHeight - 1;

        if (chain.currentHeight <= SYNC_MIN_HEIGHT) {
          chains.splice(i, 1);
        }

        await delay(SYNC_TIME_BETWEEN_REQUESTS_IN_MS);
      }
    }

    console.log("All chains have been processed to the minimum height.");
  } catch (error) {
    console.error("Error during backfilling:", error);
  }
}

/**
 * Retrieves the last synchronization status for each chain in a given network.
 * It fetches the latest cut (highest block heights) from the network and combines
 * this with the last recorded synchronization status for each chain. If no previous
 * synchronization status is found, it starts from the height provided by the latest cut.
 * This method is useful for determining the starting point for synchronization processes,
 * ensuring that all chains are processed up to the current state.
 *
 * @param network The identifier of the Chainweb network from which to retrieve the last sync status.
 * @returns A promise that resolves to an array of objects, each representing a chain with its
 *          chain ID and the current height from which the synchronization should start.
 */
async function getLastSync(network: string): Promise<any> {
  const lastCutResult = (await fetchCut(network)) as FetchCutResult;

  let lastSyncs = await syncStatusService.getLastSyncForAllChains(network, [
    SOURCE_BACKFILL,
    SOURCE_STREAMING,
  ]);

  return Object.entries(lastCutResult.hashes)
    .map(([chainId, lastCut]) => {
      const lastSync = lastSyncs.find(
        (sync) => sync.chainId === parseInt(chainId)
      );
      let currentHeight = lastSync ? lastSync.toHeight - 1 : lastCut.height;

      console.info(`Chain ID: ${chainId}`, {
        action: lastSync ? "Resuming from last sync" : "Starting from cut",
        currentHeight: currentHeight,
        source: lastSync ? "Last Sync" : "Cut",
        notes: `Processing will start at height ${currentHeight}.`,
      });

      return {
        chainId: parseInt(chainId),
        currentHeight,
      };
    })
    .filter((chain) => chain.currentHeight > SYNC_MIN_HEIGHT);
}

/**
 * Initiates a background task (daemon) that periodically checks for and processes missing blocks across all chains
 * within a specified network. It aims to identify gaps in the synchronized data, fetching and processing headers and
 * payloads for missing blocks to ensure complete and up-to-date blockchain data coverage.
 *
 * @param network The blockchain network identifier where missing blocks are to be processed.
 */
export async function startMissingBlocksDaemon(network: string) {
  console.log("Daemon: Starting to process missing blocks...");

  const sleepInterval = parseInt(process.env.SLEEP_INTERVAL_MS || "5000", 10);

  process.on("SIGINT", () => shutdownSignal.trigger());
  process.on("SIGTERM", () => shutdownSignal.trigger());

  while (!shutdownSignal.isTriggered) {
    try {
      await startMissingBlocks(network);
      console.log(
        `Daemon: Waiting for ${sleepInterval / 1000
        } seconds before the next iteration...`
      );
      await delay(sleepInterval);
    } catch (error) {
      console.error("Daemon: Error occurred in startMissingBlocks -", error);
      console.log(
        `Daemon: Attempting to restart after waiting ${sleepInterval / 1000
        } seconds...`
      );
      await delay(sleepInterval);
    }
  }

  console.log("Daemon: Shutting down gracefully.");
}

/**
 * Initiates the process to handle missing blocks for all chains within a specified network.
 * This function iterates through each chain in the network, identifies missing blocks, and
 * processes them in chunks to manage large ranges efficiently.
 *
 * @param network The network identifier to process missing blocks for.
 */
export async function startMissingBlocks(network: string) {
  console.log("Starting processing missing blocks...");
  const chains = await syncStatusService.getChains(network);

  for (const chainId of chains) {
    const missingBlocks = await syncStatusService.getMissingBlocks(
      network,
      chainId
    );

    for (const block of missingBlocks) {
      console.info(`Processing missing blocks for chain ID ${chainId}`, {
        fromHeight: block.fromHeight,
        toHeight: block.toHeight,
      });

      splitIntoChunks(
        block.toHeight,
        block.fromHeight,
        SYNC_FETCH_INTERVAL_IN_BLOCKS
      ).forEach(async (chunk) => {
        console.info(`Processing chunk:`, {
          fromHeight: chunk[0],
          toHeight: chunk[1],
        });
        await fetchHeadersWithRetry(network, chainId, chunk[0], chunk[1]);
      });
    }
  }

  console.info("Missing blocks processing complete.");
}



/**
 * Attempts to fetch payload data for a given block with retries.
 *
 * @param network The network to fetch payload from (e.g., "mainnet01").
 * @param chainId The ID of the chain to fetch payload for.
 * @param height The height of the block to fetch payload for.
 * @param payloadHash The hash of the payload to fetch.
 * @param attempt The current retry attempt.
 */
async function fetchPayloadWithRetry(
  network: string,
  chainId: number,
  fromHeight: number,
  toHeight: number,
  payloadHashes: string[],
  attempt = 1
): Promise<any> {
  const endpoint = `${SYNC_BASE_URL}/${network}/chain/${chainId}/payload/outputs/batch`;

  console.log("Fetching payloads from:", endpoint);
  try {
    const response = (await axios.post(endpoint, payloadHashes, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })) as any;

    const payloads = response.data;

    if (payloads.length === 0) {
      console.log("payloads", payloads);
      console.log("payloadHashes", payloadHashes);
      throw new Error("No payloads found");
    }

    return await processPayloads(payloads);
  } catch (error) {
    if (attempt < SYNC_ATTEMPTS_MAX_RETRY) {
      console.log(
        `Retrying... Attempt ${attempt + 1
        } of ${SYNC_ATTEMPTS_MAX_RETRY} for payloadHash from height ${fromHeight} to ${toHeight}`
      );
      console.log("Error fetching payload:", error);
      await delay(SYNC_ATTEMPTS_INTERVAL_IN_MS);
      return await fetchPayloadWithRetry(
        network,
        chainId,
        fromHeight,
        toHeight,
        payloadHashes,
        attempt + 1
      );
    } else {
      await syncErrorService.save({
        network: network,
        chainId: chainId,
        fromHeight: fromHeight,
        toHeight: toHeight,
        data: error,
        endpoint: endpoint,
        source: SOURCE_API,
      } as any);

      console.log(
        "Max retry attempts reached. Unable to fetch transactions for",
        { network, chainId, fromHeight, toHeight }
      );
    }
  }
}

/**
 * Processes an array of payloads for a specific blockchain network and chain ID.
 * Each payload typically includes transaction data that needs to be decoded and then saved.
 *
 * @param network The blockchain network identifier (e.g., "mainnet01").
 * @param chainId The specific chain ID within the blockchain network.
 * @param payloads An array of payload objects to be processed.
 * @returns A Promise that resolves when all payloads have been processed.
 */
async function processPayloads(payloads: any[]): Promise<any[]> {
  const saveOperations = payloads.map(async (payload) => {
    const transactions = payload.transactions;
    // console.log("Number of transactions:", transactions.length);
    transactions.forEach((transaction: any) => {
      transaction[0] = getDecoded(transaction[0]);
      transaction[1] = getDecoded(transaction[1]);
    });

    const minerData = getDecoded(payload.minerData);
    const transactionsHash = payload.transactionsHash;
    const outputsHash = payload.outputsHash;
    const coinbase = getDecoded(payload.coinbase);

    const payloadData = {
      transactions: transactions,
      minerData: minerData,
      transactionsHash: transactionsHash,
      outputsHash: outputsHash,
      payloadHash: payload.payloadHash,
      coinbase: coinbase,
    };

    return payloadData;
  });

  return await Promise.all(saveOperations);
}

/**
 * Starts the process of retrying failed operations for a specific network.
 * This function retrieves a list of errors recorded during previous operations,
 * attempts to fetch and process the data again, and if successful, removes the error from the log.
 *
 * @param network The blockchain network identifier where the errors occurred.
 * @returns A Promise that resolves when all retry attempts have been processed.
 */
export async function startRetryErrors(network: string): Promise<void> {
  try {
    console.log("Starting retrying failed blocks...");
    const errors = await syncErrorService.getErrors(network, SOURCE_API);

    for (const error of errors) {
      try {
        await fetchHeadersWithRetry(
          error.network,
          error.chainId,
          error.fromHeight,
          error.toHeight
        );
        await syncErrorService.delete(error.id);
      } catch (error) {
        console.log("Error during error retrying:", error);
        console.log("Moving to next error...");
      }
    }
  } catch (error) {
    console.log("Error during error retrying:", error);
  }
}
