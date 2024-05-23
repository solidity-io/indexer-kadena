import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Transaction from "./transaction";
import Contract from "./contract";
import { gql, makeExtendSchemaPlugin } from "postgraphile";

export interface TransferAttributes {
  id: number;
  transactionId: number;
  type: string;
  amount: number;
  payloadHash: string;
  chainId: number;
  from_acct: string;
  modulehash: string;
  modulename: string;
  requestkey: string;
  to_acct: string;
  network: string;
  tokenId?: string;
  contractId?: number;
}

class Transfer extends Model<TransferAttributes> implements TransferAttributes {
  declare id: number;
  declare transactionId: number;
  declare type: string;
  declare amount: number;
  declare payloadHash: string;
  declare chainId: number;
  declare from_acct: string;
  declare modulehash: string;
  declare modulename: string;
  declare requestkey: string;
  declare to_acct: string;
  declare network: string;
  declare tokenId?: string;
  declare contractId?: number;
}

Transfer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    payloadHash: { type: DataTypes.STRING, allowNull: false },
    chainId: { type: DataTypes.INTEGER, allowNull: false },
    from_acct: { type: DataTypes.STRING, allowNull: false },
    modulehash: { type: DataTypes.STRING, allowNull: false },
    modulename: { type: DataTypes.STRING, allowNull: false },
    requestkey: { type: DataTypes.STRING, allowNull: false },
    to_acct: { type: DataTypes.STRING, allowNull: false },
    network: { type: DataTypes.STRING, allowNull: false },
    tokenId: { type: DataTypes.STRING, allowNull: true },
    contractId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Transfer",
    indexes: [
      {
        name: "type_index",
        fields: ["type"],
      },
    ],
  }
);

Transfer.belongsTo(Transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

Transfer.belongsTo(Contract, {
  foreignKey: "contractId",
  as: "contract",
});

export const transfersByTypeQueryPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Query {
        transfersByType(
          type: String!
          first: Int
          after: String
        ): TransferConnection
      }

      type TransferConnection {
        edges: [TransferEdge]
        pageInfo: PageInfo
      }

      type TransferEdge {
        node: Transfer
        cursor: String
      }
    `,
    resolvers: {
      Query: {
        transfersByType: async (_query, args, context, resolveInfo) => {
          const { type, first, after } = args;
          const { rootPgPool } = context;

          let cursorCondition = "";
          const limit = first || 10;
          const values = [type, limit + 1];

          if (after) {
            cursorCondition = "AND id > $3";
            values.push(Buffer.from(after, "base64").toString("ascii"));
          }

          const query = `
            SELECT * FROM public."Transfers"
            WHERE "type" = $1
            ${cursorCondition}
            ORDER BY id
            LIMIT $2
          `;

          const { rows } = await rootPgPool.query(query, values);

          const hasNextPage = rows.length > limit;
          if (hasNextPage) {
            rows.pop();
          }

          const edges = rows.map((row: any) => ({
            node: row,
            cursor: Buffer.from(row.id.toString(), "ascii").toString("base64"),
          }));

          const endCursor =
            edges.length > 0 ? edges[edges.length - 1].cursor : null;

          return {
            edges,
            pageInfo: {
              endCursor,
              hasNextPage,
            },
          };
        },
      },
    },
  };
});

export default Transfer;
