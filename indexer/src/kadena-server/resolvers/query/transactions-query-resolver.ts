import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { buildTransactionOutput } from '../output/build-transaction-output';

export const transactionsQueryResolver: QueryResolvers<ResolverContext>['transactions'] = async (
  _parent,
  args,
  context,
) => {
  console.log('transactionsQueryResolver');
  const {
    after,
    before,
    first,
    last,
    accountName,
    blockHash,
    chainId,
    fungibleName,
    requestKey,
    maxHeight,
    minHeight,
    minimumDepth,
  } = args;

  if (!accountName && !fungibleName && !blockHash && !requestKey) {
    throw new Error(
      'At least one of accountName, fungibleName, blockHash, or requestKey must be provided',
    );
  }

  const output = await context.transactionRepository.getTransactions({
    blockHash,
    accountName,
    chainId,
    fungibleName,
    requestKey,
    maxHeight,
    minHeight,
    minimumDepth,
    first,
    last,
    before,
    after,
  });

  const edges = output.edges.map(e => ({
    cursor: e.cursor,
    node: buildTransactionOutput(e.node),
  }));

  return {
    edges,
    pageInfo: output.pageInfo,
    // for resolvers
    totalCount: -1,
    accountName,
    blockHash,
    chainId,
    maxHeight,
    minHeight,
    minimumDepth,
    fungibleName,
    requestKey,
  };
};
