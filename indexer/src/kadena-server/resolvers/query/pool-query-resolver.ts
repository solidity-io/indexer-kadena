import { ResolverContext } from '../../config/apollo-server-config';
import { QueryResolvers } from '../../config/graphql-types';
import { PoolOutput } from '../../repository/application/pool-repository';

export const poolQueryResolver: QueryResolvers<ResolverContext>['pool'] = async (
  _parent: unknown,
  args: { id: string },
  context: ResolverContext,
): Promise<any> => {
  const pool = (await context.poolRepository.getPool({ id: parseInt(args.id, 10) })) as PoolOutput;

  if (!pool) {
    return null;
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
    },
    token1: {
      __typename: 'Token',
      id: String(pool.token1.id),
      chainId: '0',
      name: pool.token1.name,
    },
    reserve0: pool.reserve0,
    reserve1: pool.reserve1,
    totalSupply: pool.totalSupply,
    key: pool.key,
    tvlUsd: pool.tvlUsd ?? 0,
    volume24hUsd: pool.volume24hUsd ?? 0,
    volume7dUsd: pool.volume7dUsd ?? 0,
    transactionCount24h: pool.transactionCount24h ?? 0,
    apr24h: pool.apr24h ?? 0,
    createdAt: pool.createdAt,
    updatedAt: pool.updatedAt,
  };
};
