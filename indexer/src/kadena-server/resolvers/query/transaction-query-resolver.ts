import { ResolverContext } from "../../config/apollo-server-config";
import { QueryResolvers } from "../../config/graphql-types";
import { getBaselineAndOrphanedTransactions } from "../../domain/transaction/transaction-service";
import { buildTransactionOutput } from "../output/build-transaction-output";

export const transactionQueryResolver: QueryResolvers<ResolverContext>["transaction"] =
  async (_parent, args, context) => {
    console.log("transactionQueryResolver");
    const { requestKey, blockHash, minimumDepth } = args;
    const output =
      await context.transactionRepository.getTransactionsByRequestKey({
        requestKey,
        blockHash,
        minimumDepth,
      });

    const lastBlockHeight = await context.blockRepository.getLastBlockHeight();

    const { baselineTransaction, orphanedTransactions } =
      getBaselineAndOrphanedTransactions(output, lastBlockHeight);

    if (!baselineTransaction) return null;

    const baseTx = buildTransactionOutput(baselineTransaction);

    const orphanedTxs = orphanedTransactions.map((t) =>
      buildTransactionOutput(t),
    );

    return {
      ...baseTx,
      orphanedTransactions: orphanedTxs,
    };
  };
