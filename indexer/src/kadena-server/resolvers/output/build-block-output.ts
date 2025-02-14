import {
  Block,
  BlockEventsConnection,
  BlockTransactionsConnection,
  FungibleChainAccount,
} from '../../config/graphql-types';
import { BlockOutput } from '../../repository/application/block-repository';

export const buildBlockOutput = (output: BlockOutput) => {
  return {
    ...output,
    // for resolvers
    parent: {} as Block,
    events: {} as BlockEventsConnection,
    minerAccount: {} as FungibleChainAccount,
    transactions: {} as BlockTransactionsConnection,
  };
};
