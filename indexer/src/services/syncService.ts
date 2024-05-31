import axios from "axios";
import { saveHeader, listS3Objects, readAndParseS3Object } from "./s3Service";
import { getDecoded, delay, splitIntoChunks } from "../utils/helpers";
import { transactionService } from "./transactionService";
import { eventService } from "./eventService";
import { syncStatusService } from "./syncStatusService";
import { syncErrorService } from "./syncErrorService";
import { transferService } from "./transferService";
import { register } from "../server/metrics";
import { Histogram } from "prom-client";
import https from "https";
import "dotenv/config";
import {
  SOURCE_S3,
  SOURCE_API,
  SOURCE_BACKFILL,
  SOURCE_STREAMING,
} from "../models/syncStatus";
import { getRequiredEnvString, getRequiredEnvNumber } from "../utils/helpers";
import Block, { BlockAttributes } from "../models/block";
import { TransactionAttributes } from "../models/transaction";
import { EventAttributes } from "../models/event";
import { TransferAttributes } from "../models/transfer";
import Contract, { ContractAttributes } from "../models/contract";
import { Transaction } from "sequelize";

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

/**
 * Initializes a set of metrics for monitoring the performance and behavior of the synchronization process.
 * This particular metric, 'syncDuration', is a histogram that tracks the duration of synchronization operations
 * in seconds. It is designed to provide insights into the time taken to process synchronization tasks,
 * helping to identify bottlenecks or inefficiencies in the sync process.
 *
 * The histogram labels are:
 * - 'network': Identifies the blockchain network that the synchronization operation is being performed on.
 * - 'chainId': Identifies the blockchain chain ID that the synchronization operation is being performed on.
 * - 'type': Specifies the type of synchronization operation, such as headers or payloads.
 * - 'minheight': The minimum block height included in the synchronization operation.
 * - 'maxheight': The maximum block height included in the synchronization operation.
 *
 * This structured approach allows for detailed analysis of synchronization performance across different chains,
 * operation types, and block height ranges.
 */
const metrics = {
  syncDuration: new Histogram({
    name: "sync_duration_seconds",
    help: "Duration of sync operations in seconds",
    labelNames: ["network", "chainId", "type", "minheight", "maxheight"],
    registers: [register],
  }),
};

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
 * Creates a signal object that can be used to manage shutdown or interrupt signals in asynchronous operations.
 * It provides a mechanism to gracefully exit from a loop or terminate a process when an external signal is received.
 * The signal object contains a boolean flag that is initially set to false and can be toggled to true using the
 * trigger method. This flag can be checked periodically in asynchronous loops to determine if the process should
 * continue running or begin shutdown procedures.
 *
 * @returns An object with properties 'isTriggered' to check the current state of the signal,
 * and 'trigger' to change the state to triggered, indicating that a shutdown or interrupt has been requested.
 */
function createSignal() {
  let isTriggered = false;
  return {
    get isTriggered() {
      return isTriggered;
    },
    trigger() {
      isTriggered = true;
    },
  };
}

const shutdownSignal = createSignal();

/**
 * Continuously processes S3 headers for a specific network as a background task (daemon).
 * It checks for new headers to process and does so in a loop until a shutdown signal is received.
 * This method ensures that your application stays up-to-date with the latest block headers.
 *
 * @param network The identifier for the blockchain network (e.g., 'mainnet01').
 */
