import { Op } from 'sequelize';

import { sequelize } from '../config/database';
import Pair from '../models/pair';
import PoolTransaction, { TransactionType } from '../models/pool-transaction';
import Token from '../models/token';

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
   * Updates pairs based on the provided update events
   * @param updateEvents Array of pair update events
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
        const [key, reserve0, reserve1] = JSON.parse(event.parameters);

        // Find the pair by key
        const pair = await Pair.findOne({
          where: { key },
        });

        if (!pair) {
          console.warn(`Pair not found for key: ${key}`);
          continue;
        }

        // Calculate old and new ratios
        const oldReserve0 = BigInt(pair.reserve0);
        const oldReserve1 = BigInt(pair.reserve1);
        const newReserve0 = BigInt(reserve0.toString());
        const newReserve1 = BigInt(reserve1.toString());

        // Calculate ratios (multiply by 1000 to avoid floating point)
        const oldRatio = (oldReserve0 * BigInt(1000)) / oldReserve1;
        const newRatio = (newReserve0 * BigInt(1000)) / newReserve1;

        // Determine transaction type based on ratio changes
        let type: TransactionType;
        let amount0In = '0';
        let amount1In = '0';
        let amount0Out = '0';
        let amount1Out = '0';

        if (oldRatio === newRatio) {
          // Ratio unchanged - liquidity operation
          if (newReserve0 > oldReserve0 && newReserve1 > oldReserve1) {
            type = TransactionType.ADD_LIQUIDITY;
            amount0In = (newReserve0 - oldReserve0).toString();
            amount1In = (newReserve1 - oldReserve1).toString();
          } else {
            type = TransactionType.REMOVE_LIQUIDITY;
            amount0Out = (oldReserve0 - newReserve0).toString();
            amount1Out = (oldReserve1 - newReserve1).toString();
          }
        } else {
          // Ratio changed - swap operation
          type = TransactionType.SWAP;
          if (newReserve0 > oldReserve0) {
            amount0In = (newReserve0 - oldReserve0).toString();
            amount1Out = (oldReserve1 - newReserve1).toString();
          } else {
            amount1In = (newReserve1 - oldReserve1).toString();
            amount0Out = (oldReserve0 - newReserve0).toString();
          }
        }

        // Record the transaction
        await PoolTransaction.create({
          pairId: pair.id,
          transactionHash: event.parameterText,
          type,
          timestamp: new Date(),
          amount0In,
          amount1In,
          amount0Out,
          amount1Out,
          amountUsd: 0, // TODO: Calculate USD value if needed
        });

        // Update the reserves
        await pair.update({
          reserve0: reserve0.toString(),
          reserve1: reserve1.toString(),
        });
      } catch (error) {
        console.error('Error updating pair:', error);
      }
    }
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
        );

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

        // Create pool transaction record
        await PoolTransaction.create({
          pairId: pair.id,
          transactionHash: event.parameterText, // Using parameterText as a unique identifier
          type: TransactionType.SWAP,
          timestamp: new Date(),
          amount0In: pair.token0Id === tokenIn.id ? amountIn.toString() : '0',
          amount1In: pair.token1Id === tokenIn.id ? amountIn.toString() : '0',
          amount0Out: pair.token0Id === tokenOut.id ? amountOut.toString() : '0',
          amount1Out: pair.token1Id === tokenOut.id ? amountOut.toString() : '0',
          amountUsd: 0, // TODO: Calculate USD value if needed
        });
      } catch (error) {
        console.error('Error processing swap:', error);
      }
    }
  }
}
