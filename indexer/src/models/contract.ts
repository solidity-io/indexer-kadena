import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Balance from "./balance";

export interface ContractAttributes {
  id: number;
  chainId: number;
  type: string;
  module: string;
  metadata: object;
  tokenId: string;
  precision: number;
}

/**
 * Represents a contract in the blockchain.
 */
class Contract extends Model<ContractAttributes> implements ContractAttributes {
  /** The unique identifier for the contract record (e.g., 1). */
  declare id: number;

  /** The ID of the blockchain network (e.g., 8). */
  declare chainId: number;

  /** The type of the contract (e.g., "fungible or poly-fungible"). */
  declare type: string;

  /** The module associated with the contract (e.g., "marmalade.ledger"). */
  declare module: string;

  /** The metadata of the contract (e.g., {"hash":"DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM", "data":[{"hash":"xWBBpd0sOxaydYz6-ZGnGegwSAIwPPncZArLeo7Ph-4", "uri":{"data":"3d6daeb041bed67899b1a8e664ebd6f3059b8ba06735b651d471dd2e074a951d", "scheme":"https://kmc-assets.s3.amazonaws.com/assets/"}}]}). */
  declare metadata: object;

  /** The token ID associated with the contract (e.g., "t:DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM"). */
  declare tokenId: string;

  /** The precision of the contract (e.g., 12). */
  declare precision: number;
}

Contract.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "The unique identifier for the contract record (e.g., 1).",
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The ID of the blockchain network (e.g., 8).",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The type of the contract (e.g., 'fungible or poly-fungible').",
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The module associated with the contract (e.g., 'marmalade.ledger').",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "The metadata of the contract (e.g., {'hash':'DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM', 'data':[{'hash':'xWBBpd0sOxaydYz6-ZGnGegwSAIwPPncZArLeo7Ph-4', 'uri':{'data':'3d6daeb041bed67899b1a8e664ebd6f3059b8ba06735b651d471dd2e074a951d', 'scheme':'https://kmc-assets.s3.amazonaws.com/assets/'}}]}).",
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment:
        "The token ID associated with the contract (e.g., 't:DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM').",
    },
    precision: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "The precision of the contract (e.g., 12).",
    },
  },
  {
    sequelize,
    modelName: "Contract",
    indexes: [
      {
        name: "contract_unique_constraint",
        unique: true,
        fields: ["chainId", "module", "tokenId"],
      },
      {
        name: "contracts_search_idx",
        fields: [sequelize.fn("LOWER", sequelize.col("module"))],
      },
    ],
  },
);

export default Contract;