export async function processS3HeadersDaemon(network: string) {
  console.log("Daemon: Starting to process headers...");

  const sleepInterval = parseInt(process.env.SLEEP_INTERVAL_MS || "5000", 10);

  process.on("SIGINT", () => shutdownSignal.trigger());
  process.on("SIGTERM", () => shutdownSignal.trigger());

  while (!shutdownSignal.isTriggered) {
    try {
      await processS3Headers(network);
      console.log(
        `Daemon: Waiting for ${sleepInterval / 1000
        } seconds before the next iteration...`
      );
      await delay(sleepInterval);
    } catch (error) {
      console.error("Daemon: Error occurred in processS3Headers -", error);
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
 * Processes header keys for each chain within a specified network in a round-robin fashion.
 * It processes a set number of keys for each chain and removes the chain from the processing
 * list once there are no more keys to process. This ensures an even distribution of processing
 * load across multiple chains.
 *
 * @param {string} network - The identifier of the network for which headers are to be processed.
 */
export async function processS3Headers(network: string) {
  console.log("Starting processing headers...");

  const chains = await syncStatusService.getChains(network);
  const lastKeysProcessed = new Map<number, number>();

  const MAX_KEYS = 20;
  const MAX_ITERATIONS = 5;

  while (chains.length > 0) {
    let remainingChains = [];
    for (const chainId of chains) {
      const prefix = `${network}/chains/${chainId}/headers/`;
      const totalKeysProcessed = await processKeys(
        network,
        chainId,
        prefix,
        processHeaderKey,
        MAX_KEYS,
        MAX_ITERATIONS
      );

      lastKeysProcessed.set(chainId, totalKeysProcessed);

      if (totalKeysProcessed > 0) {
        remainingChains.push(chainId);
      }
    }
    chains.splice(0, chains.length, ...remainingChains);
  }

  console.log("Finished processing headers.");
}

/**
 * Processes a single S3 payload key, extracting transaction and event information from the payload data.
 * It parses the payload to save transaction attributes and related events into the database.
 *
 * @param network The blockchain network identifier.
 * @param prefix The S3 object prefix used to locate blockchain data.
 * @param key The specific S3 object key pointing to the payload data to be processed.
 */
async function processPayloadKey(
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
          transactionId: transactionId,
        })
      ) as TransferAttributes[];

      await transferService.saveMany(transfersWithTransactionId, options);
    } catch (error) {
      console.error(`Error saving transaction to the database: ${error}`);
    }
  }
}

/**
 * Filters and processes NFT transfer events from a payload's event data. It identifies NFT transfer events based on
 * predefined criteria (e.g., event name and parameter structure), and constructs transfer attribute objects for each.
 *
 * @param eventsData The array of event data from a transaction payload.
 * @param payloadHash The hash of the payload containing these events.
 * @param transactionAttributes Transaction attributes associated with the events.
 * @param receiptInfo Receipt information associated with the events.
 * @returns An array of transfer attributes specifically for NFT transfers.
 */
function getNftTransfers(
  network: string,
  chainId: number,
  eventsData: any,
  payloadHash: string | undefined,
  transactionAttributes: TransactionAttributes,
  receiptInfo: any
) {
  const TRANSFER_NFT_SIGNATURE = "TRANSFER";
  const TRANSFER_NFT_PARAMS_LENGTH = 4;

  const transferNftSignature = (eventData: any) =>
    eventData.name == TRANSFER_NFT_SIGNATURE &&
    eventData.params.length == TRANSFER_NFT_PARAMS_LENGTH &&
    typeof eventData.params[0] == "string" &&
    typeof eventData.params[1] == "string" &&
    typeof eventData.params[2] == "string" &&
    typeof eventData.params[3] == "number";

  const transfersNftAttributes = eventsData
    .filter(transferNftSignature)
    .map(async (eventData: any) => {
      const params = eventData.params;
      const tokenId = params[0];
      const from_acct = params[1];
      const to_acct = params[2];
      const amount = params[3];

      const modulename = eventData.module.namespace
        ? `${eventData.module.namespace}.${eventData.module.name}`
        : eventData.module.name;

      console.log("Token ID:", tokenId);

      const manifestData = await getManifest(
        network,
        chainId,
        modulename,
        tokenId
      );
      let contractId;
      if (manifestData) {
        contractId = await saveContract(network, chainId, modulename, contractId, "poly-fungible", tokenId, manifestData);
      } else {
        console.log("No manifest URI found for token ID:", tokenId);
      }

      return {
        amount: amount,
        payloadHash: payloadHash,
        chainId: transactionAttributes.chainId,
        from_acct: from_acct,
        modulehash: eventData.moduleHash,
        modulename: modulename,
        requestkey: receiptInfo.reqKey,
        to_acct: to_acct,
        network: network,
        hasTokenId: true,
        tokenId: tokenId,
        type: "poly-fungible",
        contractId: contractId,
      } as TransferAttributes;
    }) as TransferAttributes[];
  return transfersNftAttributes;
}

