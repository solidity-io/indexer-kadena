import Balance, { BalanceAttributes } from "../models/balance";
import { Transaction } from "sequelize";

export class BalanceService {
  /**
   * Saves or updates a balance in the database.
   * If the balance already exists (based on the account, chainId, and optionally tokenId), it updates the existing balance.
   * Otherwise, it creates a new balance entry.
   *
   * @param balanceData The balance data to save or update.
   * @returns A Promise containing the balance data as saved in the database
   * and a boolean indicating whether a new balance was created (true) or an existing balance was updated (false).
   */
  async saveOrUpdate(
    balanceData: BalanceAttributes,
    options?: { transaction?: Transaction }
  ): Promise<[BalanceAttributes, boolean]> {
    const { network, chainId, qualname, account, tokenId } = balanceData;
    try {
      const whereClause = tokenId
        ? { network, chainId, qualname, account, tokenId }
        : { network, chainId, qualname, account };

      console.log("whereClause", whereClause);

      const existingBalance = await Balance.findOne({
        where: whereClause,
        transaction: options?.transaction,
      });

      if (existingBalance) {
        console.log("updating balance", existingBalance.toJSON());
        await existingBalance.update(balanceData, {
          transaction: options?.transaction,
        });
        return [existingBalance.toJSON() as BalanceAttributes, false];
      } else {
        console.log("creating balance", balanceData);
        const newBalance = await Balance.create(balanceData, {
          transaction: options?.transaction,
        });
        return [newBalance.toJSON() as BalanceAttributes, true];
      }
    } catch (error) {
      console.error("Error saving balance to database:", error);
      throw error;
    }
  }

  /**
   * Finds a balance by account and chainId.
   *
   * @param account The account to find the balance for.
   * @param chainId The chainId associated with the balance.
   * @param qualname The qualified name of the token.
   * @param network The network associated with the balance.
   * @param tokenId Optional. The tokenId for non-fungible tokens.
   * @returns A Promise containing the found balance or null if no balance is found.
   */
  async findByAccountAndChainId(
    account: string,
    chainId: number,
    qualname: string,
    network: string,
    tokenId?: string,
    options?: { lock?: any; transaction?: Transaction }
  ): Promise<BalanceAttributes | null> {
    try {
      const whereClause = tokenId
        ? { network, chainId, account, qualname, tokenId }
        : { network, chainId, account, qualname };

      const balance = await Balance.findOne({
        where: whereClause,
        lock: options?.lock,
        transaction: options?.transaction,
      });

      return balance ? (balance.toJSON() as BalanceAttributes) : null;
    } catch (error) {
      console.error("Error finding balance:", error);
      throw error;
    }
  }
}

export const balanceService = new BalanceService();
