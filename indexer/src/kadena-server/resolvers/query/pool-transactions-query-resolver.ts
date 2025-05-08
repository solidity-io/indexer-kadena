import { ResolverContext } from '../../config/apollo-server-config';
import {
  QueryResolvers,
  QueryPoolTransactionsArgs,
  PoolTransactionType,
  ResolverTypeWrapper,
  PoolTransactionEdge,
} from '../../config/graphql-types';

export const poolTransactionsQueryResolver: QueryResolvers<ResolverContext>['poolTransactions'] =
  async (_parent: unknown, args: QueryPoolTransactionsArgs, context: ResolverContext) => {
    const result = await context.poolRepository.getPoolTransactions({
      pairId: args.pairId,
      type: args.type as PoolTransactionType | undefined,
      first: args.first ?? 10,
      after: args.after,
      last: args.last,
      before: args.before,
    });

    return {
      edges: result.edges.map(edge => ({
        cursor: edge.cursor,
        node: edge.node as unknown as ResolverTypeWrapper<PoolTransactionEdge['node']>,
      })),
      pageInfo: result.pageInfo,
      totalCount: result.totalCount,
    };
  };
