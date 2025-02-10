import { ResolverContext } from "../../../config/apollo-server-config";
import { TransactionResultResolvers } from "../../../config/graphql-types";
import zod from "zod";
import { buildBlockOutput } from "../../output/build-block-output";

const schema = zod.object({ databaseTransactionId: zod.string() });

export const blockTransactionResultResolver: TransactionResultResolvers<ResolverContext>["block"] =
  async (parent, _args, context) => {
    console.log("blockTransactionResultResolver");

    const parentArgs = schema.parse(parent);

    const output = await context.getBlocksByTransactionIdsLoader.load(
      parentArgs.databaseTransactionId,
    );
    return buildBlockOutput(output);
  };
