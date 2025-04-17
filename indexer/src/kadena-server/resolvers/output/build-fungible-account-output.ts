/**
 * @file output/build-fungible-account-output.ts
 * @description Builder function for transforming database fungible account entities into GraphQL-compatible format
 *
 * This file is responsible for preparing fungible account data from the database to be returned
 * through the GraphQL API. It transforms a FungibleAccountOutput from the repository into a format
 * that matches the FungibleAccount type in the GraphQL schema, including placeholders for fields
 * that will be resolved by field resolvers.
 */

import {
  FungibleAccountTransactionsConnection,
  FungibleAccountTransfersConnection,
  FungibleChainAccount,
} from '../../config/graphql-types';
import { FungibleAccountOutput } from '../../repository/application/balance-repository';

/**
 * Transforms a database fungible account entity into a GraphQL-compatible format
 *
 * This function takes a FungibleAccountOutput from the database repository and converts it into
 * a structure that matches the FungibleAccount type in the GraphQL schema. It preserves all the
 * scalar properties from the original account entity and adds placeholder objects and arrays
 * for related entities that will be resolved by separate field resolvers.
 *
 * The placeholder objects (chainAccounts, transactions, transfers) allow the GraphQL resolver
 * system to identify which fields need to be resolved, while avoiding unnecessary database
 * queries for fields that aren't requested in the client query.
 *
 * @param account - The fungible account entity from the database repository
 * @returns A GraphQL-compatible fungible account object with placeholders for related entities
 */
export const buildFungibleAccount = (account: FungibleAccountOutput) => {
  return {
    ...account,
    // resolvers
    chainAccounts: [] as FungibleChainAccount[],
    transactions: {} as FungibleAccountTransactionsConnection,
    transfers: {} as FungibleAccountTransfersConnection,
  };
};
