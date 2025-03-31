import TransactionModel, { TransactionCreationAttributes } from '../../models/transaction';
import Transfer, { TransferAttributes } from '../../models/transfer';
import { Transaction } from 'sequelize';
import Event, { EventAttributes } from '../../models/event';
import { getCoinTransfers } from './transfers';
import Signer from '../../models/signer';
import Guard from '../../models/guard';

interface CoinbaseTransactionData {
  transactionAttributes: TransactionCreationAttributes;
  eventsAttributes: EventAttributes[];
  transfersCoinAttributes: TransferAttributes[];
}

export async function addCoinbaseTransactions(
  rows: Array<any>,
  tx: Transaction,
): Promise<EventAttributes[]> {
  const fetchPromises = rows.map(async row => {
    const output = await processCoinbaseTransaction(row.coinbase, {
      id: row.id,
      chainId: row.chainId,
      creationTime: row.creationTime,
    });
    return output;
  });

  const allData = (await Promise.all(fetchPromises)).filter(
    (f): f is CoinbaseTransactionData => f !== undefined,
  );

  const transactionsAdded = await TransactionModel.bulkCreate(
    allData.map(o => o.transactionAttributes),
    {
      transaction: tx,
      returning: ['id'],
    },
  );

  const transfersToAdd = allData
    .map((d, index) => {
      const transfersWithTransactionId = (d.transfersCoinAttributes ?? []).map(t => ({
        ...t,
        transactionId: transactionsAdded[index].id,
      }));
      return transfersWithTransactionId;
    })
    .flat();

  const eventsToAdd = allData
    .map((d, index) => {
      const eventsWithTransactionId = (d.eventsAttributes ?? []).map(t => ({
        ...t,
        transactionId: transactionsAdded[index].id,
      }));
      return eventsWithTransactionId;
    })
    .flat();

  await Transfer.bulkCreate(transfersToAdd, {
    transaction: tx,
  });

  await Event.bulkCreate(eventsToAdd, {
    transaction: tx,
  });

  return eventsToAdd;
}

export async function processCoinbaseTransaction(
  coinbase: any,
  block: { id: number; chainId: number; creationTime: bigint },
): Promise<CoinbaseTransactionData | undefined> {
  if (!coinbase) return;

  const eventsData = coinbase.events || [];
  const transactionAttributes = {
    blockId: block.id,
    chainId: block.chainId,
    creationtime: Math.trunc(Number(block.creationTime) / 1000000).toString(),
    hash: coinbase.reqKey,
    result: coinbase.result,
    logs: coinbase.logs,
    num_events: eventsData ? eventsData.length : 0,
    requestkey: coinbase.reqKey,
    sender: 'coinbase',
    txid: coinbase.txId.toString(),
  } as TransactionCreationAttributes;

  const transfersCoinAttributes = await getCoinTransfers(eventsData, transactionAttributes);

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
      requestkey: coinbase.reqKey,
    } as EventAttributes;
  }) as EventAttributes[];

  return { transactionAttributes, eventsAttributes, transfersCoinAttributes };
}
