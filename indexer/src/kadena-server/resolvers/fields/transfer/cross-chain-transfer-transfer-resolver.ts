import { ResolverContext } from "../../../config/apollo-server-config";
import { TransferResolvers } from "../../../config/graphql-types";
import zod from "zod";
import { buildTransferOutput } from "../../output/build-transfer-output";

const schema = zod.object({
  pactId: zod.string().nullable(),
  amount: zod.string(),
});

export const crossChainTransferTransferResolver: TransferResolvers<ResolverContext>["crossChainTransfer"] =
  async (parent, _args, context) => {
    console.log("crossChainTransferTransferResolver");
    const { pactId, amount } = schema.parse(parent);
    if (!pactId) return null;

    const output =
      await context.transferRepository.getCrossChainTransferByPactId({
        pactId,
        amount,
      });

    return buildTransferOutput(output);
  };
