import { ResolverContext } from '../kadena-server/config/apollo-server-config';
import NodeCache from 'node-cache';
import { HASH_RATE_AND_TOTAL_DIFFICULTY_KEY, NETWORK_STATISTICS_KEY, NODE_INFO_KEY } from './keys';
import { HashRateAndTotalDifficulty } from '../kadena-server/repository/application/network-repository';

export const MEMORY_CACHE = new NodeCache({ stdTTL: 0 });

const CACHE_TTL = 1000 * 30; // 30 seconds

export default async function initCache(context: ResolverContext) {
  const { blockRepository, networkRepository } = context;

  async function getHashRateAndTotalDifficulty() {
    try {
      const chainIds = await blockRepository.getChainIds();
      const { networkHashRate, totalDifficulty } =
        await networkRepository.getHashRateAndTotalDifficulty(chainIds);

      const oldValue = MEMORY_CACHE.get(
        HASH_RATE_AND_TOTAL_DIFFICULTY_KEY,
      ) as HashRateAndTotalDifficulty;

      const newValue: HashRateAndTotalDifficulty = {
        networkHashRate: networkHashRate,
        totalDifficulty: totalDifficulty ?? oldValue.totalDifficulty,
      };
      MEMORY_CACHE.set(HASH_RATE_AND_TOTAL_DIFFICULTY_KEY, newValue);
    } catch (err) {
      console.error(
        '[ERROR][CACHE][CONN_TIMEOUT] Failed to get hash rate and total difficulty',
        err,
      );
    }
  }

  async function getNetworkStatistics() {
    try {
      const networkStatistics = await networkRepository.getNetworkStatistics();
      MEMORY_CACHE.set(NETWORK_STATISTICS_KEY, networkStatistics);
    } catch (err) {
      console.error('[ERROR][CACHE][CONN_TIMEOUT] Failed to get network statistics', err);
    }
  }

  async function getNodeInfo() {
    try {
      const nodeInfo = await networkRepository.getNodeInfo();
      MEMORY_CACHE.set(NODE_INFO_KEY, nodeInfo);
    } catch (err) {
      console.error('[ERROR][CACHE][CONN_TIMEOUT] Failed to get node info', err);
    }
  }

  MEMORY_CACHE.set(HASH_RATE_AND_TOTAL_DIFFICULTY_KEY, {
    totalDifficulty: -1,
  });

  const getAllInfo = async () => {
    await getNetworkStatistics();
    await getNodeInfo();
    await getHashRateAndTotalDifficulty();
  };

  getAllInfo();
  setInterval(getAllInfo, CACHE_TTL);
}
