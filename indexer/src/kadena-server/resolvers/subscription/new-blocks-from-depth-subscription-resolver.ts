import { withFilter } from 'graphql-subscriptions';
import { ResolverContext } from '../../config/apollo-server-config';
import {
  SubscriptionNewBlocksFromDepthArgs,
  SubscriptionResolvers,
} from '../../config/graphql-types';
import { NEW_BLOCKS_FROM_DEPTH_EVENT } from './consts';
import zod from 'zod';
import { blockQueryResolver } from '../query/block-query-resolver';

const newBlocksFromDepthSubscriptionSchema = zod.object({
  chainId: zod.string(),
  height: zod.number(),
  hash: zod.string(),
});

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
