import SyncError, { SyncErrorAttributes } from "../models/syncError";

export class SyncErrorService {
  /**
   * Saves a synchronization error to the database.
   *
   * @param syncErrorData The synchronization error data to be saved.
   * @returns A Promise resolving to the saved SyncErrorAttributes object.
   * @throws Throws an error if the save operation fails.
   */
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

  /**
   * Retrieves synchronization errors from the database based on the network and source.
   *
   * @param network The network identifier for the errors to retrieve.
   * @param source The source identifier for the errors to retrieve.
   * @returns A Promise resolving to an array of SyncErrorAttributes objects.
   * @throws Throws an error if the retrieval operation fails.
   */
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

  /**
   * Deletes a synchronization error from the database by its ID.
   *
   * @param id The ID of the synchronization error to delete.
   * @returns A Promise that resolves when the deletion is complete.
   * @throws Throws an error if the deletion operation fails.
   */
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
