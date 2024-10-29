import Block, { BlockAttributes } from "../models/block";
import { Transaction } from "sequelize";

export class BlockService {
  /**
   * Saves or updates a block in the database.
   * If the block already exists (based on primary key or unique constraints), it updates the existing block.
   * Otherwise, it creates a new block entry.
   *
   * @param {BlockAttributes} blockData - The block data to save or update.
   * @param {Transaction} [transaction] - An optional transaction to use for this operation.
   * @returns {Promise<[BlockAttributes, boolean]>} A Promise containing the block data as saved in the database
   * and a boolean indicating whether a new block was created (true) or an existing block was updated (false).
   * @throws {Error} If there is an error saving the block to the database.
   */
  async save(
    blockData: BlockAttributes,
    transaction?: Transaction
  ): Promise<[BlockAttributes, boolean]> {
    try {
      const parsedData = {
        ...blockData,
        creationtime: blockData.creationTime
          ? BigInt(blockData.creationTime)
          : null,
        epochStart: blockData.epochStart ? BigInt(blockData.epochStart) : null,
      };

      const [block, created] = await Block.upsert(parsedData, { transaction });
      return [block.toJSON(), created as boolean];
    } catch (error) {
      console.error("Error saving block to database:", error);
      throw error;
    }
  }

  /**
   * Finds a block by its height and chain ID.
   *
   * @param {number} height - The height of the block to find.
   * @param {number} chainId - The chain ID of the block to find.
   * @returns {Promise<BlockAttributes | null>} A Promise resolving to the block data if found, otherwise null.
   * @throws {Error} If there is an error finding the block.
   */
  async findByHeightAndChainId(
    height: number,
    chainId: number
  ): Promise<BlockAttributes | null> {
    try {
      const block = await Block.findOne({ where: { height, chainId } });
      return block ? (block.toJSON() as BlockAttributes) : null;
    } catch (error) {
      console.error("Error finding block:", error);
      throw error;
    }
  }

  /**
   * Lists all blocks associated with a given chain ID.
   *
   * @param {number} chainId - The chain ID of the blocks to list.
   * @returns {Promise<BlockAttributes[]>} A Promise resolving to an array of block data.
   * @throws {Error} If there is an error listing the blocks.
   */
  async listByChainId(chainId: number): Promise<BlockAttributes[]> {
    try {
      const blocks = await Block.findAll({ where: { chainId } });
      return blocks.map((block: any) => block.toJSON() as BlockAttributes);
    } catch (error) {
      console.error("Error listing blocks:", error);
      throw error;
    }
  }

  /**
   * Finds a block by its payload hash.
   *
   * @param {string} payloadHash - The payload hash of the block to find.
   * @returns {Promise<BlockAttributes | null>} A Promise resolving to the block data if found, otherwise null.
   */
  async findBlockByPayloadHash(
    payloadHash: string
  ): Promise<BlockAttributes | null> {
    return await Block.findOne({
      where: { payloadHash: payloadHash },
    });
  }
}

export const blockService = new BlockService();
