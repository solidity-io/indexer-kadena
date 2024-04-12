import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Block from "./block";

export interface TransactionAttributes {
  id: number;
  blockId: number;
  payloadHash: string;
  chainid: number;
  code: object;
  continuation: object;
  creationtime: bigint;
  data: object;
  gas: bigint;
  gaslimit: bigint;
  gasprice: bigint;
  result: object;
  logs: object;
  metadata: object;
  nonce: string;
  num_events: number;
  pactid: string;
  proof: string;
  requestkey: string;
  rollback: boolean;
  sender: string;
  step: number;
  ttl: bigint;
  txid: string;
}

class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes
{
  declare id: number;
  declare blockId: number;
  declare result: object;
  declare payloadHash: string;
  declare chainid: number;
  declare code: object;
  declare continuation: object;
  declare creationtime: bigint;
  declare data: object;
  declare gas: bigint;
  declare gaslimit: bigint;
  declare gasprice: bigint;
  declare logs: object;
  declare metadata: object;
  declare nonce: string;
  declare num_events: number;
  declare pactid: string;
  declare proof: string;
  declare requestkey: string;
  declare rollback: boolean;
  declare sender: string;
  declare step: number;
  declare ttl: bigint;
  declare txid: string;
}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    blockId: { type: DataTypes.INTEGER, allowNull: true },
    payloadHash: { type: DataTypes.STRING },
    chainid: { type: DataTypes.INTEGER },
    code: { type: DataTypes.JSONB },
    continuation: { type: DataTypes.JSONB },
    creationtime: { type: DataTypes.BIGINT },
    data: { type: DataTypes.JSONB },
    gas: { type: DataTypes.BIGINT },
    gaslimit: { type: DataTypes.BIGINT },
    gasprice: { type: DataTypes.BIGINT },
    result: { type: DataTypes.JSONB },
    logs: { type: DataTypes.JSONB },
    metadata: { type: DataTypes.JSONB },
    nonce: { type: DataTypes.STRING },
    num_events: { type: DataTypes.INTEGER },
    pactid: { type: DataTypes.STRING },
    proof: { type: DataTypes.STRING },
    requestkey: { type: DataTypes.STRING },
    rollback: { type: DataTypes.BOOLEAN },
    sender: { type: DataTypes.STRING },
    step: { type: DataTypes.INTEGER },
    ttl: { type: DataTypes.BIGINT },
    txid: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Transaction",
  }
);

Transaction.belongsTo(Block, {
  foreignKey: "blockId",
  as: "block",
});

export default Transaction;
