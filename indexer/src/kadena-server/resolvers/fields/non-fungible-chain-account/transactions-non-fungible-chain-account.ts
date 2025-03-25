import { ResolverContext } from '../../../config/apollo-server-config';
import { NonFungibleChainAccountResolvers } from '../../../config/graphql-types';
import { buildTransactionOutput } from '../../output/build-transaction-output';

export const transactionsNonFungibleChainAccountResolver: NonFungibleChainAccountResolvers<ResolverContext>['transactions'] =
  async (parent, args, context) => {
    const { first, after, last, before } = args;
    const output = await context.transactionRepository.getTransactions({
      accountName: parent.accountName,
      chainId: parent.chainId,
      after,
      first,
      last,
      before,
      hasTokenId: true,
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
      accountName: parent.accountName,
      chainId: parent.chainId,
    };
  };
