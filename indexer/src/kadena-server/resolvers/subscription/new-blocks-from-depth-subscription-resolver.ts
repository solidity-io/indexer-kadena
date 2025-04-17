/**
 * @file subscription/new-blocks-from-depth-subscription-resolver.ts
 * @description GraphQL subscription resolver for blocks that reach a specific confirmation depth
 *
 * This file implements the resolver for the 'newBlocksFromDepth' subscription in the GraphQL schema,
 * which allows clients to receive real-time updates when blocks reach a specified minimum
 * confirmation depth. This is particularly useful for applications that need to wait for
 * a certain number of confirmations before considering a transaction finalized.
 *
 * Unlike the standard newBlocks subscription, this subscription uses a PubSub event
 * filtering mechanism to only notify clients when blocks meet their criteria.
 */

import { withFilter } from 'graphql-subscriptions';
import { ResolverContext } from '../../config/apollo-server-config';
import {
  SubscriptionNewBlocksFromDepthArgs,
  SubscriptionResolvers,
} from '../../config/graphql-types';
import { NEW_BLOCKS_FROM_DEPTH_EVENT } from './consts';
import zod from 'zod';
import { blockQueryResolver } from '../query/block-query-resolver';

/**
 * Zod schema for validating incoming block notification events
 *
 * This schema ensures that the payload from the PubSub system contains
 * the required properties (chainId, height, hash) and that they are of
 * the correct types before processing the event.
 */
const newBlocksFromDepthSubscriptionSchema = zod.object({
  chainId: zod.string(),
  height: zod.number(),
  hash: zod.string(),
});

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
 * This approach allows for a single PubSub event stream to serve multiple clients with
 * different filtering requirements.
 */
export const newBlocksFromDepthSubscriptionResolver: SubscriptionResolvers<ResolverContext>['newBlocksFromDepth'] =
  {
    resolve: async (payload: any, _args: any, context: ResolverContext) => {
      const res = await (blockQueryResolver as any)({}, { hash: payload.hash }, context);
      return [res];
    },
    subscribe: (_parent, args: SubscriptionNewBlocksFromDepthArgs, context) => {
      return {
        [Symbol.asyncIterator]: withFilter(
          () => context.pubSub.asyncIterator(NEW_BLOCKS_FROM_DEPTH_EVENT),
          payload => {
            const res = newBlocksFromDepthSubscriptionSchema.safeParse(payload);
            if (!res.success) {
              console.error(
                '[ERROR][API][BIZ_FLOW] Invalid payload on newBlocksFromDepthSubscription',
                payload,
              );
              return false;
            }
            const { chainId, height } = res.data;
            return (
              (!args.chainIds || args.chainIds.includes(chainId)) && height >= args.minimumDepth
            );
          },
        ),
      };
    },
  };
