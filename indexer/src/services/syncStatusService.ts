import { Op, Sequelize } from "sequelize";
import SyncStatus, {
  SyncStatusAttributes,
  SOURCE_BACKFILL,
  SOURCE_STREAMING,
} from "../models/syncStatus";

if (!process.env.SYNC_FETCH_INTERVAL_IN_BLOCKS) {
  console.error(
    "Missing SYNC_FETCH_INTERVAL_IN_BLOCKS in environment variables"
  );
  process.exit(1);
}

const SYNC_FETCH_INTERVAL_IN_BLOCKS_STREAMING = 1;
const SYNC_FETCH_INTERVAL_IN_BLOCKS_FILLING = parseInt(
  process.env.SYNC_FETCH_INTERVAL_IN_BLOCKS as string
);

export class SyncStatusService {
  async save(
    lastSyncData: SyncStatusAttributes
  ): Promise<SyncStatusAttributes> {
    try {
      const parsedData = {
        ...lastSyncData,
      };

      let filter = {};

      if (lastSyncData.source === SOURCE_STREAMING) {
        const LAST_BLOCK_IN_DB =
          lastSyncData.fromHeight - SYNC_FETCH_INTERVAL_IN_BLOCKS_STREAMING;
        filter = {
          where: {
            [Op.and]: [
              { network: lastSyncData.network },
              { chainId: lastSyncData.chainId },
              { source: lastSyncData.source },
              {
                [Op.or]: [
                  {
                    fromHeight: LAST_BLOCK_IN_DB,
                  },
                  {
                    fromHeight: lastSyncData.toHeight,
                  },
                ],
              },
            ],
          },
        };
      } else if (lastSyncData.source === SOURCE_BACKFILL) {
        const LAST_BLOCK_IN_DB =
          lastSyncData.toHeight + (SYNC_FETCH_INTERVAL_IN_BLOCKS_FILLING + 1);

        filter = {
          where: {
            [Op.and]: [
              { network: lastSyncData.network },
              { chainId: lastSyncData.chainId },
              { source: lastSyncData.source },
              {
                [Op.or]: [
                  { toHeight: LAST_BLOCK_IN_DB },
                  {
                    toHeight: lastSyncData.toHeight,
                  },
                ],
              },
            ],
          },
        };

        console.log("filter", filter);
      }

      const existingBlock = await SyncStatus.findOne(filter);

      if (existingBlock) {
        if (lastSyncData.source === SOURCE_STREAMING) {
          parsedData.toHeight = existingBlock.toHeight;
        } else if (lastSyncData.source == SOURCE_BACKFILL) {
          parsedData.fromHeight = existingBlock.fromHeight;
        }
        await existingBlock.update(parsedData);
        console.log("Sync status updated in database:", existingBlock.toHeight);
        return existingBlock.toJSON() as SyncStatusAttributes;
      } else {
        const block = await SyncStatus.create(parsedData);
        console.log("Sync status saved in database:", block.toHeight);
        return block.toJSON() as SyncStatusAttributes;
      }
    } catch (error) {
      console.error("Error saving last synced status:", error);
      throw error;
    }
  }

  async find(
    chainId: number,
    network: string,
    source: string
  ): Promise<SyncStatusAttributes | null> {
    try {
      const block = await SyncStatus.findOne({
        where: { chainId, network, source },
      });
      return block ? (block.toJSON() as SyncStatusAttributes) : null;
    } catch (error) {
      console.error("Error finding block:", error);
      throw error;
    }
  }

  async getLastSyncForAllChains(
    network: string,
    source: string[]
  ): Promise<SyncStatusAttributes[]> {
    try {
      const block = await SyncStatus.findAll({
        where: { network, source },
        group: ["chainId"],
        attributes: [
          "chainId",
          [Sequelize.fn("min", Sequelize.col("toHeight")), "toHeight"],
          [Sequelize.fn("max", Sequelize.col("fromHeight")), "fromHeight"],
        ],
      });
      return block.map((b) => b.toJSON() as SyncStatusAttributes);
    } catch (error) {
      console.error("Error getting last synced block for all chains:", error);
      throw error;
    }
  }
}

export const syncStatusService = new SyncStatusService();
