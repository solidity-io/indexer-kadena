/**
 * GraphQL Types for the Kadena Indexer
 *
 * This file contains all the TypeScript type definitions that correspond to the GraphQL schema
 * used in the Kadena blockchain indexer. These types are generated from the GraphQL schema using
 * a code generator and should not be manually edited.
 *
 * The file defines:
 * 1. Scalar types (ID, String, Boolean, BigInt, DateTime, Decimal)
 * 2. Object types representing blockchain entities (Block, Transaction, Event, Transfer, etc.)
 * 3. Connection types for pagination (following the Relay cursor connection spec)
 * 4. Input types for queries and filtering
 * 5. Resolver types for implementing the GraphQL resolvers
 *
 * The schema supports a rich query interface for the Kadena blockchain, including:
 * - Block queries by hash, height, and depth
 * - Transaction queries with various filters
 * - Event and transfer tracking
 * - Account information for both fungible and non-fungible tokens
 * - Guard (security predicate) information
 *
 * This type system forms the backbone of the GraphQL API and ensures
 * type safety throughout the application.
 *
 * File Structure Overview:
 *
 * 1. Type Utility Definitions (lines ~20-40): Helper types for TypeScript type manipulations
 *    such as Maybe, InputMaybe, Exact, etc., which enhance type safety and handle nullable fields.
 *
 * 2. Scalar Definitions (lines ~40-55): Define basic data types used throughout the schema
 *    including custom scalars for blockchain-specific data types like BigInt and Decimal.
 *
 * 3. Core Blockchain Entity Types (lines ~55-250): Type definitions for fundamental
 *    blockchain entities such as Block, Event, Transaction, etc., representing the core
 *    data structures of the Kadena blockchain.
 *
 * 4. Fungible Token Types (lines ~250-350): Type definitions for fungible tokens, accounts,
 *    and related connections, handling cryptocurrency-like tokens with divisible values.
 *
 * 5. Non-Fungible Token Types (lines ~350-450): Type definitions for NFT tokens, accounts,
 *    and related connections, supporting unique digital assets.
 *
 * 6. Query Interface Types (lines ~450-500): Type definitions for the GraphQL query interface,
 *    allowing clients to retrieve data from the indexer with various filters and pagination.
 *
 * TODO: I've stopped here and set this todo to breadk down this file into smaller files, because it's too big to handle.
 */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date };
  /** Floats that will have a value of 0 or more. */
  Decimal: { input: any; output: any };
};

/** A unit of information that stores a set of verified transactions. */
export type Block = Node & {
  __typename?: 'Block';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The difficulty of the block. */
  difficulty: Scalars['BigInt']['output'];
  /** The moment the difficulty is adjusted to maintain a block validation time of 30 seconds. */
  epoch: Scalars['DateTime']['output'];
  /** Default page size is 20. */
  events: BlockEventsConnection;
  flags: Scalars['Decimal']['output'];
  hash: Scalars['String']['output'];
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  minerAccount: FungibleChainAccount;
  neighbors: Array<BlockNeighbor>;
  nonce: Scalars['Decimal']['output'];
  parent?: Maybe<Block>;
  payloadHash: Scalars['String']['output'];
  /** The proof of work hash. */
  powHash: Scalars['String']['output'];
  target: Scalars['String']['output'];
  /** Default page size is 20. */
  transactions: BlockTransactionsConnection;
  weight: Scalars['String']['output'];
};

/** A unit of information that stores a set of verified transactions. */
export type BlockEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** A unit of information that stores a set of verified transactions. */
export type BlockTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Connection type for paginated block events
 * Contains edges, pagination info, and total count of events in a block
 */
