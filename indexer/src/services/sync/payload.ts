import { BlockAttributes } from "../../models/block";
import { TransactionAttributes } from "../../models/transaction";
import { EventAttributes } from "../../models/event";
import { TransferAttributes } from "../../models/transfer";
import { transactionService } from "../transactionService";
import { eventService } from "../eventService";
import { transferService } from "../transferService";
import { getNftTransfers, getCoinTransfers } from "./transfers";
import { Transaction } from "sequelize";
import { delay, getDecoded, getRequiredEnvNumber, getRequiredEnvString } from "../../utils/helpers";
import { syncErrorService } from "../syncErrorService";
import { SOURCE_API } from "../../models/syncStatus";
import { saveHeader } from "../s3Service";
import { fetchPayloads } from "./fetch";

const SYNC_ATTEMPTS_MAX_RETRY = getRequiredEnvNumber("SYNC_ATTEMPTS_MAX_RETRY");
const SYNC_ATTEMPTS_INTERVAL_IN_MS = getRequiredEnvNumber(
  "SYNC_ATTEMPTS_INTERVAL_IN_MS"
);

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

    const transfersCoinAttributes = await getCoinTransfers(
      network,
      eventsData,
      payloadHash,
      transactionAttributes,
      receiptInfo
    );

    const transfersNftAttributes = await getNftTransfers(
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

/**
 * Attempts to fetch payload data for a given block with retries.
 *
 * @param network The network to fetch payload from (e.g., "mainnet01").
 * @param chainId The ID of the chain to fetch payload for.
 * @param height The height of the block to fetch payload for.
 * @param payloadHash The hash of the payload to fetch.
 * @param attempt The current retry attempt.
 */
export async function fetchPayloadWithRetry(
  network: string,
  chainId: number,
  fromHeight: number,
  toHeight: number,
  payloadHashes: string[],
  attempt = 1
): Promise<any> {

  try {
    const payloads = await fetchPayloads(network, chainId, payloadHashes);

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