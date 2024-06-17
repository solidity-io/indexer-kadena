import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface SyncErrorAttributes {
  id: number;
  network: string;
  chainId: number;
  fromHeight: number;
  toHeight: number;
  payloadHash: string;
  endpoint: string;
  data: object;
  source: "s3" | "api";
}

class SyncError
  extends Model<SyncErrorAttributes>
  implements SyncErrorAttributes
{
  declare id: number;
  declare network: string;
  declare chainId: number;
  declare fromHeight: number;
  declare toHeight: number;
  declare payloadHash: string;
  declare endpoint: string;
  declare data: object;
  declare source: "s3" | "api";
}

SyncError.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    network: { type: DataTypes.STRING },
    chainId: { type: DataTypes.INTEGER },
    fromHeight: { type: DataTypes.INTEGER },
    toHeight: { type: DataTypes.INTEGER },
    payloadHash: { type: DataTypes.STRING },
    endpoint: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB },
    source: { type: DataTypes.ENUM("s3", "api") },
  },
  {
    sequelize,
    modelName: "SyncError",
  }
);

export default SyncError;
