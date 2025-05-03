import { Op } from 'sequelize';

import { sequelize } from '../config/database';
import Pair from '../models/pair';
import PoolChart from '../models/pool-chart';
import PoolStats from '../models/pool-stats';
import PoolTransaction, { TransactionType } from '../models/pool-transaction';
import Token from '../models/token';

type TokenAmount = number | { decimal: string };

interface CreatePairParams {
  moduleName: string;
  name: string;
  parameterText: string;
  parameters: string;
  qualifiedName: string;
  chainId: number;
}

interface TokenReference {
  refName: {
    name: string;
    namespace: string | null;
  };
  refSpec: Array<{
    name: string;
    namespace: string | null;
  }>;
}

export class PairService {
  /**
   * Creates a token if it doesn't exist
   * @param tokenRef Token reference from the parameters
   * @param transaction Sequelize transaction
   * @returns Created or found token
   */
  private static async createOrFindToken(
    tokenRef: TokenReference,
    transaction: any,
  ): Promise<Token> {
    const tokenName = tokenRef.refName.name;
    const tokenNamespace = tokenRef.refName.namespace || '';

    const [token] = await Token.findOrCreate({
      where: {
        code: `${tokenNamespace}.${tokenName}`,
      },
      defaults: {
        address: `${tokenNamespace}.${tokenName}`,
        name: tokenName,
        symbol: tokenName.toUpperCase(),
        code: `${tokenNamespace}.${tokenName}`,
        decimals: 18, // Default to 18 decimals
        totalSupply: '0',
        tokenInfo: {
          decimalsToDisplay: 8,
          description: '',
          themeColor: '#000000',
          discordUrl: '',
          mediumUrl: '',
          telegramUrl: '',
          twitterUrl: '',
          websiteUrl: '',
        },
      },
      transaction,
    });

    return token;
  }

  /**
   * Creates tokens if they don't exist and then creates a pair
   * @param pairs Array of pair creation parameters
   */
  static async createPairs(pairs: CreatePairParams[]): Promise<void> {
    if (!pairs || pairs.length === 0) {
      return;
    }

    for (const pair of pairs) {
      await sequelize.transaction(async t => {
        // Parse parameters to get token information
        const params = JSON.parse(pair.parameters);
        const token0Ref = params[0] as TokenReference;
        const token1Ref = params[1] as TokenReference;
        const key = params[2] as string;

        // Create or find both tokens
        const [token0, token1] = await Promise.all([
          this.createOrFindToken(token0Ref, t),
          this.createOrFindToken(token1Ref, t),
        ]);

        // Create pair
        await Pair.create(
          {
            token0Id: token0.id,
            token1Id: token1.id,
            reserve0: '0',
            reserve1: '0',
            totalSupply: '0',
            key: key,
          },
          { transaction: t },
        );
      });
    }
  }

  /**
   * Updates pairs and their statistics based on the provided update events
   * @param updateEvents Array of update events
   */
  static async updatePairs(
    updateEvents: Array<{
      moduleName: string;
      name: string;
      parameterText: string;
      parameters: string;
      qualifiedName: string;
      chainId: number;
    }>,
  ): Promise<void> {
    for (const event of updateEvents) {
      try {
        // Parse the parameters
        const [key, reserve0, reserve1] = JSON.parse(event.parameters) as [
          string,
          TokenAmount,
          TokenAmount,
        ];

        // Convert TokenAmount to string representation
        const reserve0Str = typeof reserve0 === 'number' ? reserve0.toString() : reserve0.decimal;
        const reserve1Str = typeof reserve1 === 'number' ? reserve1.toString() : reserve1.decimal;

        // Find the pair by key
        const pair = await Pair.findOne({
          where: { key },
        });

        if (!pair) {
          console.warn(`Pair not found for key: ${key}`);
          continue;
        }

        // Calculate USD values (placeholder - implement actual price calculation)
        const reserve0Usd = '0'; // TODO: Implement price calculation
        const reserve1Usd = '0'; // TODO: Implement price calculation
        const tvlUsd = '0'; // TODO: Implement price calculation
        const amountUsd = 0; // TODO: Implement price calculation

        // Store chart data
        await PoolChart.create({
          pairId: pair.id,
          reserve0: reserve0Str,
          reserve1: reserve1Str,
          totalSupply: pair.totalSupply,
          reserve0Usd,
          reserve1Usd,
          tvlUsd,
          timestamp: new Date(),
        });

        // Update pair's current state
        await pair.update({
          reserve0: reserve0Str,
          reserve1: reserve1Str,
        });

        // Update pool stats
        await this.updatePoolStats(pair.id);
      } catch (error) {
        console.error('Error updating pair:', error);
      }
    }
  }

