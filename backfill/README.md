# Kadena Indexer Backfill

## 1. Introduction

The Kadindexer Backfill is a utility tool designed to synchronize historical blockchain data from the Kadena network into your local database. It allows you to fetch and index past blocks and transactions, ensuring your database has a complete history of the chain. The backfill process can be configured to sync data from any specified block height, making it useful for both initial data population and recovery scenarios where data needs to be resynced from a particular point.

## 2. Prerequisites

- [Docker](https://www.docker.com/)
- Kadena Indexer PostgreSQL database running
- Network access to the Kadena network
- Running your own Kadena node

## 3. Setup

### 3.1. Starting Docker
Start Docker Desktop from command line or via IOS application.

```bash
# MacOS - Start Docker Desktop from command line
open -a Docker

# Linux - Start Docker daemon
sudo systemctl start docker
```

### 3.2. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CERT_PATH` | Path to SSL certificate bundle | `./global-bundle.pem` |
| `SYNC_BASE_URL` | Base URL for the Chainweb API | `https://api.chainweb.com/chainweb/0.0` |
| `CHAIN_ID` | ID of the chain to backfill | `0` |
| `NETWORK` | Kadena network to sync from | `mainnet01` |
| `SYNC_MIN_HEIGHT` | Starting block height for backfill | `5370495` |
| `SYNC_FETCH_INTERVAL_IN_BLOCKS` | Number of blocks to fetch in each interval | `100` |
| `SYNC_ATTEMPTS_MAX_RETRY` | Maximum number of retry attempts | `5` |
| `SYNC_ATTEMPTS_INTERVAL_IN_MS` | Interval between retry attempts in milliseconds | `500` |
| `DB_USERNAME` | PostgreSQL database username | `postgres` |
| `DB_PASSWORD` | PostgreSQL database password | `password` |
| `DB_NAME` | Name of the database | `indexer` |
| `DB_HOST` | Database host address | `localhost` |
| `DB_PORT` | Database port number | `5432` |

**NOTE:** The example Kadena node API from chainweb will not work for the indexer purpose. You will need to run your own Kadena node and set the `NODE_API_URL` to your node's API URL.

## 4. Usage

### 4.1. Start the Kadindexer services

Please refer to the [Kadena Indexer README](../indexer/README.md) for instructions on how to start the Kadindexer services.

### 4.2. Build the backfill image

Build the image:
```bash
docker build -t chainbychain -f Dockerfile .
```

### 4.3. Run the container

#### Dockerfile (Chain by Chain)
This Dockerfile is designed to run the backfill process for a single chain at a time. It's useful when you need to:
- Sync data for a specific chain ID
- Have more granular control over the backfill process
- Debug issues with a particular chain
- Manage resources more efficiently

#### Dockerfile.indexes
This Dockerfile is specifically for recreating database indexes. Use this when you need to:
- Rebuild corrupted indexes
- Optimize existing indexes
- Add new indexes to improve query performance
- Perform database maintenance

#### Dockerfile.middle-backfill
This Dockerfile orchestrates the backfill process across all chains simultaneously. It's beneficial when you want to:
- Perform a complete system backfill
- Sync data for all chains in parallel
- Save time by running multiple chain syncs concurrently
- Ensure consistency across all chains

For single chain backfill:
```bash
docker build -t chainbychain -f Dockerfile .
docker run --rm --name chainbychain --env-file .env chainbychain
```

For rebuilding indexes:
```bash
docker build -t rebuild-indexes -f Dockerfile.indexes .
docker run --rm --name rebuild-indexes --env-file .env rebuild-indexes
```

For all chains backfill:
```bash
docker build -t all-chains -f Dockerfile.middle-backfill .
docker run --rm --name all-chains --env-file .env all-chains
```