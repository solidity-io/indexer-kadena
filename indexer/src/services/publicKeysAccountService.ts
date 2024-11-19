import { Transaction } from "sequelize";
import { TransferAttributes } from "../models/transfer";
import PublicKeysAccount from "../models/publickeysaccount";

export class PublicKeysAccountService {
  /**
   * Saves the (chainId, fungible, account) combination for each key to the database.
   * This method inserts new records and prevent duplicates.
   *
   * @param transfersData Array of transfer data to be saved.
   * @param options Optional bulk create options.
   * @returns A Promise that resolves when the operation is complete.
   */
  async saveMany(
    publicKeys: string[],
    transfersAttributes: TransferAttributes[],
    chainId: number,
    options?: Transaction,
  ): Promise<void> {
    try {
      const publicKeysAccountRows = publicKeys
        .map((publicKey) => {
          return transfersAttributes.map((transfer) => ({
            publicKey: publicKey,
            chainId: chainId.toString(),
            account: transfer.from_acct,
            module: transfer.modulename,
          }));
        })
        .flat();

      const uniqueRowsInMemory = [
        ...new Map(
          publicKeysAccountRows.map((row) => [
            `${row.publicKey}_${row.chainId}_${row.account}_${row.module}`,
            row,
          ]),
        ).values(),
      ];

      await PublicKeysAccount.bulkCreate(uniqueRowsInMemory, {
        transaction: options,
        ignoreDuplicates: true,
      });
    } catch (error) {
      console.error(
        "Error saving public keys of an account to database:",
        error,
      );
    }
  }
}

export const publicKeysAccountService = new PublicKeysAccountService();
