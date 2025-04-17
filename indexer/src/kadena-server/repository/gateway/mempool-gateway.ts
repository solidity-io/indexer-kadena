/**
 * @file repository/gateway/mempool-gateway.ts
 * @description Interface for interactions with the Kadena blockchain mempool
 *
 * This file defines the interface for querying the mempool of the Kadena blockchain.
 * The mempool contains pending transactions that have been submitted to the network
 * but have not yet been included in a block. This interface allows the application
 * to query the status of pending transactions.
 */

import { Transaction } from '../../config/graphql-types';

/**
 * Represents a pending transaction output format
 *
 * This type omits certain fields from the full Transaction type
 * since pending transactions don't have some properties yet
 * (like orphaned transactions or result information)
 */
export type TransactionOutput = Omit<Transaction, 'orphanedTransactions' | 'result'>;

/**
 * Interface defining operations for interacting with the blockchain mempool
 *
 * This gateway interface provides methods to query the mempool for
 * pending transactions, allowing the application to check transaction
 * status before they are confirmed in a block.
 */
export default interface MempoolGateway {
  /**
   * Retrieves a pending transaction from the mempool by its request key
   *
   * This method queries the blockchain node's mempool to fetch information
   * about a pending transaction that has been submitted but not yet included
   * in a block.
   *
   * @param requestKey - The unique identifier of the transaction
   * @param chainId - The chain ID where the transaction was submitted
   * @returns Promise resolving to transaction data if found in the mempool
   */
  getPendingTransaction(requestKey: string, chainId: string): Promise<TransactionOutput>;
}
