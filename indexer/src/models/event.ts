import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Transaction from "./transaction";

export interface EventAttributes {
  id: number;
  transactionId: number;
  payloadHash: string;
  chainId: number;
  module: string;
  modulehash: string;
  name: string;
  params: object;
  paramtext: object;
  qualname: string;
  requestkey: string;
}

/**
 * Represents an event emitted by a transaction in the blockchain.
 */
class Event extends Model<EventAttributes> implements EventAttributes {
  /** The unique identifier for the event record (e.g., 5985644). */
  declare id: number;

  /** The ID of the associated transaction (e.g., 4134355). */
  declare transactionId: number;

  /** The payload hash of the event (e.g., "3NzEURi0GMMMEwbAbNMrjAwoPR7hDwLROe5aLityoBo"). */
  declare payloadHash: string;

  /** The ID of the blockchain network (e.g., 0). */
  declare chainId: number;

  /** The module associated with the event (e.g., "coin"). */
  declare module: string;

  /** The hash of the module (e.g., "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"). */
  declare modulehash: string;

  /** The name of the event (e.g., "TRANSFER"). */
  declare name: string;

  /** The parameters of the event (e.g., ["k:ec48fcadd0649a4230800668ca5bb17d1a91f14daf87a56cb954964055994031", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.000969]). */
  declare params: object;

  /** The text representation of the parameters (e.g., ["k:ec48fcadd0649a4230800668ca5bb17d1a91f14daf87a56cb954964055994031", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.000969]). */
  declare paramtext: object;

  /** The qualified name of the event (e.g., "coin"). */
  declare qualname: string;

  /** The request key of the event (e.g., "vyL1rMR_qbkoi8yUW3ktEeBU9XzdWSEaoe1GdPLL3j4"). */
  declare requestkey: string;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, comment: "The unique identifier for the event record (e.g., 5985644)." },
    transactionId: { type: DataTypes.INTEGER, allowNull: true, comment: "The ID of the associated transaction (e.g., 4134355)." },
    payloadHash: { type: DataTypes.STRING, allowNull: false, comment: "The payload hash of the event (e.g., '3NzEURi0GMMMEwbAbNMrjAwoPR7hDwLROe5aLityoBo')." },
    chainId: { type: DataTypes.INTEGER, allowNull: false, comment: "The ID of the blockchain network (e.g., 0)." },
    module: { type: DataTypes.STRING, allowNull: false, comment: "The module associated with the event (e.g., 'coin')." },
    modulehash: { type: DataTypes.STRING, allowNull: false, comment: "The hash of the module (e.g., 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s')." },
    name: { type: DataTypes.STRING, allowNull: false, comment: "The name of the event (e.g., 'TRANSFER')." },
    params: { type: DataTypes.JSONB, allowNull: false, comment: "The parameters of the event (e.g., ['k:ec48fcadd0649a4230800668ca5bb17d1a91f14daf87a56cb954964055994031', 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3', 0.000969])." },
    paramtext: { type: DataTypes.JSONB, allowNull: false, comment: "The text representation of the parameters (e.g., ['k:ec48fcadd0649a4230800668ca5bb17d1a91f14daf87a56cb954964055994031', 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3', 0.000969])." },
    qualname: { type: DataTypes.STRING, allowNull: false, comment: "The qualified name of the event (e.g., 'coin')." },
    requestkey: { type: DataTypes.STRING, allowNull: false, comment: "The request key of the event (e.g., 'vyL1rMR_qbkoi8yUW3ktEeBU9XzdWSEaoe1GdPLL3j4')." },
  },
  {
    sequelize,
    modelName: "Event",
    indexes: [
      {
        name: "events_transactionid_idx",
        fields: ["transactionId"],
      },
    ],
  }
);

Event.belongsTo(Transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

export default Event;
