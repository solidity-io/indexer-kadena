import TransactionModel, { TransactionAttributes } from "../models/transaction";
import { Transaction, TransactionOptions } from "sequelize";

export class TransactionService {
  /**
   * Saves or updates a transaction in the database.
   * If the transaction already exists (based on primary key or unique constraints), it updates the existing transaction.
   * Otherwise, it creates a new transaction entry.
   *
   * @param transactionData The transaction data to save or update.
   * @returns A Promise containing the transaction data as saved in the database
   * and a boolean indicating whether a new transaction was created (true) or an existing transaction was updated (false).
   */
  async save(
    transactionData: TransactionAttributes,
    txOptions?: TransactionOptions,
  ): Promise<TransactionAttributes> {
    try {
      const parsedData = {
        ...transactionData,
      };

      const tx = await TransactionModel.create(parsedData, txOptions);
      return tx.toJSON();
    } catch (error) {
      console.error("Error saving transaction to database:", error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
