import SyncError, { SyncErrorAttributes } from "../models/syncError";

export class SyncErrorService {
  async save(syncErrorData: SyncErrorAttributes): Promise<SyncErrorAttributes> {
    try {
      const parsedData = {
        ...syncErrorData,
      };

      const block = await SyncError.create(parsedData);
      console.log("Error synced block saved in database: ", block);

      return block.toJSON() as SyncErrorAttributes;
    } catch (error) {
      console.error("Error saving last synced block:", error);
      throw error;
    }
  }

  async getErrors(
    network: string,
    source: string
  ): Promise<SyncErrorAttributes[]> {
    try {
      const errors = await SyncError.findAll({
        where: {
          network,
          source,
        },
      });
      return errors.map((error) => error.toJSON() as SyncErrorAttributes);
    } catch (error) {
      console.error("Error getting last synced block:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await SyncError.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error("Error deleting last synced block:", error);
      throw error;
    }
  }
}

export const syncErrorService = new SyncErrorService();
