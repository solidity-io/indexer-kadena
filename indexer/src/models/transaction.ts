import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Block from "./block";
import { gql, makeExtendSchemaPlugin } from "postgraphile";

export interface TransactionAttributes {
  id: number;
  blockId: number;
  payloadHash: string;
  chainId: number;
  code: object;
  continuation: object;
  creationtime: string;
  data: object;
  gas: string;
  gaslimit: string;
  gasprice: string;
  hash: string;
  result: object;
  logs: object;
  metadata: object;
  nonce: string;
  num_events: number;
  pactid: string;
  proof: string;
  requestkey: string;
  rollback: boolean;
  sender: string;
  sigs: object;
  step: number;
  ttl: string;
  txid: string;
}

class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes {
  declare id: number;
  declare blockId: number;
  declare result: object;
  declare payloadHash: string;
  declare chainId: number;
  declare code: object;
  declare continuation: object;
  declare creationtime: string;
  declare data: object;
  declare gas: string;
  declare gaslimit: string;
  declare gasprice: string;
  declare hash: string;
  declare logs: object;
  declare metadata: object;
  declare nonce: string;
  declare num_events: number;
  declare pactid: string;
  declare proof: string;
  declare requestkey: string;
  declare rollback: boolean;
  declare sender: string;
  declare sigs: object;
  declare step: number;
  declare ttl: string;
  declare txid: string;
}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    blockId: { type: DataTypes.INTEGER, allowNull: true },
    payloadHash: { type: DataTypes.STRING },
    chainId: { type: DataTypes.INTEGER },
    code: { type: DataTypes.JSONB },
    continuation: { type: DataTypes.JSONB },
    creationtime: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB },
    gas: { type: DataTypes.STRING },
    gaslimit: { type: DataTypes.STRING },
    gasprice: { type: DataTypes.STRING },
    hash: { type: DataTypes.STRING },
    result: { type: DataTypes.JSONB },
    logs: { type: DataTypes.JSONB },
    metadata: { type: DataTypes.JSONB },
    nonce: { type: DataTypes.STRING },
    num_events: { type: DataTypes.INTEGER },
    pactid: { type: DataTypes.STRING },
    proof: { type: DataTypes.STRING },
    requestkey: { type: DataTypes.STRING },
    rollback: { type: DataTypes.BOOLEAN },
    sender: { type: DataTypes.STRING },
    sigs: { type: DataTypes.JSONB },
    step: { type: DataTypes.INTEGER },
    ttl: { type: DataTypes.STRING },
    txid: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Transaction",
    indexes: [
      {
        name: "requestkey_index",
        fields: ["requestkey"],
      },
      {
        name: "blockId_index",
        fields: ["blockId"],
      },
    ],
  }
);

Transaction.belongsTo(Block, {
  foreignKey: "blockId",
});

export const transactionByRequestKeyQueryPlugin = makeExtendSchemaPlugin(
  (build) => {
    return {
      typeDefs: gql`
        extend type Query {
          transactionByRequestKey(requestkey: String!, eventLimit: Int, transferLimit: Int): TransactionData
        }

        type TransactionData {
          transaction: Transaction
          events: [Event]
          transfers: [TransferData]
        }

        type TransferData  {
          transfer: Transfer
          contract: Contract
        }
      `,
      resolvers: {
        Query: {
          transactionByRequestKey: async (
            _query,
            args,
            context,
            resolveInfo
          ) => {
            const { requestkey, eventLimit, transferLimit } = args;
            const { rootPgPool } = context;

            const { rows: transactions } = await rootPgPool.query(
              `SELECT * FROM public."Transactions" WHERE requestkey = $1`,
              [requestkey]
            );

            if (transactions.length === 0) {
              return null;
            }

            const transaction = transactions[0];

            const eventLimitClause = eventLimit ? `LIMIT $2` : '';
            const eventQueryParams = eventLimit ? [transaction.id, eventLimit] : [transaction.id];
            const { rows: events } = await rootPgPool.query(
              `SELECT * FROM public."Events" WHERE "transactionId" = $1 ${eventLimitClause}`,
              eventQueryParams
            );

            const transferLimitClause = transferLimit ? `LIMIT $2` : '';
            const transferQueryParams = transferLimit ? [transaction.id, transferLimit] : [transaction.id];
            const { rows: transfers } = await rootPgPool.query(
              `SELECT * FROM public."Transfers" WHERE "transactionId" = $1 ${transferLimitClause}`,
              transferQueryParams,
            );

            const transferDataPromises = transfers.map(async (transfer: any) => {
              let contract = null;
              transfer.toAcct = transfer.to_acct;
              transfer.fromAcct = transfer.from_acct;
              if (transfer.contractId) {
                const { rows: contracts } = await rootPgPool.query(
                  `SELECT * FROM public."Contracts" WHERE id = $1`,
                  [transfer.contractId]
                );
                contract = contracts.length > 0 ? contracts[0] : null;
              }

              return {
                transfer,
                contract,
              };
            });

            const transferData = await Promise.all(transferDataPromises);

            transaction.numEvents = events.length;

            return {
              transaction,
              events,
              transfers: transferData,
            };
          }
        },
      },
    };
  }
);

export const transactionsByBlockIdQueryPlugin = makeExtendSchemaPlugin(
  (build) => {
    return {
      typeDefs: gql`
        extend type Query {
          transactionsByBlockId(
            blockId: Int!
            first: Int
            after: String
          ): TransactionConnection
        }

        type TransactionConnection {
          edges: [TransactionEdge]
          pageInfo: PageInfo
        }

        type TransactionEdge {
          node: Transaction
          cursor: String
        }
      `,
      resolvers: {
        Query: {
          transactionsByBlockId: async (_query, args, context, resolveInfo) => {
            const { blockId, first, after } = args;
            const { rootPgPool } = context;

            let cursorCondition = "";
            const limit = first || 10;
            const values = [blockId, limit + 1];

            if (after) {
              cursorCondition = "AND id > $3";
              values.push(Buffer.from(after, "base64").toString("ascii"));
            }

            const query = `
            SELECT * FROM public."Transactions"
            WHERE "blockId" = $1
            ${cursorCondition}
            ORDER BY id
            LIMIT $2
          `;

            const { rows } = await rootPgPool.query(query, values);

            const hasNextPage = rows.length > limit;
            if (hasNextPage) {
              rows.pop();
            }

            const edges = rows.map((row: any) => ({
              node: row,
              cursor: Buffer.from(row.id.toString(), "ascii").toString(
                "base64"
              ),
            }));

            const endCursor =
              edges.length > 0 ? edges[edges.length - 1].cursor : null;

            return {
              edges,
              pageInfo: {
                endCursor,
                hasNextPage,
              },
            };
          },
        },
      },
    };
  }
);

export default Transaction;
