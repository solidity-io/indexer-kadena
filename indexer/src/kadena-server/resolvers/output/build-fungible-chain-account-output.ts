import {
  FungibleChainAccountTransactionsConnection,
  FungibleChainAccountTransfersConnection,
} from '../../config/graphql-types';
import { FungibleChainAccountOutput } from '../../repository/application/block-repository';

export const buildFungibleChainAccount = (acc: FungibleChainAccountOutput) => {
  return {
    ...acc,
    // for resolvers
    transactions: {} as FungibleChainAccountTransactionsConnection,
    transfers: {} as FungibleChainAccountTransfersConnection,
  };
};
