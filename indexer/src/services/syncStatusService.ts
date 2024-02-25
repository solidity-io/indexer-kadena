import SyncStatus, { SyncStatusAttributes } from "../models/syncStatus";

export class SyncStatusService {
  async save(
    lastSyncData: SyncStatusAttributes
  ): Promise<SyncStatusAttributes> {
    try {
      const parsedData = {
        ...lastSyncData,
      };

      const existingBlock = await SyncStatus.findOne({
        where: {
          network: lastSyncData.network,
          chainId: lastSyncData.chainId,
        },
      });

      if (existingBlock) {
        if (parsedData.startHeight === undefined) {
          parsedData.startHeight = existingBlock.startHeight;
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
    source: string
  ): Promise<SyncStatusAttributes[]> {
    try {
      const block = await SyncStatus.findAll({
        where: { network, source },
      });
      return block.map((b) => b.toJSON() as SyncStatusAttributes);
    } catch (error) {
      console.error("Error getting last synced block for all chains:", error);
      throw error;
    }
  }
}

export const syncStatusService = new SyncStatusService();
