import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface StreamingErrorAttributes {
  id: number;
  chainId: number;
  hash: string;
}

interface StreamingErrorCreationAttributes
  extends Optional<StreamingErrorAttributes, "id"> {}

class StreamingError
  extends Model<StreamingErrorAttributes, StreamingErrorCreationAttributes>
  implements StreamingErrorAttributes
{
  declare id: number;
  declare chainId: number;
  declare hash: string;
}

StreamingError.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chainId: { type: DataTypes.INTEGER },
    hash: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "StreamingError",
    tableName: "StreamingErrors",
    timestamps: true,
  },
);

export default StreamingError;
