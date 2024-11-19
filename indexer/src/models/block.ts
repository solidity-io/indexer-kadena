import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { gql, makeExtendSchemaPlugin } from "postgraphile";

export interface BlockAttributes {
  id: number;
  nonce: string;
  creationTime: bigint;
  parent: string;
  adjacents: object;
  target: string;
  payloadHash: string;
  chainId: number;
  weight: string;
  height: number;
  chainwebVersion: string;
  epochStart: bigint | null;
  featureFlags: number;
  hash: string;
  minerData: object;
  transactionsHash: string;
  outputsHash: string;
  coinbase: object;
  canonical?: boolean;
  transactionsCount: number;
}

class Block extends Model<BlockAttributes> implements BlockAttributes {
  /** The unique identifier for the block record. */
  declare id: number;

  /** The nonce of the block (e.g., "11598205990112090821"). */
  declare nonce: string;

  /** The creation time of the block (e.g., 1718887955748100). */
  declare creationTime: bigint;

  /** The parent block hash (e.g., "2Zw0pONGUoyYmlKi-F0o_-ak2hKKlg1Mmc9ab6BjATY"). */
  declare parent: string;

  /** The adjacent blocks (e.g., {"1": "Cgtf12fKCSm3X1E5Cwi83q4yOZ2zG1HRLhBaPCfTw_4", "15": "SC9Lfee_7Ggl7B0QVOEtgZuU6hsabxqrF5MYyGvapSg", "17": "Cc049gy1pCd2E-3NcqWFuQicOLh-uRbivSLXFYa9LtU"}). */
  declare adjacents: object;

  /** The target of the block (e.g., "o2YaicN3y58DkvsmCDKR88KqPwLPG5EADwAAAAAAAAA"). */
  declare target: string;

  /** The payload hash of the block (e.g., "cs5s_XSSro1mvtruns3LIRw5a-3mb6tui4PwrEIp8fI"). */
  declare payloadHash: string;

  /** The ID of the blockchain network (e.g., 16). */
  declare chainId: number;

  /** The weight of the block (e.g., "WNim1Xw26HgDNwEAAAAAAAAAAAAAAAAAAAAAAAAAAAA"). */
  declare weight: string;

  /** The height of the block (e.g., 4881163). */
  declare height: number;

  /** The version of the chainweb protocol (e.g., "mainnet01"). */
  declare chainwebVersion: string;

  /** The epoch start time of the block (e.g., 1718886629458176). */
  declare epochStart: bigint;

  /** The feature flags of the block (e.g., 0). */
  declare featureFlags: number;

  /** The hash of the block (e.g., "XZXKrN7DzWnzEX2oZp5HOjr6R0zapn-XxtsYOdtfYFY"). */
  declare hash: string;

  /** The miner data of the block (e.g., {"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}). */
  declare minerData: object;

  /** The transactions hash of the block (e.g., "9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM"). */
  declare transactionsHash: string;

  /** The outputs hash of the block (e.g., "DwI3H4FgR5iC-AZ-f_BV8oYxH4yrz6ed-o5jvDAlVLE"). */
  declare outputsHash: string;

  /** The coinbase data of the block (e.g., {"gas": 0, "logs": "xHwiHPh-CY_sc6xbTFuhXOWybRSzlJ_NVSGQTL4ady0", "txId": 4457873, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.983026]}]}). */
  declare coinbase: object;

  /** Whether the block is canonical or not, if true then the block represents the main chain. */
  declare canonical?: boolean;

  /** The number of transactions in the block. */
  declare transactionsCount: number;
}