async function saveContract(network: string, chainId: number, modulename: any, contractId: any, type: string, tokenId?: any, manifestData?: any, precision?: number) {
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

async function getPrecision(
  network: string,
  chainId: number,
  module: string
): Promise<number | undefined> {
  const now = new Date();

  const createBody = (hash: string = ""): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chainId}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${network}\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(${module}.precision)\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  const { textResponse } = await callLocal(network, chainId, createBody());

  const hashFromResponse = textResponse?.split(" ").splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    network,
    chainId,
    createBody(hashFromResponse)
  );

  const precision = jsonResponse?.result.data;

  if (precision !== undefined) {
    return precision;
  } else {
    console.log(`Error fetching precision for module ${module}`);
  }
}

async function getManifest(
  network: string,
  chainId: number,
  module: string,
  tokenId: string
): Promise<any> {
  const now = new Date();

  const createBody = (hash: string = ""): string =>
    `{"cmd":"{\\"signers\\":[],\\"meta\\":{\\"creationTime\\":${now.getTime()},\\"ttl\\":600,\\"chainId\\":\\"${chainId}\\",\\"gasPrice\\":1.0e-8,\\"gasLimit\\":2500,\\"sender\\":\\"sender00\\"},\\"nonce\\":\\"CW:${now.toUTCString()}\\",\\"networkId\\":\\"${network}\\",\\"payload\\":{\\"exec\\":{\\"code\\":\\"(${module}.get-manifest \\\\\\"${tokenId}\\\\\\")\\",\\"data\\":{}}}}","hash":"${hash}","sigs":[]}`;

  const { textResponse } = await callLocal(network, chainId, createBody());

  const hashFromResponse = textResponse?.split(" ").splice(-1, 1)[0];

  const { jsonResponse } = await callLocal(
    network,
    chainId,
    createBody(hashFromResponse)
  );

  const manifest = jsonResponse?.result.data;

  if (manifest !== undefined) {
    return manifest;
  } else {
    console.log(`Error fetching manifest for token ID ${tokenId}`);
  }
}

async function callLocal(
  network: string,
  chainId: number,
  body: string
): Promise<{
  textResponse: string | undefined;
  jsonResponse: { result: { data: any } } | undefined;
  response: Response;
}> {
  const response = await fetch(
    `https://api.chainweb.com/chainweb/0.0/${network}/chain/${chainId}/pact/api/v1/local?signatureVerification=false`,
    {
      headers: {
        accept: "application/json;charset=utf-8, application/json",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=utf-8",
        pragma: "no-cache",
      },
      body,
      method: "POST",
    }
  );

  let jsonResponse;
  let textResponse;

  try {
    jsonResponse = (await response.clone().json()) as {
      result: { data: any };
    };
  } catch (e) {
    textResponse = await response.text();
  }
  return { textResponse, jsonResponse, response };
}

/**
 * Filters and processes coin transfer events from a payload's event data. Similar to `getNftTransfers`, but focuses on
 * coin-based transactions. It identifies events that represent coin transfers and constructs transfer attribute objects.
 *
 * @param eventsData The array of event data from a transaction payload.
 * @param payloadHash The hash of the payload containing these events.
 * @param transactionAttributes Transaction attributes associated with the events.
 * @param receiptInfo Receipt information associated with the events.
 * @returns An array of transfer attributes specifically for coin transfers.
 */
