import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../config/database';
import type PoolChart from './pool-chart';
import type PoolStats from './pool-stats';
import type PoolTransaction from './pool-transaction';
import type Token from './token';

class Pair extends Model {
  public id!: number;
  public address!: string;
  public token0Id!: number;
  public token1Id!: number;
  public reserve0!: string;
  public reserve1!: string;
  public totalSupply!: string;
  public key!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Type definitions for associations
  public readonly token0?: Token;
  public readonly token1?: Token;
  public readonly poolStats?: PoolStats[];
  public readonly poolTransactions?: PoolTransaction[];
  public readonly poolChart?: PoolChart[];
}

Pair.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    token0Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reserve0: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    reserve1: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    totalSupply: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Pair',
    timestamps: true,
  },
);

export default Pair;
