import Block, { BlockAttributes } from "../models/block";

export class BlockService {
  /**
   * Saves or updates a block in the database.
   * If the block already exists (based on primary key or unique constraints), it updates the existing block.
   * Otherwise, it creates a new block entry.
   *
   * @param blockData The block data to save or update.
   * @returns A Promise containing the block data as saved in the database
   * and a boolean indicating whether a new block was created (true) or an existing block was updated (false).
   */
  async save(blockData: BlockAttributes): Promise<[BlockAttributes, boolean]> {
    try {
      const parsedData = {
        ...blockData,
        creationTime: BigInt(blockData.creationTime),
        epochStart: BigInt(blockData.epochStart),
      };

      const [block, created] = await Block.upsert(parsedData);
      return [block.toJSON(), created as boolean];
    } catch (error) {
      console.error("Error saving block to database:", error);
      throw error;
    }
  }

  /**
   * Finds a block by its height and chain ID.
   *
   * @param height The height of the block to find.
   * @param chainId The chain ID of the block to find.
   * @returns A Promise resolving to the block data if found, otherwise null.
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
   * @param chainId The chain ID of the blocks to list.
   * @returns A Promise resolving to an array of block data.
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
}

export const blockService = new BlockService();
