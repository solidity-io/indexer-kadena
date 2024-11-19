import { TransactionOutput } from "../../repository/application/transaction-repository";

const BLOCK_DEPTH = 6;

export const getBaselineAndOrphanedTransactions = (
  transactions: TransactionOutput[],
  maxHeight: number,
): {
  baselineTransaction: TransactionOutput | null;
  orphanedTransactions: TransactionOutput[];
} => {
  if (transactions.length === 0) {
    return { baselineTransaction: null, orphanedTransactions: [] };
  }

  const baselineTransaction = transactions.filter(
    (transaction) => maxHeight - transaction.blockHeight > BLOCK_DEPTH,
  );

  const orphanedTransactions = transactions.filter(
    (transaction) => maxHeight - transaction.blockHeight <= BLOCK_DEPTH,
  );

  if (baselineTransaction.length > 1) {
    return {
      baselineTransaction: baselineTransaction[0],
      orphanedTransactions: [
        ...baselineTransaction.slice(1),
        ...orphanedTransactions,
      ],
    };
  }

  if (!baselineTransaction) {
    const [first, ...rest] = orphanedTransactions;
    return { baselineTransaction: first, orphanedTransactions: rest };
  }

  return { baselineTransaction: baselineTransaction[0], orphanedTransactions };
};
