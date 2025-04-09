import { ResolverContext } from '../../../config/apollo-server-config';
import { BlockResolvers } from '../../../config/graphql-types';
import { buildTransactionOutput } from '../../output/build-transaction-output';

export const transactionsBlockResolver: BlockResolvers<ResolverContext>['transactions'] = async (
  parent,
  args,
  context,
) => {
  const { hash } = parent;
  const { first, last, before, after } = args;
  const output = await context.transactionRepository.getTransactions({
    blockHash: hash,
    first,
    last,
    before,
    after,
  });

  const edges = output.edges.map(e => {
    return {
      cursor: e.cursor,
      node: buildTransactionOutput(e.node),
    };
  });

  return {
    edges,
    pageInfo: output.pageInfo,
    // for resolvers
    blockHash: hash,
    totalCount: -1,
  };
};
