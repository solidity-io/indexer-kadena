import "dotenv/config";
import { listS3Objects } from "./s3Service";
import {
  delay,
  splitIntoChunks,
  getRequiredEnvNumber,
  createSignal,
} from "../utils/helpers";
import { syncStatusService } from "./syncStatusService";
import { syncErrorService } from "./syncErrorService";
import { fetchHeadersWithRetry } from "./sync/header";
import { fetchCut, FetchCutResult } from "./sync/fetch";

import {
  SOURCE_S3,
  SOURCE_API,
  SOURCE_BACKFILL,
  SOURCE_STREAMING,
} from "../models/syncStatus";

import { addPublishEvents, DispatchInfo } from "../jobs/publisher-job";

import { fetchHeadersWithRetryForBackfill } from "./sync/backfill";

const SYNC_MIN_HEIGHT = getRequiredEnvNumber("SYNC_MIN_HEIGHT");
const SYNC_FETCH_INTERVAL_IN_BLOCKS = getRequiredEnvNumber(
  "SYNC_FETCH_INTERVAL_IN_BLOCKS",
);
const SYNC_TIME_BETWEEN_REQUESTS_IN_MS = getRequiredEnvNumber(
  "SYNC_TIME_BETWEEN_REQUESTS_IN_MS",
);

const shutdownSignal = createSignal();

/**
 * Type definition for a function that processes an individual key.
 *
 * @param {string} network - The identifier for the blockchain network (e.g., 'mainnet01').
 * @param {string} key - The specific S3 object key that points to the data to be processed.
 * @returns {Promise<void>} A promise that resolves when the processing of the key is complete.
 */
type ProcessKeyFunction = (
  network: string,
  key: string,
) => Promise<DispatchInfo | null>;

/**
 * Processes keys from S3 for a specific network and chainId.
 * This method fetches a list of keys from an S3 bucket based on the last synchronization status.
 * For each key, it reads and parses the S3 object to obtain block data, saves the block data to the database,
 * and updates the synchronization status accordingly.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 * @param {number} chainId - The chain ID to process headers for.
 * @param {string} prefix - The prefix for the S3 keys to process.
 * @param {ProcessKeyFunction} processKey - The function to process each key.
 * @param {number} maxKeys - The maximum number of keys to process in a single batch.
 * @param {number} maxIterations - The maximum number of iterations to perform. Unlimited if not specified.
 * @returns {Promise<number>} - A promise that resolves with the total number of keys processed.
 */
export async function processKeys(
  network: string,
  chainId: number,
  prefix: string,
  processKey: ProcessKeyFunction,
  maxKeys: number = 20,
  maxIterations?: number,
): Promise<number> {
  let totalKeysProcessed = 0;

  try {
    const lastSync = await syncStatusService.findWithPrefix(
      chainId,
      network,
      prefix,
      SOURCE_S3,
    );

    let startAfter = lastSync ? lastSync.key : undefined;
    let isFinished = false;
    let iterationCount = 0;

    while (!isFinished && (!maxIterations || iterationCount < maxIterations)) {
      const keys = await listS3Objects(prefix, maxKeys, startAfter);
      if (keys.length > 0) {
        const res = await Promise.all(
          keys.map(async (key) => {
            return processKey(network, key);
          }),
        );
        addPublishEvents(res.filter((r) => r !== null) as DispatchInfo[]);
        totalKeysProcessed += keys.length;
        startAfter = keys[keys.length - 1];
        iterationCount++;
      } else {
        isFinished = true;
      }
    }

    await syncStatusService.save({
      chainId: chainId,
      network: network,
      key: startAfter,
      prefix: prefix,
      source: SOURCE_S3,
    } as any);
  } catch (error) {
    console.error("Error processing block headers from storage:", error);
  }

  return totalKeysProcessed;
}

