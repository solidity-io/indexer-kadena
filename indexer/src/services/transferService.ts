import { Transaction, BulkCreateOptions } from "sequelize";
import Transfer, { TransferAttributes } from "../models/transfer";

export class TransferService {
  /**
   * Saves or updates a transfer in the database.
   * If the transfer already exists (based on primary key or unique constraints), it updates the existing transfer.
   * Otherwise, it creates a new transfer entry.
   *
   * @param transferData The transfer data to save or update.
   * @returns A Promise containing the transfer data as saved in the database
   * and a boolean indicating whether a new transfer was created (true) or an existing transfer was updated (false).
   */
  async save(
    transferData: TransferAttributes
  ): Promise<[TransferAttributes, boolean]> {
    try {
      const parsedData = {
        ...transferData,
      };

      const [transfer, created] = await Transfer.upsert(parsedData);
      return [transfer.toJSON(), created as boolean];
    } catch (error) {
      console.error("Error saving transfer to database:", error);
      throw error;
    }
  }

  /**
   * Saves an array of transfers to the database.
   * This method inserts new transfers and does not update existing ones.
   * To update existing transfers, you would need to implement additional logic.
   *
   * @param transfersData Array of transfer data to be saved.
   * @param options Optional bulk create options.
   * @returns A Promise that resolves when the operation is complete.
   */
  async saveMany(
    transfersData: TransferAttributes[],
    options?: Transaction
  ): Promise<void> {
    try {
      await Transfer.bulkCreate(transfersData, {
        transaction: options,
      });
    } catch (error) {
      console.error("Error saving transfers to database:", error);
      throw error;
    }
  }
}

export const transferService = new TransferService();
