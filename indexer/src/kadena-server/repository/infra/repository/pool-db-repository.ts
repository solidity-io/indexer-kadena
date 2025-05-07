import { Op, QueryTypes } from 'sequelize';

import { sequelize } from '../../../../config/database';
import Pair from '../../../../models/pair';
import PoolStats from '../../../../models/pool-stats';
import { getPageInfo, getPaginationParams } from '../../pagination';
import { PageInfo, Token } from '../../../config/graphql-types';
import { GetPoolsParams } from '../../application/pool-repository';
import { PoolOrderBy } from '../../../config/graphql-types';
import type PoolRepository from '../../application/pool-repository';
import type {
  GetPoolChartDataParams,
  GetPoolParams,
  GetPoolTransactionsParams,
  PoolChartDataConnection,
  PoolChartDataOutput,
  PoolOutput,
  PoolsConnection,
  PoolStatsOutput,
  PoolTransactionOutput,
  PoolTransactionsConnection,
} from '../../application/pool-repository';
import { ConnectionEdge } from '../../types';
import TokenModel from '../../../../models/token';

type OrderDirection = 'ASC' | 'DESC';

const POOL_ORDER_BY_MAP: Record<
  PoolOrderBy,
  { model: typeof PoolStats; field: string; direction: OrderDirection }
> = {
  [PoolOrderBy.TvlUsdAsc]: { model: PoolStats, field: 'tvlUsd', direction: 'ASC' },
  [PoolOrderBy.TvlUsdDesc]: { model: PoolStats, field: 'tvlUsd', direction: 'DESC' },
  [PoolOrderBy.Volume_24HAsc]: { model: PoolStats, field: 'volume24hUsd', direction: 'ASC' },
  [PoolOrderBy.Volume_24HDesc]: { model: PoolStats, field: 'volume24hUsd', direction: 'DESC' },
  [PoolOrderBy.Volume_7DAsc]: { model: PoolStats, field: 'volume7dUsd', direction: 'ASC' },
  [PoolOrderBy.Volume_7DDesc]: { model: PoolStats, field: 'volume7dUsd', direction: 'DESC' },
  [PoolOrderBy.Apr_24HAsc]: { model: PoolStats, field: 'apr24h', direction: 'ASC' },
  [PoolOrderBy.Apr_24HDesc]: { model: PoolStats, field: 'apr24h', direction: 'DESC' },
  [PoolOrderBy.TransactionCount_24HAsc]: {
    model: PoolStats,
    field: 'transactionCount24h',
    direction: 'ASC',
  },
  [PoolOrderBy.TransactionCount_24HDesc]: {
    model: PoolStats,
    field: 'transactionCount24h',
    direction: 'DESC',
  },
};