Block.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "The unique identifier for the block record.",
    },
    nonce: {
      type: DataTypes.STRING,
      comment: "The nonce of the block (e.g., '11598205990112090821').",
    },
    creationTime: {
      type: DataTypes.BIGINT,
      comment: "The creation time of the block (e.g., 1718887955748100).",
    },
    parent: {
      type: DataTypes.STRING,
      comment:
        "The parent block hash (e.g., '2Zw0pONGUoyYmlKi-F0o_-ak2hKKlg1Mmc9ab6BjATY').",
    },
    adjacents: {
      type: DataTypes.JSONB,
      comment:
        "The adjacent blocks (e.g., {'1': 'Cgtf12fKCSm3X1E5Cwi83q4yOZ2zG1HRLhBaPCfTw_4', '15': 'SC9Lfee_7Ggl7B0QVOEtgZuU6hsabxqrF5MYyGvapSg', '17': 'Cc049gy1pCd2E-3NcqWFuQicOLh-uRbivSLXFYa9LtU'}).",
    },
    target: {
      type: DataTypes.STRING,
      comment:
        "The target of the block (e.g., 'o2YaicN3y58DkvsmCDKR88KqPwLPG5EADwAAAAAAAAA').",
    },
    payloadHash: {
      type: DataTypes.STRING,
      comment:
        "The payload hash of the block (e.g., 'cs5s_XSSro1mvtruns3LIRw5a-3mb6tui4PwrEIp8fI').",
    },
    chainId: {
      type: DataTypes.INTEGER,
      comment: "The ID of the blockchain network (e.g., 16).",
    },
    weight: {
      type: DataTypes.STRING,
      comment:
        "The weight of the block (e.g., 'WNim1Xw26HgDNwEAAAAAAAAAAAAAAAAAAAAAAAAAAAA').",
    },
    height: {
      type: DataTypes.INTEGER,
      comment: "The height of the block (e.g., 4881163).",
    },
    chainwebVersion: {
      type: DataTypes.STRING,
      comment: "The version of the chainweb protocol (e.g., 'mainnet01').",
    },
    epochStart: {
      type: DataTypes.BIGINT,
      comment: "The epoch start time of the block (e.g., 1718886629458176).",
    },
    featureFlags: {
      type: DataTypes.INTEGER,
      comment: "The feature flags of the block (e.g., 0).",
    },
    hash: {
      type: DataTypes.STRING,
      comment:
        "The hash of the block (e.g., 'XZXKrN7DzWnzEX2oZp5HOjr6R0zapn-XxtsYOdtfYFY').",
    },
    minerData: {
      type: DataTypes.JSONB,
      comment:
        "The miner data of the block (e.g., {'account': 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3', 'predicate': 'keys-all', 'public-keys': ['e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3']}).",
    },
    transactionsHash: {
      type: DataTypes.STRING,
      comment:
        "The transactions hash of the block (e.g., '9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM').",
    },
    outputsHash: {
      type: DataTypes.STRING,
      comment:
        "The outputs hash of the block (e.g., 'DwI3H4FgR5iC-AZ-f_BV8oYxH4yrz6ed-o5jvDAlVLE').",
    },
    coinbase: {
      type: DataTypes.JSONB,
      comment:
        "The coinbase data of the block (e.g., {'gas': 0, 'logs': 'xHwiHPh-CY_sc6xbTFuhXOWybRSzlJ_NVSGQTL4ady0', 'txId': 4457873, 'events': [{'name': 'TRANSFER', 'module': {'name': 'coin', 'namespace': null}, 'params': ['', 'k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3', 0.983026]}]}).",
    },
    canonical: {
      type: DataTypes.BOOLEAN,
      comment: "Indicates whether the transaction is canonical.",
    },
    transactionsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "The number of transactions in the block.",
    },
  },
  {
    sequelize,
    modelName: "Block",
    indexes: [
      {
        name: "blocks_chainwebVersion_chainid_hash_unique_idx",
        unique: true,
        fields: ["chainwebVersion", "chainId", "hash"],
      },
      {
        name: "blocks_height_idx",
        fields: ["height"],
      },
      {
        name: "blocks_chainid_height_idx",
        fields: ["chainId", "height"],
      },
      {
        name: "blocks_chainid_idx",
        fields: ["chainId"],
      },
      {
        name: "blocks_canonical_idx",
        fields: ["canonical"],
      },
      // Search indexes
      {
        name: "blocks_trgm_parent_idx",
        fields: [sequelize.fn("LOWER", sequelize.col("parent"))],
        using: "gin",
        operator: "gin_trgm_ops",
      },
    ],
  },
);

export const blockQueryPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Query {
        blockByHeight(height: Int!, chainId: Int!): Block
        searchAll(
          searchTerm: String!
          limit: Int!
          heightFilter: Int
        ): SearchAllResult
      }

      type SearchAllResult {
        blocks: [Block]
        transactions: [Transaction]
        addresses: [Balance]
        tokens: [Contract]
      }
    `,
    resolvers: {
      Query: {
        blockByHeight: async (_query, args, context, resolveInfo) => {
          const { height, chainId } = args;
          const { rootPgPool } = context;
          const { rows } = await rootPgPool.query(
            `SELECT * FROM public."Blocks" WHERE height = $1 AND "chainId" = $2`,
            [height, chainId],
          );
          return rows[0];
        },
        searchAll: async (_query, args, context, resolveInfo) => {
          const { searchTerm, limit, heightFilter } = args;
          const { rootPgPool } = context;

          const blocksQuery = `
          SELECT * FROM public."Blocks" WHERE LOWER(hash) = LOWER($1) 
          UNION ALL
          SELECT * FROM public."Blocks" WHERE LOWER(parent) = LOWER($1) 
          UNION ALL
          SELECT * FROM public."Blocks" WHERE LOWER("payloadHash") = LOWER($1) 
          UNION ALL
          SELECT * FROM public."Blocks" WHERE LOWER("transactionsHash") = LOWER($1) 
          UNION ALL
          SELECT * FROM public."Blocks" WHERE LOWER("outputsHash") = LOWER($1) 
          UNION ALL
          SELECT * FROM public."Blocks" WHERE height = $3
          LIMIT $2;
        `;

          const transactionsQuery = `
          SELECT * FROM public."Transactions" WHERE LOWER(requestkey) = LOWER($1)
          UNION ALL
          SELECT * FROM public."Transactions" WHERE LOWER(txid) = LOWER($1)
          UNION ALL
          SELECT * FROM public."Transactions" WHERE LOWER(pactid) = LOWER($1)
          UNION ALL
          SELECT * FROM public."Transactions" WHERE LOWER(sender) = LOWER($1)
          LIMIT $2;
        `;

          const addressesQuery = `
          SELECT DISTINCT account, module, qualname, network, -1 as "chainId"
          FROM public."Balances"
          WHERE LOWER(account) = LOWER($1)
          ORDER BY account ASC
          LIMIT $2
        `;

          const tokensQuery = `
          SELECT DISTINCT network, type, module, precision, -1 as "chainId" 
          FROM public."Contracts"
          WHERE (type = 'fungible' OR type = 'poly-fungible')
            AND LOWER(module) LIKE LOWER($1)
          LIMIT $2
        `;

          const [blocks, transactions, addresses, tokens] = await Promise.all([
            rootPgPool.query(blocksQuery, [
              `${searchTerm}`,
              limit,
              heightFilter,
            ]),
            rootPgPool.query(transactionsQuery, [`${searchTerm}`, limit]),
            rootPgPool.query(addressesQuery, [`${searchTerm}`, limit]),
            rootPgPool.query(tokensQuery, [`%${searchTerm}%`, limit]),
          ]);

          return {
            blocks: blocks.rows,
            transactions: transactions.rows,
            addresses: addresses.rows,
            tokens: tokens.rows,
          };
        },
      },
    },
  };
});

export default Block;
