import { Block, Transaction, Transfer } from "../../config/graphql-types";
import { TransferOutput } from "../../repository/application/transfer-repository";

export const buildTransferOutput = (transfer: TransferOutput) => {
  return {
    ...transfer,
    // for resolvers
    block: {} as Block,
    transaction: {} as Transaction,
    crossChainTransfer: {} as Transfer,
  };
};
