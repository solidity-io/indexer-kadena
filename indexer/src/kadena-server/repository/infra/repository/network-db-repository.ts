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
import { getCirculationNumber } from "../../../utils/coin-circulation";

const HOST_URL = getRequiredEnvString("NODE_API_URL");
const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");
const NETWORK_ID = getRequiredEnvString("SYNC_NETWORK");

const NODE_INFO_KEY = "NODE_INFO_KEY";

export default class NetworkDbRepository implements NetworkRepository {
  async getCut(): Promise<number> {
    const response = await fetch(`${SYNC_BASE_URL}/${NETWORK_ID}/cut`, {
      method: "GET",
      headers: {
        accept: "application/json;charset=utf-8, application/json",
        "cache-control": "no-cache",
      },
    });
    const data = await response.json();

    return data.height as number;
  }

  async getLatestCreationTime(): Promise<number> {
    const creationTimeQuery = `
      SELECT b."creationTime"
      FROM "Blocks" b
      WHERE b.id = (SELECT max(id) from "Blocks");
  `;

    const { rows } = await rootPgPool.query(creationTimeQuery);

    const latestCreationTime = parseInt(rows[0].creationTime, 10);

    return latestCreationTime;
  }

  private async getCoinsInCirculation() {
    const cutHeight = await this.getCut();
    const latestCreationTime = await this.getLatestCreationTime();
    const rewards = await getCirculationNumber(cutHeight, latestCreationTime);
    return rewards;
  }

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

    const coinsInCirculation = await this.getCoinsInCirculation();

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
      const timestampInMilliseconds = Number(block.creationTime); // Convert to milliseconds
      const creationTime = new Date(timestampInMilliseconds / 1000);
      blocksWithDifficulty.push({
        creationTime: Number(block.creationTime),
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
