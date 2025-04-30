import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../config/database';
import type Pair from './pair';

export enum ChartDataType {
  VOLUME = 'VOLUME',
  TVL = 'TVL',
  FEES = 'FEES',
}

class PoolChartData extends Model {
  public id!: number;
  public pairId!: number;
  public type!: ChartDataType;
  public timestamp!: Date;
  public valueUsd!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Type definitions for associations
  public readonly pair?: Pair;
}

PoolChartData.init(
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
    type: {
      type: DataTypes.ENUM(...Object.values(ChartDataType)),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valueUsd: {
      type: DataTypes.DECIMAL(24, 8),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pool_chart_data',
    timestamps: true,
  },
);

export default PoolChartData;
