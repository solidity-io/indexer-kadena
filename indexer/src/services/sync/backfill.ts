import { rootPgPool, sequelize } from "../../config/database";
import Block, { BlockAttributes } from "../../models/block";
import Event, { EventAttributes } from "../../models/event";
import PublicKeysAccount, {
  PublicKeysAccountAttributes,
} from "../../models/publickeysaccount";
import Signer, { SignerAttributes } from "../../models/signer";
import { SOURCE_API, SOURCE_BACKFILL } from "../../models/syncStatus";
import Transaction, { TransactionAttributes } from "../../models/transaction";
import Transfer, { TransferAttributes } from "../../models/transfer";
import { delay, getRequiredEnvNumber } from "../../utils/helpers";
import { readAndParseS3Object } from "../s3Service";
import { syncErrorService } from "../syncErrorService";
import { syncStatusService } from "../syncStatusService";
import { fetchHeaders } from "./fetch";
import { fetchAndSavePayloadWithRetry } from "./payload";
import { getCoinTransfers, getNftTransfers } from "./transfers";

const SYNC_ATTEMPTS_MAX_RETRY = getRequiredEnvNumber("SYNC_ATTEMPTS_MAX_RETRY");
const SYNC_ATTEMPTS_INTERVAL_IN_MS = getRequiredEnvNumber(
  "SYNC_ATTEMPTS_INTERVAL_IN_MS",
);

export async function processBackfillHeaderKey(
  network: string,
  key: string,
  tx: any,
): Promise<{
  transactions: TransactionAttributes[];
  events: EventAttributes[];
  transfers: TransferAttributes[];
  signers: SignerAttributes[];
  publicKeysAccount: PublicKeysAccountAttributes[];
}> {
  const parsedData = await readAndParseS3Object(key);

  if (!parsedData) {
    console.error("No parsed data found for key:", key);
    return {
      transactions: [],
      events: [],
      transfers: [],
      signers: [],
      publicKeysAccount: [],
    };
  }

  let headerData = parsedData.header;
  if (!headerData) {
    headerData = parsedData;
  }

  const payloadData = parsedData.payload;

  const transactions = payloadData.transactions || [];
  try {
    const blockAttribute = {
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
      transactionsCount: transactions.length,
    } as BlockAttributes;

    const createdBlock = await Block.create(blockAttribute, {
      transaction: tx,
    });

    const payloadHash = payloadData.payloadHash;

    const promises = transactions.map(async (transactionArray: any) => {
      return processTransaction(
        transactionArray,
        createdBlock,
        payloadHash,
        network,
      );
    });

    const results: Array<{
      transaction: TransactionAttributes;
      events: EventAttributes[];
      transfers: TransferAttributes[];
      signers: SignerAttributes[];
      publicKeysAccount: PublicKeysAccountAttributes[];
    }> = await Promise.all(promises);

    const txs = results.map((r) => r.transaction);
    const events = results.map((r) => r.events).flat();
    const transfers = results.map((r) => r.transfers).flat();
    const signers = results.map((r) => r.signers).flat();
    const publicKeysAccount = results.map((r) => r.publicKeysAccount).flat();

    return { transactions: txs, events, transfers, signers, publicKeysAccount };
  } catch (error) {
    console.error(`Error saving block to the database: ${headerData.hash}`);
    return {
      transactions: [],
      events: [],
      transfers: [],
      signers: [],
      publicKeysAccount: [],
    };
  }
}

