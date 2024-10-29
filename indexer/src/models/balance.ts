import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Contract from "./contract";
import { gql, makeExtendSchemaPlugin } from "postgraphile";

export interface BalanceAttributes {
  id: number;
  account: string;
  chainId: number;
  balance: bigint;
  module: string;
  qualname: string;
  tokenId: string;
  hasTokenId: boolean;
  network: string;
  contractId: number;
  transactionsCount: number;
  fungiblesCount: number;
  polyfungiblesCount: number;
}

/**
 * Represents a balance in the system.
 */
class Balance extends Model<BalanceAttributes> implements BalanceAttributes {
  /** The unique identifier for the balance record (e.g., 45690). */
  public id!: number;

  /** The account associated with the balance (e.g., "k:aaef3fbd4715dff905a3c50cb243d97058b8221da858e645551b44ffdd4364a4"). */
  public account!: string;

  /** The ID of the blockchain network (e.g., 2). */
  public chainId!: number;

  /** The balance amount (e.g., 25). */
  public balance!: bigint;

  /** The module associated with the balance (e.g., "coin"). */
  public module!: string;

  /** The qualified name of the balance (e.g., "coin"). */
  public qualname!: string;

  /** The token ID associated with the balance (e.g., "boxing-badger #1443"). */
  public tokenId!: string;

  /** Whether the balance has a token ID (e.g., false). */
  public hasTokenId!: boolean;

  /** The network name (e.g., "mainnet01"). */
  public network!: string;

  /** The ID of the associated contract (e.g., 204). */
  public contractId!: number;

  /** The number of transactions in the block. */
  public transactionsCount!: number;

  /** The number of fungibles in the block. */
  public fungiblesCount!: number;

  /** The number of polyfungibles in the block. */
  public polyfungiblesCount!: number;
}

Balance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "The unique identifier for the balance record (e.g., 45690).",
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The account associated with the balance (e.g., 'k:aaef3fbd4715dff905a3c50cb243d97058b8221da858e645551b44ffdd4364a4').",
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The ID of the blockchain network (e.g., 2).",
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      comment: "The balance amount (e.g., 25).",
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The module associated with the balance (e.g., 'coin').",
    },
    qualname: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The qualified name of the balance (e.g., 'coin').",
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "The token ID associated with the balance (e.g., 'boxing-badger #1443').",
    },
    hasTokenId: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the balance has a token ID (e.g., false).",
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The network name (e.g., 'mainnet01').",
    },
    contractId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "The ID of the associated contract (e.g., 204).",
    },
    transactionsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "The number of transactions in the block."
    },
    fungiblesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "The number of fungibles in the block."
    },
    polyfungiblesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "The number of polyfungibles in the block."
    },
  },
  {
    sequelize,
    modelName: "Balance",
    indexes: [
      {
        name: "balances_unique_constraint",
        unique: true,
        fields: ["network", "chainId", "account", "qualname", "tokenId"],
      },
      {
        name: "balances_account_index",
        fields: ["account"],
      },
      {
        name: "balances_tokenid_index",
        fields: ["tokenId"],
      },
      {
        name: "balances_contractid_index",
        fields: ["contractId"],
      },
      {
        name: "balances_search_idx",
        fields: [
          sequelize.fn('LOWER', sequelize.col('account')),
        ]
      }
    ],
  }
);

Balance.belongsTo(Contract, {
  foreignKey: "contractId",
  as: "contract",
});

export const getHoldersPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Query {
        getHolders(moduleName: String!, before: String, after: String, first: Int, last: Int): HolderResponse
      }

      type HolderResponse {
        edges: [HolderEdge]
        pageInfo: PageInfo
        totalCount: Int
      }

      type HolderEdge {
        cursor: String
        node: HolderNode
      }

      type HolderNode {
        address: String
        quantity: Float
        percentage: Float
      }
    `,
    resolvers: {
      Query: {
        getHolders: async (_query, args, context, _resolveInfo) => {
          const { moduleName, before, after, first, last } = args;
          const { rootPgPool } = context;

          const { rows } = await rootPgPool.query(
            `SELECT * FROM get_holders_by_module($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::INT, $5::INT)`,
            [moduleName, before, after, first, last]
          );

          const holders = rows.map((row: any) => ({
            cursor: Buffer.from(row.row_id.toString()).toString('base64'),
            node: {
              address: row.address,
              quantity: row.quantity,
              percentage: row.percentage,
            }
          }));

          const hasNextPage = first ? holders.length === first : false;
          const hasPreviousPage = last ? holders.length === last : !!after;

          const endCursor = hasNextPage ? holders[holders.length - 1].cursor : null;
          const startCursor = holders.length > 0 ? holders[0].cursor : null;
          const totalCount = holders.length;

          return {
            edges: holders,
            pageInfo: {
              endCursor,
              hasNextPage,
              hasPreviousPage,
              startCursor
            },
            totalCount
          };
        },
      },
    },
  };
});

export default Balance;
