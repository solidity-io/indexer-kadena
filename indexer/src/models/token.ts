import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../config/database';
import type { Pair } from './pair';

class Token extends Model {
  public id!: number;
  public address!: string;
  public name!: string;
  public symbol!: string;
  public decimals!: number;
  public totalSupply!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Type definitions for associations
  public readonly pairsAsToken0?: Pair[];
  public readonly pairsAsToken1?: Pair[];
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalSupply: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    sequelize,
    tableName: 'tokens',
    timestamps: true,
  },
);

export default Token;
