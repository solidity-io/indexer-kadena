import Block, { BlockAttributes } from "../models/block";

export class BlockService {
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