export default class PoolDbRepository implements PoolRepository {
  async getPools(params: GetPoolsParams): Promise<{
    pageInfo: PageInfo;
    edges: ConnectionEdge<PoolOutput>[];
    totalCount: number;
  }> {
    const { after, before, first, last, orderBy } = params;
    const pagination = getPaginationParams({ after, before, first, last });

    // Get the latest stats for each pool
    const latestStats = await PoolStats.findAll({
      attributes: ['pairId', [sequelize.fn('MAX', sequelize.col('timestamp')), 'maxTimestamp']],
      group: ['pairId'],
    });

    const pairIds = latestStats.map(stat => stat.pairId);
    const maxTimestamps = latestStats.reduce(
      (acc, stat) => {
        const maxTimestamp = stat.get('maxTimestamp') as Date;
        if (maxTimestamp) {
          acc[stat.pairId] = maxTimestamp;
        }
        return acc;
      },
      {} as Record<number, Date>,
    );

    const orderByClause = [
      ['PoolStats', POOL_ORDER_BY_MAP[orderBy].field, POOL_ORDER_BY_MAP[orderBy].direction],
    ] as [string, string, 'ASC' | 'DESC'][];

    const pairIdsStr = pairIds.join(',');
    const timestampsStr = Object.values(maxTimestamps)
      .map(t => `'${t.toISOString()}'`)
      .join(',');

    let whereClause = '';
    const conditions = [];

    if (pairIdsStr) {
      conditions.push(`p.id IN (${pairIdsStr})`);
    }
    if (timestampsStr) {
      conditions.push(`ps.timestamp IN (${timestampsStr})`);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const query = `
      SELECT 
        p.*,
        t0.id as "token0Id",
        t0.name as "token0Name",
        t1.id as "token1Id",
        t1.name as "token1Name",
        ps."tvlUsd",
        ps."volume24hUsd",
        ps."volume7dUsd",
        ps."transactionCount24h",
        ps."apr24h"
      FROM "Pairs" p
      JOIN "Tokens" t0 ON p."token0Id" = t0.id
      JOIN "Tokens" t1 ON p."token1Id" = t1.id
      JOIN "PoolStats" ps ON p.id = ps."pairId"
      ${whereClause}
      ORDER BY ps."${POOL_ORDER_BY_MAP[orderBy].field}" ${POOL_ORDER_BY_MAP[orderBy].direction}
      LIMIT ${pagination.limit} OFFSET ${pagination.after ? 0 : pagination.limit}
    `;

    const pairs = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const edges = pairs.map((pair: any) => ({
      cursor: pair.id.toString(),
      node: {
        __typename: 'Pool' as const,
        id: pair.id.toString(),
        address: pair.address,
        token0: {
          __typename: 'Token' as const,
          id: pair.token0Id.toString(),
          chainId: '0',
          name: pair.token0Name,
        } as unknown as Token,
        token1: {
          __typename: 'Token' as const,
          id: pair.token1Id.toString(),
          chainId: '0',
          name: pair.token1Name,
        } as unknown as Token,
        reserve0: pair.reserve0,
        reserve1: pair.reserve1,
        totalSupply: pair.totalSupply,
        key: pair.key,
        tvlUsd: pair.tvlUsd ?? 0,
        volume24hUsd: pair.volume24hUsd ?? 0,
        volume7dUsd: pair.volume7dUsd ?? 0,
        transactionCount24h: pair.transactionCount24h ?? 0,
        apr24h: pair.apr24h ?? 0,
        createdAt: pair.createdAt,
        updatedAt: pair.updatedAt,
      } as PoolOutput,
    }));

    const totalCount = await Pair.count({
      where: {
        id: {
          [Op.in]: pairIds,
        },
      },
    });

    const pageInfo = getPageInfo({
      edges,
      order: pagination.order,
      limit: pagination.limit,
      after,
      before,
    });

    return {
      edges,
      pageInfo: pageInfo.pageInfo,
      totalCount,
    };
  }

  async getPool(params: GetPoolParams): Promise<PoolOutput | null> {
    const { id } = params;

    // Get the pair
    const pairQuery = `
      SELECT 
        p.id,
        p.address,
        p."token0Id",
        p."token1Id",
        p.reserve0,
        p.reserve1,
        p."totalSupply",
        p.key,
        p."createdAt",
        p."updatedAt"
      FROM "Pairs" p
      WHERE p.id = $1
    `;

    const [pairResult] = await sequelize.query(pairQuery, {
      type: QueryTypes.SELECT,
      bind: [id],
    });

    if (!pairResult) {
      return null;
    }

    const pair = pairResult as any;

    // Get the tokens
    const tokensQuery = `
      SELECT t.*
      FROM "Tokens" t
      WHERE t.id = $1 OR t.id = $2
    `;

    const tokens = await sequelize.query(tokensQuery, {
      type: QueryTypes.SELECT,
      bind: [pair.token0Id, pair.token1Id],
    });

    const token0 = tokens.find((t: any) => t.id === pair.token0Id) as TokenModel;
    const token1 = tokens.find((t: any) => t.id === pair.token1Id) as TokenModel;

    if (!token0 || !token1) {
      throw new Error(`Tokens not found for pool ${id}`);
    }

    // Get the latest pool stats
    const statsQuery = `
      SELECT 
        "tvlUsd",
        "volume24hUsd",
        "volume7dUsd",
        "transactionCount24h",
        "apr24h"
      FROM "PoolStats"
      WHERE "pairId" = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const [statsResult] = await sequelize.query(statsQuery, {
      type: QueryTypes.SELECT,
      bind: [id],
    });

    const stats = statsResult
      ? (statsResult as any)
      : {
          tvlUsd: 0,
          volume24hUsd: 0,
          volume7dUsd: 0,
          transactionCount24h: 0,
          apr24h: 0,
        };

    return {
      __typename: 'Pool',
      id: pair.id.toString(),
      address: pair.address,
      token0,
      token1,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      totalSupply: pair.totalSupply,
      key: pair.key,
      tvlUsd: stats.tvlUsd ?? 0,
      volume24hUsd: stats.volume24hUsd ?? 0,
      volume7dUsd: stats.volume7dUsd ?? 0,
      transactionCount24h: stats.transactionCount24h ?? 0,
      apr24h: stats.apr24h ?? 0,
      createdAt: pair.createdAt,
      updatedAt: pair.updatedAt,
      databasePoolId: pair.id.toString(),
      lastPrice: 0,
      token0Liquidity: pair.reserve0,
      token0LiquidityDollar: 0,
      token1Liquidity: pair.reserve1,
      token1LiquidityDollar: 0,
      totalLiquidityDollar: 0,
      feePercentage: 0,
    } as PoolOutput;
  }

  async getPoolTransactions(
    params: GetPoolTransactionsParams,
  ): Promise<PoolTransactionsConnection> {
    const { pairId, type, first, after, last, before } = params;
    const pagination = getPaginationParams({ first, after, last, before });

    let query = `
      SELECT 
        id,
        type,
        timestamp,
        maker,
        "amountIn",
        "amountOut",
        "amountInUsd",
        "amountOutUsd",
        "token0Amount",
        "token1Amount",
        "token0AmountUsd",
        "token1AmountUsd",
        "feesUsd",
        "transactionHash"
      FROM "PoolTransactions"
      WHERE pair_id = $1
    `;

    const queryParams = [pairId];
    let paramIndex = 2;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(type as unknown as number);
      paramIndex++;
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(pagination.limit, pagination.after ? 0 : pagination.limit);

    const [results] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: queryParams,
    });

    const rows = results as any[];
    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: {
        id: row.id,
        type: row.type,
        timestamp: row.timestamp,
        maker: row.maker,
        amountIn: row.amountIn,
        amountOut: row.amountOut,
        amountInUsd: row.amountInUsd,
        amountOutUsd: row.amountOutUsd,
        token0Amount: row.token0Amount,
        token1Amount: row.token1Amount,
        token0AmountUsd: row.token0AmountUsd,
        token1AmountUsd: row.token1AmountUsd,
        feesUsd: row.feesUsd,
        transactionHash: row.transactionHash,
      } as PoolTransactionOutput,
    }));

    const pageInfo = getPageInfo({ edges, order: 'DESC', limit: pagination.limit, after, before });
    return {
      edges,
      pageInfo: {
        hasNextPage: pageInfo.pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.pageInfo.hasPreviousPage,
        startCursor: pageInfo.pageInfo.startCursor,
        endCursor: pageInfo.pageInfo.endCursor,
      },
    } as PoolTransactionsConnection;
  }

  async getPoolChartData(params: GetPoolChartDataParams): Promise<PoolChartDataConnection> {
    const { pairId, type, first, after, last, before, timeRange = 'ALL' } = params;
    const pagination = getPaginationParams({ first, after, last, before });

    let timeFilter = '';
    const now = new Date();
    let startDate = new Date(0); // Default to epoch start

    switch (timeRange) {
      case '1D':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      // 'ALL' doesn't need a filter
    }

    if (timeRange !== 'ALL') {
      timeFilter = ' AND timestamp >= $2';
    }

    const query = `
      SELECT 
        id,
        timestamp,
        "valueUsd"
      FROM "PoolChartData"
      WHERE pair_id = $1 AND type = $${timeRange === 'ALL' ? 2 : 3}${timeFilter}
      ORDER BY timestamp ASC
      LIMIT $${timeRange === 'ALL' ? 3 : 4} OFFSET $${timeRange === 'ALL' ? 4 : 5}
    `;

    const queryParams = [pairId, type];
    if (timeRange !== 'ALL') {
      queryParams.push(startDate.getTime());
    }
    queryParams.push(pagination.limit, pagination.after ? 0 : pagination.limit);

    const [results] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: queryParams,
    });

    const rows = results as any[];
    const edges = rows.map(row => ({
      cursor: row.id.toString(),
      node: {
        id: row.id,
        timestamp: row.timestamp,
        valueUsd: row.valueUsd,
      } as PoolChartDataOutput,
    }));

    const pageInfo = getPageInfo({ edges, order: 'ASC', limit: pagination.limit, after, before });
    return {
      edges,
      pageInfo: {
        hasNextPage: pageInfo.pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.pageInfo.hasPreviousPage,
        startCursor: pageInfo.pageInfo.startCursor,
        endCursor: pageInfo.pageInfo.endCursor,
      },
    } as PoolChartDataConnection;
  }

  async getLatestPoolStats(pairId: number): Promise<PoolStatsOutput | null> {
    const query = `
      SELECT 
        id,
        timestamp,
        "tvlUsd",
        "volume24hUsd",
        "volume7dUsd",
        "fees24hUsd",
        "transactionCount24h",
        "apr24h"
      FROM "PoolStats"
      WHERE pair_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const [result] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: [pairId],
    });

    if (!result) {
      return null;
    }

    const row = result as any;
    return {
      id: row.id,
      timestamp: row.timestamp,
      tvlUsd: row.tvlUsd,
      volume24hUsd: row.volume24hUsd,
      volume7dUsd: row.volume7dUsd,
      fees24hUsd: row.fees24hUsd,
      transactionCount24h: row.transactionCount24h,
      apr24h: row.apr24h,
    } as PoolStatsOutput;
  }
}