function getCoinTransfers(
  network: string,
  eventsData: any,
  payloadHash: string,
  transactionAttributes: TransactionAttributes,
  receiptInfo: any
) {
  const TRANSFER_COIN_SIGNATURE = "TRANSFER";
  const TRANSFER_COIN_PARAMS_LENGTH = 3;

  const transferCoinSignature = (eventData: any) =>
    eventData.name == TRANSFER_COIN_SIGNATURE &&
    eventData.params.length == TRANSFER_COIN_PARAMS_LENGTH &&
    typeof eventData.params[0] == "string" &&
    typeof eventData.params[1] == "string" &&
    typeof eventData.params[2] == "number";

  const transfersCoinAttributes = eventsData
    .filter(transferCoinSignature)
    .map(async (eventData: any) => {
      const modulename = eventData.module.namespace
      ? `${eventData.module.namespace}.${eventData.module.name}`
      : eventData.module.name;
      const chainId = transactionAttributes.chainId;

      const precisionData = await getPrecision(
        network,
        chainId,
        modulename
      );

      let contractId;
      if (precisionData) {
        contractId = await saveContract(network, chainId, modulename, contractId, "fungible", null, null, precisionData);
      } else {
        console.log("No precision found for module:", modulename);
      }
      
      const params = eventData.params;
      const from_acct = params[0];
      const to_acct = params[1];
      const amount = params[2];
      return {
        amount: amount,
        payloadHash: payloadHash,
        chainId: transactionAttributes.chainId,
        from_acct: from_acct,
        modulehash: eventData.moduleHash,
        modulename: eventData.module.namespace
          ? `${eventData.module.namespace}.${eventData.module.name}`
          : eventData.module.name,
        requestkey: receiptInfo.reqKey,
        network: network,
        to_acct: to_acct,
        hasTokenId: false,
        type: "fungible",
      } as TransferAttributes;
    }) as TransferAttributes[];
  return transfersCoinAttributes;
}

/**
 * Asynchronously processes a single header key by reading and parsing its associated data from an S3 object,
 * saving the parsed block data to the database, and updating the synchronization status accordingly.
 *
 * The function is designed to be flexible, working with any specified network and handling data located using
 * a combination of prefix and key. This allows it to be used in various contexts, including round-robin
 * processing or individual header processing tasks. The function encapsulates the entire process of dealing
 * with a single header's data, from fetching and parsing to persisting the changes in the system's state.
 *
 * @param {string} network - The identifier for the blockchain network (e.g., 'mainnet01'). This is used
 *                           to specify the network context in which the header key is being processed,
 *                           affecting how the data is saved and synchronized.
 * @param {string} prefix - The S3 object prefix that precedes the key, used to construct the full path
 *                          to the S3 object. This typically includes the network and chain ID,
 *                          and helps in organizing and locating the blockchain data in S3.
 * @param {string} key - The specific S3 object key that uniquely identifies the data
 *                       to be processed. This key is used to fetch the data from S3 for processing.
 *
 * @returns {Promise<void>} A promise that resolves when the key has been successfully processed,
 *                          including reading, parsing, saving the block data, and updating the sync status.
 */

async function processHeaderKey(network: string, prefix: string, key: string) {
  const parsedData = await readAndParseS3Object(key);

  if (!parsedData) {
    console.error("No parsed data found for key:", key);
    return;
  }

  let headerData = parsedData.header;
  if (!headerData) {
    headerData = parsedData;
  }

  const payloadData = parsedData.payload;

  try {
    let blockAttribute = {
      nonce: headerData.nonce,
      creationTime: headerData.creationTime,
      parent: headerData.parent,
      adjacents: headerData.adjacents,
      target: headerData.target,
      payloadHash: headerData.payloadHash,
      chainId: headerData.chainId,
      weight: headerData.weight,
      height: headerData.height,
      chainwebVersion: headerData.chainwebVersion,
      epochStart: headerData.epochStart,
      featureFlags: headerData.featureFlags,
      hash: headerData.hash,
      minerData: payloadData.minerData,
      transactionsHash: payloadData.transactionsHash,
      outputsHash: payloadData.outputsHash,
      coinbase: payloadData.coinbase,
    } as BlockAttributes;

    const createdBlock = await Block.create(blockAttribute);

    await processPayloadKey(network, createdBlock, payloadData);
  } catch (error) {
    console.error(`Error saving block to the database: ${error}`);
  }
}

/**
 * Starts streaming headers from the Chainweb P2P network.
 * This method establishes a connection to the Chainweb node's header stream and listens for new headers.
 * Upon receiving a header, it saves the header and its payload to S3 and attempts to fetch the payload's transactions.
 * It retries fetching the payload up to a maximum number of attempts if necessary.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 */
