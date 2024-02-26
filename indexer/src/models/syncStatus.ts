import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const SOURCE_S3 = "s3";
export const SOURCE_API = "api";
export const SOURCE_BACKFILL = "backfill";
export const SOURCE_STREAMING = "streaming";

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
    source: {
      type: DataTypes.ENUM(
        SOURCE_S3,
        SOURCE_API,
        SOURCE_BACKFILL,
        SOURCE_STREAMING
      ),
    },
  },
  {
    sequelize,
    modelName: "SyncStatus",
  }
);

export default SyncStatus;
