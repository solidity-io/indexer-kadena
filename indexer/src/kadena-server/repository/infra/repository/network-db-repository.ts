import { Op } from "sequelize";
import BlockModel from "../../../../models/block";
import NetworkRepository, {
  GetNodeInfo,
  HashRateAndTotalDifficulty,
  NetworkStatistics,
} from "../../application/network-repository";
import {
  BlockWithDifficulty,
  calculateBlockDifficulty,
  calculateTotalDifficulty,
} from "../../../utils/difficulty";
import { calculateNetworkHashRate } from "../../../utils/hashrate";
import { rootPgPool } from "../../../../config/database";
import { nodeInfoValidator } from "../schema-validator/node-info-validator";
import { getRequiredEnvString } from "../../../../utils/helpers";
import { MEMORY_CACHE } from "../../../../cache/init";
import {
  HASH_RATE_AND_TOTAL_DIFFICULTY_KEY,
  NETWORK_STATISTICS_KEY,
} from "../../../../cache/keys";

const HOST_URL = getRequiredEnvString("NODE_API_URL");

const NODE_INFO_KEY = "NODE_INFO_KEY";

export default class NetworkDbRepository implements NetworkRepository {
  async getNetworkStatistics() {
    const totalTransactionsCountQuery = `
      SELECT last_value as "totalTransactionsCount" from "Transactions_id_seq"
    `;

    const { rows: totalTransactionsCountRows } = await rootPgPool.query(
      totalTransactionsCountQuery,
    );
    const transactionCount = parseInt(
      totalTransactionsCountRows[0].totalTransactionsCount,
      10,
    );

    const coinsInCirculationQuery = `
      SELECT sum(balance) as "count"
      FROM "Balances"
    `;

    const { rows: coinsInCirculationRows } = await rootPgPool.query(
      coinsInCirculationQuery,
    );
    const coinsInCirculation = parseInt(coinsInCirculationRows[0].count, 10);

    const output = {
      coinsInCirculation,
      transactionCount,
    };

    return output;
  }

  async getHashRateAndTotalDifficulty(chainIds: number[]) {
    const lastBlock = await BlockModel.findOne({
      order: [["height", "DESC"]],
      attributes: ["height"],
    });

    const currentHeight = lastBlock?.height ?? 0;

    const blocks = await BlockModel.findAll({
      where: {
        height: {
          [Op.gte]: Number(currentHeight) - 4,
        },
      },
      attributes: ["creationTime", "target", "height", "chainId"],
    });

    const blocksWithDifficulty: BlockWithDifficulty[] = [];

    for (const block of blocks) {
      const timestampInMilliseconds = Number(block.creationTime) / 1000000; // Convert to milliseconds
      const creationTime = new Date(timestampInMilliseconds);
      blocksWithDifficulty.push({
        creationTime: timestampInMilliseconds,
        creationTimeDate: creationTime,
        difficulty: calculateBlockDifficulty(block.target),
        height: BigInt(block.height),
        chainId: BigInt(block.chainId),
      });
    }

    const output = {
      networkHashRate: Number(calculateNetworkHashRate(blocksWithDifficulty)),
      totalDifficulty: Number(
        calculateTotalDifficulty(
          BigInt(currentHeight),
          blocksWithDifficulty,
          chainIds,
        ),
      ),
    };

    return output;
  }

  async getNodeInfo(): Promise<GetNodeInfo> {
    const response = await fetch(`${HOST_URL}/info`, {
      method: "GET",
      headers: {
        accept: "application/json;charset=utf-8, application/json",
        "cache-control": "no-cache",
      },
    });
    const data = await response.json();

    const output = nodeInfoValidator.validate(data);
    return output;
  }

  async getAllInfo() {
    const nodeInfo = MEMORY_CACHE.get(NODE_INFO_KEY) as GetNodeInfo;
    const networkStatistics = MEMORY_CACHE.get(
      NETWORK_STATISTICS_KEY,
    ) as NetworkStatistics;
    const HashRateAndTotalDifficulty = MEMORY_CACHE.get(
      HASH_RATE_AND_TOTAL_DIFFICULTY_KEY,
    ) as HashRateAndTotalDifficulty;

    return { ...nodeInfo, ...networkStatistics, ...HashRateAndTotalDifficulty };
  }
}
