/**
 * Resolver for the transactions field of the FungibleChainAccount type.
 * This module retrieves transactions associated with a chain-specific fungible token account
 * in a paginated connection format.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { FungibleChainAccountResolvers } from '../../../config/graphql-types';
import { buildTransactionOutput } from '../../output/build-transaction-output';

/**
 * Resolver function for the transactions field of the FungibleChainAccount type.
 * Retrieves a paginated connection of transactions associated with the specified
 * account, fungible token, and chain.
 *
 * @param parent - The parent object containing accountName, fungibleName, and chainId
 * @param args - GraphQL pagination arguments (first, after, before, last)
 * @param context - The resolver context containing repositories and services
 * @returns A connection object with edges containing transaction nodes, pagination info, and metadata for resolvers
 */
export const transactionsFungibleChainAccountResolver: FungibleChainAccountResolvers<ResolverContext>['transactions'] =
  async (parent, args, context) => {
    const { first, after, last, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
      chainId: parent.chainId,
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
      chainId: parent.chainId,
      fungibleName: parent.fungibleName,
    };
  };
