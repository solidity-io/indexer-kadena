/**
 * Transfer Model Definition
 *
 * This module defines the Transfer model, which represents token transfers between accounts
 * in the Kadena blockchain. Transfers are the fundamental operations that move value between
 * blockchain addresses and are essential for tracking token ownership and flow.
 *
 * The model supports multiple transfer types:
 * 1. Fungible token transfers (standard coin/token movements)
 * 2. Poly-fungible token transfers (NFTs with unique token IDs)
 *
 * Transfers are linked to their originating transactions and associated contracts,
 * providing a comprehensive view of token movement throughout the blockchain ecosystem.
 */

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Transaction from './transaction';
import Contract from './contract';
import { gql, makeExtendSchemaPlugin } from 'postgraphile';

/**
 * Interface defining the attributes of a Transfer.
 * These attributes represent the essential properties of token transfers
 * as they are stored in the database.
 */
export interface TransferAttributes {
  /** Unique identifier for the transfer record */
  id: number;
  /** Reference to the transaction that contained this transfer */
  transactionId: number;
  /** Type of transfer: 'fungible' or 'poly-fungible' (NFT) */
  type: string;
  /** Amount of tokens transferred */
  amount: number;
  /** Chain ID where the transfer occurred */
  chainId: number;
  /** Account address that initiated the transfer */
  from_acct: string;
  /** Hash of the module that processed the transfer */
  modulehash: string;
  /** Name of the module/contract that processed the transfer */
  modulename: string;
  /** Unique request key identifying the transaction */
  requestkey: string;
  /** Account address that received the transfer */
  to_acct: string;
  /** Flag indicating whether this transfer involves a specific token ID (NFTs) */
  hasTokenId: boolean;
  /** Specific token ID for NFT transfers, undefined for fungible transfers */
  tokenId?: string;
  /** Reference to the associated contract record */
  contractId?: number;
  /** Flag indicating whether this is a canonical transfer record */
  canonical?: boolean;
  /** Index representing the order of the transfer within its transaction */
  orderIndex?: number;
}

/**
 * Represents a token transfer in the blockchain.
 *
 * Transfers track the movement of tokens between accounts, capturing
 * essential details like amount, sender, receiver, and associated token contract.
 */
class Transfer extends Model<TransferAttributes> implements TransferAttributes {
  /** The unique identifier for the transfer record (e.g., 1799984). */
  declare id: number;

  /** The ID of the associated transaction (e.g., 2022215). */
  declare transactionId: number;

  /** The type of the transfer (e.g., "fungible"). */
  declare type: string;

  /** The amount transferred (e.g., 0.0003112). */
  declare amount: number;

  /** The ID of the blockchain network (e.g., 0). */
  declare chainId: number;

  /** The account from which the transfer was made (e.g., "k:6fdc4bdbd5bd319466d7b83d85465d8a5a5546bf3b9aababb77aac7bb44241aa"). */
  declare from_acct: string;

  /** The hash of the module (e.g., "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"). */
  declare modulehash: string;

  /** The name of the module (e.g., "coin"). */
  declare modulename: string;

  /** The request key of the transfer (e.g., "y2XuhnGPkvptF-scYTnMfdcD2zokQf-HyOu-qngAm9s"). */
  declare requestkey: string;

  /** The account to which the transfer was made (e.g., "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"). */
  declare to_acct: string;

  /** Whether the transfer has a token ID (e.g., false). */
  declare hasTokenId: boolean;

  /** The token ID associated with the transfer (optional, e.g., "t:DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM"). */
  declare tokenId?: string;

  /** The ID of the associated contract (optional, e.g., 1). */
  declare contractId?: number;

  /* Whether the transfer is canonical */
  declare canonical?: boolean;

  /* The transfer order */
  declare orderIndex?: number;
}

/**
 * Initialize the Transfer model with its attributes and configuration.
 * This defines the database schema for the Transfers table and sets up indexes
 * for efficient querying of transfer data.
 *
 * The model includes multiple specialized indexes to optimize different query patterns:
 * - Simple indexes for common filter columns like type, contractId, and transactionId
 * - Composite indexes for account-based queries with module names
 * - Chain-specific account queries for filtering by chain ID
 *
 * These indexes support efficient lookups for account balance calculations,
 * transaction history retrieval, and token movement analysis.
 */
Transfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: 'The unique identifier for the transfer record (e.g., 1799984).',
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'The ID of the associated transaction (e.g., 2022215).',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The type of the transfer (e.g., 'fungible').",
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      comment: 'The amount transferred (e.g., 0.0003112).',
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'The ID of the blockchain network (e.g., 0).',
    },
    from_acct: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The account from which the transfer was made (e.g., 'k:6fdc4bdbd5bd319466d7b83d85465d8a5a5546bf3b9aababb77aac7bb44241aa').",
    },
    modulehash: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The hash of the module (e.g., 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s').",
    },
    modulename: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "The name of the module (e.g., 'coin').",
    },
    requestkey: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The request key of the transfer (e.g., 'y2XuhnGPkvptF-scYTnMfdcD2zokQf-HyOu-qngAm9s').",
    },
    to_acct: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "The account to which the transfer was made (e.g., 'k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa').",
    },
    hasTokenId: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the transfer has a token ID (e.g., true).',
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment:
        "The token ID associated with the transfer (optional, e.g., 't:DowR5LB9h6n96kxFRXDLSuSs1yh100Pk6STuUQNpseM').",
    },
    contractId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'The ID of the associated contract (optional, e.g., 1).',
    },
    canonical: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the transfer is canonical',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'The transfer order',
    },
  },
  {
    sequelize,
    modelName: 'Transfer',
    indexes: [
      {
        name: 'transfers_type_idx',
        fields: ['type'],
      },
      {
        name: 'transfers_transactionid_idx',
        fields: ['transactionId'],
      },
      {
        name: 'transfers_hasTokenId_idx',
        fields: ['hasTokenId'],
      },
      {
        name: 'transfers_contractid_idx',
        fields: ['contractId'],
      },
      {
        name: 'transfers_modulename_idx',
        fields: ['modulename'],
      },
      {
        name: 'transfers_from_acct_modulename_idx',
        fields: ['from_acct', 'modulename'],
      },
      {
        name: 'transfers_chainid_from_acct_modulename_idx',
        fields: ['chainId', 'from_acct', 'modulename'],
      },
      {
        name: 'transfers_chainid_to_acct_modulename_idx',
        fields: ['chainId', 'to_acct', 'modulename'],
      },
      {
        name: 'from_acct_idx',
        fields: ['from_acct'],
      },
      {
        name: 'to_acct_idx',
        fields: ['to_acct'],
      },
    ],
  },
);

/**
 * Define relationships between the Transfer model and other models.
 *
 * Transfers belong to:
 * 1. Transactions - Each transfer is part of a blockchain transaction
 * 2. Contracts - Each transfer involves a specific token contract
 *
 * These relationships enable efficient querying of related data,
 * such as retrieving all transfers for a transaction or finding
 * transfers involving a specific contract.
 */
Transfer.belongsTo(Transaction, {
  foreignKey: 'transactionId',
  as: 'transaction',
});

Transfer.belongsTo(Contract, {
  foreignKey: 'contractId',
  as: 'contract',
});

/**
 * GraphQL extension plugin for querying transfers by type.
 *
 * This plugin extends the GraphQL schema to provide a specialized
 * query for retrieving transfers filtered by their type (fungible or poly-fungible).
 * It includes cursor-based pagination support for handling large result sets efficiently.
 *
 * The resolver executes a raw SQL query for optimal performance when
 * filtering and paginating transfer records.
 */
export const transfersByTypeQueryPlugin = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      extend type Query {
        transfersByType(type: String!, first: Int, after: String): TransferConnection
      }

      type TransferConnection {
        edges: [TransferEdge]
        pageInfo: PageInfo
      }

      type TransferEdge {
        node: Transfer
        cursor: String
      }
    `,
    resolvers: {
      Query: {
        transfersByType: async (_query, args, context, resolveInfo) => {
          const { type, first, after } = args;
          const { rootPgPool } = context;

          let cursorCondition = '';
          const limit = first || 10;
          const values = [type, limit + 1];

          if (after) {
            cursorCondition = 'AND id > $3';
            values.push(Buffer.from(after, 'base64').toString('ascii'));
          }

          const query = `
            SELECT * FROM public."Transfers"
            WHERE "type" = $1
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
            cursor: Buffer.from(row.id.toString(), 'ascii').toString('base64'),
          }));

          const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

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
});

export default Transfer;
