import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface GuardAttributes {
  id: number;
  publicKey: string;
  chainId: string;
  account: string;
  predicate: string;
}

interface GuardCreationAttributes extends Optional<GuardAttributes, "id"> {}

class Guard
  extends Model<GuardAttributes, GuardCreationAttributes>
  implements GuardAttributes
{
  public id!: number;
  public publicKey!: string;
  public chainId!: string;
  public account!: string;
  public predicate!: string;
}

Guard.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "The unique identifier for the signer",
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The public key associated with the account",
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The chain ID associated with the account",
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The account associated with the public key",
    },
    predicate: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The predicate associated with the account, public key and chain",
    },
  },
  {
    sequelize,
    modelName: "Guard",
    tableName: "Guards", // optional, specifies the table name
    timestamps: true, // automatically adds `createdAt` and `updatedAt` fields
  },
);

export default Guard;
