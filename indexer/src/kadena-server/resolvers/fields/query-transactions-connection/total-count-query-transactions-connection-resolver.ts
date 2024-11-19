import { ResolverContext } from "../../../config/apollo-server-config";
import { QueryTransactionsConnectionResolvers } from "../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({
  accountName: zod.string().nullable().optional(),
  blockHash: zod.string().nullable().optional(),
  chainId: zod.string().nullable().optional(),
  fungibleName: zod.string().nullable().optional(),
  maxHeight: zod.number().nullable().optional(),
  minHeight: zod.number().nullable().optional(),
  minimumDepth: zod.number().nullable().optional(),
  requestKey: zod.string().nullable().optional(),
});

export const totalCountQueryTransactionsConnectionResolver: QueryTransactionsConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountQueryTransactionsConnectionResolver");
    const {
      accountName,
      blockHash,
      chainId,
      maxHeight,
      minHeight,
      minimumDepth,
      fungibleName,
      requestKey,
    } = schema.parse(parent);
    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      blockHash,
      chainId,
      fungibleName,
      maxHeight,
      minHeight,
      minimumDepth,
      requestKey,
    });
    return output;
  };
