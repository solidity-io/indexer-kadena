/**
 * GraphQL resolver for the 'completedBlockHeights' query
 *
 * This file implements the resolver for the 'completedBlockHeights' query in the GraphQL schema,
 * which allows clients to retrieve blocks at specific completed heights or within a height range.
 * This is useful for applications that need to verify the completeness of the blockchain data
 * or monitor specific block heights for transaction finality.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildBlockOutput } from '../output/build-block-output';

/**
 * Resolver function for the 'completedBlockHeights' query
 *
 * This resolver handles requests for blockchain blocks at specific heights or within a
 * height range. It delegates to the block repository to fetch blocks that match the
 * specified criteria, then transforms the results into the GraphQL-compatible format
 * using the block builder.
 *
 * The resolver supports several filtering options:
 * - completedHeights: Array of specific block heights to fetch
 * - heightCount: Number of heights to retrieve (used with continuous ranges)
 * - chainIds: Filter blocks by specific chain IDs
 *
 * It also implements the GraphQL Connection specification for pagination,
 * returning edges with cursors and pageInfo for navigation.
 *
 * @param _parent - Parent resolver object (unused in this root resolver)
 * @param args - GraphQL query arguments including completedHeights, heightCount, chainIds, and pagination parameters
 * @param context - Resolver context containing repository implementations
 * @returns Promise resolving to a blocks connection with edges and pagination info
 */
export const completedBlockHeightsQueryResolver: QueryResolvers<ResolverContext>['completedBlockHeights'] =
  async (_parent, args, context) => {
    const { completedHeights, heightCount, chainIds, first, after, before, last } = args;
    const output = await context.blockRepository.getCompletedBlocks({
      completedHeights,
      heightCount,
      chainIds,
      first,
      after,
      before,
      last,
    });

    const edges = output.edges.map(e => ({
      cursor: e.cursor,
      node: buildBlockOutput(e.node),
    }));

    return { edges, pageInfo: output.pageInfo };
  };
