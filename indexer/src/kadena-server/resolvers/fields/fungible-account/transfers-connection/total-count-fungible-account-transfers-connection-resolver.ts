import { ResolverContext } from "../../../../config/apollo-server-config";
import { FungibleAccountTransfersConnectionResolvers } from "../../../../config/graphql-types";
import zod from "zod";

const schema = zod.object({
  accountName: zod.string(),
  fungibleName: zod.string(),
});

export const totalCountFungibleAccountTransfersConnectionResolver: FungibleAccountTransfersConnectionResolvers<ResolverContext>["totalCount"] =
  async (parent, _args, context) => {
    console.log("totalCountFungibleAccountTransfersConnection");

    const { accountName, fungibleName } = schema.parse(parent);

    const output = await context.transferRepository.getTotalCountOfTransfers({
      accountName,
      fungibleName,
    });
    return output;
  };
