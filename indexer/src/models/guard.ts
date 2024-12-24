import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Balance from "./balance";

export interface GuardAttributes {
  id: number;
  publicKey: string;
  predicate: string;
  balanceId: number;
}

interface GuardCreationAttributes extends Optional<GuardAttributes, "id"> {}

class Guard
  extends Model<GuardAttributes, GuardCreationAttributes>
  implements GuardAttributes
{
  public id!: number;
  public publicKey!: string;
  public predicate!: string;
  public balanceId!: number;
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
    predicate: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The predicate associated with the account, public key and chain",
    },
    balanceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "The ID of the associated balance (e.g., 204).",
    },
  },
  {
    sequelize,
    modelName: "Guard",
    tableName: "Guards",
    indexes: [
      {
        name: "guards_publickey_predicate_balanceid_idx",
        fields: ["publicKey", "predicate", "balanceId"],
        unique: true,
      },
    ],
  },
);

Guard.belongsTo(Balance, {
  foreignKey: "balanceId",
  as: "balance",
});

export default Guard;
