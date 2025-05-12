/**
 * Builder function for transforming database transaction entities into GraphQL-compatible format
 *
 * This file is responsible for preparing transaction data from the database to be returned through
 * the GraphQL API. It transforms a TransactionOutput from the repository into a format that matches
 * the Transaction type in the GraphQL schema, including placeholders for fields that will be resolved
 * by field resolvers.
 */

import { Signer, TransactionMeta } from '../../config/graphql-types';
import { TransactionOutput } from '../../repository/application/transaction-repository';

/**
 * Transforms a database transaction entity into a GraphQL-compatible format
 *
 * This function takes a TransactionOutput from the database repository and converts it into
 * a structure that matches the Transaction type in the GraphQL schema. It preserves all the
 * scalar properties from the original transaction entity and adds placeholder objects for
 * related entities that will be resolved by separate field resolvers.
 *
 * The function also ensures that necessary metadata (like databaseTransactionId and blockHash)
 * is carried over to nested objects (cmd and result), making this information available to
 * the field resolvers that will populate the related entities.
 *
 * @param tx - The transaction entity from the database repository
 * @returns A GraphQL-compatible transaction object with placeholders for related entities
 */
export const buildTransactionOutput = (tx: TransactionOutput) => {
  return {
    ...tx,
    cmd: {
      ...tx.cmd,
      // for resolvers
      databaseTransactionId: tx.databaseTransactionId,
      meta: {} as TransactionMeta,
      signers: [] as Signer[],
    },
    result: {
      ...tx.result,
      // for resolvers
      databaseTransactionId: tx.databaseTransactionId,
      blockHash: tx.blockHash,
    },
  };
};
