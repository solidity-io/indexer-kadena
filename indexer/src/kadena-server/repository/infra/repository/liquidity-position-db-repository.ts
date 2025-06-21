import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../../config/database';
import LiquidityBalance from '../../../../models/liquidity-balance';
import PoolStats from '../../../../models/pool-stats';
import { getPageInfo, getPaginationParams } from '../../pagination';
import {
  GetLiquidityPositionsParams,
  LiquidityPosition,
  LiquidityPositionsConnection,
} from '../../application/liquidity-position-repository';
import PoolDbRepository from './pool-db-repository';

export default class LiquidityPositionDbRepository {
  private poolRepository: PoolDbRepository;

  constructor() {
    this.poolRepository = new PoolDbRepository();
  }

  async getLiquidityPositions(
    params: GetLiquidityPositionsParams,
  ): Promise<LiquidityPositionsConnection> {
    const { walletAddress, first, after, last, before, orderBy } = params;
    console.log(params);
    const pagination = getPaginationParams({ after, before, first, last });
    console.log(pagination);
    // Get the latest stats for each pool
    const latestStats = await PoolStats.findAll({
      attributes: ['pairId', [sequelize.fn('MAX', sequelize.col('timestamp')), 'maxTimestamp']],
      group: ['pairId'],
    });

    const pairIds = latestStats.map(stat => stat.pairId);
    // If no pairIds, return empty result
    if (pairIds.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        totalCount: 0,
      };
    }

    // Build order by clause
    const orderByMap: Record<string, [string, string]> = {
      VALUE_USD_ASC: [
        'CASE WHEN CAST(p."totalSupply" AS DECIMAL) = 0 THEN 0 ELSE (CAST(lb.liquidity AS DECIMAL) / CAST(p."totalSupply" AS DECIMAL)) * CAST(ls."tvlUsd" AS DECIMAL) END',
        'ASC',
      ],
      VALUE_USD_DESC: [
        'CASE WHEN CAST(p."totalSupply" AS DECIMAL) = 0 THEN 0 ELSE (CAST(lb.liquidity AS DECIMAL) / CAST(p."totalSupply" AS DECIMAL)) * CAST(ls."tvlUsd" AS DECIMAL) END',
        'DESC',
      ],
      LIQUIDITY_ASC: ['lb.liquidity', 'ASC'],
      LIQUIDITY_DESC: ['lb.liquidity', 'DESC'],
      APR_ASC: ['ls."apr24h"', 'ASC'],
      APR_DESC: ['ls."apr24h"', 'DESC'],
    };

    const [orderField, orderDirection] = orderByMap[orderBy || 'VALUE_USD_DESC'];

    const pairIdsString = pairIds.map(id => `'${id}'`).join(',');

    // Query to get positions with pool and token information
    let query = `
      WITH latest_stats AS (
        SELECT DISTINCT ON (ps."pairId") 
          ps.*
        FROM "PoolStats" ps
        WHERE ps."pairId" IN (${pairIdsString})
        ORDER BY ps."pairId", ps.timestamp DESC
      )
      SELECT 
        lb.id,
        lb."pairId",
        lb.liquidity,
        lb."walletAddress",
        lb."createdAt",
        lb."updatedAt",
        p.key as "pairKey",
        t0.id as "token0Id",
        t0.name as "token0Name",
        t1.id as "token1Id",
        t1.name as "token1Name",
        ls."tvlUsd",
        COALESCE(ls."apr24h", 0) as "apr24h",
        CASE WHEN CAST(p."totalSupply" AS DECIMAL) = 0 THEN 0 ELSE (CAST(lb.liquidity AS DECIMAL) / CAST(p."totalSupply" AS DECIMAL)) * CAST(ls."tvlUsd" AS DECIMAL) END as "valueUsd"
      FROM "LiquidityBalances" lb
      LEFT JOIN "Pairs" p ON lb."pairId" = p.id
      LEFT JOIN "Tokens" t0 ON p."token0Id" = t0.id
      LEFT JOIN "Tokens" t1 ON p."token1Id" = t1.id
      LEFT JOIN latest_stats ls ON p.id = ls."pairId"
      WHERE lb."walletAddress" = $1
    `;

    const queryParams: any[] = [walletAddress];
    let paramIndex = 2;

    if (pagination.after) {
      query += ` AND lb.id ${pagination.order === 'DESC' ? '<' : '>'} $${paramIndex}`;
      queryParams.push(pagination.after);
      paramIndex++;
    }

    if (pagination.before) {
      query += ` AND lb.id ${pagination.order === 'DESC' ? '>' : '<'} $${paramIndex}`;
      queryParams.push(pagination.before);
      paramIndex++;
    }

    // First order by the requested field, then by id for consistent pagination
    query += ` ORDER BY lb.id ${pagination.order}, ${orderField} ${orderDirection}`;
    console.log(query);

    const positions = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: queryParams,
    });
    console.log({ positions });

    const edges = await Promise.all(
      (positions as any[]).map(async position => {
        const pool = await this.poolRepository.getPool({ id: position.pairId });
        return {
          cursor: position.id.toString(),
          node: {
            id: position.id.toString(),
            pairId: position.pairId,
            liquidity: position.liquidity,
            walletAddress: position.walletAddress,
            valueUsd: parseFloat(position.valueUsd),
            apr24h: parseFloat(position.apr24h),
            pair: pool!,
            createdAt: new Date(position.createdAt),
            updatedAt: new Date(position.updatedAt),
          } as LiquidityPosition,
        };
      }),
    );

    const pageInfo = getPageInfo({
      edges,
      order: pagination.order,
      limit: pagination.limit,
      after,
      before,
    });

    const totalCount = await LiquidityBalance.count({
      where: {
        walletAddress,
      },
    });

    return {
      ...pageInfo,
      totalCount,
    };
  }
}