export type BlockEventsConnection = {
  __typename?: 'BlockEventsConnection';
  edges: Array<BlockEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for BlockEventsConnection
 * Contains a cursor for pagination and the event node
 */
export type BlockEventsConnectionEdge = {
  __typename?: 'BlockEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

/**
 * The neighbor of a block.
 * Represents an adjacent block in the blockchain with its chain ID and hash
 */
export type BlockNeighbor = {
  __typename?: 'BlockNeighbor';
  chainId: Scalars['String']['output'];
  hash: Scalars['String']['output'];
};

/**
 * Connection type for paginated block transactions
 * Contains edges, pagination info, and total count of transactions in a block
 */
export type BlockTransactionsConnection = {
  __typename?: 'BlockTransactionsConnection';
  edges: Array<BlockTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for BlockTransactionsConnection
 * Contains a cursor for pagination and the transaction node
 */
export type BlockTransactionsConnectionEdge = {
  __typename?: 'BlockTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * The payload of a continuation transaction.
 * Contains data and metadata for continuing multi-step transactions across chains
 */
export type ContinuationPayload = {
  __typename?: 'ContinuationPayload';
  /** The environment data made available to the transaction. Formatted as raw JSON. */
  data: Scalars['String']['output'];
  /** A unique id when a pact (defpact) is initiated. See the "Pact execution scope and pact-id" explanation in the docs for more information. */
  pactId?: Maybe<Scalars['String']['output']>;
  /** The proof provided to continue the cross-chain transaction. */
  proof?: Maybe<Scalars['String']['output']>;
  /** Whether or not this transaction can be rolled back. */
  rollback?: Maybe<Scalars['Boolean']['output']>;
  /** The step-number when this is an execution of a `defpact`, aka multi-step transaction. */
  step?: Maybe<Scalars['Int']['output']>;
};

/**
 * An event emitted by the execution of a smart-contract function.
 * Contains all metadata about the event, including block, chain, module, parameters, etc.
 */
export type Event = Node & {
  __typename?: 'Event';
  block: Block;
  chainId: Scalars['BigInt']['output'];
  /** The height of the block where the event was emitted. */
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  moduleName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** The order index of this event, in the case that there are multiple events in one transaction. */
  orderIndex: Scalars['BigInt']['output'];
  parameterText: Scalars['String']['output'];
  parameters?: Maybe<Scalars['String']['output']>;
  /** The full eventname, containing module and eventname, e.g. coin.TRANSFER */
  qualifiedName: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
};

/**
 * The payload of an exec transaction.
 * Contains the Pact code and environment data for the transaction
 */
export type ExecutionPayload = {
  __typename?: 'ExecutionPayload';
  /** The Pact expressions executed in this transaction when it is an `exec` transaction. */
  code?: Maybe<Scalars['String']['output']>;
  /** The environment data made available to the transaction. Formatted as raw JSON. */
  data: Scalars['String']['output'];
};

/**
 * A fungible-specific account.
 * Represents an account with fungible token holdings across multiple chains
 */
export type FungibleAccount = Node & {
  __typename?: 'FungibleAccount';
  accountName: Scalars['String']['output'];
  /**
   * Uses "length" multiplier which scales with the number of items in the returned array.
   * Each chain account requires a separate database lookup, so complexity = 5 × array_length.
   * Example: 3 chain accounts = 5 × 3 = 15 complexity points.
   * This pattern is ideal for array fields where complexity scales linearly with result size.
   */
  chainAccounts: Array<FungibleChainAccount>;
  fungibleName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  totalBalance: Scalars['Decimal']['output'];
  /**
   * Default page size is 20.
   * Uses "first" multiplier to control pagination complexity.
   * Transactions are expensive operations requiring joins, so base value is higher.
   * Example: requesting 20 transactions = 10 × 20 = 200 complexity points.
   */
  transactions: FungibleAccountTransactionsConnection;
  transfers: FungibleAccountTransfersConnection;
};

/**
 * Arguments for FungibleAccount transactions query
 * Controls pagination of transactions related to a fungible account
 */
export type FungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Arguments for FungibleAccount transfers query
 * Controls pagination of transfers related to a fungible account
 */
export type FungibleAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Connection type for paginated fungible account transactions
 * Contains edges, pagination info, and total count of transactions
 */
export type FungibleAccountTransactionsConnection = {
  __typename?: 'FungibleAccountTransactionsConnection';
  edges: Array<FungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for FungibleAccountTransactionsConnection
 * Contains a cursor for pagination and the transaction node
 */
export type FungibleAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * Connection type for paginated fungible account transfers
 * Contains edges, pagination info, and total count of transfers
 */
export type FungibleAccountTransfersConnection = {
  __typename?: 'FungibleAccountTransfersConnection';
  edges: Array<FungibleAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for FungibleAccountTransfersConnection
 * Contains a cursor for pagination and the transfer node
 */
export type FungibleAccountTransfersConnectionEdge = {
  __typename?: 'FungibleAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/**
 * A fungible specific chain-account.
 * Represents an account's fungible token balance on a specific chain
 */
export type FungibleChainAccount = Node & {
  __typename?: 'FungibleChainAccount';
  accountName: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  chainId: Scalars['String']['output'];
  fungibleName: Scalars['String']['output'];
  guard: IGuard;
  id: Scalars['ID']['output'];
  /** Transactions that the current account is sender of. Default page size is 20. */
  transactions: FungibleChainAccountTransactionsConnection;
  /** Default page size is 20. */
  transfers: FungibleChainAccountTransfersConnection;
};

/**
 * Arguments for FungibleChainAccount transactions query
 * Controls pagination of transactions related to a fungible chain account
 */
export type FungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Arguments for FungibleChainAccount transfers query
 * Controls pagination of transfers related to a fungible chain account
 */
export type FungibleChainAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Connection type for paginated fungible chain account transactions
 * Contains edges, pagination info, and total count of transactions
 */
export type FungibleChainAccountTransactionsConnection = {
  __typename?: 'FungibleChainAccountTransactionsConnection';
  edges: Array<FungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for FungibleChainAccountTransactionsConnection
 * Contains a cursor for pagination and the transaction node
 */
export type FungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * Connection type for paginated fungible chain account transfers
 * Contains edges, pagination info, and total count of transfers
 */
export type FungibleChainAccountTransfersConnection = {
  __typename?: 'FungibleChainAccountTransfersConnection';
  edges: Array<FungibleChainAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for FungibleChainAccountTransfersConnection
 * Contains a cursor for pagination and the transfer node
 */
export type FungibleChainAccountTransfersConnectionEdge = {
  __typename?: 'FungibleChainAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/**
 * Gas limit estimation for a transaction
 * Contains details about the estimated gas required for a transaction
 */
export type GasLimitEstimation = {
  __typename?: 'GasLimitEstimation';
  amount: Scalars['Int']['output'];
  inputType: Scalars['String']['output'];
  transaction: Scalars['String']['output'];
  usedPreflight: Scalars['Boolean']['output'];
  usedSignatureVerification: Scalars['Boolean']['output'];
};

/**
 * Genesis height information for a chain
 * Represents the initial block height for a specific chain
 */
export type GenesisHeight = {
  __typename?: 'GenesisHeight';
  chainId: Scalars['String']['output'];
  height: Scalars['Int']['output'];
};

/**
 * General information about the graph and chainweb-data.
 * Contains configuration details for the GraphQL API and indexer
 */
export type GraphConfiguration = {
  __typename?: 'GraphConfiguration';
  /** The lowest block-height that is indexed in this endpoint. */
  minimumBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** The version of the graphl api. */
  version: Scalars['String']['output'];
};

/**
 * A guard interface representing security predicates in Kadena
 * Can be implemented by different guard types (e.g., KeysetGuard)
 */
export type IGuard = {
  /** @deprecated deprecated, use KeysetGuard.keys */
  keys: Array<Scalars['String']['output']>;
  /** @deprecated deprecated, use KeysetGuard.predicate */
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/**
 * A keyset guard implementation of IGuard
 * Represents a set of public keys and a predicate for authorization
 */
export type KeysetGuard = IGuard & {
  __typename?: 'KeysetGuard';
  keys: Array<Scalars['String']['output']>;
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/**
 * Information about the Kadena network.
 * Contains network statistics, configuration, and status information
 */
export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  /** The version of the API. */
  apiVersion: Scalars['String']['output'];
  /** The number of circulating coins. */
  coinsInCirculation: Scalars['Float']['output'];
  genesisHeights: Array<GenesisHeight>;
  /** The network hash rate. */
  networkHashRate: Scalars['Float']['output'];
  /** The host of the network. */
  networkHost: Scalars['String']['output'];
  /** The ID of the network. */
  networkId: Scalars['String']['output'];
  nodeBlockDelay: Scalars['Int']['output'];
  nodeChains: Array<Scalars['String']['output']>;
  nodeLatestBehaviorHeight: Scalars['Int']['output'];
  nodePackageVersion: Scalars['String']['output'];
  nodeServiceDate: Scalars['DateTime']['output'];
  numberOfChains: Scalars['Int']['output'];
  /** The total difficulty. */
  totalDifficulty: Scalars['Float']['output'];
  /** The total number of transactions. */
  transactionCount: Scalars['Int']['output'];
};

/**
 * Interface for entities with a unique identifier
 * Base interface implemented by most entity types in the schema
 */
export type Node = {
  id: Scalars['ID']['output'];
};

/**
 * A non-fungible-specific account.
 * Represents an account with non-fungible token (NFT) holdings across multiple chains
 */
export type NonFungibleAccount = Node & {
  __typename?: 'NonFungibleAccount';
  accountName: Scalars['String']['output'];
  chainAccounts: Array<NonFungibleChainAccount>;
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  /** Default page size is 20. Note that custom token related transactions are not included. */
  transactions: NonFungibleAccountTransactionsConnection;
};

/**
 * Arguments for NonFungibleAccount transactions query
 * Controls pagination of transactions related to a non-fungible account
 */
export type NonFungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Connection type for paginated non-fungible account transactions
 * Contains edges, pagination info, and total count of transactions
 */
export type NonFungibleAccountTransactionsConnection = {
  __typename?: 'NonFungibleAccountTransactionsConnection';
  edges: Array<NonFungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for NonFungibleAccountTransactionsConnection
 * Contains a cursor for pagination and the transaction node
 */
export type NonFungibleAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * A chain and non-fungible-specific account.
 * Represents an account's non-fungible token holdings on a specific chain
 */
export type NonFungibleChainAccount = Node & {
  __typename?: 'NonFungibleChainAccount';
  accountName: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  /** Default page size is 20. Note that custom token related transactions are not included. */
  transactions: NonFungibleChainAccountTransactionsConnection;
};

/**
 * Arguments for NonFungibleChainAccount transactions query
 * Controls pagination of transactions related to a non-fungible chain account
 */
export type NonFungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Connection type for paginated non-fungible chain account transactions
 * Contains edges, pagination info, and total count of transactions
 */
export type NonFungibleChainAccountTransactionsConnection = {
  __typename?: 'NonFungibleChainAccountTransactionsConnection';
  edges: Array<NonFungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for NonFungibleChainAccountTransactionsConnection
 * Contains a cursor for pagination and the transaction node
 */
export type NonFungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * Information related to a non-fungible token.
 * Contains details about an NFT collection such as supply and URI
 */
export type NonFungibleToken = {
  __typename?: 'NonFungibleToken';
  precision: Scalars['Int']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
};

/**
 * The token identifier and its balance.
 * Represents a specific NFT token balance for an account on a chain
 */
export type NonFungibleTokenBalance = Node & {
  __typename?: 'NonFungibleTokenBalance';
  accountName: Scalars['String']['output'];
  balance: Scalars['Int']['output'];
  chainId: Scalars['String']['output'];
  guard: IGuard;
  id: Scalars['ID']['output'];
  info?: Maybe<NonFungibleToken>;
  tokenId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

/**
 * Input type for a Pact query
 * Specifies the chain, code, and data for executing a Pact query
 */
export type PactQuery = {
  chainId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  data?: InputMaybe<Array<PactQueryData>>;
};

/**
 * Key-value pair for Pact query data
 * Used to pass environment data to a Pact query
 */
export type PactQueryData = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/**
 * Response from a Pact query
 * Contains the result or error from executing a Pact query
 */
export type PactQueryResponse = {
  __typename?: 'PactQueryResponse';
  chainId: Scalars['String']['output'];
  code: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

/**
 * Pagination information for connections
 * Contains cursors and flags for navigating paginated results
 */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Retrieve a block by hash. */
  block?: Maybe<Block>;
  /** Retrieve blocks by chain and minimal depth. Default page size is 20. */
  blocksFromDepth?: Maybe<QueryBlocksFromDepthConnection>;
  /** Retrieve blocks by chain and minimal height. Default page size is 20. */
  blocksFromHeight: QueryBlocksFromHeightConnection;
  /** Retrieve all completed blocks from a given height. Default page size is 20. */
  completedBlockHeights: QueryCompletedBlockHeightsConnection;
  /**
   * Retrieve events by qualifiedName (e.g. `coin.TRANSFER`). Default page size is 20.
   *
   *       The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
   *
   *       An example of such a filter parameter value: `events(parametersFilter: "{\"array_starts_with\": \"k:abcdefg\"}")`
   */
  events: QueryEventsConnection;
  /** Retrieve an fungible specific account by its name and fungible, such as coin. */
  fungibleAccount?: Maybe<FungibleAccount>;
  /** Retrieve an account by public key. */
  fungibleAccountsByPublicKey: Array<FungibleAccount>;
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccount?: Maybe<FungibleChainAccount>;
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccounts?: Maybe<Array<FungibleChainAccount>>;
  /** Retrieve a chain account by public key. */
  fungibleChainAccountsByPublicKey: Array<FungibleChainAccount>;
  /**
   * Estimate the gas limit for one or more transactions. Throws an error when the transaction fails or is invalid. The input accepts a JSON object and based on the parameters passed it will determine what type of format it is and return the gas limit estimation. The following types are supported:
   *
   *       - `full-transaction`: A complete transaction object. Required parameters: `cmd`, `hash` and `sigs`.
   *       - `stringified-command`: A JSON stringified command. Required parameters: `cmd`. It also optionally accepts `sigs`.
   *       - `full-command`: A full command. Required parameters: `payload`, `meta` and `signers`.
   *       - `partial-command`: A partial command. Required parameters: `payload` and either `meta` or `signers`. In case `meta` is not given, but `signers` is given, you can also add `chainId` as a parameter.
   *       - `payload`: A just the payload of a command. Required parameters: `payload` and `chainId`.
   *       - `code`: The code of an execution. Required parameters: `code` and `chainId`.
   *
   *       Every type accepts an optional parameter called `networkId` to override the default value from the environment variables.
   *
   *       Example of the input needed for a type `code` query: `gasLimitEstimate(input: "{\"code\":\"(coin.details \\\"k:1234\\\")\",\"chainId\":\"3\"}")`
   */
  gasLimitEstimate: Array<GasLimitEstimation>;
  /** Get the configuration of the graph. */
  graphConfiguration: GraphConfiguration;
  /** Get the height of the block with the highest height. */
  lastBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Get information about the network. */
  networkInfo?: Maybe<NetworkInfo>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  /** Retrieve a non-fungible specific account by its name. */
  nonFungibleAccount?: Maybe<NonFungibleAccount>;
  /** Retrieve an account by its name on a specific chain. */
  nonFungibleChainAccount?: Maybe<NonFungibleChainAccount>;
  /** Execute arbitrary Pact code via a local call without gas-estimation or signature-verification (e.g. (+ 1 2) or (coin.get-details <account>)). */
  pactQuery: Array<PactQueryResponse>;
  tokens?: Maybe<QueryTokensConnection>;
  /** Retrieve one transaction by its unique key. Throws an error if multiple transactions are found. */
  transaction?: Maybe<Transaction>;
  /**
   * Retrieve transactions. Default page size is 20.
   *  At least one of accountName, fungibleName, blockHash, or requestKey must be provided.
   */
  transactions: QueryTransactionsConnection;
  /** Retrieve all transactions by a given public key. */
  transactionsByPublicKey: QueryTransactionsByPublicKeyConnection;
  /** Retrieve transfers. Default page size is 20. */
  transfers: QueryTransfersConnection;
};

/**
 * Arguments for the block query to retrieve a specific block by hash.
 */
export type QueryBlockArgs = {
  hash: Scalars['String']['input'];
};

/**
 * Arguments for retrieving blocks from a minimum depth in the blockchain.
 * Includes pagination and chain filtering parameters.
 */
export type QueryBlocksFromDepthArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth: Scalars['Int']['input'];
};

/**
 * Arguments for retrieving blocks from a specific height in the blockchain.
 * Allows fetching blocks within a range from startHeight to endHeight (optional).
 */
export type QueryBlocksFromHeightArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  endHeight?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  startHeight: Scalars['Int']['input'];
};

/**
 * Arguments for retrieving completed block heights.
 * Used to check which block heights have been fully processed in the indexer.
 */
export type QueryCompletedBlockHeightsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Arguments for querying events by various filters.
 * Requires a qualified event name (e.g., 'coin.TRANSFER') and supports additional filters.
 */
export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  orderIndex?: InputMaybe<Scalars['Int']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
  requestKey?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving a fungible account by name and token type.
 */
export type QueryFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving fungible accounts by public key.
 */
export type QueryFungibleAccountsByPublicKeyArgs = {
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};

/**
 * Arguments for retrieving a fungible account on a specific chain.
 */
export type QueryFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving fungible accounts across multiple chains.
 */
export type QueryFungibleChainAccountsArgs = {
  accountName: Scalars['String']['input'];
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving fungible chain accounts by public key on a specific chain.
 */
export type QueryFungibleChainAccountsByPublicKeyArgs = {
  chainId: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};

/**
 * Arguments for estimating gas limits for one or more transactions.
 */
export type QueryGasLimitEstimateArgs = {
  input: Array<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving a node by its unique ID.
 */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

/**
 * Arguments for retrieving multiple nodes by their IDs.
 */
export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};

/**
 * Arguments for retrieving a non-fungible account by name.
 */
export type QueryNonFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
};

/**
 * Arguments for retrieving a non-fungible account on a specific chain.
 */
export type QueryNonFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
};

/**
 * Arguments for executing a Pact query.
 */
export type QueryPactQueryArgs = {
  pactQuery: Array<PactQuery>;
};

/**
 * Arguments for retrieving tokens with pagination.
 */
export type QueryTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Arguments for retrieving a transaction by its request key.
 * Optionally can specify a minimum confirmation depth or block hash.
 */
export type QueryTransactionArgs = {
  blockHash?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  requestKey: Scalars['String']['input'];
};

/**
 * Arguments for querying transactions with various filters.
 * Supports filtering by account, chain, block, and more.
 */
export type QueryTransactionsArgs = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  requestKey?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Arguments for retrieving transactions by public key with pagination.
 */
export type QueryTransactionsByPublicKeyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  publicKey: Scalars['String']['input'];
};

/**
 * Arguments for querying transfers with various filters.
 * Supports filtering by account, chain, block, and more.
 */
export type QueryTransfersArgs = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  requestKey?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Connection type for blocks retrieved from a minimum depth.
 * Implements the Relay connection specification for pagination.
 */
export type QueryBlocksFromDepthConnection = {
  __typename?: 'QueryBlocksFromDepthConnection';
  edges: Array<QueryBlocksFromDepthConnectionEdge>;
  pageInfo: PageInfo;
};

/**
 * Edge type for blocks from depth connection.
 * Contains the cursor and the block node.
 */
export type QueryBlocksFromDepthConnectionEdge = {
  __typename?: 'QueryBlocksFromDepthConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

/**
 * Connection type for blocks retrieved from a specific height.
 * Implements the Relay connection specification for pagination.
 */
export type QueryBlocksFromHeightConnection = {
  __typename?: 'QueryBlocksFromHeightConnection';
  edges: Array<QueryBlocksFromHeightConnectionEdge>;
  pageInfo: PageInfo;
};

/**
 * Edge type for blocks from height connection.
 * Contains the cursor and the block node.
 */
export type QueryBlocksFromHeightConnectionEdge = {
  __typename?: 'QueryBlocksFromHeightConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

/**
 * Connection type for completed block heights.
 * Implements the Relay connection specification for pagination.
 */
export type QueryCompletedBlockHeightsConnection = {
  __typename?: 'QueryCompletedBlockHeightsConnection';
  edges: Array<Maybe<QueryCompletedBlockHeightsConnectionEdge>>;
  pageInfo: PageInfo;
};

/**
 * Edge type for completed block heights connection.
 * Contains the cursor and the block node.
 */
export type QueryCompletedBlockHeightsConnectionEdge = {
  __typename?: 'QueryCompletedBlockHeightsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

/**
 * Connection type for events query.
 * Implements the Relay connection specification for pagination and includes total count.
 */
export type QueryEventsConnection = {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for events connection.
 * Contains the cursor and the event node.
 */
export type QueryEventsConnectionEdge = {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

/**
 * Connection type for tokens query.
 * Implements the Relay connection specification for pagination.
 */
export type QueryTokensConnection = {
  __typename?: 'QueryTokensConnection';
  edges: Array<QueryTokensEdge>;
  pageInfo: PageInfo;
};

/**
 * Edge type for tokens connection.
 * Contains the cursor and the token node.
 */
export type QueryTokensEdge = {
  __typename?: 'QueryTokensEdge';
  cursor: Scalars['String']['output'];
  node: Token;
};

/**
 * Connection type for transactions by public key.
 * Implements the Relay connection specification for pagination and includes total count.
 */
export type QueryTransactionsByPublicKeyConnection = {
  __typename?: 'QueryTransactionsByPublicKeyConnection';
  edges: Array<QueryTransactionsByPublicKeyConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for transactions by public key connection.
 * Contains the cursor and the transaction node.
 */
export type QueryTransactionsByPublicKeyConnectionEdge = {
  __typename?: 'QueryTransactionsByPublicKeyConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * Connection type for transactions query.
 * Implements the Relay connection specification for pagination and includes total count.
 */
export type QueryTransactionsConnection = {
  __typename?: 'QueryTransactionsConnection';
  edges: Array<QueryTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for transactions connection.
 * Contains the cursor and the transaction node.
 */
export type QueryTransactionsConnectionEdge = {
  __typename?: 'QueryTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/**
 * Connection type for transfers query.
 * Implements the Relay connection specification for pagination and includes total count.
 */
export type QueryTransfersConnection = {
  __typename?: 'QueryTransfersConnection';
  edges: Array<QueryTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/**
 * Edge type for transfers connection.
 * Contains the cursor and the transfer node.
 */
export type QueryTransfersConnectionEdge = {
  __typename?: 'QueryTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/** DEPRECATED: a fallthrough IGuard type to cover non-KeysetGuard types. */
export type RawGuard = IGuard & {
  __typename?: 'RawGuard';
  /** @deprecated deprecated, use KeysetGuard.keys */
  keys: Array<Scalars['String']['output']>;
  /** @deprecated deprecated, use KeysetGuard.predicate */
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/** A signer for a specific transaction. */
export type Signer = Node & {
  __typename?: 'Signer';
  /** The signer for the gas. */
  address?: Maybe<Scalars['String']['output']>;
  clist: Array<TransactionCapability>;
  id: Scalars['ID']['output'];
  orderIndex?: Maybe<Scalars['Int']['output']>;
  pubkey: Scalars['String']['output'];
  /** The signature scheme that was used to sign. */
  scheme?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /**
   * Listen for events by qualifiedName (e.g. `coin.TRANSFER`).
   *
   *       The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
   *
   *       An example of such a filter parameter value: `events(parametersFilter: "{\"array_starts_with\": \"k:abcdefg\"}")`
   */
  events?: Maybe<Array<Event>>;
  /** Subscribe to new blocks. */
  newBlocks?: Maybe<Array<Block>>;
  /** Subscribe to new blocks from a specific depth. */
  newBlocksFromDepth?: Maybe<Array<Block>>;
  /** Listen for a transaction by request key. */
  transaction?: Maybe<Transaction>;
};

/** Arguments for events subscription query. */
export type SubscriptionEventsArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
};

/** Arguments for new blocks subscription query. */
export type SubscriptionNewBlocksArgs = {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Arguments for new blocks from depth subscription query. */
export type SubscriptionNewBlocksFromDepthArgs = {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  minimumDepth: Scalars['Int']['input'];
};

/** Arguments for transaction subscription query. */
export type SubscriptionTransactionArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  requestKey: Scalars['String']['input'];
};

/** Represents a token in the blockchain. */
export type Token = {
  __typename?: 'Token';
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** A transaction. */
export type Transaction = Node & {
  __typename?: 'Transaction';
  cmd: TransactionCommand;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orphanedTransactions?: Maybe<Array<Maybe<Transaction>>>;
  result: TransactionInfo;
  sigs: Array<TransactionSignature>;
};

/** List of capabilities associated with/installed by this signer. */
export type TransactionCapability = {
  __typename?: 'TransactionCapability';
  args: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** A transaction command. */
export type TransactionCommand = {
  __typename?: 'TransactionCommand';
  meta: TransactionMeta;
  /** The network id of the environment. */
  networkId: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
  payload: TransactionPayload;
  signers: Array<Signer>;
};

/** The result of a transaction. */
export type TransactionInfo = TransactionMempoolInfo | TransactionResult;

/** The mempool information. */
export type TransactionMempoolInfo = {
  __typename?: 'TransactionMempoolInfo';
  /** The status of the mempool. */
  status?: Maybe<Scalars['String']['output']>;
};

/** The metadata of a transaction. */
export type TransactionMeta = {
  __typename?: 'TransactionMeta';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  gasLimit: Scalars['BigInt']['output'];
  gasPrice: Scalars['Float']['output'];
  sender: Scalars['String']['output'];
  ttl: Scalars['BigInt']['output'];
};

/** The payload of a transaction. */
export type TransactionPayload = ContinuationPayload | ExecutionPayload;

/** The result of a transaction. */
export type TransactionResult = {
  __typename?: 'TransactionResult';
  /** The transaction result when it was successful. Formatted as raw JSON. */
  badResult?: Maybe<Scalars['String']['output']>;
  block: Block;
  /** The JSON stringified continuation in the case that it is a continuation. */
  continuation?: Maybe<Scalars['String']['output']>;
  eventCount?: Maybe<Scalars['BigInt']['output']>;
  events: TransactionResultEventsConnection;
  gas: Scalars['BigInt']['output'];
  /** The transaction result when it was successful. Formatted as raw JSON. */
  goodResult?: Maybe<Scalars['String']['output']>;
  /**
   * The height of the block this transaction belongs to.
   * @deprecated Use `block.height` instead.
   */
  height: Scalars['BigInt']['output'];
  /** Identifier to retrieve the logs for the execution of the transaction. */
  logs?: Maybe<Scalars['String']['output']>;
  /** @deprecated Not used. */
  metadata: Scalars['String']['output'];
  transactionId?: Maybe<Scalars['BigInt']['output']>;
  transfers: TransactionResultTransfersConnection;
};

/** Arguments for retrieving transaction result events with pagination. */
export type TransactionResultEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** Arguments for retrieving transaction result transfers with pagination. */
export type TransactionResultTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** Connection type for paginated event results in a transaction. */
export type TransactionResultEventsConnection = {
  __typename?: 'TransactionResultEventsConnection';
  edges: Array<Maybe<TransactionResultEventsConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for the transaction result events connection. */
export type TransactionResultEventsConnectionEdge = {
  __typename?: 'TransactionResultEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

/** Connection type for paginated transfer results in a transaction. */
export type TransactionResultTransfersConnection = {
  __typename?: 'TransactionResultTransfersConnection';
  edges: Array<Maybe<TransactionResultTransfersConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Edge type for the transaction result transfers connection. */
export type TransactionResultTransfersConnectionEdge = {
  __typename?: 'TransactionResultTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/** List of capabilities associated with/installed by this signer. */
export type TransactionSignature = {
  __typename?: 'TransactionSignature';
  sig: Scalars['String']['output'];
};

/** A transfer of funds from a fungible between two accounts. */
export type Transfer = Node & {
  __typename?: 'Transfer';
  amount: Scalars['Decimal']['output'];
  block: Block;
  /** @deprecated Use `block.hash` field instead. */
  blockHash: Scalars['String']['output'];
  /** @deprecated Use `block.chainId` field instead. */
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The counterpart of the crosschain-transfer. `null` when it is not a cross-chain-transfer. */
  crossChainTransfer?: Maybe<Transfer>;
  /** @deprecated Use `block.height` field instead. */
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  moduleHash: Scalars['String']['output'];
  moduleName: Scalars['String']['output'];
  /** The order of the transfer when it is a `defpact` (multi-step transaction) execution. */
  orderIndex: Scalars['BigInt']['output'];
  receiverAccount: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  senderAccount: Scalars['String']['output'];
  /** The transaction that initiated this transfer. */
  transaction?: Maybe<Transaction>;
};

export type UserGuard = IGuard & {
  __typename?: 'UserGuard';
  args: Array<Scalars['String']['output']>;
  fun: Scalars['String']['output'];
  /** @deprecated deprecated, use KeysetGuard.keys */
  keys: Array<Scalars['String']['output']>;
  /** @deprecated deprecated, use KeysetGuard.predicate */
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/** Wrapper type for resolver functions that may return a promise. */
export type ResolverTypeWrapper<T> = Promise<T> | T;

/** Resolver with explicit resolve function. */
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

/** Resolver type for GraphQL fields. */
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

/** Function signature for GraphQL field resolvers. */
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

/**
 * Represents a subscription function that establishes the initial subscription connection.
 * @template TResult - The result type that will be streamed in the subscription
 * @template TParent - The parent object type
 * @template TContext - The context type passed to resolvers
 * @template TArgs - The arguments type for the subscription
 * @returns An async iterable or promise of an async iterable that yields subscription results
 */
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

/**
 * Represents a resolver function that processes each emitted value in a subscription.
 * @template TResult - The final result type after processing
 * @template TParent - The parent object type
 * @template TContext - The context type passed to resolvers
 * @template TArgs - The arguments type for the resolver
 * @returns The resolved result or a promise of the result
 */
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/**
 * Interface for subscription resolvers using the subscriber/resolver pattern.
 * This pattern separates the subscription setup from the payload processing.
 * @template TResult - The final result type
 * @template TKey - The key in the subscription payload
 * @template TParent - The parent object type
 * @template TContext - The context type passed to resolvers
 * @template TArgs - The arguments type for the subscription
 */
export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

/**
 * Interface for subscription resolvers using a simpler pattern where both
 * subscription setup and payload processing are combined.
 * @template TResult - The final result type
 * @template TParent - The parent object type
 * @template TContext - The context type passed to resolvers
 * @template TArgs - The arguments type for the subscription
 */
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

/**
 * Union type representing either subscription pattern that can be used.
 * @template TResult - The final result type
 * @template TKey - The key in the subscription payload
 * @template TParent - The parent object type
 * @template TContext - The context type passed to resolvers
 * @template TArgs - The arguments type for the subscription
 */
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

/**
 * The main subscription resolver type that can be either a function returning a SubscriptionObject
 * or a SubscriptionObject itself.
 * @template TResult - The final result type
 * @template TKey - The key in the subscription payload
 * @template TParent - The parent object type (defaults to empty object)
 * @template TContext - The context type passed to resolvers (defaults to empty object)
 * @template TArgs - The arguments type for the subscription (defaults to empty object)
 */
export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

/**
 * Represents a type resolver function that determines the concrete type of an interface or union.
 * @template TTypes - The possible concrete types
 * @template TParent - The parent object type (defaults to empty object)
 * @template TContext - The context type passed to resolvers (defaults to empty object)
 * @returns The resolved type or a promise of the resolved type
 */
export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

/**
 * Function that determines if an object is of a specific GraphQL type.
 * Used by the GraphQL executor to check if an object belongs to a certain type.
 * @template T - The type to check against (defaults to empty object)
 * @template TContext - The context type passed to resolvers (defaults to empty object)
 * @returns Boolean indicating whether the object is of the specified type
 */
export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

/**
 * Represents a function that continues the resolver chain.
 * Used in directive resolvers to continue execution after directive processing.
 * @template T - The result type of the next resolver
 * @returns A promise of the result from the next resolver
 */
export type NextResolverFn<T> = () => Promise<T>;

/**
 * Represents a directive resolver function that can modify the behavior of field resolution.
 * @template TResult - The result type (defaults to empty object)
 * @template TParent - The parent object type (defaults to empty object)
 * @template TContext - The context type passed to resolvers (defaults to empty object)
 * @template TArgs - The arguments type for the directive (defaults to empty object)
 * @returns The result or a promise of the result after directive processing
 */
export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  TransactionInfo:
    | TransactionMempoolInfo
    | (Omit<TransactionResult, 'block' | 'events' | 'transfers'> & {
        block: _RefType['Block'];
        events: _RefType['TransactionResultEventsConnection'];
        transfers: _RefType['TransactionResultTransfersConnection'];
      });
  TransactionPayload: ContinuationPayload | ExecutionPayload;
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  IGuard: KeysetGuard | RawGuard | UserGuard;
  Node:
    | (Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & {
        events: _RefType['BlockEventsConnection'];
        minerAccount: _RefType['FungibleChainAccount'];
        parent?: Maybe<_RefType['Block']>;
        transactions: _RefType['BlockTransactionsConnection'];
      })
    | (Omit<Event, 'block' | 'transaction'> & {
        block: _RefType['Block'];
        transaction?: Maybe<_RefType['Transaction']>;
      })
    | (Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & {
        chainAccounts: Array<_RefType['FungibleChainAccount']>;
        transactions: _RefType['FungibleAccountTransactionsConnection'];
        transfers: _RefType['FungibleAccountTransfersConnection'];
      })
    | (Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & {
        guard: _RefType['IGuard'];
        transactions: _RefType['FungibleChainAccountTransactionsConnection'];
        transfers: _RefType['FungibleChainAccountTransfersConnection'];
      })
    | (Omit<NonFungibleAccount, 'chainAccounts' | 'nonFungibleTokenBalances' | 'transactions'> & {
        chainAccounts: Array<_RefType['NonFungibleChainAccount']>;
        nonFungibleTokenBalances: Array<_RefType['NonFungibleTokenBalance']>;
        transactions: _RefType['NonFungibleAccountTransactionsConnection'];
      })
    | (Omit<NonFungibleChainAccount, 'nonFungibleTokenBalances' | 'transactions'> & {
        nonFungibleTokenBalances: Array<_RefType['NonFungibleTokenBalance']>;
        transactions: _RefType['NonFungibleChainAccountTransactionsConnection'];
      })
    | (Omit<NonFungibleTokenBalance, 'guard'> & { guard: _RefType['IGuard'] })
    | Signer
    | (Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & {
        cmd: _RefType['TransactionCommand'];
        orphanedTransactions?: Maybe<Array<Maybe<_RefType['Transaction']>>>;
        result: _RefType['TransactionInfo'];
      })
    | (Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & {
        block: _RefType['Block'];
        crossChainTransfer?: Maybe<_RefType['Transfer']>;
        transaction?: Maybe<_RefType['Transaction']>;
      });
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Block: ResolverTypeWrapper<
    Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & {
      events: ResolversTypes['BlockEventsConnection'];
      minerAccount: ResolversTypes['FungibleChainAccount'];
      parent?: Maybe<ResolversTypes['Block']>;
      transactions: ResolversTypes['BlockTransactionsConnection'];
    }
  >;
  BlockEventsConnection: ResolverTypeWrapper<
    Omit<BlockEventsConnection, 'edges'> & {
      edges: Array<ResolversTypes['BlockEventsConnectionEdge']>;
    }
  >;
  BlockEventsConnectionEdge: ResolverTypeWrapper<
    Omit<BlockEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }
  >;
  BlockNeighbor: ResolverTypeWrapper<BlockNeighbor>;
  BlockTransactionsConnection: ResolverTypeWrapper<
    Omit<BlockTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['BlockTransactionsConnectionEdge']>;
    }
  >;
  BlockTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<BlockTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }
  >;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ContinuationPayload: ResolverTypeWrapper<ContinuationPayload>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  Event: ResolverTypeWrapper<
    Omit<Event, 'block' | 'transaction'> & {
      block: ResolversTypes['Block'];
      transaction?: Maybe<ResolversTypes['Transaction']>;
    }
  >;
  ExecutionPayload: ResolverTypeWrapper<ExecutionPayload>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FungibleAccount: ResolverTypeWrapper<
    Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & {
      chainAccounts: Array<ResolversTypes['FungibleChainAccount']>;
      transactions: ResolversTypes['FungibleAccountTransactionsConnection'];
      transfers: ResolversTypes['FungibleAccountTransfersConnection'];
    }
  >;
  FungibleAccountTransactionsConnection: ResolverTypeWrapper<
    Omit<FungibleAccountTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['FungibleAccountTransactionsConnectionEdge']>;
    }
  >;
  FungibleAccountTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<FungibleAccountTransactionsConnectionEdge, 'node'> & {
      node: ResolversTypes['Transaction'];
    }
  >;
  FungibleAccountTransfersConnection: ResolverTypeWrapper<
    Omit<FungibleAccountTransfersConnection, 'edges'> & {
      edges: Array<ResolversTypes['FungibleAccountTransfersConnectionEdge']>;
    }
  >;
  FungibleAccountTransfersConnectionEdge: ResolverTypeWrapper<
    Omit<FungibleAccountTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }
  >;
  FungibleChainAccount: ResolverTypeWrapper<
    Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & {
      guard: ResolversTypes['IGuard'];
      transactions: ResolversTypes['FungibleChainAccountTransactionsConnection'];
      transfers: ResolversTypes['FungibleChainAccountTransfersConnection'];
    }
  >;
  FungibleChainAccountTransactionsConnection: ResolverTypeWrapper<
    Omit<FungibleChainAccountTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['FungibleChainAccountTransactionsConnectionEdge']>;
    }
  >;
  FungibleChainAccountTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<FungibleChainAccountTransactionsConnectionEdge, 'node'> & {
      node: ResolversTypes['Transaction'];
    }
  >;
  FungibleChainAccountTransfersConnection: ResolverTypeWrapper<
    Omit<FungibleChainAccountTransfersConnection, 'edges'> & {
      edges: Array<ResolversTypes['FungibleChainAccountTransfersConnectionEdge']>;
    }
  >;
  FungibleChainAccountTransfersConnectionEdge: ResolverTypeWrapper<
    Omit<FungibleChainAccountTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }
  >;
  GasLimitEstimation: ResolverTypeWrapper<GasLimitEstimation>;
  GenesisHeight: ResolverTypeWrapper<GenesisHeight>;
  GraphConfiguration: ResolverTypeWrapper<GraphConfiguration>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IGuard: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['IGuard']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  KeysetGuard: ResolverTypeWrapper<KeysetGuard>;
  NetworkInfo: ResolverTypeWrapper<NetworkInfo>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NonFungibleAccount: ResolverTypeWrapper<
    Omit<NonFungibleAccount, 'chainAccounts' | 'nonFungibleTokenBalances' | 'transactions'> & {
      chainAccounts: Array<ResolversTypes['NonFungibleChainAccount']>;
      nonFungibleTokenBalances: Array<ResolversTypes['NonFungibleTokenBalance']>;
      transactions: ResolversTypes['NonFungibleAccountTransactionsConnection'];
    }
  >;
  NonFungibleAccountTransactionsConnection: ResolverTypeWrapper<
    Omit<NonFungibleAccountTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['NonFungibleAccountTransactionsConnectionEdge']>;
    }
  >;
  NonFungibleAccountTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<NonFungibleAccountTransactionsConnectionEdge, 'node'> & {
      node: ResolversTypes['Transaction'];
    }
  >;
  NonFungibleChainAccount: ResolverTypeWrapper<
    Omit<NonFungibleChainAccount, 'nonFungibleTokenBalances' | 'transactions'> & {
      nonFungibleTokenBalances: Array<ResolversTypes['NonFungibleTokenBalance']>;
      transactions: ResolversTypes['NonFungibleChainAccountTransactionsConnection'];
    }
  >;
  NonFungibleChainAccountTransactionsConnection: ResolverTypeWrapper<
    Omit<NonFungibleChainAccountTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['NonFungibleChainAccountTransactionsConnectionEdge']>;
    }
  >;
  NonFungibleChainAccountTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<NonFungibleChainAccountTransactionsConnectionEdge, 'node'> & {
      node: ResolversTypes['Transaction'];
    }
  >;
  NonFungibleToken: ResolverTypeWrapper<NonFungibleToken>;
  NonFungibleTokenBalance: ResolverTypeWrapper<
    Omit<NonFungibleTokenBalance, 'guard'> & { guard: ResolversTypes['IGuard'] }
  >;
  PactQuery: PactQuery;
  PactQueryData: PactQueryData;
  PactQueryResponse: ResolverTypeWrapper<PactQueryResponse>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  QueryBlocksFromDepthConnection: ResolverTypeWrapper<
    Omit<QueryBlocksFromDepthConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryBlocksFromDepthConnectionEdge']>;
    }
  >;
  QueryBlocksFromDepthConnectionEdge: ResolverTypeWrapper<
    Omit<QueryBlocksFromDepthConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }
  >;
  QueryBlocksFromHeightConnection: ResolverTypeWrapper<
    Omit<QueryBlocksFromHeightConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryBlocksFromHeightConnectionEdge']>;
    }
  >;
  QueryBlocksFromHeightConnectionEdge: ResolverTypeWrapper<
    Omit<QueryBlocksFromHeightConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }
  >;
  QueryCompletedBlockHeightsConnection: ResolverTypeWrapper<
    Omit<QueryCompletedBlockHeightsConnection, 'edges'> & {
      edges: Array<Maybe<ResolversTypes['QueryCompletedBlockHeightsConnectionEdge']>>;
    }
  >;
  QueryCompletedBlockHeightsConnectionEdge: ResolverTypeWrapper<
    Omit<QueryCompletedBlockHeightsConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }
  >;
  QueryEventsConnection: ResolverTypeWrapper<
    Omit<QueryEventsConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryEventsConnectionEdge']>;
    }
  >;
  QueryEventsConnectionEdge: ResolverTypeWrapper<
    Omit<QueryEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }
  >;
  QueryTokensConnection: ResolverTypeWrapper<QueryTokensConnection>;
  QueryTokensEdge: ResolverTypeWrapper<QueryTokensEdge>;
  QueryTransactionsByPublicKeyConnection: ResolverTypeWrapper<
    Omit<QueryTransactionsByPublicKeyConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryTransactionsByPublicKeyConnectionEdge']>;
    }
  >;
  QueryTransactionsByPublicKeyConnectionEdge: ResolverTypeWrapper<
    Omit<QueryTransactionsByPublicKeyConnectionEdge, 'node'> & {
      node: ResolversTypes['Transaction'];
    }
  >;
  QueryTransactionsConnection: ResolverTypeWrapper<
    Omit<QueryTransactionsConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryTransactionsConnectionEdge']>;
    }
  >;
  QueryTransactionsConnectionEdge: ResolverTypeWrapper<
    Omit<QueryTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }
  >;
  QueryTransfersConnection: ResolverTypeWrapper<
    Omit<QueryTransfersConnection, 'edges'> & {
      edges: Array<ResolversTypes['QueryTransfersConnectionEdge']>;
    }
  >;
  QueryTransfersConnectionEdge: ResolverTypeWrapper<
    Omit<QueryTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }
  >;
  RawGuard: ResolverTypeWrapper<RawGuard>;
  Signer: ResolverTypeWrapper<Signer>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  Transaction: ResolverTypeWrapper<
    Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & {
      cmd: ResolversTypes['TransactionCommand'];
      orphanedTransactions?: Maybe<Array<Maybe<ResolversTypes['Transaction']>>>;
      result: ResolversTypes['TransactionInfo'];
    }
  >;
  TransactionCapability: ResolverTypeWrapper<TransactionCapability>;
  TransactionCommand: ResolverTypeWrapper<
    Omit<TransactionCommand, 'meta' | 'payload'> & {
      meta: ResolversTypes['TransactionMeta'];
      payload: ResolversTypes['TransactionPayload'];
    }
  >;
  TransactionInfo: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransactionInfo']>;
  TransactionMempoolInfo: ResolverTypeWrapper<TransactionMempoolInfo>;
  TransactionMeta: ResolverTypeWrapper<TransactionMeta>;
  TransactionPayload: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>['TransactionPayload']
  >;
  TransactionResult: ResolverTypeWrapper<
    Omit<TransactionResult, 'block' | 'events' | 'transfers'> & {
      block: ResolversTypes['Block'];
      events: ResolversTypes['TransactionResultEventsConnection'];
      transfers: ResolversTypes['TransactionResultTransfersConnection'];
    }
  >;
  TransactionResultEventsConnection: ResolverTypeWrapper<
    Omit<TransactionResultEventsConnection, 'edges'> & {
      edges: Array<Maybe<ResolversTypes['TransactionResultEventsConnectionEdge']>>;
    }
  >;
  TransactionResultEventsConnectionEdge: ResolverTypeWrapper<
    Omit<TransactionResultEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }
  >;
  TransactionResultTransfersConnection: ResolverTypeWrapper<
    Omit<TransactionResultTransfersConnection, 'edges'> & {
      edges: Array<Maybe<ResolversTypes['TransactionResultTransfersConnectionEdge']>>;
    }
  >;
  TransactionResultTransfersConnectionEdge: ResolverTypeWrapper<
    Omit<TransactionResultTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }
  >;
  TransactionSignature: ResolverTypeWrapper<TransactionSignature>;
  Transfer: ResolverTypeWrapper<
    Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & {
      block: ResolversTypes['Block'];
      crossChainTransfer?: Maybe<ResolversTypes['Transfer']>;
      transaction?: Maybe<ResolversTypes['Transaction']>;
    }
  >;
  UserGuard: ResolverTypeWrapper<UserGuard>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  Block: Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & {
    events: ResolversParentTypes['BlockEventsConnection'];
    minerAccount: ResolversParentTypes['FungibleChainAccount'];
    parent?: Maybe<ResolversParentTypes['Block']>;
    transactions: ResolversParentTypes['BlockTransactionsConnection'];
  };
  BlockEventsConnection: Omit<BlockEventsConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['BlockEventsConnectionEdge']>;
  };
  BlockEventsConnectionEdge: Omit<BlockEventsConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Event'];
  };
  BlockNeighbor: BlockNeighbor;
  BlockTransactionsConnection: Omit<BlockTransactionsConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['BlockTransactionsConnectionEdge']>;
  };
  BlockTransactionsConnectionEdge: Omit<BlockTransactionsConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Transaction'];
  };
  Boolean: Scalars['Boolean']['output'];
  ContinuationPayload: ContinuationPayload;
  DateTime: Scalars['DateTime']['output'];
  Decimal: Scalars['Decimal']['output'];
  Event: Omit<Event, 'block' | 'transaction'> & {
    block: ResolversParentTypes['Block'];
    transaction?: Maybe<ResolversParentTypes['Transaction']>;
  };
  ExecutionPayload: ExecutionPayload;
  Float: Scalars['Float']['output'];
  FungibleAccount: Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & {
    chainAccounts: Array<ResolversParentTypes['FungibleChainAccount']>;
    transactions: ResolversParentTypes['FungibleAccountTransactionsConnection'];
    transfers: ResolversParentTypes['FungibleAccountTransfersConnection'];
  };
  FungibleAccountTransactionsConnection: Omit<FungibleAccountTransactionsConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['FungibleAccountTransactionsConnectionEdge']>;
  };
  FungibleAccountTransactionsConnectionEdge: Omit<
    FungibleAccountTransactionsConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transaction'] };
  FungibleAccountTransfersConnection: Omit<FungibleAccountTransfersConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['FungibleAccountTransfersConnectionEdge']>;
  };
  FungibleAccountTransfersConnectionEdge: Omit<FungibleAccountTransfersConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Transfer'];
  };
  FungibleChainAccount: Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & {
    guard: ResolversParentTypes['IGuard'];
    transactions: ResolversParentTypes['FungibleChainAccountTransactionsConnection'];
    transfers: ResolversParentTypes['FungibleChainAccountTransfersConnection'];
  };
  FungibleChainAccountTransactionsConnection: Omit<
    FungibleChainAccountTransactionsConnection,
    'edges'
  > & { edges: Array<ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge']> };
  FungibleChainAccountTransactionsConnectionEdge: Omit<
    FungibleChainAccountTransactionsConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transaction'] };
  FungibleChainAccountTransfersConnection: Omit<
    FungibleChainAccountTransfersConnection,
    'edges'
  > & { edges: Array<ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge']> };
  FungibleChainAccountTransfersConnectionEdge: Omit<
    FungibleChainAccountTransfersConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transfer'] };
  GasLimitEstimation: GasLimitEstimation;
  GenesisHeight: GenesisHeight;
  GraphConfiguration: GraphConfiguration;
  ID: Scalars['ID']['output'];
  IGuard: ResolversInterfaceTypes<ResolversParentTypes>['IGuard'];
  Int: Scalars['Int']['output'];
  KeysetGuard: KeysetGuard;
  NetworkInfo: NetworkInfo;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NonFungibleAccount: Omit<
    NonFungibleAccount,
    'chainAccounts' | 'nonFungibleTokenBalances' | 'transactions'
  > & {
    chainAccounts: Array<ResolversParentTypes['NonFungibleChainAccount']>;
    nonFungibleTokenBalances: Array<ResolversParentTypes['NonFungibleTokenBalance']>;
    transactions: ResolversParentTypes['NonFungibleAccountTransactionsConnection'];
  };
  NonFungibleAccountTransactionsConnection: Omit<
    NonFungibleAccountTransactionsConnection,
    'edges'
  > & { edges: Array<ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge']> };
  NonFungibleAccountTransactionsConnectionEdge: Omit<
    NonFungibleAccountTransactionsConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transaction'] };
  NonFungibleChainAccount: Omit<
    NonFungibleChainAccount,
    'nonFungibleTokenBalances' | 'transactions'
  > & {
    nonFungibleTokenBalances: Array<ResolversParentTypes['NonFungibleTokenBalance']>;
    transactions: ResolversParentTypes['NonFungibleChainAccountTransactionsConnection'];
  };
  NonFungibleChainAccountTransactionsConnection: Omit<
    NonFungibleChainAccountTransactionsConnection,
    'edges'
  > & { edges: Array<ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge']> };
  NonFungibleChainAccountTransactionsConnectionEdge: Omit<
    NonFungibleChainAccountTransactionsConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transaction'] };
  NonFungibleToken: NonFungibleToken;
  NonFungibleTokenBalance: Omit<NonFungibleTokenBalance, 'guard'> & {
    guard: ResolversParentTypes['IGuard'];
  };
  PactQuery: PactQuery;
  PactQueryData: PactQueryData;
  PactQueryResponse: PactQueryResponse;
  PageInfo: PageInfo;
  Query: {};
  QueryBlocksFromDepthConnection: Omit<QueryBlocksFromDepthConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryBlocksFromDepthConnectionEdge']>;
  };
  QueryBlocksFromDepthConnectionEdge: Omit<QueryBlocksFromDepthConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Block'];
  };
  QueryBlocksFromHeightConnection: Omit<QueryBlocksFromHeightConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryBlocksFromHeightConnectionEdge']>;
  };
  QueryBlocksFromHeightConnectionEdge: Omit<QueryBlocksFromHeightConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Block'];
  };
  QueryCompletedBlockHeightsConnection: Omit<QueryCompletedBlockHeightsConnection, 'edges'> & {
    edges: Array<Maybe<ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge']>>;
  };
  QueryCompletedBlockHeightsConnectionEdge: Omit<
    QueryCompletedBlockHeightsConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Block'] };
  QueryEventsConnection: Omit<QueryEventsConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryEventsConnectionEdge']>;
  };
  QueryEventsConnectionEdge: Omit<QueryEventsConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Event'];
  };
  QueryTokensConnection: QueryTokensConnection;
  QueryTokensEdge: QueryTokensEdge;
  QueryTransactionsByPublicKeyConnection: Omit<QueryTransactionsByPublicKeyConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge']>;
  };
  QueryTransactionsByPublicKeyConnectionEdge: Omit<
    QueryTransactionsByPublicKeyConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transaction'] };
  QueryTransactionsConnection: Omit<QueryTransactionsConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryTransactionsConnectionEdge']>;
  };
  QueryTransactionsConnectionEdge: Omit<QueryTransactionsConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Transaction'];
  };
  QueryTransfersConnection: Omit<QueryTransfersConnection, 'edges'> & {
    edges: Array<ResolversParentTypes['QueryTransfersConnectionEdge']>;
  };
  QueryTransfersConnectionEdge: Omit<QueryTransfersConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Transfer'];
  };
  RawGuard: RawGuard;
  Signer: Signer;
  String: Scalars['String']['output'];
  Subscription: {};
  Token: Token;
  Transaction: Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & {
    cmd: ResolversParentTypes['TransactionCommand'];
    orphanedTransactions?: Maybe<Array<Maybe<ResolversParentTypes['Transaction']>>>;
    result: ResolversParentTypes['TransactionInfo'];
  };
  TransactionCapability: TransactionCapability;
  TransactionCommand: Omit<TransactionCommand, 'meta' | 'payload'> & {
    meta: ResolversParentTypes['TransactionMeta'];
    payload: ResolversParentTypes['TransactionPayload'];
  };
  TransactionInfo: ResolversUnionTypes<ResolversParentTypes>['TransactionInfo'];
  TransactionMempoolInfo: TransactionMempoolInfo;
  TransactionMeta: TransactionMeta;
  TransactionPayload: ResolversUnionTypes<ResolversParentTypes>['TransactionPayload'];
  TransactionResult: Omit<TransactionResult, 'block' | 'events' | 'transfers'> & {
    block: ResolversParentTypes['Block'];
    events: ResolversParentTypes['TransactionResultEventsConnection'];
    transfers: ResolversParentTypes['TransactionResultTransfersConnection'];
  };
  TransactionResultEventsConnection: Omit<TransactionResultEventsConnection, 'edges'> & {
    edges: Array<Maybe<ResolversParentTypes['TransactionResultEventsConnectionEdge']>>;
  };
  TransactionResultEventsConnectionEdge: Omit<TransactionResultEventsConnectionEdge, 'node'> & {
    node: ResolversParentTypes['Event'];
  };
  TransactionResultTransfersConnection: Omit<TransactionResultTransfersConnection, 'edges'> & {
    edges: Array<Maybe<ResolversParentTypes['TransactionResultTransfersConnectionEdge']>>;
  };
  TransactionResultTransfersConnectionEdge: Omit<
    TransactionResultTransfersConnectionEdge,
    'node'
  > & { node: ResolversParentTypes['Transfer'] };
  TransactionSignature: TransactionSignature;
  Transfer: Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & {
    block: ResolversParentTypes['Block'];
    crossChainTransfer?: Maybe<ResolversParentTypes['Transfer']>;
    transaction?: Maybe<ResolversParentTypes['Transaction']>;
  };
  UserGuard: UserGuard;
};

