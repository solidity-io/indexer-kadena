import { withFilter } from "graphql-subscriptions";
import { ResolverContext } from "../../config/apollo-server-config";
import {
  SubscriptionNewBlocksArgs,
  SubscriptionResolvers,
} from "../../config/graphql-types";
import { blockQueryResolver } from "../query/block-query-resolver";
import { NEW_BLOCKS_EVENT } from "./consts";

export const newBlocksSubscriptionResolver: SubscriptionResolvers<ResolverContext>["newBlocks"] =
  {
    resolve: async (payload: any, _args: any, context: ResolverContext) => {
      const res = await (blockQueryResolver as any)({}, payload, context);
      return [res];
    },
    subscribe: (_parent, args: SubscriptionNewBlocksArgs, context) => {
      return {
        [Symbol.asyncIterator]: withFilter(
          () => context.pubSub.asyncIterator(NEW_BLOCKS_EVENT),
          (payload) => {
            const { chainId } = payload;
            if (!args.chainIds) {
              return true;
            }
            return args.chainIds.includes(chainId);
          },
        ),
      };
    },
  };