  /**
   * Updates pool statistics for a given pair
   * @param pairId ID of the pair to update stats for
   */
  private static async updatePoolStats(pairId: number): Promise<void> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Get transactions for different time periods
    const [transactions24h, transactions7d, transactions30d, transactions1y] = await Promise.all([
      PoolTransaction.findAll({
        where: {
          pairId,
          timestamp: { [Op.gte]: oneDayAgo },
        },
      }),
      PoolTransaction.findAll({
        where: {
          pairId,
          timestamp: { [Op.gte]: sevenDaysAgo },
        },
      }),
      PoolTransaction.findAll({
        where: {
          pairId,
          timestamp: { [Op.gte]: thirtyDaysAgo },
        },
      }),
      PoolTransaction.findAll({
        where: {
          pairId,
          timestamp: { [Op.gte]: oneYearAgo },
        },
      }),
    ]);

    // Get latest chart data for TVL
    const latestChart = await PoolChart.findOne({
      where: { pairId },
      order: [['timestamp', 'DESC']],
    });

    // Calculate volumes and fees
    const volume24h = transactions24h.reduce((sum, tx) => sum + tx.amountUsd, 0);
    const volume7d = transactions7d.reduce((sum, tx) => sum + tx.amountUsd, 0);
    const volume30d = transactions30d.reduce((sum, tx) => sum + tx.amountUsd, 0);
    const volume1y = transactions1y.reduce((sum, tx) => sum + tx.amountUsd, 0);

    const fees24h = transactions24h.reduce((sum, tx) => sum + tx.feeUsd, 0);
    const fees7d = transactions7d.reduce((sum, tx) => sum + tx.feeUsd, 0);
    const fees30d = transactions30d.reduce((sum, tx) => sum + tx.feeUsd, 0);
    const fees1y = transactions1y.reduce((sum, tx) => sum + tx.feeUsd, 0);

    // Calculate APR (assuming 0.3% fee)
    const apr24h = (fees24h * 365) / (latestChart?.tvlUsd ? parseFloat(latestChart.tvlUsd) : 1);

    // Get TVL history
    const tvlHistory = await PoolChart.findAll({
      where: { pairId },
      attributes: ['timestamp', 'tvlUsd'],
      order: [['timestamp', 'ASC']],
    });

