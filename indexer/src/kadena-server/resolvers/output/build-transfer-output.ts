/**
 * Builder function for transforming database transfer entities into GraphQL-compatible format
 *
 * This file is responsible for preparing transfer data from the database to be returned through
 * the GraphQL API. It transforms a TransferOutput from the repository into a format that matches
 * the Transfer type in the GraphQL schema, including placeholders for fields that will be resolved
 * by field resolvers.
 */

import { Block, Transaction, Transfer } from '../../config/graphql-types';
import { TransferOutput } from '../../repository/application/transfer-repository';

/**
 * Transforms a database transfer entity into a GraphQL-compatible format
 *
 * This function takes a TransferOutput from the database repository and converts it into
 * a structure that matches the Transfer type in the GraphQL schema. It preserves all the
 * scalar properties from the original transfer entity and adds placeholder objects for
 * related entities that will be resolved by separate field resolvers.
 *
 * The placeholder objects (block, transaction, crossChainTransfer) allow the GraphQL resolver
 * system to identify which fields need to be resolved, while avoiding unnecessary database
 * queries for fields that aren't requested in the client query.
 *
 * @param transfer - The transfer entity from the database repository
 * @returns A GraphQL-compatible transfer object with placeholders for related entities
 */
export const buildTransferOutput = (transfer: TransferOutput) => {
  return {
    ...transfer,
    // for resolvers
    block: {} as Block,
    transaction: {} as Transaction,
    crossChainTransfer: {} as Transfer,
  };
};
