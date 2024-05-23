import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface BalanceAttributes {
  id: number;
  account: string;
  chainId: number;
  balance: bigint;
  module: string;
  qualname: string;
  tokenId: string;
  network: string;
}

class Balance extends Model<BalanceAttributes> implements BalanceAttributes {
  public id!: number;
  public account!: string;
  public chainId!: number;
  public balance!: bigint;
  public module!: string;
  public qualname!: string;
  public tokenId!: string;
  public network!: string;
}

Balance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Balance",
    indexes: [
      {
        unique: true,
        fields: ["network", "chainId", "account", "qualname", "tokenId"],
        name: "balance_unique_constraint",
      },
    ],
  }
);

export default Balance;
