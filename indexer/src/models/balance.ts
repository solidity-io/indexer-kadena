import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Contract from "./contract";

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
    ],
  }
);

Balance.belongsTo(Contract, {
  foreignKey: "contractId",
  as: "contract",
});

export default Balance;