/**
 * Initiates the process of synchronizing blockchain data from a specific point, either from the latest block cut or from the
 * last recorded synchronization status for each chain.
 *
 * The synchronization process involves the following steps:
 * 1. Fetching the latest cut from the Chainweb network to determine the current highest block heights across all chains.
 * 2. Retrieving the last synchronization status for all chains to identify the starting point of the fill process.
 *    If no previous synchronization status is found for a chain, the process starts from the height provided by the latest cut.
 * 3. Processing each chain individually in a round-robin fashion, fetching headers and their corresponding payloads from
 *    the last height down to a specified minimum height. This ensures that the load is evenly distributed across all chains and
 *    that the system remains responsive during the synchronization process.
 * 4. For each chain, headers and payloads are fetched in descending order (from higher blocks to lower blocks), allowing for
 *    efficient catch-up to the current state of the blockchain.
 * 5. The process continues iteratively, moving through each chain in turn, until all chains have reached the minimum required block height.
 *
 * @param {string} network - The identifier of the Chainweb network from which to synchronize data (e.g., 'mainnet01').
 */
export async function startBackFill(
  network: string,
  offset = 0,
): Promise<void> {
  try {
    console.log("Starting filling...");
    const [chain] = (await getLastSync(network)).slice(0 + offset, 1 + offset);

    console.info(
      "Starting backfill process for chain: ",
      chain,
      SYNC_MIN_HEIGHT,
    );
    while (chain.currentHeight > SYNC_MIN_HEIGHT) {
      console.info(`Processing chain:`, {
        chainId: chain.chainId,
        currentHeight: chain.currentHeight,
      });

      let nextHeight = Math.max(
        chain.currentHeight - SYNC_FETCH_INTERVAL_IN_BLOCKS,
        SYNC_MIN_HEIGHT + 1,
      );

      const start = new Date().getTime();

      const counters = await fetchHeadersWithRetryForBackfill(
        network,
        chain.chainId,
        nextHeight,
        chain.currentHeight,
      );

      chain.currentHeight = nextHeight - 1;

      const end = new Date().getTime();
      const time = end - start;
      console.log(
        {
          chainId: chain.chainId,
          currentHeight: chain.currentHeight,
        },
        `processed in ${time / 1000}s.`,
      );
      console.log("Counters: ", counters);
    }

    console.log("All chains have been processed to the minimum height.");
  } catch (error) {
    console.error("Error during backfilling:", error);
  }
}

/**
 * Retrieves the last synchronization status for each chain in a given network.
 * It fetches the latest cut (highest block heights) from the network and combines
 * this with the last recorded synchronization status for each chain. If no previous
 * synchronization status is found, it starts from the height provided by the latest cut.
 * This method is useful for determining the starting point for synchronization processes,
 * ensuring that all chains are processed up to the current state.
 *
 * @param {string} network - The identifier of the Chainweb network from which to retrieve the last sync status.
 * @returns {Promise<Array<{ chainId: number, currentHeight: number }>>} - A promise that resolves to an array of objects, each representing a chain with its chain ID and the current height from which the synchronization should start.
 */
async function getLastSync(
  network: string,
): Promise<Array<{ chainId: number; currentHeight: number }>> {
  const lastCutResult = (await fetchCut(network)) as FetchCutResult;

  let lastSyncs = await syncStatusService.getLastSyncForAllChains(network, [
    SOURCE_BACKFILL,
    SOURCE_STREAMING,
  ]);

  return Object.entries(lastCutResult.hashes)
    .map(([chainId, lastCut]) => {
      const lastSync = lastSyncs.find(
        (sync) => sync.chainId === parseInt(chainId),
      );
      let currentHeight = lastSync ? lastSync.toHeight - 1 : lastCut.height;

      console.info(`Chain ID: ${chainId}`, {
        action: lastSync ? "Resuming from last sync" : "Starting from cut",
        currentHeight: currentHeight,
        source: lastSync ? "Last Sync" : "Cut",
        notes: `Processing will start at height ${currentHeight}.`,
      });

      return {
        chainId: parseInt(chainId),
        currentHeight,
      };
    })
    .filter((chain) => chain.currentHeight > SYNC_MIN_HEIGHT);
}

/**
 * Initiates a background task (daemon) that periodically checks for and processes missing blocks across all chains
 * within a specified network. It aims to identify gaps in the synchronized data, fetching and processing headers and
 * payloads for missing blocks to ensure complete and up-to-date blockchain data coverage.
 *
 * @param {string} network - The blockchain network identifier where missing blocks are to be processed.
 */
