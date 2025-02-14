import { BlockAttributes } from "../../models/block";
import TransactionModel, {
  TransactionAttributes,
} from "../../models/transaction";
import Event, { EventAttributes } from "../../models/event";
import Transfer, { TransferAttributes } from "../../models/transfer";
import { getNftTransfers, getCoinTransfers } from "./transfers";
import { QueryTypes, Transaction } from "sequelize";
import Signer from "../../models/signer";
import Guard from "../../models/guard";
import { handleSingleQuery } from "../../kadena-server/utils/raw-query";
import { sequelize } from "../../config/database";
import { processCoinbaseTransaction } from "./coinbase";

const TRANSACTION_INDEX = 0;
const RECEIPT_INDEX = 1;

interface BalanceInsertResult {
  id: number;
  chainId: number;
  account: string;
  module: string;
}

export async function processPayloadKey(
  block: BlockAttributes,
  payloadData: any,
  tx?: Transaction,
): Promise<EventAttributes[]> {
  const transactions = payloadData.transactions || [];

  const transactionPromises = transactions.map((transactionArray: any) =>
    processTransaction(transactionArray, block, tx),
  );

  await processCoinbaseTransaction(payloadData.coinbase, {
    id: block.id,
    chainId: block.chainId,
    creationTime: block.creationTime,
  });

  return (await Promise.all(transactionPromises)).flat();
}

export async function processTransaction(
  transactionArray: any,
  block: BlockAttributes,
  tx?: Transaction,
): Promise<EventAttributes[]> {
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

  let nonce = (cmdData.nonce || "").replace(/\\"/g, "");
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
    proof: cmdData?.payload?.cont?.proof || null,
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
    eventsData,
    transactionAttributes,
  );

  const transfersNftAttributes = await getNftTransfers(
    transactionAttributes.chainId,
    eventsData,
    transactionAttributes,
  );

  const transfersAttributes = [transfersCoinAttributes, transfersNftAttributes]
    .flat()
    .filter((transfer) => transfer.amount !== undefined);

  try {
    const { id: transactionId } = await TransactionModel.create(
      transactionAttributes,
      {
        transaction: tx,
      },
    );

    const eventsWithTransactionId = eventsAttributes.map((event) => ({
      ...event,
      transactionId,
    })) as EventAttributes[];
    await Event.bulkCreate(eventsWithTransactionId, { transaction: tx });

    const signers = (cmdData.signers ?? []).map(
      (signer: any, index: number) => ({
        address: signer.address,
        orderIndex: index,
        pubkey: signer.pubKey,
        clist: signer.clist,
        scheme: signer.scheme,
        transactionId,
      }),
    );
    await Signer.bulkCreate(signers, { transaction: tx });

    const transfersWithTransactionId = transfersAttributes.map((transfer) => ({
      ...transfer,
      transactionId,
    })) as TransferAttributes[];
    await Transfer.bulkCreate(transfersWithTransactionId, {
      transaction: tx,
    });

    const balancesFrom = transfersAttributes
      .filter((t) => t.from_acct !== "")
      .map((t) => ({
        account: t.from_acct,
        chainId: t.chainId,
        module: t.modulename,
        hasTokenId: t.hasTokenId,
        tokenId: t.tokenId ?? "", // Normalize tokenId
      }));

    const balancesTo = transfersAttributes
      .filter((t) => t.to_acct !== "")
      .map((t) => ({
        account: t.to_acct,
        chainId: t.chainId,
        module: t.modulename,
        hasTokenId: t.hasTokenId,
        tokenId: t.tokenId ?? "", // Normalize tokenId
      }));

    const balances = [...balancesFrom, ...balancesTo];

    const values = balances
      .map(
        (balance) =>
          `(${balance.chainId}, '${balance.account}', '${balance.module}', '${balance.tokenId}', ${balance.hasTokenId}, NOW(), NOW())`,
      )
      .join(", ");

    const query = `
      INSERT INTO "Balances" ("chainId", account, module, "tokenId", "hasTokenId", "createdAt", "updatedAt")
      VALUES ${values}
      ON CONFLICT ("chainId", account, module, "tokenId") DO NOTHING
      RETURNING id, "chainId", account, module;
    `;

    const insertedBalances = await sequelize.query<BalanceInsertResult>(query, {
      type: QueryTypes.SELECT, // Use SELECT to retrieve rows with RETURNING
      transaction: tx,
    });

    await saveGuards(insertedBalances ?? [], tx);

    return eventsAttributes;
  } catch (error) {
    console.error(`Error saving transaction to the database: ${error}`);
    return [];
  }
}

export async function getGuardsFromBalances(balances: BalanceInsertResult[]) {
  const guardPromises: Array<Promise<any | null>> = balances.map(
    async (balance) => {
      const res = await handleSingleQuery({
        chainId: balance.chainId.toString(),
        code: `(${balance.module}.details \"${balance.account}\")`,
      });

      if (res.status !== "success" || !res.result) return null;

      const result = JSON.parse(res.result ?? "{}");
      const keys = result?.guard?.keys ?? [];
      const pred = result?.guard?.pred;
      if (!keys?.length || !pred) return null;

      const withKeys = keys.map((key: any) => ({
        balanceId: balance.id,
        account: balance.account,
        publicKey: key,
        predicate: pred,
      }));

      return withKeys;
    },
  );

  const guards = await Promise.all(guardPromises);
  const filteredGuards = guards
    .flat()
    .filter((g) => g !== null && `k:${g.publicKey}` !== g.account)
    .map((g) => ({
      balanceId: g.balanceId,
      publicKey: g.publicKey,
      predicate: g.predicate,
    }));

  return filteredGuards;
}

async function saveGuards(balances: BalanceInsertResult[], tx?: Transaction) {
  const filteredGuards = await getGuardsFromBalances(balances);
  await Guard.bulkCreate(filteredGuards, {
    transaction: tx,
    ignoreDuplicates: true,
  });
}
