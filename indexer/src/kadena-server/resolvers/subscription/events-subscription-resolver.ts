import { withFilter } from "graphql-subscriptions";
import { ResolverContext } from "../../config/apollo-server-config";
import { SubscriptionResolvers } from "../../config/graphql-types";
import { eventsQueryResolver } from "../query/events-query-resolver";
import zod from "zod";

import { EVENTS_EVENT } from "./consts";

const eventsSubscriptionSchema = zod.object({
  chainId: zod.string(),
  height: zod.number(),
  qualifiedEventName: zod.string(),
});

export const eventsSubscriptionResolver: SubscriptionResolvers<ResolverContext>["events"] =
  {
    resolve: async (payload: any, _args: any, context: ResolverContext) => {
      const res = await (eventsQueryResolver as any)(
        {},
        {
          blockHash: payload.hash,
          chainId: payload.chainId,
          qualifiedEventName: payload.qualifiedEventName,
        },
        context,
      );
      return res.edges.map((e: any) => e.node);
    },
    subscribe: (_parent, args, context) => {
      return {
        [Symbol.asyncIterator]: withFilter(
          () => context.pubSub.asyncIterator(EVENTS_EVENT),
          (payload) => {
            const res = eventsSubscriptionSchema.safeParse(payload);
            if (!res.success) {
              console.info("Invalid payload on eventsSubscription", payload);
              return false;
            }
            const { chainId, height, qualifiedEventName } = res.data;

            if (args.chainId && chainId !== args.chainId) {
              return false;
            }

            if (args.minimumDepth && height < args.minimumDepth) {
              return false;
            }

            return qualifiedEventName === args.qualifiedEventName;
          },
        ),
      };
    },
  };
