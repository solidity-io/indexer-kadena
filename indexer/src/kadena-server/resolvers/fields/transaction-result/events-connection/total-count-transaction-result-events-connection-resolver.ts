import { ResolverContext } from "../../../../config/apollo-server-config";
import { TransactionResultEventsConnectionResolvers } from "../../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({
  transactionId: zod.string(),
});

export const totalCountTransactionResultEventsConnectionResolver: TransactionResultEventsConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountTransactionResultEventsConnectionResolver");

    const { transactionId } = schema.parse(parent);

    const output = await context.eventRepository.getTotalTransactionEventsCount(
      {
        transactionId,
      },
    );
    return output;
  };
