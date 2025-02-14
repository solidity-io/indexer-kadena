import { Transaction } from '../../config/graphql-types';

export type TransactionOutput = Omit<Transaction, 'orphanedTransactions' | 'result'>;

export default interface MempoolGateway {
  getPendingTransaction(requestKey: string, chainId: string): Promise<TransactionOutput>;
}
