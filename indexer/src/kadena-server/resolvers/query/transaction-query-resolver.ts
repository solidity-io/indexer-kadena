import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { buildTransactionOutput } from "../output/build-transaction-output";

export const transactionQueryResolver: QueryResolvers<ResolverContext>["transaction"] =
  async (_parent, args, context) => {
    console.log("transactionQueryResolver");
    const { requestKey, blockHash, minimumDepth } = args;
    const transactions =
      await context.transactionRepository.getTransactionsByRequestKey({
        requestKey,
        blockHash,
        minimumDepth,
      });

    if (transactions.length === 0) return null;

    const [first, ...rest] =
      await context.blockRepository.getTransactionsOrderedByBlockDepth(
        transactions,
      );

    return {
      ...buildTransactionOutput(first),
      orphanedTransactions: rest.map((r) => buildTransactionOutput(r)),
    };
  };
