import { Signer, TransactionMeta } from "../../config/graphql-types";
import { TransactionOutput } from "../../repository/application/transaction-repository";

export const buildTransactionOutput = (tx: TransactionOutput) => {
  return {
    ...tx,
    cmd: {
      ...tx.cmd,
      // for resolvers
      databaseTransactionId: tx.databaseTransactionId,
      meta: {} as TransactionMeta,
      signers: [] as Signer[],
    },
    result: {
      ...tx.result,
      // for resolvers
      databaseTransactionId: tx.databaseTransactionId,
      blockHash: tx.blockHash,
    },
  };
};
