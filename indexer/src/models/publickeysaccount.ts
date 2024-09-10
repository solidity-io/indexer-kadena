import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface PublicKeysAccountAttributes {
  id: number;
  publicKey: string;
  chainId: string;
  account: string;
  module: string;
}

interface PublicKeysAccountCreationAttributes
  extends Optional<PublicKeysAccountAttributes, "id"> {}

class PublicKeysAccount
  extends Model<
    PublicKeysAccountAttributes,
    PublicKeysAccountCreationAttributes
  >
  implements PublicKeysAccountAttributes
{
  public id!: number;
  public publicKey!: string;
  public chainId!: string;
  public account!: string;
  public module!: string;
}

PublicKeysAccount.init(
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
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The chain ID associated with the account",
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The account associated with the public key",
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The module associated with the public key",
    },
  },
  {
    sequelize,
    modelName: "PublicKeysAccount",
    tableName: "PublicKeysAccounts", // optional, specifies the table name
    timestamps: true, // automatically adds `createdAt` and `updatedAt` fields
  },
);

export default PublicKeysAccount;
