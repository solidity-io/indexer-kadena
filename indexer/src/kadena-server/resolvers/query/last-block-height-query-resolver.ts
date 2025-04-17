/**
 * GraphQL resolver for the 'lastBlockHeight' query
 *
 * This file implements the resolver for the 'lastBlockHeight' query in the GraphQL schema,
 * which allows clients to retrieve the height of the most recent block indexed by the system.
 * This is useful for determining how up-to-date the indexer is compared to the blockchain.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';

/**
 * Resolver function for the 'lastBlockHeight' query
 *
 * This resolver handles requests for the most recent block height in the database.
 * It delegates to the block repository to fetch this simple but important piece of
 * information, which clients can use to determine if they are synced with the latest
 * blockchain state or need to wait for more blocks to be indexed.
 *
 * Unlike most other resolvers, this one returns a scalar value (BigInt) rather than
 * a complex object or connection.
 *
 * @param _args - Parent object (unused in this root resolver)
 * @param _parent - GraphQL query arguments (unused in this resolver)
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to a BigInt representing the height of the most recent indexed block
 */
export const lastBlockHeightQueryResolver: QueryResolvers<ResolverContext>['lastBlockHeight'] =
  async (_args, _parent, context) => {
    const lastBlockHeight = await context.blockRepository.getLastBlockHeight();

    return lastBlockHeight;
  };
