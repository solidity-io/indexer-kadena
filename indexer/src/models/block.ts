import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { gql, makeExtendSchemaPlugin } from "postgraphile";

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
  epochStart: bigint | null;
  featureFlags: number;
  hash: string;
  minerData: object;
  transactionsHash: string;
  outputsHash: string;
  coinbase: object;
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
  declare minerData: object;
  declare transactionsHash: string;
  declare outputsHash: string;
  declare coinbase: object;
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
    minerData: { type: DataTypes.JSONB },
    transactionsHash: { type: DataTypes.STRING },
    outputsHash: { type: DataTypes.STRING },
    coinbase: { type: DataTypes.JSONB },
  },
  {
    sequelize,
    modelName: "Block",
    indexes: [
      {
        unique: true,
        fields: ["chainwebVersion", "chainId", "height"],
        name: "block_unique_constraint",
      },
    ],
  }
);

export const blockQueryPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Query {
        blockByHeight(height: Int!, chainId: Int!): Block
      }
    `,
    resolvers: {
      Query: {
        blockByHeight: async (_query, args, context, resolveInfo) => {
          const { height, chainId } = args;
          const { rootPgPool } = context;
          const { rows } = await rootPgPool.query(
            `SELECT * FROM public."Blocks" WHERE height = $1 AND "chainId" = $2`,
            [height, chainId]
          );
          return rows[0];
        },
      },
    },
  };
});

export default Block;
