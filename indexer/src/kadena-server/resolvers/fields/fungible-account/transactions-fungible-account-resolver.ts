/**
 * Resolver for the transactions field of the FungibleAccount type.
 * This module retrieves transactions associated with a specific fungible token account
 * in a paginated connection format.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { FungibleAccountResolvers } from '../../../config/graphql-types';
import { buildTransactionOutput } from '../../output/build-transaction-output';

/**
 * Resolver function for the transactions field of the FungibleAccount type.
 * Retrieves a paginated connection of transactions associated with the specified
 * account and fungible token.
 *
 * @param parent - The parent object containing accountName and fungibleName
 * @param args - GraphQL pagination arguments (first, after, before, last)
 * @param context - The resolver context containing repositories and services
 * @returns A connection object with edges containing transaction nodes, pagination info, and metadata for resolvers
 */
export const transactionsFungibleAccountResolver: FungibleAccountResolvers<ResolverContext>['transactions'] =
  async (parent, args, context) => {
    const { first, last, after, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
      after,
      first,
      last,
      before,
    });

    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildTransactionOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,
      // for resolvers
      totalCount: -1, // Placeholder value; actual count is resolved by a separate resolver
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
    };
  };
