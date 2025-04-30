import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../config/database';
import type Pair from './pair';

export enum TransactionType {
  SWAP = 'SWAP',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  REMOVE_LIQUIDITY = 'REMOVE_LIQUIDITY',
}

class PoolTransaction extends Model {
  public id!: number;
  public pairId!: number;
  public transactionHash!: string;
  public type!: TransactionType;
  public timestamp!: Date;
  public amount0In!: string;
  public amount1In!: string;
  public amount0Out!: string;
  public amount1Out!: string;
  public amountUsd!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Type definitions for associations
  public readonly pair?: Pair;
}

PoolTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pairId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount0In: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    amount1In: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    amount0Out: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    amount1Out: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    amountUsd: {
      type: DataTypes.DECIMAL(24, 8),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pool_transactions',
    timestamps: true,
  },
);

export default PoolTransaction;
