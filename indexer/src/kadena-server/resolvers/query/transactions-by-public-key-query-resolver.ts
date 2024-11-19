import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildTransactionOutput } from "../output/build-transaction-output";

export const transactionsByPublicKeyQueryResolver: QueryResolvers<ResolverContext>["transactionsByPublicKey"] =
  async (_parent, args, context) => {
    console.log("transactionsByPublicKeyQueryResolver");
    const { publicKey, first, after, before, last } = args;
    const output =
      await context.transactionRepository.getTransactionsByPublicKey({
        publicKey,
        first,
        after,
        before,
        last,
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
      publicKey,
    };
  };
