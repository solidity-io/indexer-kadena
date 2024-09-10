import { ResolverContext } from "../../../config/apollo-server-config";
import { FungibleAccountResolvers } from "../../../config/graphql-types";
import { buildTransactionOutput } from "../../output/build-transaction-output";

export const transactionsFungibleAccountResolver: FungibleAccountResolvers<ResolverContext>["transactions"] =
  async (parent, args, context) => {
    console.log("transactionsFungibleAccountResolver");

    const { first, last, after, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      fungibleName: parent.fungibleName,
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
      fungibleName: parent.fungibleName,
    };
  };
