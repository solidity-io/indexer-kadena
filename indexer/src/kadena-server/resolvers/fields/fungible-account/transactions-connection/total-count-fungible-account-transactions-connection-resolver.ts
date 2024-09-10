import { ResolverContext } from "../../../../config/apollo-server-config";
import { FungibleAccountTransactionsConnectionResolvers } from "../../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({
  accountName: zod.string(),
  fungibleName: zod.string(),
});

export const totalCountFungibleAccountTransactionsConnectionResolver: FungibleAccountTransactionsConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountFungibleAccountTransactionsConnectionResolver");

    const { accountName, fungibleName } = schema.parse(parent);

    const output = await context.transactionRepository.getTransactionsCount({
      accountName,
      fungibleName,
    });
    return output;
  };