export async function fetchHeadersWithRetryForBackfill(
  network: string,
  chainId: number,
  minHeight: number,
  maxHeight: number,
  attempt: number = 1,
): Promise<{
  transactionsCount: number;
  eventsCount: number;
  transfersCount: number;
  signersCount: number;
  publicKeysAccountCount: number;
}> {
  const tx = await sequelize.transaction();
  try {
    const data: { items: Array<{ height: number; hash: string }> } =
      await fetchHeaders(network, chainId, minHeight, maxHeight);

    const headerPromises = data.items.map(async (item: any) => {
      await fetchAndSavePayloadWithRetry(
        network,
        chainId,
        item.height,
        item.payloadHash,
        { header: item },
      );

      const objectKey = `${network}/chains/${chainId}/headers/${item.height}-${item.hash}.json`;
      return processBackfillHeaderKey(network, objectKey, tx);
    });

    const result = await Promise.all(headerPromises);

    const transactions = result.map((r) => r.transactions).flat();
    const events = result.map((r) => r.events).flat();
    const transfers = result.map((r) => r.transfers).flat();
    const signers = result.map((r) => r.signers).flat();
    const publicKeysAccount = result.map((r) => r.publicKeysAccount).flat();

    const transactionsPromise = Transaction.bulkCreate(transactions, {
      transaction: tx,
      logging: false,
      validate: false,
    });
    const eventsPromise = Event.bulkCreate(events, {
      transaction: tx,
      logging: false,
      validate: false,
    });
    const tranfersPromise = Transfer.bulkCreate(transfers, {
      transaction: tx,
      logging: false,
      validate: false,
    });
    const signersPromise = Signer.bulkCreate(signers, {
      transaction: tx,
      logging: false,
      validate: false,
    });
    const publicKeysAccountPromise = PublicKeysAccount.bulkCreate(
      publicKeysAccount,
      {
        transaction: tx,
        logging: false,
        validate: false,
        ignoreDuplicates: true,
      },
    );
    await Promise.all([
      transactionsPromise,
      eventsPromise,
      tranfersPromise,
      signersPromise,
      publicKeysAccountPromise,
    ]);

    await tx.commit();

    await syncStatusService.save({
      chainId: chainId,
      fromHeight: maxHeight,
      toHeight: minHeight,
      network: network,
      source: SOURCE_BACKFILL,
    } as any);

    return {
      transactionsCount: transactions?.length,
      eventsCount: events?.length,
      transfersCount: transfers?.length,
      signersCount: signers?.length,
      publicKeysAccountCount: publicKeysAccount?.length,
    };
  } catch (error) {
    console.error(`Error fetching headers: ${error}`);
    if (attempt < SYNC_ATTEMPTS_MAX_RETRY) {
      if (attempt > 2) {
        console.log(
          `Retrying fetch headers... Attempt ${
            attempt + 1
          } of ${SYNC_ATTEMPTS_MAX_RETRY}`,
        );
      }
      await delay(SYNC_ATTEMPTS_INTERVAL_IN_MS);
      const counters = await fetchHeadersWithRetryForBackfill(
        network,
        chainId,
        minHeight,
        maxHeight,
        attempt + 1,
      );
      return counters;
    } else {
      await tx.rollback();
      await syncErrorService.save({
        network: network,
        chainId: chainId,
        fromHeight: maxHeight,
        toHeight: minHeight,
        data: error,
        source: SOURCE_API,
      } as any);

      console.log("Max retry attempts reached. Unable to fetch headers for", {
        network,
        chainId,
        minHeight,
        maxHeight,
      });

      return {
        transactionsCount: 0,
        eventsCount: 0,
        transfersCount: 0,
        signersCount: 0,
        publicKeysAccountCount: 0,
      };
    }
  }
}

async function processTransaction(
  transactionArray: any,
  block: BlockAttributes,
  payloadHash: string,
  network: string,
): Promise<{
  transaction: TransactionAttributes;
  events: EventAttributes[];
  transfers: TransferAttributes[];
  signers: SignerAttributes[];
  publicKeysAccount: PublicKeysAccountAttributes[];
}> {
  const TRANSACTION_INDEX = 0;
  const RECEIPT_INDEX = 1;
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
    pactid: receiptInfo.continuation?.pactId || "",
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
    receiptInfo,
  );

  const transfersNftAttributes = await getNftTransfers(
    network,
    transactionAttributes.chainId,
    eventsData,
    payloadHash,
    transactionAttributes,
    receiptInfo,
  );

  const transfersAttributes = [transfersCoinAttributes, transfersNftAttributes]
    .flat()
    .filter((transfer) => transfer.amount !== undefined);

  try {
    const { rows }: any = await rootPgPool.query(
      `SELECT nextval('\"Transactions_id_seq\"')`,
    );

    const transactionId = rows[0].nextval;

    const eventsWithTransactionId = eventsAttributes.map((event) => ({
      ...event,
      transactionId: transactionId,
    })) as EventAttributes[];

    const signers = cmdData.signers.map((signer: any, index: number) => ({
      pubkey: signer.pubKey,
      clist: signer.clist,
      orderIndex: index,
      transactionId: transactionId,
    }));

    const publicKeys = cmdData.payload?.exec?.data?.keyset?.keys ?? [];
    const publicKeysAccountRows = publicKeys
      .map((publicKey: any) => {
        return transfersAttributes.map((transfer) => ({
          publicKey: publicKey,
          chainId: transactionAttributes.chainId.toString(),
          account: transfer.from_acct,
          module: transfer.modulename,
        }));
      })
      .flat();

    const uniqueRowsInMemory = [
      ...new Map(
        publicKeysAccountRows.map((row: any) => [
          `${row.publicKey}_${row.chainId}_${row.account}_${row.module}`,
          row,
        ]),
      ).values(),
    ] as PublicKeysAccountAttributes[];

    const transfersWithTransactionId = transfersAttributes.map((transfer) => ({
      ...transfer,
      tokenId: transfer.tokenId,
      contractId: transfer.contractId,
      transactionId: transactionId,
    })) as TransferAttributes[];

    return {
      transaction: { ...transactionAttributes, id: transactionId },
      events: eventsWithTransactionId,
      transfers: transfersWithTransactionId,
      signers,
      publicKeysAccount: uniqueRowsInMemory,
    };
  } catch (error) {
    console.error(`Error saving transaction to the database: ${error}`);
    return {
      transaction: transactionAttributes,
      events: [],
      transfers: [],
      signers: [],
      publicKeysAccount: [],
    };
  }
}