    // Update or create pool stats
    await PoolStats.upsert({
      pairId,
      timestamp: now,
      volume24hUsd: volume24h,
      volume7dUsd: volume7d,
      volume30dUsd: volume30d,
      volume1yUsd: volume1y,
      fees24hUsd: fees24h,
      fees7dUsd: fees7d,
      fees30dUsd: fees30d,
      fees1yUsd: fees1y,
      tvlUsd: latestChart?.tvlUsd ? parseFloat(latestChart.tvlUsd) : 0,
      apr24h,
      tvlHistory: tvlHistory.map(chart => ({
        timestamp: chart.timestamp,
        value: chart.tvlUsd,
      })),
    });
  }

  /**
   * Processes swap events and records them in the pool transaction history
   * @param swapEvents Array of swap events
   */
  static async processSwaps(
    swapEvents: Array<{
      moduleName: string;
      name: string;
      parameterText: string;
      parameters: string;
      qualifiedName: string;
      chainId: number;
    }>,
  ): Promise<void> {
    for (const event of swapEvents) {
      try {
        // Parse the parameters
        const [sender, receiver, amountIn, tokenInRef, amountOut, tokenOutRef] = JSON.parse(
          event.parameters,
        ) as [string, string, TokenAmount, TokenReference, TokenAmount, TokenReference];

        // Convert TokenAmount to string representation
        const amountInStr = typeof amountIn === 'number' ? amountIn.toString() : amountIn.decimal;
        const amountOutStr =
          typeof amountOut === 'number' ? amountOut.toString() : amountOut.decimal;

        // Find the tokens
        const [tokenIn, tokenOut] = await Promise.all([
          this.createOrFindToken(tokenInRef, null),
          this.createOrFindToken(tokenOutRef, null),
        ]);

        // Find the pair
        const pair = await Pair.findOne({
          where: {
            [Op.or]: [
              { token0Id: tokenIn.id, token1Id: tokenOut.id },
              { token0Id: tokenOut.id, token1Id: tokenIn.id },
            ],
          },
        });

        if (!pair) {
          console.warn(`Pair not found for tokens: ${tokenIn.code} and ${tokenOut.code}`);
          continue;
        }

        // Calculate USD value (placeholder - implement actual price calculation)
        const amountUsd = 0; // TODO: Implement price calculation

        // Create pool transaction record
        await PoolTransaction.create({
          pairId: pair.id,
          transactionHash: event.parameterText,
          type: TransactionType.SWAP,
          maker: sender,
          timestamp: new Date(),
          amount0In: pair.token0Id === tokenIn.id ? amountInStr : '0',
          amount1In: pair.token1Id === tokenIn.id ? amountInStr : '0',
          amount0Out: pair.token0Id === tokenOut.id ? amountOutStr : '0',
          amount1Out: pair.token1Id === tokenOut.id ? amountOutStr : '0',
          amountUsd,
        });
      } catch (error) {
        console.error('Error processing swap:', error);
      }
    }
  }

  /**
   * Processes liquidity events and records them in the pool transaction history
   * @param liquidityEvents Array of liquidity events
   */
  static async processLiquidityEvents(
    liquidityEvents: Array<{
      moduleName: string;
      name: string;
      parameterText: string;
      parameters: string;
      qualifiedName: string;
      chainId: number;
    }>,
  ): Promise<void> {
    for (const event of liquidityEvents) {
      try {
        // Parse the parameters
        const [sender, to, token0Ref, token1Ref, amount0, amount1] = JSON.parse(
          event.parameters,
        ) as [string, string, TokenReference, TokenReference, TokenAmount, TokenAmount];

        // Convert TokenAmount to string representation
        const amount0Str = typeof amount0 === 'number' ? amount0.toString() : amount0.decimal;
        const amount1Str = typeof amount1 === 'number' ? amount1.toString() : amount1.decimal;

        // Find the tokens
        const [token0, token1] = await Promise.all([
          this.createOrFindToken(token0Ref, null),
          this.createOrFindToken(token1Ref, null),
        ]);

        // Find the pair
        const pair = await Pair.findOne({
          where: {
            [Op.or]: [
              { token0Id: token0.id, token1Id: token1.id },
              { token0Id: token1.id, token1Id: token0.id },
            ],
          },
        });

        if (!pair) {
          console.warn(`Pair not found for tokens: ${token0.code} and ${token1.code}`);
          continue;
        }

        // Determine if tokens are in correct order
        const isToken0First = pair.token0Id === token0.id;

        // Calculate USD value (placeholder - implement actual price calculation)
        const amountUsd = 0; // TODO: Implement price calculation

        // Create pool transaction record
        await PoolTransaction.create({
          pairId: pair.id,
          transactionHash: event.parameterText,
          type:
            event.name === 'ADD_LIQUIDITY'
              ? TransactionType.ADD_LIQUIDITY
              : TransactionType.REMOVE_LIQUIDITY,
          maker: sender,
          timestamp: new Date(),
          amount0In: isToken0First ? amount0Str : '0',
          amount1In: isToken0First ? '0' : amount0Str,
          amount0Out: isToken0First ? '0' : amount1Str,
          amount1Out: isToken0First ? amount1Str : '0',
          amountUsd,
        });

        // Update reserves based on the event type
        const reserve0 = BigInt(pair.reserve0);
        const reserve1 = BigInt(pair.reserve1);
        const amount0BigInt = BigInt(amount0Str);
        const amount1BigInt = BigInt(amount1Str);

        if (event.name === 'ADD_LIQUIDITY') {
          await pair.update({
            reserve0: (reserve0 + amount0BigInt).toString(),
            reserve1: (reserve1 + amount1BigInt).toString(),
          });
        } else {
          await pair.update({
            reserve0: (reserve0 - amount0BigInt).toString(),
            reserve1: (reserve1 - amount1BigInt).toString(),
          });
        }
      } catch (error) {
        console.error('Error processing liquidity event:', error);
      }
    }
  }
}
