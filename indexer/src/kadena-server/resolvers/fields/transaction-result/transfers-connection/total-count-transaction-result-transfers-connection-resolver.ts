import { ResolverContext } from "../../../../config/apollo-server-config";
import { TransactionResultTransfersConnectionResolvers } from "../../../../config/graphql-types";

export const totalCountTransactionResultTransfersConnectionResolver: TransactionResultTransfersConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountTransactionResultTransfersConnectionResolver");

    const output = await context.transferRepository.getTotalCountOfTransfers({
      transactionId: parent.transactionId,
    });
    return output;
  };
