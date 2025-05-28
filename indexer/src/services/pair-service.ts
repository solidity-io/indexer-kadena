import { Op } from 'sequelize';

import { sequelize } from '../config/database';
import Pair from '../models/pair';
import PoolChart from '../models/pool-chart';
import PoolStats from '../models/pool-stats';
import PoolTransaction, { TransactionType } from '../models/pool-transaction';
import Token from '../models/token';
import LiquidityBalance from '../models/liquidity-balance';
import { PriceService } from './price/price.service';
import { DEFAULT_PROTOCOL } from '../kadena-server/config/apollo-server-config';

type TokenAmount = number | { decimal: string };

// Cache for token prices in USD
interface TokenPriceCache {
  price: number;
  timestamp: number;
}

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
  private static tokenPriceCache: Map<number, TokenPriceCache> = new Map();
  private static readonly PRICE_CACHE_TTL = parseInt(process.env.PRICE_CACHE_TTL || '300000', 10); // Default 5 minutes

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

    const code = tokenNamespace ? `${tokenNamespace}.${tokenName}` : tokenName;

    const [token] = await Token.findOrCreate({
      where: {
        code,
      },
      defaults: {
        address: code,
        name: tokenName,
        symbol: tokenName.toUpperCase(),
        code,
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
        const moduleName = pair.moduleName;

        // Create or find both tokens
        const [token0, token1] = await Promise.all([
          this.createOrFindToken(token0Ref, t),
          this.createOrFindToken(token1Ref, t),
        ]);

        // Create pair
        await this.createOrFindPair(token0, token1, moduleName);
      });
    }
  }

  /**
   * Gets the cached price for a token or calculates it if not cached
   * @param token The token to get price for
   * @returns The token price in USD
   */
  private static async getTokenPriceInUSD(
    token: Token,
    protocolAddress = DEFAULT_PROTOCOL,
  ): Promise<number | undefined> {
    const now = Date.now();
    const cached = this.tokenPriceCache.get(token.id);

    // Return cached price if it's still valid
    if (cached && now - cached.timestamp < this.PRICE_CACHE_TTL) {
      return cached.price;
    }

    // Calculate new price
    const price = await this.calculateTokenPriceInUSD(token, { decimal: '1' }, protocolAddress);
    if (price !== undefined) {
      this.tokenPriceCache.set(token.id, { price, timestamp: now });
    }
    return price;
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
        let pair = await Pair.findOne({
          where: { key },
          include: [
            { model: Token, as: 'token0' },
            { model: Token, as: 'token1' },
          ],
        });

        if (!pair) {
          const [code0, code1] = key.split(':');
          // Create tokens using module name
          const token0 = await Token.findOrCreate({
            where: { code: code0 },
            defaults: {
              address: code0,
              name: code0.split('.').length > 1 ? code0.split('.')[1] : code0,
              symbol:
                code0.split('.').length > 1
                  ? code0.split('.')[1].toUpperCase()
                  : code0.toUpperCase(),
              code: code0,
              decimals: 18,
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
          });

          const token1 = await Token.findOrCreate({
            where: { code: code1 },
            defaults: {
              address: code1,
              name: code1.split('.').length > 1 ? code1.split('.')[1] : code1,
              symbol:
                code1.split('.').length > 1
                  ? code1.split('.')[1].toUpperCase()
                  : code1.toUpperCase(),
              code: code1,
              decimals: 18,
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
          });

          // Create or find pair using existing method
          pair = await this.createOrFindPair(token0[0], token1[0], event.moduleName);
        }

        // Get token prices in USD
        const [token0Price, token1Price] = await Promise.all([
          pair.token0 ? this.getTokenPriceInUSD(pair.token0, pair.address) : undefined,
          pair.token1 ? this.getTokenPriceInUSD(pair.token1, pair.address) : undefined,
        ]);

        // Calculate USD values
        const reserve0Usd = token0Price ? (Number(reserve0Str) * token0Price).toString() : '0';
        const reserve1Usd = token1Price ? (Number(reserve1Str) * token1Price).toString() : '0';
        const tvlUsd = (Number(reserve0Usd) + Number(reserve1Usd)).toString();

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
    const volume24h = transactions24h.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.amountUsd.toString()),
      0,
    );
    const volume7d = transactions7d.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.amountUsd.toString()),
      0,
    );
    const volume30d = transactions30d.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.amountUsd.toString()),
      0,
    );
    const volume1y = transactions1y.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.amountUsd.toString()),
      0,
    );

    const fees24h = transactions24h.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.feeUsd.toString()),
      0,
    );
    const fees7d = transactions7d.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.feeUsd.toString()),
      0,
    );
    const fees30d = transactions30d.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.feeUsd.toString()),
      0,
    );
    const fees1y = transactions1y.reduce(
      (sum, tx) => parseFloat(sum.toString()) + parseFloat(tx.feeUsd.toString()),
      0,
    );

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

  private static async createOrFindPair(
    token0: Token,
    token1: Token,
    moduleName: string,
  ): Promise<Pair> {
    // Try to find existing pair
    const existingPair = await Pair.findOne({
      where: {
        [Op.or]: [
          { token0Id: token0.id, token1Id: token1.id },
          { token0Id: token1.id, token1Id: token0.id },
        ],
        address: moduleName,
      },
    });

    if (existingPair) {
      return existingPair;
    }

    // Canonize the key by sorting token codes alphabetically
    const [firstToken, secondToken] = [token0.code, token1.code].sort();
    const key = `${firstToken}:${secondToken}`;

    // Determine which token should be token0 and token1 based on the sorted order
    const isToken0First = token0.code === firstToken;
    const orderedToken0 = isToken0First ? token0 : token1;
    const orderedToken1 = isToken0First ? token1 : token0;

    // Create new pair if not found
    return await Pair.create({
      token0Id: orderedToken0.id,
      token1Id: orderedToken1.id,
      reserve0: '0',
      reserve1: '0',
      totalSupply: '0',
      key: key,
      address: moduleName,
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
      transactionId: number;
      requestkey: string;
    }>,
  ): Promise<void> {
    if (!swapEvents || swapEvents.length === 0) {
      return;
    }

    const FEE = 0.003; // 0.3% fee

    for (const event of swapEvents) {
      try {
        // Parse parameters
        const [sender, receiver, amountIn, tokenInRef, amountOut, tokenOutRef] = JSON.parse(
          event.parameters,
        ) as [string, string, TokenAmount, TokenReference, TokenAmount, TokenReference];

        // Convert TokenAmount to string representation
        const amountInStr = typeof amountIn === 'number' ? amountIn.toString() : amountIn.decimal;
        const amountOutStr =
          typeof amountOut === 'number' ? amountOut.toString() : amountOut.decimal;

        // Create or find both tokens
        const tokenIn = await this.createOrFindToken(tokenInRef, null);
        const tokenOut = await this.createOrFindToken(tokenOutRef, null);

        // Create or find the pair
        const pair = await this.createOrFindPair(tokenIn, tokenOut, event.moduleName);

        // Get token prices in USD
        const [tokenInPrice, tokenOutPrice] = await Promise.all([
          this.getTokenPriceInUSD(tokenIn, pair.address),
          this.getTokenPriceInUSD(tokenOut, pair.address),
        ]);

        // Calculate USD value
        const amountUsd = tokenInPrice
          ? Number(amountInStr) * tokenInPrice
          : tokenOutPrice
            ? Number(amountOutStr) * tokenOutPrice
            : 0;

        // Calculate fee amount using the formula: fee_amount = in * (FEE / (1 - FEE))
        const feeAmount = Number(amountInStr) * (FEE / (1 - FEE));
        const feeUsd = tokenInPrice ? feeAmount * tokenInPrice : 0;

        // Create pool transaction record
        await PoolTransaction.create({
          pairId: pair.id,
          transactionId: event.transactionId,
          requestkey: event.requestkey,
          type: TransactionType.SWAP,
          maker: sender,
          timestamp: new Date(),
          amount0In: pair.token0Id === tokenIn.id ? amountInStr : '0',
          amount1In: pair.token1Id === tokenIn.id ? amountInStr : '0',
          amount0Out: pair.token0Id === tokenOut.id ? amountOutStr : '0',
          amount1Out: pair.token1Id === tokenOut.id ? amountOutStr : '0',
          amountUsd,
          feeUsd,
        });

        // Update pool stats
        await this.updatePoolStats(pair.id);
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
      transactionId: number;
      requestkey: string;
    }>,
  ): Promise<void> {
    for (const event of liquidityEvents) {
      try {
        // Parse the parameters
        const [sender, to, token0Ref, token1Ref, amount0, amount1, liquidity] = JSON.parse(
          event.parameters,
        ) as [string, string, TokenReference, TokenReference, TokenAmount, TokenAmount, number];

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

        // Get token prices in USD
        const [token0Price, token1Price] = await Promise.all([
          this.getTokenPriceInUSD(token0, pair.address),
          this.getTokenPriceInUSD(token1, pair.address),
        ]);

        // Calculate USD value
        const amountUsd =
          (token0Price ? Number(amount0Str) * token0Price : 0) +
          (token1Price ? Number(amount1Str) * token1Price : 0);

        // Create pool transaction record
        await PoolTransaction.create({
          pairId: pair.id,
          transactionId: event.transactionId,
          requestkey: event.requestkey,
          type:
            event.name === 'ADD_LIQUIDITY'
              ? TransactionType.ADD_LIQUIDITY
              : TransactionType.REMOVE_LIQUIDITY,
          maker: sender,
          timestamp: new Date(),
          amount0In:
            event.name === 'ADD_LIQUIDITY'
              ? pair.token0Id === token0.id
                ? amount0Str
                : amount1Str
              : '0',
          amount1In:
            event.name === 'ADD_LIQUIDITY'
              ? pair.token1Id === token0.id
                ? amount0Str
                : amount1Str
              : '0',
          amount0Out:
            event.name === 'REMOVE_LIQUIDITY'
              ? pair.token0Id === token1.id
                ? amount0Str
                : amount1Str
              : '0',
          amount1Out:
            event.name === 'REMOVE_LIQUIDITY'
              ? pair.token1Id === token1.id
                ? amount0Str
                : amount1Str
              : '0',
          amountUsd,
          feeUsd: 0,
        });

        const liquidityBalance = await LiquidityBalance.findOne({
          where: {
            pairId: pair.id,
            walletAddress: sender,
          },
        });

        if (event.name === 'ADD_LIQUIDITY') {
          if (liquidityBalance) {
            // Update existing balance
            const currentLiquidity = Number(liquidityBalance.liquidity);
            const newLiquidity = currentLiquidity + liquidity;
            await liquidityBalance.update({
              liquidity: newLiquidity.toString(),
            });
          } else {
            // Create new balance
            await LiquidityBalance.create({
              pairId: pair.id,
              walletAddress: sender,
              liquidity: liquidity.toString(),
            });
          }
        } else if (event.name === 'REMOVE_LIQUIDITY' && liquidityBalance) {
          // Subtract liquidity
          const currentLiquidity = Number(liquidityBalance.liquidity);
          const newLiquidity = currentLiquidity - liquidity;
          await liquidityBalance.update({
            liquidity: newLiquidity.toString(),
          });
        }

        // Update pool stats
        await this.updatePoolStats(pair.id);
      } catch (error) {
        console.error('Error processing liquidity event:', error);
      }
    }
  }

  /**
   * Finds a direct pair between two tokens
   * @param token0Id First token ID
   * @param token1Id Second token ID
   * @returns The pair if found, null otherwise
   */
  private static async findDirectPair(
    token0Id: number,
    token1Id: number,
    protocolAddress = DEFAULT_PROTOCOL,
  ): Promise<Pair | null> {
    return Pair.findOne({
      where: {
        [Op.or]: [
          { token0Id, token1Id },
          { token0Id: token1Id, token1Id: token0Id },
        ],
        address: protocolAddress,
      },
      include: [
        { model: Token, as: 'token0' },
        { model: Token, as: 'token1' },
      ],
    });
  }

  /**
   * Uses BFS to find the shortest path to KDA and calculates the token price
   * @param startTokenId Starting token ID
   * @param startAmount Starting token amount
   * @returns The KDA amount if a path is found, undefined otherwise
   */
  private static async findOptimalKdaPricePath(
    startTokenId: number,
    startAmount: number,
    protocolAddress = DEFAULT_PROTOCOL,
  ): Promise<number | undefined> {
    // Get KDA token
    const kdaToken = await Token.findOne({ where: { code: 'coin' } });
    if (!kdaToken) {
      return undefined;
    }

    // Queue for BFS: [tokenId, amount, path]
    const queue: Array<[number, number, number[]]> = [[startTokenId, startAmount, [startTokenId]]];
    const visited = new Set<number>([startTokenId]);

    while (queue.length > 0) {
      const [currentTokenId, currentAmount, path] = queue.shift()!;

      // Try direct path to KDA
      const directPair = await this.findDirectPair(currentTokenId, kdaToken.id, protocolAddress);
      if (directPair) {
        const reserve0 = Number(directPair.reserve0);
        const reserve1 = Number(directPair.reserve1);

        let kdaAmount: number;
        if (currentTokenId === directPair.token0Id) {
          kdaAmount = (currentAmount * reserve1) / reserve0;
        } else {
          kdaAmount = (currentAmount * reserve0) / reserve1;
        }

        // Found the shortest path to KDA
        return kdaAmount;
      }

      // If path length is 4, don't explore further
      if (path.length >= 4) {
        continue;
      }

      // Find all connected pairs
      const connectedPairs = await Pair.findAll({
        where: {
          [Op.or]: [{ token0Id: currentTokenId }, { token1Id: currentTokenId }],
          address: protocolAddress,
        },
        include: [
          { model: Token, as: 'token0' },
          { model: Token, as: 'token1' },
        ],
      });

      // Add connected tokens to queue
      for (const pair of connectedPairs) {
        const otherTokenId = pair.token0Id === currentTokenId ? pair.token1Id : pair.token0Id;

        // Skip if already visited
        if (visited.has(otherTokenId)) {
          continue;
        }

        // Calculate amount of the other token
        const reserve0 = Number(pair.reserve0);
        const reserve1 = Number(pair.reserve1);
        const otherTokenAmount =
          currentTokenId === pair.token0Id
            ? (currentAmount * reserve1) / reserve0
            : (currentAmount * reserve0) / reserve1;

        // Add to queue
        queue.push([otherTokenId, otherTokenAmount, [...path, otherTokenId]]);
        visited.add(otherTokenId);
      }
    }

    return undefined;
  }

  /**
   * Calculates the USD value of a token amount using KDA price and pair information
   * @param token The token to calculate value for
   * @param amount The amount of the token
   * @returns The USD value of the token amount
   */
  static async calculateTokenPriceInUSD(
    token: Token,
    amount: TokenAmount,
    protocolAddress = DEFAULT_PROTOCOL,
  ): Promise<number | undefined> {
    try {
      const prices = await this.calculateTokenPrice(token, protocolAddress);
      if (!prices) return undefined;

      const amountStr = typeof amount === 'number' ? amount.toString() : amount.decimal;
      return prices.priceInUSD * Number(amountStr);
    } catch (error) {
      console.error('Error calculating token USD value:', error);
      return undefined;
    }
  }

  /**
   * Calculates the price of a token in USD
   * @param token The token to calculate price for
   * @returns The price of the token in USD
   */
  static async calculateTokenPrice(
    token: Token,
    protocolAddress = DEFAULT_PROTOCOL,
  ): Promise<{ priceInUSD: number; priceInKDA: number } | undefined> {
    try {
      // Get KDA/USD price
      const priceService = PriceService.getInstance();
      const kdaUsdPrice = priceService.getKdaUsdPrice();
      if (!kdaUsdPrice) {
        console.warn('KDA/USD price not available');
        return undefined;
      }
      // Use 1 token with proper decimals
      const oneToken = 10 ** token.decimals;

      // Find shortest path to KDA using BFS
      const kdaAmount = await this.findOptimalKdaPricePath(token.id, oneToken, protocolAddress);

      if (kdaAmount === undefined) {
        console.warn(`No path found to calculate price for token ${token.code}`);
        return undefined;
      }

      // Convert to USD with proper decimal handling
      const priceInUSD = (kdaAmount * kdaUsdPrice) / 10 ** token.decimals;
      const priceInKDA = kdaAmount / 10 ** token.decimals;
      return { priceInUSD, priceInKDA };
    } catch (error) {
      console.error('Error calculating token price:', error);
      return undefined;
    }
  }
}
