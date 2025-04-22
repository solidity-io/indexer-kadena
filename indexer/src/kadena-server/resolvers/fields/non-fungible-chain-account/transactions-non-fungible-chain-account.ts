/**
 * Resolver for the transactions field of the NonFungibleChainAccount type.
 * This module retrieves transactions associated with non-fungible tokens (NFTs)
 * owned by a specific account on a specific chain in a paginated connection format.
 */
import { ResolverContext } from '../../../config/apollo-server-config';
import { NonFungibleChainAccountResolvers } from '../../../config/graphql-types';
import { buildTransactionOutput } from '../../output/build-transaction-output';

/**
 * Resolver function for the transactions field of the NonFungibleChainAccount type.
 * Retrieves a paginated connection of transactions associated with NFTs owned by
 * the specified account on the specified chain. Specifically filters for transactions
 * that include token IDs.
 *
 * @param parent - The parent object containing accountName and chainId
 * @param args - GraphQL pagination arguments (first, after, before, last)
 * @param context - The resolver context containing repositories and services
 * @returns A connection object with edges containing transaction nodes, pagination info, and metadata for resolvers
 */
export const transactionsNonFungibleChainAccountResolver: NonFungibleChainAccountResolvers<ResolverContext>['transactions'] =
  async (parent, args, context) => {
    const { first, after, last, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      chainId: parent.chainId,
      after,
      first,
      last,
      before,
      hasTokenId: true, // Specifically retrieves NFT transactions that have token IDs
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
    };
  };
