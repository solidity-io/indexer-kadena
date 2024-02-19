import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface LastSyncAttributes {
  id: number;
  chainId: number;
  height: number;
  network: string;
  key: string;
}

class LastSync extends Model<LastSyncAttributes> implements LastSyncAttributes {
  declare id: number;
  declare chainId: number;
  declare height: number;
  declare network: string;
  declare key: string;
}

LastSync.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chainId: { type: DataTypes.INTEGER },
    height: { type: DataTypes.INTEGER },
    network: { type: DataTypes.STRING },
    key: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "LastSync",
  }
);

export default LastSync;
