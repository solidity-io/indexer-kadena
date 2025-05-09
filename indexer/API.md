# DEX GraphQL API Documentation

This document provides a comprehensive guide for querying the DEX (Decentralized Exchange) data through our GraphQL API.

## Table of Contents

- [Token Info](#token-info)
- [Wallet Info](#wallet-info)
- [DEX Metrics](#dex-metrics)
- [Pools](#pools)
- [Pool Details](#pool-details)
- [Time Frames](#time-frames)
- [Sorting Options](#sorting-options)
- [Transaction Types](#transaction-types)
- [Pagination](#pagination)

## Token Info

### Get Token Metadata

```graphql
query GetTokenInfo {
  tokens(first: 10) {
    edges {
      node {
        id
        name
        chainId
      }
    }
  }
}
```

### Get Token Price and Exchange Rate

```graphql
query GetPoolInfo($poolId: ID!) {
  pool(id: $poolId) {
    token0 {
      id
      name
    }
    token1 {
      id
      name
    }
    reserve0
    reserve1
    tvlUsd
  }
}
```

## Wallet Info

### Get Wallet's Liquidity Positions

```graphql
query GetWalletPositions($walletAddress: String!) {
  liquidityPositions(walletAddress: $walletAddress, orderBy: VALUE_USD_DESC, first: 10) {
    edges {
      node {
        id
        pairKey
        liquidity
        valueUsd
        apr24h
        token0 {
          id
          name
        }
        token1 {
          id
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## DEX Metrics

### Get Overall DEX Statistics

```graphql
query GetDexMetrics {
  dexMetrics {
    totalPools
    currentTvlUsd
    totalVolumeUsd
    tvlHistory {
      timestamp
      value
    }
    volumeHistory {
      timestamp
      value
    }
  }
}
```

## Pools

### Get All Pools (Paginated and Sorted)

```graphql
query GetPools {
  pools(first: 20, orderBy: TVL_USD_DESC) {
    edges {
      node {
        id
        address
        token0 {
          id
          name
        }
        token1 {
          id
          name
        }
        tvlUsd
        volume24hUsd
        volume7dUsd
        transactionCount24h
        apr24h
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## Pool Details

### Get Pool by ID with Charts

```graphql
query GetPoolDetails($poolId: ID!) {
  pool(id: $poolId) {
    id
    address
    token0 {
      id
      name
    }
    token1 {
      id
      name
    }
    reserve0
    reserve1
    totalSupply
    tvlUsd
    tvlChange24h
    volume24hUsd
    volumeChange24h
    volume7dUsd
    fees24hUsd
    feesChange24h
    transactionCount24h
    transactionCountChange24h
    apr24h

    # Get charts for different timeframes
    charts(timeFrame: DAY) {
      volume {
        timestamp
        value
      }
      tvl {
        timestamp
        value
      }
      fees {
        timestamp
        value
      }
    }

    # Get transactions
    transactions(first: 10) {
      edges {
        node {
          id
          maker
          amount0In
          amount1In
          amount0Out
          amount1Out
          amountUsd
          timestamp
          transactionType
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
}
```

### Get Pool Transactions by Type

```graphql
query GetPoolTransactions($pairId: Int!) {
  poolTransactions(pairId: $pairId, type: SWAP, first: 10) {
    edges {
      node {
        id
        maker
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUsd
        timestamp
        transactionType
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## Time Frames

For chart data, you can use these time frames:

- `DAY` - Last 24 hours
- `WEEK` - Last 7 days
- `MONTH` - Last 30 days
- `YEAR` - Last 365 days
- `ALL` - All available data

## Sorting Options

For pools and liquidity positions, you can sort by:

- `TVL_USD_ASC/DESC` - Sort by Total Value Locked
- `VOLUME_24H_ASC/DESC` - Sort by 24-hour volume
- `VOLUME_7D_ASC/DESC` - Sort by 7-day volume
- `APR_24H_ASC/DESC` - Sort by 24-hour APR
- `TRANSACTION_COUNT_24H_ASC/DESC` - Sort by 24-hour transaction count

## Transaction Types

- `SWAP` - Token swap transactions
- `ADD_LIQUIDITY` - Adding liquidity to a pool
- `REMOVE_LIQUIDITY` - Removing liquidity from a pool

## Pagination

All list queries support pagination with the following parameters:

- `first`: Number of items to fetch from the start
- `after`: Cursor for fetching the next page
- `last`: Number of items to fetch from the end
- `before`: Cursor for fetching the previous page

Each paginated response includes:

- `pageInfo`: Contains pagination metadata
  - `hasNextPage`: Boolean indicating if more pages exist
  - `hasPreviousPage`: Boolean indicating if previous pages exist
  - `startCursor`: Cursor for the first item
  - `endCursor`: Cursor for the last item
- `totalCount`: Total number of items available

## Response Types

### PoolTransaction

```typescript
type PoolTransaction {
  id: ID!
  maker: String!
  amount0In: Decimal!
  amount1In: Decimal!
  amount0Out: Decimal!
  amount1Out: Decimal!
  amountUsd: Decimal!
  timestamp: DateTime!
  transactionId: Int!
  requestkey: String!
  transactionType: PoolTransactionType!
}
```

### Pool

```typescript
type Pool {
  id: ID!
  address: String!
  token0: Token!
  token1: Token!
  reserve0: String!
  reserve1: String!
  totalSupply: String!
  key: String!
  tvlUsd: Decimal!
  tvlChange24h: Float!
  volume24hUsd: Decimal!
  volumeChange24h: Float!
  volume7dUsd: Decimal!
  fees24hUsd: Decimal!
  feesChange24h: Float!
  transactionCount24h: Int!
  transactionCountChange24h: Float!
  apr24h: Decimal!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### DexMetrics

```typescript
type DexMetrics {
  totalPools: Int!
  currentTvlUsd: Decimal!
  tvlHistory: [ChartDataPoint!]!
  volumeHistory: [ChartDataPoint!]!
  totalVolumeUsd: Decimal!
}
```

### ChartDataPoint

```typescript
type ChartDataPoint {
  timestamp: DateTime!
  value: Decimal!
}
```
