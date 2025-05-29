import { ResolverContext } from '../../config/apollo-server-config';
import { Pool, QueryResolvers, QueryPoolArgs } from '../../config/graphql-types';

export const poolQueryResolver: QueryResolvers<ResolverContext>['pool'] = async (
  _parent: unknown,
  args: QueryPoolArgs,
  context: ResolverContext,
): Promise<Pool> => {
  const pool = await context.poolRepository.getPool(args);

  if (!pool) {
    throw new Error(`Pool with id ${args.id} not found`);
  }

  return {
    __typename: 'Pool',
    id: pool.id.toString(),
    address: pool.address,
    token0: {
      __typename: 'Token',
      id: String(pool.token0.id),
      chainId: '0',
      name: pool.token0.name,
      address: pool.token0.address || '',
    },
    token1: {
      __typename: 'Token',
      id: String(pool.token1.id),
      chainId: '0',
      name: pool.token1.name,
      address: pool.token1.address || '',
    },
    reserve0: pool.reserve0,
    reserve1: pool.reserve1,
    totalSupply: pool.totalSupply,
    key: pool.key,
    tvlUsd: pool.tvlUsd ?? 0,
    tvlChange24h: pool.tvlChange24h ?? 0,
    volume24hUsd: pool.volume24hUsd ?? 0,
    volumeChange24h: pool.volumeChange24h ?? 0,
    volume7dUsd: pool.volume7dUsd ?? 0,
    fees24hUsd: pool.fees24hUsd ?? 0,
    feesChange24h: pool.feesChange24h ?? 0,
    transactionCount24h: pool.transactionCount24h ?? 0,
    transactionCountChange24h: pool.transactionCountChange24h ?? 0,
    apr24h: pool.apr24h ?? 0,
    createdAt: pool.createdAt,
    updatedAt: pool.updatedAt,
    charts: {
      __typename: 'PoolCharts',
      tvl: pool.charts.tvl || [],
      volume: pool.charts.volume || [],
      fees: pool.charts.fees || [],
    },
    transactions: pool.transactions || {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
    },
  };
};
