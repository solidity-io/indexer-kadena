import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface BlockAttributes {
  id: number;
  nonce: string;
  creationTime: bigint;
  parent: string;
  adjacents: object;
  target: string;
  payloadHash: string;
  chainId: number;
  weight: string;
  height: number;
  chainwebVersion: string;
  epochStart: bigint;
  featureFlags: number;
  hash: string;
}

class Block extends Model<BlockAttributes> implements BlockAttributes {
  declare id: number;
  declare nonce: string;
  declare creationTime: bigint;
  declare parent: string;
  declare adjacents: object;
  declare target: string;
  declare payloadHash: string;
  declare chainId: number;
  declare weight: string;
  declare height: number;
  declare chainwebVersion: string;
  declare epochStart: bigint;
  declare featureFlags: number;
  declare hash: string;
}

Block.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nonce: { type: DataTypes.STRING },
    creationTime: { type: DataTypes.BIGINT },
    parent: { type: DataTypes.STRING },
    adjacents: { type: DataTypes.JSONB },
    target: { type: DataTypes.STRING },
    payloadHash: { type: DataTypes.STRING },
    chainId: { type: DataTypes.INTEGER },
    weight: { type: DataTypes.STRING },
    height: { type: DataTypes.INTEGER },
    chainwebVersion: { type: DataTypes.STRING },
    epochStart: { type: DataTypes.BIGINT },
    featureFlags: { type: DataTypes.INTEGER },
    hash: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Block",
  }
);

export default Block;