export type ComplexityDirectiveArgs = {
  multipliers?: Maybe<Array<Scalars['String']['input']>>;
  value: Scalars['Int']['input'];
};

export type ComplexityDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ComplexityDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BlockResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Block'] = ResolversParentTypes['Block'],
> = {
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  difficulty?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  epoch?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<
    ResolversTypes['BlockEventsConnection'],
    ParentType,
    ContextType,
    Partial<BlockEventsArgs>
  >;
  flags?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  minerAccount?: Resolver<ResolversTypes['FungibleChainAccount'], ParentType, ContextType>;
  neighbors?: Resolver<Array<ResolversTypes['BlockNeighbor']>, ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Block']>, ParentType, ContextType>;
  payloadHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  powHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactions?: Resolver<
    ResolversTypes['BlockTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<BlockTransactionsArgs>
  >;
  weight?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockEventsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockEventsConnection'] = ResolversParentTypes['BlockEventsConnection'],
> = {
  edges?: Resolver<Array<ResolversTypes['BlockEventsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockEventsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockEventsConnectionEdge'] = ResolversParentTypes['BlockEventsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockNeighborResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BlockNeighbor'] = ResolversParentTypes['BlockNeighbor'],
> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockTransactionsConnection'] = ResolversParentTypes['BlockTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['BlockTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BlockTransactionsConnectionEdge'] = ResolversParentTypes['BlockTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContinuationPayloadResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ContinuationPayload'] = ResolversParentTypes['ContinuationPayload'],
> = {
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pactId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proof?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rollback?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type EventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event'],
> = {
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  parameterText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parameters?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qualifiedName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExecutionPayloadResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['ExecutionPayload'] = ResolversParentTypes['ExecutionPayload'],
> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleAccount'] = ResolversParentTypes['FungibleAccount'],
> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainAccounts?: Resolver<Array<ResolversTypes['FungibleChainAccount']>, ParentType, ContextType>;
  fungibleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalBalance?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  transactions?: Resolver<
    ResolversTypes['FungibleAccountTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<FungibleAccountTransactionsArgs>
  >;
  transfers?: Resolver<
    ResolversTypes['FungibleAccountTransfersConnection'],
    ParentType,
    ContextType,
    Partial<FungibleAccountTransfersArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleAccountTransactionsConnection'] = ResolversParentTypes['FungibleAccountTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['FungibleAccountTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleAccountTransactionsConnectionEdge'] = ResolversParentTypes['FungibleAccountTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransfersConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleAccountTransfersConnection'] = ResolversParentTypes['FungibleAccountTransfersConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['FungibleAccountTransfersConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransfersConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleAccountTransfersConnectionEdge'] = ResolversParentTypes['FungibleAccountTransfersConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleChainAccount'] = ResolversParentTypes['FungibleChainAccount'],
> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fungibleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guard?: Resolver<ResolversTypes['IGuard'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactions?: Resolver<
    ResolversTypes['FungibleChainAccountTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<FungibleChainAccountTransactionsArgs>
  >;
  transfers?: Resolver<
    ResolversTypes['FungibleChainAccountTransfersConnection'],
    ParentType,
    ContextType,
    Partial<FungibleChainAccountTransfersArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleChainAccountTransactionsConnection'] = ResolversParentTypes['FungibleChainAccountTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['FungibleChainAccountTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge'] = ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransfersConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleChainAccountTransfersConnection'] = ResolversParentTypes['FungibleChainAccountTransfersConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['FungibleChainAccountTransfersConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransfersConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge'] = ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GasLimitEstimationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['GasLimitEstimation'] = ResolversParentTypes['GasLimitEstimation'],
> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inputType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedPreflight?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  usedSignatureVerification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenesisHeightResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GenesisHeight'] = ResolversParentTypes['GenesisHeight'],
> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphConfigurationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['GraphConfiguration'] = ResolversParentTypes['GraphConfiguration'],
> = {
  minimumBlockHeight?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IGuardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IGuard'] = ResolversParentTypes['IGuard'],
> = {
  __resolveType: TypeResolveFn<'KeysetGuard' | 'RawGuard' | 'UserGuard', ParentType, ContextType>;
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type KeysetGuardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['KeysetGuard'] = ResolversParentTypes['KeysetGuard'],
> = {
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NetworkInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NetworkInfo'] = ResolversParentTypes['NetworkInfo'],
> = {
  apiVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coinsInCirculation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  genesisHeights?: Resolver<Array<ResolversTypes['GenesisHeight']>, ParentType, ContextType>;
  networkHashRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  networkHost?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  networkId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeBlockDelay?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nodeChains?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  nodeLatestBehaviorHeight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nodePackageVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodeServiceDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  numberOfChains?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDifficulty?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  transactionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node'],
> = {
  __resolveType: TypeResolveFn<
    | 'Block'
    | 'Event'
    | 'FungibleAccount'
    | 'FungibleChainAccount'
    | 'NonFungibleAccount'
    | 'NonFungibleChainAccount'
    | 'NonFungibleTokenBalance'
    | 'Signer'
    | 'Transaction'
    | 'Transfer',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NonFungibleAccountResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleAccount'] = ResolversParentTypes['NonFungibleAccount'],
> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainAccounts?: Resolver<
    Array<ResolversTypes['NonFungibleChainAccount']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nonFungibleTokenBalances?: Resolver<
    Array<ResolversTypes['NonFungibleTokenBalance']>,
    ParentType,
    ContextType
  >;
  transactions?: Resolver<
    ResolversTypes['NonFungibleAccountTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<NonFungibleAccountTransactionsArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleAccountTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleAccountTransactionsConnection'] = ResolversParentTypes['NonFungibleAccountTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['NonFungibleAccountTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleAccountTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge'] = ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleChainAccount'] = ResolversParentTypes['NonFungibleChainAccount'],
> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nonFungibleTokenBalances?: Resolver<
    Array<ResolversTypes['NonFungibleTokenBalance']>,
    ParentType,
    ContextType
  >;
  transactions?: Resolver<
    ResolversTypes['NonFungibleChainAccountTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<NonFungibleChainAccountTransactionsArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleChainAccountTransactionsConnection'] = ResolversParentTypes['NonFungibleChainAccountTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['NonFungibleChainAccountTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge'] = ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleTokenResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleToken'] = ResolversParentTypes['NonFungibleToken'],
> = {
  precision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  supply?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleTokenBalanceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['NonFungibleTokenBalance'] = ResolversParentTypes['NonFungibleTokenBalance'],
> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guard?: Resolver<ResolversTypes['IGuard'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  info?: Resolver<Maybe<ResolversTypes['NonFungibleToken']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PactQueryResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['PactQueryResponse'] = ResolversParentTypes['PactQueryResponse'],
> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo'],
> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  block?: Resolver<
    Maybe<ResolversTypes['Block']>,
    ParentType,
    ContextType,
    RequireFields<QueryBlockArgs, 'hash'>
  >;
  blocksFromDepth?: Resolver<
    Maybe<ResolversTypes['QueryBlocksFromDepthConnection']>,
    ParentType,
    ContextType,
    RequireFields<QueryBlocksFromDepthArgs, 'minimumDepth'>
  >;
  blocksFromHeight?: Resolver<
    ResolversTypes['QueryBlocksFromHeightConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryBlocksFromHeightArgs, 'startHeight'>
  >;
  completedBlockHeights?: Resolver<
    ResolversTypes['QueryCompletedBlockHeightsConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryCompletedBlockHeightsArgs, 'completedHeights' | 'heightCount'>
  >;
  events?: Resolver<
    ResolversTypes['QueryEventsConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryEventsArgs, 'qualifiedEventName'>
  >;
  fungibleAccount?: Resolver<
    Maybe<ResolversTypes['FungibleAccount']>,
    ParentType,
    ContextType,
    RequireFields<QueryFungibleAccountArgs, 'accountName' | 'fungibleName'>
  >;
  fungibleAccountsByPublicKey?: Resolver<
    Array<ResolversTypes['FungibleAccount']>,
    ParentType,
    ContextType,
    RequireFields<QueryFungibleAccountsByPublicKeyArgs, 'fungibleName' | 'publicKey'>
  >;
  fungibleChainAccount?: Resolver<
    Maybe<ResolversTypes['FungibleChainAccount']>,
    ParentType,
    ContextType,
    RequireFields<QueryFungibleChainAccountArgs, 'accountName' | 'chainId' | 'fungibleName'>
  >;
  fungibleChainAccounts?: Resolver<
    Maybe<Array<ResolversTypes['FungibleChainAccount']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFungibleChainAccountsArgs, 'accountName' | 'fungibleName'>
  >;
  fungibleChainAccountsByPublicKey?: Resolver<
    Array<ResolversTypes['FungibleChainAccount']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryFungibleChainAccountsByPublicKeyArgs,
      'chainId' | 'fungibleName' | 'publicKey'
    >
  >;
  gasLimitEstimate?: Resolver<
    Array<ResolversTypes['GasLimitEstimation']>,
    ParentType,
    ContextType,
    RequireFields<QueryGasLimitEstimateArgs, 'input'>
  >;
  graphConfiguration?: Resolver<ResolversTypes['GraphConfiguration'], ParentType, ContextType>;
  lastBlockHeight?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  networkInfo?: Resolver<Maybe<ResolversTypes['NetworkInfo']>, ParentType, ContextType>;
  node?: Resolver<
    Maybe<ResolversTypes['Node']>,
    ParentType,
    ContextType,
    RequireFields<QueryNodeArgs, 'id'>
  >;
  nodes?: Resolver<
    Array<Maybe<ResolversTypes['Node']>>,
    ParentType,
    ContextType,
    RequireFields<QueryNodesArgs, 'ids'>
  >;
  nonFungibleAccount?: Resolver<
    Maybe<ResolversTypes['NonFungibleAccount']>,
    ParentType,
    ContextType,
    RequireFields<QueryNonFungibleAccountArgs, 'accountName'>
  >;
  nonFungibleChainAccount?: Resolver<
    Maybe<ResolversTypes['NonFungibleChainAccount']>,
    ParentType,
    ContextType,
    RequireFields<QueryNonFungibleChainAccountArgs, 'accountName' | 'chainId'>
  >;
  pactQuery?: Resolver<
    Array<ResolversTypes['PactQueryResponse']>,
    ParentType,
    ContextType,
    RequireFields<QueryPactQueryArgs, 'pactQuery'>
  >;
  tokens?: Resolver<
    Maybe<ResolversTypes['QueryTokensConnection']>,
    ParentType,
    ContextType,
    Partial<QueryTokensArgs>
  >;
  transaction?: Resolver<
    Maybe<ResolversTypes['Transaction']>,
    ParentType,
    ContextType,
    RequireFields<QueryTransactionArgs, 'requestKey'>
  >;
  transactions?: Resolver<
    ResolversTypes['QueryTransactionsConnection'],
    ParentType,
    ContextType,
    Partial<QueryTransactionsArgs>
  >;
  transactionsByPublicKey?: Resolver<
    ResolversTypes['QueryTransactionsByPublicKeyConnection'],
    ParentType,
    ContextType,
    RequireFields<QueryTransactionsByPublicKeyArgs, 'publicKey'>
  >;
  transfers?: Resolver<
    ResolversTypes['QueryTransfersConnection'],
    ParentType,
    ContextType,
    Partial<QueryTransfersArgs>
  >;
};

export type QueryBlocksFromDepthConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryBlocksFromDepthConnection'] = ResolversParentTypes['QueryBlocksFromDepthConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['QueryBlocksFromDepthConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromDepthConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryBlocksFromDepthConnectionEdge'] = ResolversParentTypes['QueryBlocksFromDepthConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromHeightConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryBlocksFromHeightConnection'] = ResolversParentTypes['QueryBlocksFromHeightConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['QueryBlocksFromHeightConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromHeightConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryBlocksFromHeightConnectionEdge'] = ResolversParentTypes['QueryBlocksFromHeightConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryCompletedBlockHeightsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryCompletedBlockHeightsConnection'] = ResolversParentTypes['QueryCompletedBlockHeightsConnection'],
> = {
  edges?: Resolver<
    Array<Maybe<ResolversTypes['QueryCompletedBlockHeightsConnectionEdge']>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryCompletedBlockHeightsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge'] = ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryEventsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryEventsConnection'] = ResolversParentTypes['QueryEventsConnection'],
> = {
  edges?: Resolver<Array<ResolversTypes['QueryEventsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryEventsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryEventsConnectionEdge'] = ResolversParentTypes['QueryEventsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTokensConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTokensConnection'] = ResolversParentTypes['QueryTokensConnection'],
> = {
  edges?: Resolver<Array<ResolversTypes['QueryTokensEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTokensEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTokensEdge'] = ResolversParentTypes['QueryTokensEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsByPublicKeyConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransactionsByPublicKeyConnection'] = ResolversParentTypes['QueryTransactionsByPublicKeyConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['QueryTransactionsByPublicKeyConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsByPublicKeyConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge'] = ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransactionsConnection'] = ResolversParentTypes['QueryTransactionsConnection'],
> = {
  edges?: Resolver<
    Array<ResolversTypes['QueryTransactionsConnectionEdge']>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransactionsConnectionEdge'] = ResolversParentTypes['QueryTransactionsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransfersConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransfersConnection'] = ResolversParentTypes['QueryTransfersConnection'],
> = {
  edges?: Resolver<Array<ResolversTypes['QueryTransfersConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransfersConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['QueryTransfersConnectionEdge'] = ResolversParentTypes['QueryTransfersConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RawGuardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RawGuard'] = ResolversParentTypes['RawGuard'],
> = {
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Signer'] = ResolversParentTypes['Signer'],
> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clist?: Resolver<Array<ResolversTypes['TransactionCapability']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderIndex?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pubkey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scheme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  events?: SubscriptionResolver<
    Maybe<Array<ResolversTypes['Event']>>,
    'events',
    ParentType,
    ContextType,
    RequireFields<SubscriptionEventsArgs, 'qualifiedEventName'>
  >;
  newBlocks?: SubscriptionResolver<
    Maybe<Array<ResolversTypes['Block']>>,
    'newBlocks',
    ParentType,
    ContextType,
    Partial<SubscriptionNewBlocksArgs>
  >;
  newBlocksFromDepth?: SubscriptionResolver<
    Maybe<Array<ResolversTypes['Block']>>,
    'newBlocksFromDepth',
    ParentType,
    ContextType,
    RequireFields<SubscriptionNewBlocksFromDepthArgs, 'minimumDepth'>
  >;
  transaction?: SubscriptionResolver<
    Maybe<ResolversTypes['Transaction']>,
    'transaction',
    ParentType,
    ContextType,
    RequireFields<SubscriptionTransactionArgs, 'requestKey'>
  >;
};

export type TokenResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token'],
> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction'],
> = {
  cmd?: Resolver<ResolversTypes['TransactionCommand'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orphanedTransactions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Transaction']>>>,
    ParentType,
    ContextType
  >;
  result?: Resolver<ResolversTypes['TransactionInfo'], ParentType, ContextType>;
  sigs?: Resolver<Array<ResolversTypes['TransactionSignature']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionCapabilityResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionCapability'] = ResolversParentTypes['TransactionCapability'],
> = {
  args?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionCommandResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionCommand'] = ResolversParentTypes['TransactionCommand'],
> = {
  meta?: Resolver<ResolversTypes['TransactionMeta'], ParentType, ContextType>;
  networkId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payload?: Resolver<ResolversTypes['TransactionPayload'], ParentType, ContextType>;
  signers?: Resolver<Array<ResolversTypes['Signer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionInfo'] = ResolversParentTypes['TransactionInfo'],
> = {
  __resolveType: TypeResolveFn<
    'TransactionMempoolInfo' | 'TransactionResult',
    ParentType,
    ContextType
  >;
};

export type TransactionMempoolInfoResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionMempoolInfo'] = ResolversParentTypes['TransactionMempoolInfo'],
> = {
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionMetaResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionMeta'] = ResolversParentTypes['TransactionMeta'],
> = {
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  gasLimit?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionPayloadResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionPayload'] = ResolversParentTypes['TransactionPayload'],
> = {
  __resolveType: TypeResolveFn<'ContinuationPayload' | 'ExecutionPayload', ParentType, ContextType>;
};

export type TransactionResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionResult'] = ResolversParentTypes['TransactionResult'],
> = {
  badResult?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  continuation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eventCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  events?: Resolver<
    ResolversTypes['TransactionResultEventsConnection'],
    ParentType,
    ContextType,
    Partial<TransactionResultEventsArgs>
  >;
  gas?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  goodResult?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  logs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  transfers?: Resolver<
    ResolversTypes['TransactionResultTransfersConnection'],
    ParentType,
    ContextType,
    Partial<TransactionResultTransfersArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultEventsConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionResultEventsConnection'] = ResolversParentTypes['TransactionResultEventsConnection'],
> = {
  edges?: Resolver<
    Array<Maybe<ResolversTypes['TransactionResultEventsConnectionEdge']>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultEventsConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionResultEventsConnectionEdge'] = ResolversParentTypes['TransactionResultEventsConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultTransfersConnectionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionResultTransfersConnection'] = ResolversParentTypes['TransactionResultTransfersConnection'],
> = {
  edges?: Resolver<
    Array<Maybe<ResolversTypes['TransactionResultTransfersConnectionEdge']>>,
    ParentType,
    ContextType
  >;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultTransfersConnectionEdgeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionResultTransfersConnectionEdge'] = ResolversParentTypes['TransactionResultTransfersConnectionEdge'],
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionSignatureResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TransactionSignature'] = ResolversParentTypes['TransactionSignature'],
> = {
  sig?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransferResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Transfer'] = ResolversParentTypes['Transfer'],
> = {
  amount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  blockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  crossChainTransfer?: Resolver<Maybe<ResolversTypes['Transfer']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  moduleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  receiverAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senderAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserGuardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserGuard'] = ResolversParentTypes['UserGuard'],
> = {
  args?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  fun?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  Block?: BlockResolvers<ContextType>;
  BlockEventsConnection?: BlockEventsConnectionResolvers<ContextType>;
  BlockEventsConnectionEdge?: BlockEventsConnectionEdgeResolvers<ContextType>;
  BlockNeighbor?: BlockNeighborResolvers<ContextType>;
  BlockTransactionsConnection?: BlockTransactionsConnectionResolvers<ContextType>;
  BlockTransactionsConnectionEdge?: BlockTransactionsConnectionEdgeResolvers<ContextType>;
  ContinuationPayload?: ContinuationPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Decimal?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  ExecutionPayload?: ExecutionPayloadResolvers<ContextType>;
  FungibleAccount?: FungibleAccountResolvers<ContextType>;
  FungibleAccountTransactionsConnection?: FungibleAccountTransactionsConnectionResolvers<ContextType>;
  FungibleAccountTransactionsConnectionEdge?: FungibleAccountTransactionsConnectionEdgeResolvers<ContextType>;
  FungibleAccountTransfersConnection?: FungibleAccountTransfersConnectionResolvers<ContextType>;
  FungibleAccountTransfersConnectionEdge?: FungibleAccountTransfersConnectionEdgeResolvers<ContextType>;
  FungibleChainAccount?: FungibleChainAccountResolvers<ContextType>;
  FungibleChainAccountTransactionsConnection?: FungibleChainAccountTransactionsConnectionResolvers<ContextType>;
  FungibleChainAccountTransactionsConnectionEdge?: FungibleChainAccountTransactionsConnectionEdgeResolvers<ContextType>;
  FungibleChainAccountTransfersConnection?: FungibleChainAccountTransfersConnectionResolvers<ContextType>;
  FungibleChainAccountTransfersConnectionEdge?: FungibleChainAccountTransfersConnectionEdgeResolvers<ContextType>;
  GasLimitEstimation?: GasLimitEstimationResolvers<ContextType>;
  GenesisHeight?: GenesisHeightResolvers<ContextType>;
  GraphConfiguration?: GraphConfigurationResolvers<ContextType>;
  IGuard?: IGuardResolvers<ContextType>;
  KeysetGuard?: KeysetGuardResolvers<ContextType>;
  NetworkInfo?: NetworkInfoResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NonFungibleAccount?: NonFungibleAccountResolvers<ContextType>;
  NonFungibleAccountTransactionsConnection?: NonFungibleAccountTransactionsConnectionResolvers<ContextType>;
  NonFungibleAccountTransactionsConnectionEdge?: NonFungibleAccountTransactionsConnectionEdgeResolvers<ContextType>;
  NonFungibleChainAccount?: NonFungibleChainAccountResolvers<ContextType>;
  NonFungibleChainAccountTransactionsConnection?: NonFungibleChainAccountTransactionsConnectionResolvers<ContextType>;
  NonFungibleChainAccountTransactionsConnectionEdge?: NonFungibleChainAccountTransactionsConnectionEdgeResolvers<ContextType>;
  NonFungibleToken?: NonFungibleTokenResolvers<ContextType>;
  NonFungibleTokenBalance?: NonFungibleTokenBalanceResolvers<ContextType>;
  PactQueryResponse?: PactQueryResponseResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  QueryBlocksFromDepthConnection?: QueryBlocksFromDepthConnectionResolvers<ContextType>;
  QueryBlocksFromDepthConnectionEdge?: QueryBlocksFromDepthConnectionEdgeResolvers<ContextType>;
  QueryBlocksFromHeightConnection?: QueryBlocksFromHeightConnectionResolvers<ContextType>;
  QueryBlocksFromHeightConnectionEdge?: QueryBlocksFromHeightConnectionEdgeResolvers<ContextType>;
  QueryCompletedBlockHeightsConnection?: QueryCompletedBlockHeightsConnectionResolvers<ContextType>;
  QueryCompletedBlockHeightsConnectionEdge?: QueryCompletedBlockHeightsConnectionEdgeResolvers<ContextType>;
  QueryEventsConnection?: QueryEventsConnectionResolvers<ContextType>;
  QueryEventsConnectionEdge?: QueryEventsConnectionEdgeResolvers<ContextType>;
  QueryTokensConnection?: QueryTokensConnectionResolvers<ContextType>;
  QueryTokensEdge?: QueryTokensEdgeResolvers<ContextType>;
  QueryTransactionsByPublicKeyConnection?: QueryTransactionsByPublicKeyConnectionResolvers<ContextType>;
  QueryTransactionsByPublicKeyConnectionEdge?: QueryTransactionsByPublicKeyConnectionEdgeResolvers<ContextType>;
  QueryTransactionsConnection?: QueryTransactionsConnectionResolvers<ContextType>;
  QueryTransactionsConnectionEdge?: QueryTransactionsConnectionEdgeResolvers<ContextType>;
  QueryTransfersConnection?: QueryTransfersConnectionResolvers<ContextType>;
  QueryTransfersConnectionEdge?: QueryTransfersConnectionEdgeResolvers<ContextType>;
  RawGuard?: RawGuardResolvers<ContextType>;
  Signer?: SignerResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionCapability?: TransactionCapabilityResolvers<ContextType>;
  TransactionCommand?: TransactionCommandResolvers<ContextType>;
  TransactionInfo?: TransactionInfoResolvers<ContextType>;
  TransactionMempoolInfo?: TransactionMempoolInfoResolvers<ContextType>;
  TransactionMeta?: TransactionMetaResolvers<ContextType>;
  TransactionPayload?: TransactionPayloadResolvers<ContextType>;
  TransactionResult?: TransactionResultResolvers<ContextType>;
  TransactionResultEventsConnection?: TransactionResultEventsConnectionResolvers<ContextType>;
  TransactionResultEventsConnectionEdge?: TransactionResultEventsConnectionEdgeResolvers<ContextType>;
  TransactionResultTransfersConnection?: TransactionResultTransfersConnectionResolvers<ContextType>;
  TransactionResultTransfersConnectionEdge?: TransactionResultTransfersConnectionEdgeResolvers<ContextType>;
  TransactionSignature?: TransactionSignatureResolvers<ContextType>;
  Transfer?: TransferResolvers<ContextType>;
  UserGuard?: UserGuardResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  complexity?: ComplexityDirectiveResolver<any, any, ContextType>;
};