export async function startMissingBlocksDaemon(network: string): Promise<void> {
  console.log("Daemon: Starting to process missing blocks...");

  const sleepInterval = parseInt(process.env.SLEEP_INTERVAL_MS || "5000", 10);

  process.on("SIGINT", () => shutdownSignal.trigger());
  process.on("SIGTERM", () => shutdownSignal.trigger());

  while (!shutdownSignal.isTriggered) {
    try {
      await startMissingBlocks(network);
      console.log(
        `Daemon: Waiting for ${
          sleepInterval / 1000
        } seconds before the next iteration...`,
      );
      await delay(sleepInterval);
    } catch (error) {
      console.error("Daemon: Error occurred in startMissingBlocks -", error);
      console.log(
        `Daemon: Attempting to restart after waiting ${
          sleepInterval / 1000
        } seconds...`,
      );
      await delay(sleepInterval);
    }
  }

  console.log("Daemon: Shutting down gracefully.");
}

/**
 * Initiates the process to handle missing blocks for all chains within a specified network.
 * This function iterates through each chain in the network, identifies missing blocks, and
 * processes them in chunks to manage large ranges efficiently.
 *
 * @param {string} network - The network identifier to process missing blocks for.
 */
export async function startMissingBlocks(network: string): Promise<void> {
  console.log("Starting processing missing blocks...");
  const chains = Array.from({ length: 20 }, (_, i) => i);
  const limit = 1;

  const chainPromises = chains.map(async (chainId) => {
    const missingBlocks = await syncStatusService.getNextMissingBlock(
      network,
      chainId,
      limit,
    );

    if (missingBlocks) {
      const missingBlockPromises = missingBlocks.map((missingBlock) =>
        processMissingBlock(network, chainId, missingBlock),
      );

      await Promise.all(missingBlockPromises);
    }
  });

  await Promise.all(chainPromises);

  console.info("Missing blocks processing complete.");
}

/**
 * Processes a range of missing blocks for a specific chain within a network.
 * This function fetches headers for each missing block range and processes them.
 *
 * @param {string} network - The identifier of the Chainweb network.
 * @param {number} chainId - The ID of the chain to process missing blocks for.
 * @param {object} missingBlock - The missing block object containing the range to be processed.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
export async function processMissingBlock(
  network: string,
  chainId: number,
  missingBlock: any,
): Promise<void> {
  if (missingBlock) {
    const chunks = splitIntoChunks(
      missingBlock.toHeight,
      missingBlock.fromHeight,
      SYNC_FETCH_INTERVAL_IN_BLOCKS,
    );

    const chunkPromises = chunks.map((chunk) => {
      console.info(
        `*** [Missing] Processing missing block range`,
        {
          fromHeight: chunk[1],
          toHeight: chunk[0],
        },
        `for chain ID ${chainId}`,
      );
      return fetchHeadersWithRetry(network, chainId, chunk[1], chunk[0]);
    });

    await Promise.all(chunkPromises);
  }
}

/**
 * Starts the process of retrying failed operations for a specific network.
 * This function retrieves a list of errors recorded during previous operations,
 * attempts to fetch and process the data again, and if successful, removes the error from the log.
 *
 * @param {string} network - The blockchain network identifier where the errors occurred.
 * @returns {Promise<void>} - A promise that resolves when all retry attempts have been processed.
 */
export async function startRetryErrors(network: string): Promise<void> {
  try {
    console.log("Starting retrying failed blocks...");
    const errors = await syncErrorService.getErrors(network, SOURCE_API);

    for (const error of errors) {
      try {
        await fetchHeadersWithRetry(
          error.network,
          error.chainId,
          error.fromHeight,
          error.toHeight,
        );
        await syncErrorService.delete(error.id);
      } catch (err) {
        console.log("Error during error retrying:", err);
        console.log("Moving to next error...");
      }
    }
  } catch (error) {
    console.log("Error during error retrying:", error);
  }
}
