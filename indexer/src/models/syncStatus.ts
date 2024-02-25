import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface SyncStatusAttributes {
  id: number;
  network: string;
  chainId: number;
  startHeight: number;
  fromHeight: number;
  toHeight: number;
  key: string;
  source: string;
}

class SyncStatus
  extends Model<SyncStatusAttributes>
  implements SyncStatusAttributes
{
  declare id: number;
  declare network: string;
  declare chainId: number;
  declare startHeight: number;
  declare fromHeight: number;
  declare toHeight: number;
  declare key: string;
  declare source: string;
}

SyncStatus.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    network: { type: DataTypes.STRING },
    chainId: { type: DataTypes.INTEGER },
    startHeight: { type: DataTypes.INTEGER },
    fromHeight: { type: DataTypes.INTEGER },
    toHeight: { type: DataTypes.INTEGER },
    key: { type: DataTypes.STRING },
    source: { type: DataTypes.ENUM("s3", "api", "backfill", "streaming") },
  },
  {
    sequelize,
    modelName: "SyncStatus",
  }
);

export default SyncStatus;
