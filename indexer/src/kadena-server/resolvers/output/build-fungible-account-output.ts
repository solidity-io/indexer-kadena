import {
  FungibleAccountTransactionsConnection,
  FungibleAccountTransfersConnection,
  FungibleChainAccount,
} from "../../config/graphql-types";
import { FungibleAccountOutput } from "../../repository/application/balance-repository";

export const buildFungibleAccount = (account: FungibleAccountOutput) => {
  return {
    ...account,
    // resolvers
    chainAccounts: [] as FungibleChainAccount[],
    transactions: {} as FungibleAccountTransactionsConnection,
    transfers: {} as FungibleAccountTransfersConnection,
  };
};
