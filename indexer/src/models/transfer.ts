import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Transaction from "./transaction";

export interface TransferAttributes {
  id: number;
  transactionId: number;
  amount: number;
  payloadHash: string;
  chainid: number;
  from_acct: string;
  modulehash: string;
  modulename: string;
  requestkey: string;
  to_acct: string;
  tokenId?: string;
}

class Transfer extends Model<TransferAttributes> implements TransferAttributes {
  declare id: number;
  declare transactionId: number;
  declare amount: number;
  declare payloadHash: string;
  declare chainid: number;
  declare from_acct: string;
  declare modulehash: string;
  declare modulename: string;
  declare requestkey: string;
  declare to_acct: string;
  declare tokenId?: string;
}

Transfer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: true },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    payloadHash: { type: DataTypes.STRING, allowNull: false },
    chainid: { type: DataTypes.INTEGER, allowNull: false },
    from_acct: { type: DataTypes.STRING, allowNull: false },
    modulehash: { type: DataTypes.STRING, allowNull: false },
    modulename: { type: DataTypes.STRING, allowNull: false },
    requestkey: { type: DataTypes.STRING, allowNull: false },
    to_acct: { type: DataTypes.STRING, allowNull: false },
    tokenId: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Transfer",
  }
);

Transfer.belongsTo(Transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

export default Transfer;
