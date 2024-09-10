import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildFungibleAccount } from "../output/build-fungible-account-output";

export const fungibleAccountsByPublicKeyQueryResolver: QueryResolvers<ResolverContext>["fungibleAccountsByPublicKey"] =
  async (_parent, args, context) => {
    console.log("fungibleAccountsByPublicKeyQueryResolver");
    const { publicKey, fungibleName } = args;
    const accounts = await context.balanceRepository.getAccountsByPublicKey(
      publicKey,
      fungibleName
    );

    const output = accounts.map((acc) => buildFungibleAccount(acc));

    return output;
  };
