import { PageInfo, Signer, Transaction, TransactionMeta } from '../../config/graphql-types';
import { PaginationsParams } from '../pagination';
import { ConnectionEdge } from '../types';

export type GetTransactionsParams = GetTransactionsCountParams & PaginationsParams;

export interface GetTransactionsByPublicKeyParams extends PaginationsParams {
  publicKey: string;
}

export interface GetSignersParams {
  transactionId?: string;
  requestKey?: string;
  orderIndex?: string;
}

export interface GetTransactionsCountParams {
  blockHash?: string | null;
  accountName?: string | null;
  chainId?: string | null;
  requestKey?: string | null;
  fungibleName?: string | null;
  minimumDepth?: number | null;
  maxHeight?: number | null;
  minHeight?: number | null;
  hasTokenId?: boolean | null;
}

export interface GetTransactionsByRequestKey {
  requestKey: string;
  blockHash?: string | null;
  minimumDepth?: number | null;
}

export type TransactionOutput = Omit<Transaction, 'cmd'> & {
  cmd: Omit<Transaction['cmd'], 'meta' | 'signers'>;
} & { databaseTransactionId: string; blockHash: string; blockHeight: number };

export type TransactionMetaOutput = TransactionMeta;

export type SignerOutput = Signer;
export default interface TransactionRepository {
  getTransactions(params: GetTransactionsParams): Promise<{
    pageInfo: PageInfo;
    edges: ConnectionEdge<TransactionOutput>[];
  }>;
  getTransactionsCount(params: GetTransactionsCountParams): Promise<number>;
  getTransactionsByRequestKey(params: GetTransactionsByRequestKey): Promise<TransactionOutput[]>;
  getTransactionByTransferId(transferId: string): Promise<TransactionOutput>;
  getTransactionMetaInfoById(transactionId: string): Promise<TransactionMetaOutput>;
  getTransactionsByPublicKey(params: GetTransactionsByPublicKeyParams): Promise<{
    pageInfo: PageInfo;
    edges: ConnectionEdge<TransactionOutput>[];
  }>;
  getTransactionsByPublicKeyCount(publicKey: string): Promise<number>;
  getTransactionsByEventIds(eventIds: string[]): Promise<TransactionOutput[]>;
  getSigners(params: GetSignersParams): Promise<SignerOutput[]>;
}
