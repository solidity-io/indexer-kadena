import { BlockAttributes } from "../../models/block";
import { TransactionAttributes } from "../../models/transaction";
import { EventAttributes } from "../../models/event";
import { TransferAttributes } from "../../models/transfer";
import { transactionService } from "../transactionService";
import { eventService } from "../eventService";
import { transferService } from "../transferService";
import { getNftTransfers, getCoinTransfers } from "./transfers";
import { Transaction } from "sequelize";
import { delay, getDecoded, getRequiredEnvNumber } from "../../utils/helpers";
import { syncErrorService } from "../syncErrorService";
import { SOURCE_API } from "../../models/syncStatus";
import { saveHeader } from "../s3Service";
import { fetchPayloads } from "./fetch";
import Signer from "../../models/signer";

const SYNC_ATTEMPTS_MAX_RETRY = getRequiredEnvNumber("SYNC_ATTEMPTS_MAX_RETRY");
const SYNC_ATTEMPTS_INTERVAL_IN_MS = getRequiredEnvNumber(
  "SYNC_ATTEMPTS_INTERVAL_IN_MS",
);
const TRANSACTION_INDEX = 0;
const RECEIPT_INDEX = 1;

export async function fetchAndSavePayloadWithRetry(
  network: string,
  chainId: any,
  height: any,
  payloadHash: any,
  blockData: any,
): Promise<boolean> {
  const payload = await fetchPayloadWithRetry(
    network,
    chainId,
    height,
    height,
    [payloadHash],
  );

  if (!payload?.length) {
    console.error("No payload found for height and chain:", {
      height,
      chainId,
      blockData,
    });
    return false;
  }

  blockData.payload = payload[0];

  return await saveHeader(network, chainId, height, blockData);
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
  tx?: Transaction,
) {
  const transactions = payloadData.transactions || [];

  const transactionPromises = transactions.map((transactionArray: any) =>
    processTransaction(transactionArray, block, network, tx),
  );

  await Promise.all(transactionPromises);
}

export async function processTransaction(
  transactionArray: any,
  block: BlockAttributes,
  network: string,
  tx?: Transaction,
) {
  const transactionInfo = transactionArray[TRANSACTION_INDEX];
  const receiptInfo = transactionArray[RECEIPT_INDEX];

  let sigsData = transactionInfo.sigs;
  let cmdData: any;
  try {
    cmdData = JSON.parse(transactionInfo.cmd);
  } catch (error) {
    console.error(
      `Error parsing cmd JSON for key ${transactionInfo.cmd}: ${error}`,
    );
    throw error;
  }

  let nonce = (cmdData.Nonce || "").replace(/\\"/g, "");
  nonce = nonce.replace(/"/g, "");
  const eventsData = receiptInfo.events || [];
  const transactionAttributes = {
    blockId: block.id,
    code: cmdData.payload.exec ? cmdData.payload?.exec?.code : {},
    data: cmdData.payload.exec ? cmdData.payload?.exec?.data : {},
    chainId: cmdData.meta.chainId,
    creationtime: cmdData.meta.creationTime.toString(),
    gaslimit: cmdData.meta.gasLimit,
    gasprice: cmdData.meta.gasPrice,
    hash: transactionInfo.hash,
    nonce,
    pactid: receiptInfo.continuation?.pactId || null,
    continuation: receiptInfo.continuation || {},
    gas: receiptInfo.gas,
    result: receiptInfo.result || null,
    logs: receiptInfo.logs || null,
    num_events: eventsData ? eventsData.length : 0,
    requestkey: receiptInfo.reqKey,
    rollback: receiptInfo.result
      ? receiptInfo.result.status != "success"
      : true,
    sender: cmdData?.meta?.sender || null,
    sigs: sigsData,
    step: cmdData?.payload?.cont?.step || 0,
    ttl: cmdData.meta.ttl,
    txid: receiptInfo.txId ? receiptInfo.txId.toString() : null,
  } as TransactionAttributes;

  const eventsAttributes = eventsData.map((eventData: any) => {
    return {
      chainId: transactionAttributes.chainId,
      module: eventData.module.namespace
        ? `${eventData.module.namespace}.${eventData.module.name}`
        : eventData.module.name,
      name: eventData.name,
      params: eventData.params,
      qualname: eventData.module.namespace
        ? `${eventData.module.namespace}.${eventData.module.name}`
        : eventData.module.name,
      requestkey: receiptInfo.reqKey,
    } as EventAttributes;
  }) as EventAttributes[];

  const transfersCoinAttributes = await getCoinTransfers(
    network,
    eventsData,
    transactionAttributes,
    receiptInfo,
  );

  const transfersNftAttributes = await getNftTransfers(
    network,
    transactionAttributes.chainId,
    eventsData,
    transactionAttributes,
    receiptInfo,
  );

  const transfersAttributes = [transfersCoinAttributes, transfersNftAttributes]
    .flat()
    .filter((transfer) => transfer.amount !== undefined);

  try {
    let transactionInstance = await transactionService.save(
      transactionAttributes,
      { transaction: tx },
    );

    let transactionId = transactionInstance.id;

    const eventsWithTransactionId = eventsAttributes.map((event) => ({
      ...event,
      transactionId: transactionId,
    })) as EventAttributes[];

    await eventService.saveMany(eventsWithTransactionId, { transaction: tx });

    const signers = (cmdData.signers ?? []).map(
      (signer: any, index: number) => ({
        address: signer.address,
        orderIndex: index,
        pubkey: signer.pubKey,
        clist: signer.clist,
        scheme: signer.scheme,
        transactionId: transactionId,
      }),
    );

    await Signer.bulkCreate(signers, { transaction: tx });

    const transfersWithTransactionId = transfersAttributes.map((transfer) => ({
      ...transfer,
      tokenId: transfer.tokenId,
      contractId: transfer.contractId,
      transactionId: transactionId,
    })) as TransferAttributes[];

    await transferService.saveMany(transfersWithTransactionId, {
      transaction: tx,
    });
  } catch (error) {
    console.error(`Error saving transaction to the database: ${error}`);
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
  attempt = 1,
): Promise<any> {
  try {
    const payloads = await fetchPayloads(network, chainId, payloadHashes);

    if (payloads?.length) {
      throw new Error("No payloads found, retrying...");
    }

    return await processPayloads(payloads);
  } catch (error) {
    if (attempt < SYNC_ATTEMPTS_MAX_RETRY) {
      if (attempt > 2) {
        console.log(
          `Retrying... Attempt ${
            attempt + 1
          } of ${SYNC_ATTEMPTS_MAX_RETRY} for payloadHash from height ${fromHeight} to ${toHeight}`,
        );
      }
      await delay(SYNC_ATTEMPTS_INTERVAL_IN_MS);
      return await fetchPayloadWithRetry(
        network,
        chainId,
        fromHeight,
        toHeight,
        payloadHashes,
        attempt + 1,
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
        { network, chainId, fromHeight, toHeight },
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