export async function startStreaming(network: string): Promise<void> {
  console.log("Starting streaming...");
  const options = {
    method: "GET",
    hostname: "api.chainweb.com",
    port: 443,
    path: `/chainweb/0.0/${network}/header/updates`,
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);

    res.on("data", async (chunk) => {
      const chunkStr = chunk.toString();
      const dataLine = chunkStr
        .split("\n")
        .find((line: any) => line.startsWith("data:"));

      if (dataLine) {
        const jsonData = dataLine.replace("data:", "").trim();

        try {
          const blockData = JSON.parse(jsonData);
          const height = blockData.header.height;
          const chainId = blockData.header.chainId;
          const creationTime = blockData.header.creationTime;

          console.log(
            `chainId: ${chainId} - height: ${height} - creationTime: ${creationTime}`
          );

          const payloadHash = blockData.header.payloadHash;

          await fetchAndSavePayloadWithRetry(
            network,
            chainId,
            height,
            payloadHash,
            blockData
          );

          await syncStatusService.save({
            chainId: chainId,
            fromHeight: height,
            toHeight: height,
            network: network,
            source: SOURCE_STREAMING,
          } as any);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    });

    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
}

async function fetchAndSavePayloadWithRetry(
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

interface FetchCutResult {
  hashes: {
    [chainId: string]: {
      height: number;
      hash: string;
    };
  };
}

/**
 * Fetches the current cut information from the network.
 *
 * @param network The network to fetch the cut from (e.g., "mainnet01").
 * @returns A promise resolving to the cut information.
 */
async function fetchCut(network: string): Promise<any> {
  try {
    const response = await axios.get(`${SYNC_BASE_URL}/${network}/cut`);
    return response.data as FetchCutResult;
  } catch (error) {
    console.error("Error fetching cut:", error);
    throw error;
  }
}

/**
 * Attempts to fetch headers for a given blockchain chain within a specified height range, with retries upon failure.
 * This function makes an HTTP GET request to fetch headers between the minHeight and maxHeight for a specific chainId.
 * In case of a failure, it retries the request up to a maximum number of attempts defined by ATTEMPTS_MAX_RETRY.
 *
 * @param network - The network identifier (e.g., "mainnet01") from which to fetch the headers.
 * @param chainId - The ID of the chain for which headers are being fetched.
 * @param minHeight - The minimum block height for which headers should be fetched.
 * @param maxHeight - The maximum block height for which headers should be fetched.
 * @param attempt - The current attempt number (used internally for retries).
 */
async function fetchHeadersWithRetry(
  network: string,
  chainId: number,
  minHeight: number,
  maxHeight: number,
  attempt: number = 1
): Promise<void> {
  const endpoint = `${SYNC_BASE_URL}/${network}/chain/${chainId}/header?minheight=${minHeight}&maxheight=${maxHeight}`;

  console.log("Fetching headers from:", endpoint);
  const end = metrics.syncDuration.startTimer({
    network: network,
    chainId: chainId.toString(),
    minheight: minHeight.toString(),
    maxheight: maxHeight.toString(),
    type: "headers",
  });
  try {
    const response = await axios.get(endpoint, {
      headers: { Accept: "application/json;blockheader-encoding=object" },
    });

    const items = response.data.items;

    console.log(`Fetched ${items.length} headers for chainId ${chainId}`);

    await Promise.all(
      items.map(async (header: any) => {
        await fetchAndSavePayloadWithRetry(
          network,
          chainId,
          maxHeight,
          minHeight,
          [header.payloadHash]
        );
      })
    );

    await syncStatusService.save({
      chainId: chainId,
      fromHeight: maxHeight,
      toHeight: minHeight,
      network: network,
      source: SOURCE_BACKFILL,
    } as any);
    end();
  } catch (error) {
    console.error(`Error fetching headers: ${error}`);
    if (attempt < SYNC_ATTEMPTS_MAX_RETRY) {
      console.log(
        `Retrying fetch headers... Attempt ${attempt + 1
        } of ${SYNC_ATTEMPTS_MAX_RETRY}`
      );
      await delay(SYNC_ATTEMPTS_INTERVAL_IN_MS);
      await fetchHeadersWithRetry(
        network,
        chainId,
        minHeight,
        maxHeight,
        attempt + 1
      );
    } else {
      await syncErrorService.save({
        network: network,
        chainId: chainId,
        fromHeight: maxHeight,
        toHeight: minHeight,
        data: error,
        endpoint: endpoint,
        source: SOURCE_API,
      } as any);

      console.log("Max retry attempts reached. Unable to fetch headers for", {
        network,
        chainId,
        minHeight,
        maxHeight,
      });
    }
    end();
  }
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
