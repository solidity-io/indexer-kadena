import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Balance from "./balance";

export interface ContractAttributes {
  id: number;
  network: string;
  chainId: number;
  type: string;
  module: string;
  metadata: object;
  tokenId: string;
  precision: number;
}

class Contract extends Model<ContractAttributes> implements ContractAttributes {
  declare id: number;
  declare network: string;
  declare chainId: number;
  declare type: string; // fungible, poly-fungible
  declare module: string;
  declare metadata: object;
  declare tokenId: string;
  declare precision: number;
}

Contract.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    network: { type: DataTypes.STRING, allowNull: false },
    chainId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    module: { type: DataTypes.STRING, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
    tokenId: { type: DataTypes.STRING, allowNull: true },
    precision: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Contract",
    indexes: [
      {
        name: "contract_unique_constraint",
        unique: true,
        fields: ["network", "chainId", "module", "tokenId"],
      },
    ],
  }
);

export default Contract;
