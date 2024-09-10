import { ResolverContext } from "../../../config/apollo-server-config";
import { QueryTransfersConnectionResolvers } from "../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({
  accountName: zod.string().nullable().optional(),
  blockHash: zod.string().nullable().optional(),
  chainId: zod.string().nullable().optional(),
  fungibleName: zod.string().nullable().optional(),
  requestKey: zod.string().nullable().optional(),
});

export const totalCountQueryTransfersConnectionResolver: QueryTransfersConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountQueryTransfersConnectionResolver");

    const { accountName, blockHash, chainId, fungibleName, requestKey } =
      schema.parse(parent);

    const transactions =
      await context.transferRepository.getTotalCountOfTransfers({
        accountName,
        blockHash,
        chainId,
        fungibleName,
        requestKey,
      });

    return transactions;
  };
