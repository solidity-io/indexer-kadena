import { ResolverContext } from "../../../config/apollo-server-config";
import { FungibleChainAccountResolvers } from "../../../config/graphql-types";
import { buildTransactionOutput } from "../../output/build-transaction-output";

export const transactionsFungibleChainAccountResolver: FungibleChainAccountResolvers<ResolverContext>["transactions"] =
  async (parent, args, context) => {
    console.log("transactionsFungibleChainAccountResolver");

    const { first, after, last, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
      chainId: parent.chainId,
      after,
      first,
      last,
      before,
    });

    const edges = output.edges.map((e) => ({
      cursor: e.cursor,
      node: buildTransactionOutput(e.node),
    }));

    return {
      edges,
      pageInfo: output.pageInfo,

      // for resolvers
      totalCount: -1,
      accountName: parent.accountName,
      chainId: parent.chainId,
      fungibleName: parent.fungibleName,
    };
  };
