import { Pair } from '../models/pair';
import { Token } from '../models/token';
import { logger } from '../utils/logger';

export class PairService {
  // ... existing code ...

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
        const [tokenAddress, reserve0, reserve1] = JSON.parse(event.parameters);

        // Find the token
        const token = await Token.findOne({
          where: { address: tokenAddress },
        });

        if (!token) {
          logger.warn(`Token not found for address: ${tokenAddress}`);
          continue;
        }

        // Find pairs where this token is either token0 or token1
        const pairs = await Pair.findAll({
          where: {
            [Op.or]: [{ token0Id: token.id }, { token1Id: token.id }],
          },
          include: [
            { model: Token, as: 'token0' },
            { model: Token, as: 'token1' },
          ],
        });

        for (const pair of pairs) {
          // Update the correct reserve based on whether the token is token0 or token1
          if (pair.token0Id === token.id) {
            await pair.update({
              reserve0: reserve0.toString(),
              reserve1: reserve1.toString(),
            });
          } else {
            await pair.update({
              reserve0: reserve1.toString(),
              reserve1: reserve0.toString(),
            });
          }
        }
      } catch (error) {
        logger.error('Error updating pair:', error);
      }
    }
  }
}
