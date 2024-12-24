import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildFungibleChainAccount } from "../output/build-fungible-chain-account-output";

export const fungibleChainAccountsByPublicKeyQueryResolver: QueryResolvers<ResolverContext>["fungibleChainAccountsByPublicKey"] =
  async (_parent, args, context) => {
    console.log("fungibleChainAccountsByPublicKeyQueryResolver");
    const { publicKey, fungibleName, chainId } = args;

    const output =
      await context.balanceRepository.getChainAccountsByPublicKey_NODE(
        publicKey,
        fungibleName,
        chainId,
      );

    const res = output.map((acc) => buildFungibleChainAccount(acc));
    return res;
  };
