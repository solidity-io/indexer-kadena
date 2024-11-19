import { ResolverContext } from "../../../../config/apollo-server-config";
import { TransactionResultEventsConnectionResolvers } from "../../../../config/graphql-types";

export const totalCountTransactionResultEventsConnectionResolver: TransactionResultEventsConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountTransactionResultEventsConnectionResolver");

    const output = await context.eventRepository.getTotalTransactionEventsCount(
      {
        transactionId: parent.transactionId,
      }
    );
    return output;
  };
