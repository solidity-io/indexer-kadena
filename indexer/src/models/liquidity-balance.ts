import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class LiquidityBalance extends Model {
  public id!: number;
  public pairKey!: string;
  public liquidity!: string;
  public walletAddress!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LiquidityBalance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pairKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    liquidity: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'LiquidityBalances',
    indexes: [
      {
        unique: true,
        fields: ['pairKey', 'walletAddress'],
      },
    ],
  },
);

export default LiquidityBalance;
