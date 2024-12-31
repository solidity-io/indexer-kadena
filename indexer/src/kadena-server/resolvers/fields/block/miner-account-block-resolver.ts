import { ResolverContext } from "../../../config/apollo-server-config";
import { BlockResolvers } from "../../../config/graphql-types";
import { buildFungibleChainAccount } from "../../output/build-fungible-chain-account-output";

export const minerAccountBlockResolver: BlockResolvers<ResolverContext>["minerAccount"] =
  async (parent, _args, context) => {
    console.log("minerAccountBlockResolver");

    const output = await context.blockRepository.getMinerData(
      parent.hash,
      parent.chainId,
    );

    return buildFungibleChainAccount(output);
  };
