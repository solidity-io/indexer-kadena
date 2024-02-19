import LastSync, { LastSyncAttributes } from "../models/lastSync";

export class LastSyncService {
  async save(lastSyncData: LastSyncAttributes): Promise<LastSyncAttributes> {
    try {
      const parsedData = {
        ...lastSyncData,
        chainId: lastSyncData.chainId,
        height: lastSyncData.height,
        network: lastSyncData.network,
      };

      const existingBlock = await LastSync.findOne({
        where: {
          network: lastSyncData.network,
          chainId: lastSyncData.chainId,
        },
      });

      if (existingBlock) {
        await existingBlock.update(parsedData);
        console.log(
          "Last synced block updated in database:",
          existingBlock.height
        );
        return existingBlock.toJSON() as LastSyncAttributes;
      } else {
        const block = await LastSync.create(parsedData);
        console.log("Last synced block saved in database:", block.height);
        return block.toJSON() as LastSyncAttributes;
      }
    } catch (error) {
      console.error("Error saving last synced block:", error);
      throw error;
    }
  }

  async find(
    chainId: number,
    network: string
  ): Promise<LastSyncAttributes | null> {
    try {
      const block = await LastSync.findOne({
        where: { chainId, network },
      });
      return block ? (block.toJSON() as LastSyncAttributes) : null;
    } catch (error) {
      console.error("Error finding block:", error);
      throw error;
    }
  }
}

export const lastSyncService = new LastSyncService();
