import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** Floats that will have a value of 0 or more. */
  Decimal: { input: any; output: any; }
};

export type Block = Node & {
  __typename?: 'Block';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  difficulty?: Maybe<Scalars['BigInt']['output']>;
  epoch: Scalars['DateTime']['output'];
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
  powHash: Scalars['String']['output'];
  target: Scalars['String']['output'];
  transactions: BlockTransactionsConnection;
  weight: Scalars['String']['output'];
};


export type BlockEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type BlockTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type BlockEventsConnection = {
  __typename?: 'BlockEventsConnection';
  edges: Array<BlockEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BlockEventsConnectionEdge = {
  __typename?: 'BlockEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type BlockNeighbor = {
  __typename?: 'BlockNeighbor';
  chainId: Scalars['String']['output'];
  hash: Scalars['String']['output'];
};

export type BlockTransactionsConnection = {
  __typename?: 'BlockTransactionsConnection';
  edges: Array<BlockTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BlockTransactionsConnectionEdge = {
  __typename?: 'BlockTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type ContinuationPayload = {
  __typename?: 'ContinuationPayload';
  data: Scalars['String']['output'];
  pactId?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
  rollback?: Maybe<Scalars['Boolean']['output']>;
  step?: Maybe<Scalars['Int']['output']>;
};

export type Event = Node & {
  __typename?: 'Event';
  block: Block;
  chainId: Scalars['BigInt']['output'];
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  moduleName: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orderIndex: Scalars['BigInt']['output'];
  parameters?: Maybe<Scalars['String']['output']>;
  qualifiedName: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
};

export type ExecutionPayload = {
  __typename?: 'ExecutionPayload';
  code?: Maybe<Scalars['String']['output']>;
  data: Scalars['String']['output'];
};

export type FungibleAccount = Node & {
  __typename?: 'FungibleAccount';
  accountName: Scalars['String']['output'];
  chainAccounts: Array<FungibleChainAccount>;
  fungibleName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  totalBalance: Scalars['Decimal']['output'];
  transactions: FungibleAccountTransactionsConnection;
  transfers: FungibleAccountTransfersConnection;
};


export type FungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type FungibleAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type FungibleAccountTransactionsConnection = {
  __typename?: 'FungibleAccountTransactionsConnection';
  edges: Array<FungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type FungibleAccountTransfersConnection = {
  __typename?: 'FungibleAccountTransfersConnection';
  edges: Array<FungibleAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleAccountTransfersConnectionEdge = {
  __typename?: 'FungibleAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export type FungibleChainAccount = Node & {
  __typename?: 'FungibleChainAccount';
  accountName: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  chainId: Scalars['String']['output'];
  fungibleName: Scalars['String']['output'];
  guard: Guard;
  id: Scalars['ID']['output'];
  transactions: FungibleChainAccountTransactionsConnection;
  transfers: FungibleChainAccountTransfersConnection;
};


export type FungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type FungibleChainAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type FungibleChainAccountTransactionsConnection = {
  __typename?: 'FungibleChainAccountTransactionsConnection';
  edges: Array<FungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type FungibleChainAccountTransfersConnection = {
  __typename?: 'FungibleChainAccountTransfersConnection';
  edges: Array<FungibleChainAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleChainAccountTransfersConnectionEdge = {
  __typename?: 'FungibleChainAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export type GasLimitEstimation = {
  __typename?: 'GasLimitEstimation';
  amount: Scalars['Int']['output'];
  inputType: Scalars['String']['output'];
  transaction: Scalars['String']['output'];
  usedPreflight: Scalars['Boolean']['output'];
  usedSignatureVerification: Scalars['Boolean']['output'];
};

export type GenesisHeight = {
  __typename?: 'GenesisHeight';
  chainId: Scalars['String']['output'];
  height: Scalars['Int']['output'];
};

export type GraphConfiguration = {
  __typename?: 'GraphConfiguration';
  /** The lowest block-height that is indexed in this endpoint. */
  minimumBlockHeight?: Maybe<Scalars['BigInt']['output']>;
};

export type Guard = {
  __typename?: 'Guard';
  keys: Array<Scalars['String']['output']>;
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/** Information about the network. */
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

export type Node = {
  id: Scalars['ID']['output'];
};

/** A non-fungible-specific account. */
export type NonFungibleAccount = Node & {
  __typename?: 'NonFungibleAccount';
  accountName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  /** Default page size is 20. Note that custom token related transactions are not included. */
  transactions: NonFungibleAccountTransactionsConnection;
};


/** A non-fungible-specific account. */
export type NonFungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NonFungibleAccountTransactionsConnection = {
  __typename?: 'NonFungibleAccountTransactionsConnection';
  edges: Array<NonFungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NonFungibleAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type NonFungibleChainAccount = Node & {
  __typename?: 'NonFungibleChainAccount';
  accountName: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  transactions: NonFungibleChainAccountTransactionsConnection;
};


export type NonFungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NonFungibleChainAccountTransactionsConnection = {
  __typename?: 'NonFungibleChainAccountTransactionsConnection';
  edges: Array<NonFungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NonFungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type NonFungibleToken = {
  __typename?: 'NonFungibleToken';
  precision: Scalars['Int']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
};

export type NonFungibleTokenBalance = Node & {
  __typename?: 'NonFungibleTokenBalance';
  accountName: Scalars['String']['output'];
  balance: Scalars['Int']['output'];
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  info?: Maybe<NonFungibleToken>;
  tokenId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type PactQuery = {
  chainId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  data?: InputMaybe<Array<PactQueryData>>;
};

export type PactQueryData = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Information related to a token. */
export type PactQueryResponse = {
  __typename?: 'PactQueryResponse';
  chainId: Scalars['String']['output'];
  code: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  block?: Maybe<Block>;
  blocksFromDepth?: Maybe<QueryBlocksFromDepthConnection>;
  blocksFromHeight: QueryBlocksFromHeightConnection;
  completedBlockHeights: QueryCompletedBlockHeightsConnection;
  events: QueryEventsConnection;
  /** Retrieve an fungible specific account by its name and fungible, such as coin. */
  fungibleAccount?: Maybe<FungibleAccount>;
  /** Retrieve an account by public key. */
  fungibleAccountsByPublicKey: Array<FungibleAccount>;
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccount: Array<FungibleChainAccount>;
  /** Retrieve a chain account by public key. */
  fungibleChainAccountsByPublicKey: Array<FungibleChainAccount>;
  /**
   * Estimate the gas limit for one or more transactions. Throws an error when the transaction fails or is invalid. The input accepts a JSON object and based on the parameters passed it will determine what type of format it is and return the gas limit estimation. The following types are supported:
   *
   *     - `full-transaction`: A complete transaction object. Required parameters: `cmd`, `hash` and `sigs`.
   *     - `stringified-command`: A JSON stringified command. Required parameters: `cmd`. It also optionally accepts `sigs`.
   *     - `full-command`: A full command. Required parameters: `payload`, `meta` and `signers`.
   *     - `partial-command`: A partial command. Required parameters: `payload` and either `meta` or `signers`. In case `meta` is not given, but `signers` is given, you can also add `chainId` as a parameter.
   *     - `payload`: A just the payload of a command. Required parameters: `payload` and `chainId`.
   *     - `code`: The code of an execution. Required parameters: `code` and `chainId`.
   *
   *     Every type accepts an optional parameter called `networkId` to override the default value from the environment variables.
   *
   *     Example of the input needed for a type `code` query: `gasLimitEstimate(input: "{\"code\":\"(coin.details \\\"k:1234\\\")\",\"chainId\":\"3\"}")`
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
  transaction?: Maybe<Transaction>;
  transactions: QueryTransactionsConnection;
  transactionsByPublicKey: QueryTransactionsByPublicKeyConnection;
  transfers: QueryTransfersConnection;
};


export type QueryBlockArgs = {
  hash: Scalars['String']['input'];
};


export type QueryBlocksFromDepthArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth: Scalars['Int']['input'];
};


export type QueryBlocksFromHeightArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  endHeight?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  startHeight: Scalars['Int']['input'];
};


export type QueryCompletedBlockHeightsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


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


export type QueryFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFungibleAccountsByPublicKeyArgs = {
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};


export type QueryFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFungibleChainAccountsByPublicKeyArgs = {
  chainId: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};


export type QueryGasLimitEstimateArgs = {
  input: Array<Scalars['String']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryNonFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
};


export type QueryNonFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
};


export type QueryPactQueryArgs = {
  pactQuery: Array<PactQuery>;
};


export type QueryTransactionArgs = {
  blockHash?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  requestKey: Scalars['String']['input'];
};


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


export type QueryTransactionsByPublicKeyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  publicKey: Scalars['String']['input'];
};


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

export type QueryBlocksFromDepthConnection = {
  __typename?: 'QueryBlocksFromDepthConnection';
  edges: Array<Maybe<QueryBlocksFromDepthConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryBlocksFromDepthConnectionEdge = {
  __typename?: 'QueryBlocksFromDepthConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryBlocksFromHeightConnection = {
  __typename?: 'QueryBlocksFromHeightConnection';
  edges: Array<Maybe<QueryBlocksFromHeightConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryBlocksFromHeightConnectionEdge = {
  __typename?: 'QueryBlocksFromHeightConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryCompletedBlockHeightsConnection = {
  __typename?: 'QueryCompletedBlockHeightsConnection';
  edges: Array<Maybe<QueryCompletedBlockHeightsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryCompletedBlockHeightsConnectionEdge = {
  __typename?: 'QueryCompletedBlockHeightsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryEventsConnection = {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryEventsConnectionEdge = {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type QueryTransactionsByPublicKeyConnection = {
  __typename?: 'QueryTransactionsByPublicKeyConnection';
  edges: Array<Maybe<QueryTransactionsByPublicKeyConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransactionsByPublicKeyConnectionEdge = {
  __typename?: 'QueryTransactionsByPublicKeyConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type QueryTransactionsConnection = {
  __typename?: 'QueryTransactionsConnection';
  edges: Array<QueryTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransactionsConnectionEdge = {
  __typename?: 'QueryTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type QueryTransfersConnection = {
  __typename?: 'QueryTransfersConnection';
  edges: Array<QueryTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransfersConnectionEdge = {
  __typename?: 'QueryTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export type Signer = Node & {
  __typename?: 'Signer';
  address?: Maybe<Scalars['String']['output']>;
  clist: Array<TransactionCapability>;
  id: Scalars['ID']['output'];
  orderIndex?: Maybe<Scalars['Int']['output']>;
  pubkey: Scalars['String']['output'];
  scheme?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  events?: Maybe<Array<Event>>;
  newBlocks?: Maybe<Array<Block>>;
  newBlocksFromDepth?: Maybe<Array<Block>>;
  transaction?: Maybe<Transaction>;
};


export type SubscriptionEventsArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  qualifiedEventName: Scalars['String']['input'];
};


export type SubscriptionNewBlocksArgs = {
  chainIds: Array<InputMaybe<Scalars['String']['input']>>;
};


export type SubscriptionNewBlocksFromDepthArgs = {
  chainIds: Array<Scalars['String']['input']>;
  minimumDepth: Scalars['Int']['input'];
};


export type SubscriptionTransactionArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  requestKey: Scalars['String']['input'];
};

export type Transaction = Node & {
  __typename?: 'Transaction';
  cmd: TransactionCommand;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orphanedTransactions?: Maybe<Array<Maybe<Transaction>>>;
  result: TransactionInfo;
  sigs: Array<TransactionSignature>;
};

export type TransactionCapability = {
  __typename?: 'TransactionCapability';
  args: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type TransactionCommand = {
  __typename?: 'TransactionCommand';
  meta: TransactionMeta;
  /** The network id of the environment. */
  networkId: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
  payload: TransactionPayload;
  signers: Array<Signer>;
};

export type TransactionInfo = TransactionMempoolInfo | TransactionResult;

export type TransactionMempoolInfo = {
  __typename?: 'TransactionMempoolInfo';
  status?: Maybe<Scalars['String']['output']>;
};

export type TransactionMeta = {
  __typename?: 'TransactionMeta';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  gasLimit: Scalars['BigInt']['output'];
  gasPrice: Scalars['Float']['output'];
  sender: Scalars['String']['output'];
  ttl: Scalars['BigInt']['output'];
};

export type TransactionPayload = ContinuationPayload | ExecutionPayload;

export type TransactionResult = {
  __typename?: 'TransactionResult';
  badResult?: Maybe<Scalars['String']['output']>;
  block: Block;
  continuation?: Maybe<Scalars['String']['output']>;
  eventCount?: Maybe<Scalars['BigInt']['output']>;
  events: TransactionResultEventsConnection;
  gas: Scalars['BigInt']['output'];
  goodResult?: Maybe<Scalars['String']['output']>;
  height: Scalars['BigInt']['output'];
  logs?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['BigInt']['output']>;
  transfers: TransactionResultTransfersConnection;
};


export type TransactionResultEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type TransactionResultTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type TransactionResultEventsConnection = {
  __typename?: 'TransactionResultEventsConnection';
  edges: Array<Maybe<TransactionResultEventsConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
  transactionId: Scalars['String']['output'];
};

export type TransactionResultEventsConnectionEdge = {
  __typename?: 'TransactionResultEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type TransactionResultTransfersConnection = {
  __typename?: 'TransactionResultTransfersConnection';
  edges: Array<Maybe<TransactionResultTransfersConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type TransactionResultTransfersConnectionEdge = {
  __typename?: 'TransactionResultTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export type TransactionSignature = {
  __typename?: 'TransactionSignature';
  sig: Scalars['String']['output'];
};

export type Transfer = Node & {
  __typename?: 'Transfer';
  amount: Scalars['Decimal']['output'];
  block: Block;
  crossChainTransfer?: Maybe<Transfer>;
  id: Scalars['ID']['output'];
  moduleName: Scalars['String']['output'];
  orderIndex: Scalars['BigInt']['output'];
  receiverAccount: Scalars['String']['output'];
  senderAccount: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  TransactionInfo: ( TransactionMempoolInfo ) | ( Omit<TransactionResult, 'block' | 'events' | 'transfers'> & { block: _RefType['Block'], events: _RefType['TransactionResultEventsConnection'], transfers: _RefType['TransactionResultTransfersConnection'] } );
  TransactionPayload: ( ContinuationPayload ) | ( ExecutionPayload );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Node: ( Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & { events: _RefType['BlockEventsConnection'], minerAccount: _RefType['FungibleChainAccount'], parent?: Maybe<_RefType['Block']>, transactions: _RefType['BlockTransactionsConnection'] } ) | ( Omit<Event, 'block' | 'transaction'> & { block: _RefType['Block'], transaction?: Maybe<_RefType['Transaction']> } ) | ( Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & { chainAccounts: Array<_RefType['FungibleChainAccount']>, transactions: _RefType['FungibleAccountTransactionsConnection'], transfers: _RefType['FungibleAccountTransfersConnection'] } ) | ( Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & { guard: _RefType['Guard'], transactions: _RefType['FungibleChainAccountTransactionsConnection'], transfers: _RefType['FungibleChainAccountTransfersConnection'] } ) | ( Omit<NonFungibleAccount, 'transactions'> & { transactions: _RefType['NonFungibleAccountTransactionsConnection'] } ) | ( Omit<NonFungibleChainAccount, 'transactions'> & { transactions: _RefType['NonFungibleChainAccountTransactionsConnection'] } ) | ( NonFungibleTokenBalance ) | ( Signer ) | ( Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & { cmd: _RefType['TransactionCommand'], orphanedTransactions?: Maybe<Array<Maybe<_RefType['Transaction']>>>, result: _RefType['TransactionInfo'] } ) | ( Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & { block: _RefType['Block'], crossChainTransfer?: Maybe<_RefType['Transfer']>, transaction?: Maybe<_RefType['Transaction']> } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Block: ResolverTypeWrapper<Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & { events: ResolversTypes['BlockEventsConnection'], minerAccount: ResolversTypes['FungibleChainAccount'], parent?: Maybe<ResolversTypes['Block']>, transactions: ResolversTypes['BlockTransactionsConnection'] }>;
  BlockEventsConnection: ResolverTypeWrapper<Omit<BlockEventsConnection, 'edges'> & { edges: Array<ResolversTypes['BlockEventsConnectionEdge']> }>;
  BlockEventsConnectionEdge: ResolverTypeWrapper<Omit<BlockEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }>;
  BlockNeighbor: ResolverTypeWrapper<BlockNeighbor>;
  BlockTransactionsConnection: ResolverTypeWrapper<Omit<BlockTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['BlockTransactionsConnectionEdge']> }>;
  BlockTransactionsConnectionEdge: ResolverTypeWrapper<Omit<BlockTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ContinuationPayload: ResolverTypeWrapper<ContinuationPayload>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  Event: ResolverTypeWrapper<Omit<Event, 'block' | 'transaction'> & { block: ResolversTypes['Block'], transaction?: Maybe<ResolversTypes['Transaction']> }>;
  ExecutionPayload: ResolverTypeWrapper<ExecutionPayload>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FungibleAccount: ResolverTypeWrapper<Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & { chainAccounts: Array<ResolversTypes['FungibleChainAccount']>, transactions: ResolversTypes['FungibleAccountTransactionsConnection'], transfers: ResolversTypes['FungibleAccountTransfersConnection'] }>;
  FungibleAccountTransactionsConnection: ResolverTypeWrapper<Omit<FungibleAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['FungibleAccountTransactionsConnectionEdge']> }>;
  FungibleAccountTransactionsConnectionEdge: ResolverTypeWrapper<Omit<FungibleAccountTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  FungibleAccountTransfersConnection: ResolverTypeWrapper<Omit<FungibleAccountTransfersConnection, 'edges'> & { edges: Array<ResolversTypes['FungibleAccountTransfersConnectionEdge']> }>;
  FungibleAccountTransfersConnectionEdge: ResolverTypeWrapper<Omit<FungibleAccountTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }>;
  FungibleChainAccount: ResolverTypeWrapper<Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & { guard: ResolversTypes['Guard'], transactions: ResolversTypes['FungibleChainAccountTransactionsConnection'], transfers: ResolversTypes['FungibleChainAccountTransfersConnection'] }>;
  FungibleChainAccountTransactionsConnection: ResolverTypeWrapper<Omit<FungibleChainAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['FungibleChainAccountTransactionsConnectionEdge']> }>;
  FungibleChainAccountTransactionsConnectionEdge: ResolverTypeWrapper<Omit<FungibleChainAccountTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  FungibleChainAccountTransfersConnection: ResolverTypeWrapper<Omit<FungibleChainAccountTransfersConnection, 'edges'> & { edges: Array<ResolversTypes['FungibleChainAccountTransfersConnectionEdge']> }>;
  FungibleChainAccountTransfersConnectionEdge: ResolverTypeWrapper<Omit<FungibleChainAccountTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }>;
  GasLimitEstimation: ResolverTypeWrapper<GasLimitEstimation>;
  GenesisHeight: ResolverTypeWrapper<GenesisHeight>;
  GraphConfiguration: ResolverTypeWrapper<GraphConfiguration>;
  Guard: ResolverTypeWrapper<Guard>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  NetworkInfo: ResolverTypeWrapper<NetworkInfo>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NonFungibleAccount: ResolverTypeWrapper<Omit<NonFungibleAccount, 'transactions'> & { transactions: ResolversTypes['NonFungibleAccountTransactionsConnection'] }>;
  NonFungibleAccountTransactionsConnection: ResolverTypeWrapper<Omit<NonFungibleAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['NonFungibleAccountTransactionsConnectionEdge']> }>;
  NonFungibleAccountTransactionsConnectionEdge: ResolverTypeWrapper<Omit<NonFungibleAccountTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  NonFungibleChainAccount: ResolverTypeWrapper<Omit<NonFungibleChainAccount, 'transactions'> & { transactions: ResolversTypes['NonFungibleChainAccountTransactionsConnection'] }>;
  NonFungibleChainAccountTransactionsConnection: ResolverTypeWrapper<Omit<NonFungibleChainAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['NonFungibleChainAccountTransactionsConnectionEdge']> }>;
  NonFungibleChainAccountTransactionsConnectionEdge: ResolverTypeWrapper<Omit<NonFungibleChainAccountTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  NonFungibleToken: ResolverTypeWrapper<NonFungibleToken>;
  NonFungibleTokenBalance: ResolverTypeWrapper<NonFungibleTokenBalance>;
  PactQuery: PactQuery;
  PactQueryData: PactQueryData;
  PactQueryResponse: ResolverTypeWrapper<PactQueryResponse>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  QueryBlocksFromDepthConnection: ResolverTypeWrapper<Omit<QueryBlocksFromDepthConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['QueryBlocksFromDepthConnectionEdge']>> }>;
  QueryBlocksFromDepthConnectionEdge: ResolverTypeWrapper<Omit<QueryBlocksFromDepthConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }>;
  QueryBlocksFromHeightConnection: ResolverTypeWrapper<Omit<QueryBlocksFromHeightConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['QueryBlocksFromHeightConnectionEdge']>> }>;
  QueryBlocksFromHeightConnectionEdge: ResolverTypeWrapper<Omit<QueryBlocksFromHeightConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }>;
  QueryCompletedBlockHeightsConnection: ResolverTypeWrapper<Omit<QueryCompletedBlockHeightsConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['QueryCompletedBlockHeightsConnectionEdge']>> }>;
  QueryCompletedBlockHeightsConnectionEdge: ResolverTypeWrapper<Omit<QueryCompletedBlockHeightsConnectionEdge, 'node'> & { node: ResolversTypes['Block'] }>;
  QueryEventsConnection: ResolverTypeWrapper<Omit<QueryEventsConnection, 'edges'> & { edges: Array<ResolversTypes['QueryEventsConnectionEdge']> }>;
  QueryEventsConnectionEdge: ResolverTypeWrapper<Omit<QueryEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }>;
  QueryTransactionsByPublicKeyConnection: ResolverTypeWrapper<Omit<QueryTransactionsByPublicKeyConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['QueryTransactionsByPublicKeyConnectionEdge']>> }>;
  QueryTransactionsByPublicKeyConnectionEdge: ResolverTypeWrapper<Omit<QueryTransactionsByPublicKeyConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  QueryTransactionsConnection: ResolverTypeWrapper<Omit<QueryTransactionsConnection, 'edges'> & { edges: Array<ResolversTypes['QueryTransactionsConnectionEdge']> }>;
  QueryTransactionsConnectionEdge: ResolverTypeWrapper<Omit<QueryTransactionsConnectionEdge, 'node'> & { node: ResolversTypes['Transaction'] }>;
  QueryTransfersConnection: ResolverTypeWrapper<Omit<QueryTransfersConnection, 'edges'> & { edges: Array<ResolversTypes['QueryTransfersConnectionEdge']> }>;
  QueryTransfersConnectionEdge: ResolverTypeWrapper<Omit<QueryTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }>;
  Signer: ResolverTypeWrapper<Signer>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Transaction: ResolverTypeWrapper<Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & { cmd: ResolversTypes['TransactionCommand'], orphanedTransactions?: Maybe<Array<Maybe<ResolversTypes['Transaction']>>>, result: ResolversTypes['TransactionInfo'] }>;
  TransactionCapability: ResolverTypeWrapper<TransactionCapability>;
  TransactionCommand: ResolverTypeWrapper<Omit<TransactionCommand, 'meta' | 'payload'> & { meta: ResolversTypes['TransactionMeta'], payload: ResolversTypes['TransactionPayload'] }>;
  TransactionInfo: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransactionInfo']>;
  TransactionMempoolInfo: ResolverTypeWrapper<TransactionMempoolInfo>;
  TransactionMeta: ResolverTypeWrapper<TransactionMeta>;
  TransactionPayload: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransactionPayload']>;
  TransactionResult: ResolverTypeWrapper<Omit<TransactionResult, 'block' | 'events' | 'transfers'> & { block: ResolversTypes['Block'], events: ResolversTypes['TransactionResultEventsConnection'], transfers: ResolversTypes['TransactionResultTransfersConnection'] }>;
  TransactionResultEventsConnection: ResolverTypeWrapper<Omit<TransactionResultEventsConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['TransactionResultEventsConnectionEdge']>> }>;
  TransactionResultEventsConnectionEdge: ResolverTypeWrapper<Omit<TransactionResultEventsConnectionEdge, 'node'> & { node: ResolversTypes['Event'] }>;
  TransactionResultTransfersConnection: ResolverTypeWrapper<Omit<TransactionResultTransfersConnection, 'edges'> & { edges: Array<Maybe<ResolversTypes['TransactionResultTransfersConnectionEdge']>> }>;
  TransactionResultTransfersConnectionEdge: ResolverTypeWrapper<Omit<TransactionResultTransfersConnectionEdge, 'node'> & { node: ResolversTypes['Transfer'] }>;
  TransactionSignature: ResolverTypeWrapper<TransactionSignature>;
  Transfer: ResolverTypeWrapper<Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & { block: ResolversTypes['Block'], crossChainTransfer?: Maybe<ResolversTypes['Transfer']>, transaction?: Maybe<ResolversTypes['Transaction']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  Block: Omit<Block, 'events' | 'minerAccount' | 'parent' | 'transactions'> & { events: ResolversParentTypes['BlockEventsConnection'], minerAccount: ResolversParentTypes['FungibleChainAccount'], parent?: Maybe<ResolversParentTypes['Block']>, transactions: ResolversParentTypes['BlockTransactionsConnection'] };
  BlockEventsConnection: Omit<BlockEventsConnection, 'edges'> & { edges: Array<ResolversParentTypes['BlockEventsConnectionEdge']> };
  BlockEventsConnectionEdge: Omit<BlockEventsConnectionEdge, 'node'> & { node: ResolversParentTypes['Event'] };
  BlockNeighbor: BlockNeighbor;
  BlockTransactionsConnection: Omit<BlockTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['BlockTransactionsConnectionEdge']> };
  BlockTransactionsConnectionEdge: Omit<BlockTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  Boolean: Scalars['Boolean']['output'];
  ContinuationPayload: ContinuationPayload;
  DateTime: Scalars['DateTime']['output'];
  Decimal: Scalars['Decimal']['output'];
  Event: Omit<Event, 'block' | 'transaction'> & { block: ResolversParentTypes['Block'], transaction?: Maybe<ResolversParentTypes['Transaction']> };
  ExecutionPayload: ExecutionPayload;
  Float: Scalars['Float']['output'];
  FungibleAccount: Omit<FungibleAccount, 'chainAccounts' | 'transactions' | 'transfers'> & { chainAccounts: Array<ResolversParentTypes['FungibleChainAccount']>, transactions: ResolversParentTypes['FungibleAccountTransactionsConnection'], transfers: ResolversParentTypes['FungibleAccountTransfersConnection'] };
  FungibleAccountTransactionsConnection: Omit<FungibleAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['FungibleAccountTransactionsConnectionEdge']> };
  FungibleAccountTransactionsConnectionEdge: Omit<FungibleAccountTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  FungibleAccountTransfersConnection: Omit<FungibleAccountTransfersConnection, 'edges'> & { edges: Array<ResolversParentTypes['FungibleAccountTransfersConnectionEdge']> };
  FungibleAccountTransfersConnectionEdge: Omit<FungibleAccountTransfersConnectionEdge, 'node'> & { node: ResolversParentTypes['Transfer'] };
  FungibleChainAccount: Omit<FungibleChainAccount, 'guard' | 'transactions' | 'transfers'> & { guard: ResolversParentTypes['Guard'], transactions: ResolversParentTypes['FungibleChainAccountTransactionsConnection'], transfers: ResolversParentTypes['FungibleChainAccountTransfersConnection'] };
  FungibleChainAccountTransactionsConnection: Omit<FungibleChainAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge']> };
  FungibleChainAccountTransactionsConnectionEdge: Omit<FungibleChainAccountTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  FungibleChainAccountTransfersConnection: Omit<FungibleChainAccountTransfersConnection, 'edges'> & { edges: Array<ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge']> };
  FungibleChainAccountTransfersConnectionEdge: Omit<FungibleChainAccountTransfersConnectionEdge, 'node'> & { node: ResolversParentTypes['Transfer'] };
  GasLimitEstimation: GasLimitEstimation;
  GenesisHeight: GenesisHeight;
  GraphConfiguration: GraphConfiguration;
  Guard: Guard;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  NetworkInfo: NetworkInfo;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NonFungibleAccount: Omit<NonFungibleAccount, 'transactions'> & { transactions: ResolversParentTypes['NonFungibleAccountTransactionsConnection'] };
  NonFungibleAccountTransactionsConnection: Omit<NonFungibleAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge']> };
  NonFungibleAccountTransactionsConnectionEdge: Omit<NonFungibleAccountTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  NonFungibleChainAccount: Omit<NonFungibleChainAccount, 'transactions'> & { transactions: ResolversParentTypes['NonFungibleChainAccountTransactionsConnection'] };
  NonFungibleChainAccountTransactionsConnection: Omit<NonFungibleChainAccountTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge']> };
  NonFungibleChainAccountTransactionsConnectionEdge: Omit<NonFungibleChainAccountTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  NonFungibleToken: NonFungibleToken;
  NonFungibleTokenBalance: NonFungibleTokenBalance;
  PactQuery: PactQuery;
  PactQueryData: PactQueryData;
  PactQueryResponse: PactQueryResponse;
  PageInfo: PageInfo;
  Query: {};
  QueryBlocksFromDepthConnection: Omit<QueryBlocksFromDepthConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['QueryBlocksFromDepthConnectionEdge']>> };
  QueryBlocksFromDepthConnectionEdge: Omit<QueryBlocksFromDepthConnectionEdge, 'node'> & { node: ResolversParentTypes['Block'] };
  QueryBlocksFromHeightConnection: Omit<QueryBlocksFromHeightConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['QueryBlocksFromHeightConnectionEdge']>> };
  QueryBlocksFromHeightConnectionEdge: Omit<QueryBlocksFromHeightConnectionEdge, 'node'> & { node: ResolversParentTypes['Block'] };
  QueryCompletedBlockHeightsConnection: Omit<QueryCompletedBlockHeightsConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge']>> };
  QueryCompletedBlockHeightsConnectionEdge: Omit<QueryCompletedBlockHeightsConnectionEdge, 'node'> & { node: ResolversParentTypes['Block'] };
  QueryEventsConnection: Omit<QueryEventsConnection, 'edges'> & { edges: Array<ResolversParentTypes['QueryEventsConnectionEdge']> };
  QueryEventsConnectionEdge: Omit<QueryEventsConnectionEdge, 'node'> & { node: ResolversParentTypes['Event'] };
  QueryTransactionsByPublicKeyConnection: Omit<QueryTransactionsByPublicKeyConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge']>> };
  QueryTransactionsByPublicKeyConnectionEdge: Omit<QueryTransactionsByPublicKeyConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  QueryTransactionsConnection: Omit<QueryTransactionsConnection, 'edges'> & { edges: Array<ResolversParentTypes['QueryTransactionsConnectionEdge']> };
  QueryTransactionsConnectionEdge: Omit<QueryTransactionsConnectionEdge, 'node'> & { node: ResolversParentTypes['Transaction'] };
  QueryTransfersConnection: Omit<QueryTransfersConnection, 'edges'> & { edges: Array<ResolversParentTypes['QueryTransfersConnectionEdge']> };
  QueryTransfersConnectionEdge: Omit<QueryTransfersConnectionEdge, 'node'> & { node: ResolversParentTypes['Transfer'] };
  Signer: Signer;
  String: Scalars['String']['output'];
  Subscription: {};
  Transaction: Omit<Transaction, 'cmd' | 'orphanedTransactions' | 'result'> & { cmd: ResolversParentTypes['TransactionCommand'], orphanedTransactions?: Maybe<Array<Maybe<ResolversParentTypes['Transaction']>>>, result: ResolversParentTypes['TransactionInfo'] };
  TransactionCapability: TransactionCapability;
  TransactionCommand: Omit<TransactionCommand, 'meta' | 'payload'> & { meta: ResolversParentTypes['TransactionMeta'], payload: ResolversParentTypes['TransactionPayload'] };
  TransactionInfo: ResolversUnionTypes<ResolversParentTypes>['TransactionInfo'];
  TransactionMempoolInfo: TransactionMempoolInfo;
  TransactionMeta: TransactionMeta;
  TransactionPayload: ResolversUnionTypes<ResolversParentTypes>['TransactionPayload'];
  TransactionResult: Omit<TransactionResult, 'block' | 'events' | 'transfers'> & { block: ResolversParentTypes['Block'], events: ResolversParentTypes['TransactionResultEventsConnection'], transfers: ResolversParentTypes['TransactionResultTransfersConnection'] };
  TransactionResultEventsConnection: Omit<TransactionResultEventsConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['TransactionResultEventsConnectionEdge']>> };
  TransactionResultEventsConnectionEdge: Omit<TransactionResultEventsConnectionEdge, 'node'> & { node: ResolversParentTypes['Event'] };
  TransactionResultTransfersConnection: Omit<TransactionResultTransfersConnection, 'edges'> & { edges: Array<Maybe<ResolversParentTypes['TransactionResultTransfersConnectionEdge']>> };
  TransactionResultTransfersConnectionEdge: Omit<TransactionResultTransfersConnectionEdge, 'node'> & { node: ResolversParentTypes['Transfer'] };
  TransactionSignature: TransactionSignature;
  Transfer: Omit<Transfer, 'block' | 'crossChainTransfer' | 'transaction'> & { block: ResolversParentTypes['Block'], crossChainTransfer?: Maybe<ResolversParentTypes['Transfer']>, transaction?: Maybe<ResolversParentTypes['Transaction']> };
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['Block'] = ResolversParentTypes['Block']> = {
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  difficulty?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  epoch?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['BlockEventsConnection'], ParentType, ContextType, RequireFields<BlockEventsArgs, 'first' | 'last'>>;
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
  transactions?: Resolver<ResolversTypes['BlockTransactionsConnection'], ParentType, ContextType, RequireFields<BlockTransactionsArgs, 'first' | 'last'>>;
  weight?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockEventsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockEventsConnection'] = ResolversParentTypes['BlockEventsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['BlockEventsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockEventsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockEventsConnectionEdge'] = ResolversParentTypes['BlockEventsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockNeighborResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockNeighbor'] = ResolversParentTypes['BlockNeighbor']> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockTransactionsConnection'] = ResolversParentTypes['BlockTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['BlockTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockTransactionsConnectionEdge'] = ResolversParentTypes['BlockTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContinuationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContinuationPayload'] = ResolversParentTypes['ContinuationPayload']> = {
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pactId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proof?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rollback?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  parameters?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qualifiedName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExecutionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExecutionPayload'] = ResolversParentTypes['ExecutionPayload']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleAccount'] = ResolversParentTypes['FungibleAccount']> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainAccounts?: Resolver<Array<ResolversTypes['FungibleChainAccount']>, ParentType, ContextType>;
  fungibleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalBalance?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  transactions?: Resolver<ResolversTypes['FungibleAccountTransactionsConnection'], ParentType, ContextType, RequireFields<FungibleAccountTransactionsArgs, 'first' | 'last'>>;
  transfers?: Resolver<ResolversTypes['FungibleAccountTransfersConnection'], ParentType, ContextType, RequireFields<FungibleAccountTransfersArgs, 'first' | 'last'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleAccountTransactionsConnection'] = ResolversParentTypes['FungibleAccountTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FungibleAccountTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleAccountTransactionsConnectionEdge'] = ResolversParentTypes['FungibleAccountTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransfersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleAccountTransfersConnection'] = ResolversParentTypes['FungibleAccountTransfersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FungibleAccountTransfersConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleAccountTransfersConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleAccountTransfersConnectionEdge'] = ResolversParentTypes['FungibleAccountTransfersConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleChainAccount'] = ResolversParentTypes['FungibleChainAccount']> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fungibleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guard?: Resolver<ResolversTypes['Guard'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactions?: Resolver<ResolversTypes['FungibleChainAccountTransactionsConnection'], ParentType, ContextType, RequireFields<FungibleChainAccountTransactionsArgs, 'first' | 'last'>>;
  transfers?: Resolver<ResolversTypes['FungibleChainAccountTransfersConnection'], ParentType, ContextType, RequireFields<FungibleChainAccountTransfersArgs, 'first' | 'last'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleChainAccountTransactionsConnection'] = ResolversParentTypes['FungibleChainAccountTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FungibleChainAccountTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge'] = ResolversParentTypes['FungibleChainAccountTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransfersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleChainAccountTransfersConnection'] = ResolversParentTypes['FungibleChainAccountTransfersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FungibleChainAccountTransfersConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FungibleChainAccountTransfersConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge'] = ResolversParentTypes['FungibleChainAccountTransfersConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GasLimitEstimationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GasLimitEstimation'] = ResolversParentTypes['GasLimitEstimation']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inputType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedPreflight?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  usedSignatureVerification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenesisHeightResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenesisHeight'] = ResolversParentTypes['GenesisHeight']> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphConfigurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GraphConfiguration'] = ResolversParentTypes['GraphConfiguration']> = {
  minimumBlockHeight?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Guard'] = ResolversParentTypes['Guard']> = {
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raw?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NetworkInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['NetworkInfo'] = ResolversParentTypes['NetworkInfo']> = {
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

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Block' | 'Event' | 'FungibleAccount' | 'FungibleChainAccount' | 'NonFungibleAccount' | 'NonFungibleChainAccount' | 'NonFungibleTokenBalance' | 'Signer' | 'Transaction' | 'Transfer', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NonFungibleAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleAccount'] = ResolversParentTypes['NonFungibleAccount']> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nonFungibleTokenBalances?: Resolver<Array<ResolversTypes['NonFungibleTokenBalance']>, ParentType, ContextType>;
  transactions?: Resolver<ResolversTypes['NonFungibleAccountTransactionsConnection'], ParentType, ContextType, RequireFields<NonFungibleAccountTransactionsArgs, 'first' | 'last'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleAccountTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleAccountTransactionsConnection'] = ResolversParentTypes['NonFungibleAccountTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NonFungibleAccountTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleAccountTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge'] = ResolversParentTypes['NonFungibleAccountTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleChainAccount'] = ResolversParentTypes['NonFungibleChainAccount']> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nonFungibleTokenBalances?: Resolver<Array<ResolversTypes['NonFungibleTokenBalance']>, ParentType, ContextType>;
  transactions?: Resolver<ResolversTypes['NonFungibleChainAccountTransactionsConnection'], ParentType, ContextType, RequireFields<NonFungibleChainAccountTransactionsArgs, 'first' | 'last'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleChainAccountTransactionsConnection'] = ResolversParentTypes['NonFungibleChainAccountTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NonFungibleChainAccountTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleChainAccountTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge'] = ResolversParentTypes['NonFungibleChainAccountTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleToken'] = ResolversParentTypes['NonFungibleToken']> = {
  precision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  supply?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NonFungibleTokenBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleTokenBalance'] = ResolversParentTypes['NonFungibleTokenBalance']> = {
  accountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  info?: Resolver<Maybe<ResolversTypes['NonFungibleToken']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PactQueryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PactQueryResponse'] = ResolversParentTypes['PactQueryResponse']> = {
  chainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  block?: Resolver<Maybe<ResolversTypes['Block']>, ParentType, ContextType, RequireFields<QueryBlockArgs, 'hash'>>;
  blocksFromDepth?: Resolver<Maybe<ResolversTypes['QueryBlocksFromDepthConnection']>, ParentType, ContextType, RequireFields<QueryBlocksFromDepthArgs, 'first' | 'last' | 'minimumDepth'>>;
  blocksFromHeight?: Resolver<ResolversTypes['QueryBlocksFromHeightConnection'], ParentType, ContextType, RequireFields<QueryBlocksFromHeightArgs, 'first' | 'last' | 'startHeight'>>;
  completedBlockHeights?: Resolver<ResolversTypes['QueryCompletedBlockHeightsConnection'], ParentType, ContextType, RequireFields<QueryCompletedBlockHeightsArgs, 'completedHeights' | 'first' | 'heightCount' | 'last'>>;
  events?: Resolver<ResolversTypes['QueryEventsConnection'], ParentType, ContextType, RequireFields<QueryEventsArgs, 'first' | 'last' | 'qualifiedEventName'>>;
  fungibleAccount?: Resolver<Maybe<ResolversTypes['FungibleAccount']>, ParentType, ContextType, RequireFields<QueryFungibleAccountArgs, 'accountName' | 'fungibleName'>>;
  fungibleAccountsByPublicKey?: Resolver<Array<ResolversTypes['FungibleAccount']>, ParentType, ContextType, RequireFields<QueryFungibleAccountsByPublicKeyArgs, 'fungibleName' | 'publicKey'>>;
  fungibleChainAccount?: Resolver<Array<ResolversTypes['FungibleChainAccount']>, ParentType, ContextType, RequireFields<QueryFungibleChainAccountArgs, 'accountName' | 'fungibleName'>>;
  fungibleChainAccountsByPublicKey?: Resolver<Array<ResolversTypes['FungibleChainAccount']>, ParentType, ContextType, RequireFields<QueryFungibleChainAccountsByPublicKeyArgs, 'chainId' | 'fungibleName' | 'publicKey'>>;
  gasLimitEstimate?: Resolver<Array<ResolversTypes['GasLimitEstimation']>, ParentType, ContextType, RequireFields<QueryGasLimitEstimateArgs, 'input'>>;
  graphConfiguration?: Resolver<ResolversTypes['GraphConfiguration'], ParentType, ContextType>;
  lastBlockHeight?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  networkInfo?: Resolver<Maybe<ResolversTypes['NetworkInfo']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  nodes?: Resolver<Array<Maybe<ResolversTypes['Node']>>, ParentType, ContextType, RequireFields<QueryNodesArgs, 'ids'>>;
  nonFungibleAccount?: Resolver<Maybe<ResolversTypes['NonFungibleAccount']>, ParentType, ContextType, RequireFields<QueryNonFungibleAccountArgs, 'accountName'>>;
  nonFungibleChainAccount?: Resolver<Maybe<ResolversTypes['NonFungibleChainAccount']>, ParentType, ContextType, RequireFields<QueryNonFungibleChainAccountArgs, 'accountName' | 'chainId'>>;
  pactQuery?: Resolver<Array<ResolversTypes['PactQueryResponse']>, ParentType, ContextType, RequireFields<QueryPactQueryArgs, 'pactQuery'>>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QueryTransactionArgs, 'requestKey'>>;
  transactions?: Resolver<ResolversTypes['QueryTransactionsConnection'], ParentType, ContextType, RequireFields<QueryTransactionsArgs, 'first' | 'last'>>;
  transactionsByPublicKey?: Resolver<ResolversTypes['QueryTransactionsByPublicKeyConnection'], ParentType, ContextType, RequireFields<QueryTransactionsByPublicKeyArgs, 'first' | 'last' | 'publicKey'>>;
  transfers?: Resolver<ResolversTypes['QueryTransfersConnection'], ParentType, ContextType, RequireFields<QueryTransfersArgs, 'first' | 'last'>>;
};

export type QueryBlocksFromDepthConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryBlocksFromDepthConnection'] = ResolversParentTypes['QueryBlocksFromDepthConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['QueryBlocksFromDepthConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromDepthConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryBlocksFromDepthConnectionEdge'] = ResolversParentTypes['QueryBlocksFromDepthConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromHeightConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryBlocksFromHeightConnection'] = ResolversParentTypes['QueryBlocksFromHeightConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['QueryBlocksFromHeightConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryBlocksFromHeightConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryBlocksFromHeightConnectionEdge'] = ResolversParentTypes['QueryBlocksFromHeightConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryCompletedBlockHeightsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryCompletedBlockHeightsConnection'] = ResolversParentTypes['QueryCompletedBlockHeightsConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['QueryCompletedBlockHeightsConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryCompletedBlockHeightsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge'] = ResolversParentTypes['QueryCompletedBlockHeightsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryEventsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryEventsConnection'] = ResolversParentTypes['QueryEventsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['QueryEventsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryEventsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryEventsConnectionEdge'] = ResolversParentTypes['QueryEventsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsByPublicKeyConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransactionsByPublicKeyConnection'] = ResolversParentTypes['QueryTransactionsByPublicKeyConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['QueryTransactionsByPublicKeyConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsByPublicKeyConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge'] = ResolversParentTypes['QueryTransactionsByPublicKeyConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransactionsConnection'] = ResolversParentTypes['QueryTransactionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['QueryTransactionsConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransactionsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransactionsConnectionEdge'] = ResolversParentTypes['QueryTransactionsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransfersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransfersConnection'] = ResolversParentTypes['QueryTransfersConnection']> = {
  edges?: Resolver<Array<ResolversTypes['QueryTransfersConnectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryTransfersConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryTransfersConnectionEdge'] = ResolversParentTypes['QueryTransfersConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Signer'] = ResolversParentTypes['Signer']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clist?: Resolver<Array<ResolversTypes['TransactionCapability']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderIndex?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pubkey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scheme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  events?: SubscriptionResolver<Maybe<Array<ResolversTypes['Event']>>, "events", ParentType, ContextType, RequireFields<SubscriptionEventsArgs, 'qualifiedEventName'>>;
  newBlocks?: SubscriptionResolver<Maybe<Array<ResolversTypes['Block']>>, "newBlocks", ParentType, ContextType, RequireFields<SubscriptionNewBlocksArgs, 'chainIds'>>;
  newBlocksFromDepth?: SubscriptionResolver<Maybe<Array<ResolversTypes['Block']>>, "newBlocksFromDepth", ParentType, ContextType, RequireFields<SubscriptionNewBlocksFromDepthArgs, 'chainIds' | 'minimumDepth'>>;
  transaction?: SubscriptionResolver<Maybe<ResolversTypes['Transaction']>, "transaction", ParentType, ContextType, RequireFields<SubscriptionTransactionArgs, 'requestKey'>>;
};

export type TransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  cmd?: Resolver<ResolversTypes['TransactionCommand'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orphanedTransactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Transaction']>>>, ParentType, ContextType>;
  result?: Resolver<ResolversTypes['TransactionInfo'], ParentType, ContextType>;
  sigs?: Resolver<Array<ResolversTypes['TransactionSignature']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionCapabilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionCapability'] = ResolversParentTypes['TransactionCapability']> = {
  args?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionCommandResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionCommand'] = ResolversParentTypes['TransactionCommand']> = {
  meta?: Resolver<ResolversTypes['TransactionMeta'], ParentType, ContextType>;
  networkId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payload?: Resolver<ResolversTypes['TransactionPayload'], ParentType, ContextType>;
  signers?: Resolver<Array<ResolversTypes['Signer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionInfo'] = ResolversParentTypes['TransactionInfo']> = {
  __resolveType: TypeResolveFn<'TransactionMempoolInfo' | 'TransactionResult', ParentType, ContextType>;
};

export type TransactionMempoolInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionMempoolInfo'] = ResolversParentTypes['TransactionMempoolInfo']> = {
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionMeta'] = ResolversParentTypes['TransactionMeta']> = {
  chainId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  gasLimit?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  gasPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionPayload'] = ResolversParentTypes['TransactionPayload']> = {
  __resolveType: TypeResolveFn<'ContinuationPayload' | 'ExecutionPayload', ParentType, ContextType>;
};

export type TransactionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionResult'] = ResolversParentTypes['TransactionResult']> = {
  badResult?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  continuation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eventCount?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['TransactionResultEventsConnection'], ParentType, ContextType, RequireFields<TransactionResultEventsArgs, 'first' | 'last'>>;
  gas?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  goodResult?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  logs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  transfers?: Resolver<ResolversTypes['TransactionResultTransfersConnection'], ParentType, ContextType, RequireFields<TransactionResultTransfersArgs, 'first' | 'last'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultEventsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionResultEventsConnection'] = ResolversParentTypes['TransactionResultEventsConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['TransactionResultEventsConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultEventsConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionResultEventsConnectionEdge'] = ResolversParentTypes['TransactionResultEventsConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultTransfersConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionResultTransfersConnection'] = ResolversParentTypes['TransactionResultTransfersConnection']> = {
  edges?: Resolver<Array<Maybe<ResolversTypes['TransactionResultTransfersConnectionEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResultTransfersConnectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionResultTransfersConnectionEdge'] = ResolversParentTypes['TransactionResultTransfersConnectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Transfer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionSignatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionSignature'] = ResolversParentTypes['TransactionSignature']> = {
  sig?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transfer'] = ResolversParentTypes['Transfer']> = {
  amount?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  block?: Resolver<ResolversTypes['Block'], ParentType, ContextType>;
  crossChainTransfer?: Resolver<Maybe<ResolversTypes['Transfer']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  receiverAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senderAccount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
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
  Guard?: GuardResolvers<ContextType>;
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
  QueryTransactionsByPublicKeyConnection?: QueryTransactionsByPublicKeyConnectionResolvers<ContextType>;
  QueryTransactionsByPublicKeyConnectionEdge?: QueryTransactionsByPublicKeyConnectionEdgeResolvers<ContextType>;
  QueryTransactionsConnection?: QueryTransactionsConnectionResolvers<ContextType>;
  QueryTransactionsConnectionEdge?: QueryTransactionsConnectionEdgeResolvers<ContextType>;
  QueryTransfersConnection?: QueryTransfersConnectionResolvers<ContextType>;
  QueryTransfersConnectionEdge?: QueryTransfersConnectionEdgeResolvers<ContextType>;
  Signer?: SignerResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
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
};

