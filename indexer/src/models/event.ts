import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface EventAttributes {
  payloadHash: string;
  chainid: number;
  module: string;
  modulehash: string;
  name: string;
  params: object;
  paramtext: object;
  qualname: string;
  requestkey: string;
}

class Event extends Model<EventAttributes> implements EventAttributes {
  declare payloadHash: string;
  declare chainid: number;
  declare module: string;
  declare modulehash: string;
  declare name: string;
  declare params: object;
  declare paramtext: object;
  declare qualname: string;
  declare requestkey: string;
}

Event.init(
  {
    payloadHash: { type: DataTypes.STRING, allowNull: false },
    chainid: { type: DataTypes.INTEGER, allowNull: false },
    module: { type: DataTypes.STRING, allowNull: false },
    modulehash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    params: { type: DataTypes.JSONB, allowNull: false },
    paramtext: { type: DataTypes.JSONB, allowNull: false },
    qualname: { type: DataTypes.STRING, allowNull: false },
    requestkey: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Event",
  }
);

export default Event;
