/**
 * GraphQL subscription resolver for blocks that reach a specific confirmation depth
 *
 * This file implements the resolver for the 'newBlocksFromDepth' subscription in the GraphQL schema,
 * which allows clients to receive real-time updates when blocks reach a specified minimum
 * confirmation depth. This is particularly useful for applications that need to wait for
 * a certain number of confirmations before considering a transaction finalized.
 */

import { ResolverContext } from '../../config/apollo-server-config';
import { SubscriptionResolvers } from '../../config/graphql-types';
import { BlockOutput } from '../../repository/application/block-repository';

async function* iteratorFn(
  chainIds: string[],
  minimumDepth: number,
  context: ResolverContext,
): AsyncGenerator<BlockOutput[], void, unknown> {
  const startingTimestamp = new Date().getTime() / 1000000;
  const blockResult = await context.blockRepository.getLastBlocksWithDepth(
    chainIds,
    minimumDepth,
    startingTimestamp,
  );

  let lastBlockId: string | undefined;

  if (blockResult.length > 0) {
    lastBlockId = blockResult[0].blockId.toString();
    yield [];
  }

  while (context.signal) {
    const newBlocks = await context.blockRepository.getLastBlocksWithDepth(
      chainIds,
      minimumDepth,
      startingTimestamp,
      lastBlockId,
    );

    if (newBlocks.length > 0) {
      lastBlockId = newBlocks[0].blockId.toString();
      yield newBlocks;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

/**
 * GraphQL subscription resolver for the 'newBlocksFromDepth' subscription
 *
 * This resolver follows the Apollo subscription pattern with separate subscribe and resolve functions:
 * - subscribe: Sets up a filtered AsyncIterator that will push block data to subscribers when
 *   blocks meet the specified chain and depth criteria.
 * - resolve: Transforms the basic block data from the event into complete Block objects by
 *   leveraging the block query resolver to fetch full details.
 *
 * The resolver uses GraphQL's withFilter function to efficiently filter the stream of all
 * block events down to only those matching the client's criteria:
 * - Blocks on chains specified by the chainIds argument (or all chains if not specified)
 * - Blocks with a depth (confirmations) greater than or equal to minimumDepth
 *
 */
export const newBlocksFromDepthSubscriptionResolver: SubscriptionResolvers<ResolverContext>['newBlocksFromDepth'] =
  {
    resolve: (payload: any) => payload,
    subscribe: (_root, args, context) => {
      return iteratorFn(args.chainIds ?? [], args.minimumDepth, context);
    },
  };
