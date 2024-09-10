import { withFilter } from "graphql-subscriptions";
import { ResolverContext } from "../../config/apollo-server-config";
import {
  SubscriptionResolvers,
  SubscriptionTransactionArgs,
} from "../../config/graphql-types";

import { transactionQueryResolver } from "../query/transaction-query-resolver";
import { TRANSACTION_EVENT } from "./consts";
import zod from "zod";

const newTransactionSubscriptionSchema = zod.object({
  requestKey: zod.string(),
  chainId: zod.string(),
});

export const transactionSubscriptionResolver: SubscriptionResolvers<ResolverContext>["transaction"] =
  {
    resolve: async (payload: any, _args: any, context: ResolverContext) => {
      return (transactionQueryResolver as any)(
        {},
        { requestKey: payload.requestKey, chainId: payload.chainId },
        context,
      );
    },
    subscribe: (_parent, args, context) => {
      return {
        [Symbol.asyncIterator]: withFilter(
          () => context.pubSub.asyncIterator([TRANSACTION_EVENT]),
          (payload) => {
            const res = newTransactionSubscriptionSchema.safeParse(payload);
            if (!res.success) {
              console.info(
                "Invalid payload on newTransactionSubscriptionSchema",
                payload,
              );
              return false;
            }
            const { requestKey, chainId } = res.data;
            return requestKey === args.requestKey && chainId === args.chainId;
          },
        ),
      };
    },
  };
