import { ResolverContext } from "../../../config/apollo-server-config";
import { FungibleAccountResolvers } from "../../../config/graphql-types";
import { buildFungibleChainAccount } from "../../output/build-fungible-chain-account-output";

export const chainAccountsFungibleAccountResolver: FungibleAccountResolvers<ResolverContext>["chainAccounts"] =
  async (parent, _args, context) => {
    console.log("chainAccountsFungibleAccountResolver");
    const accounts = await context.balanceRepository.getChainsAccountInfo_NODE(
      parent.accountName,
      parent.fungibleName,
    );

    return accounts.map((acc) => buildFungibleChainAccount(acc));
  };
