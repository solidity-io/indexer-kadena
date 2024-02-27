import {
  startStreaming,
  startBackFill,
  startRetryErrors,
  startMissingBlocks,
} from "./services/syncService";
import dotenv from "dotenv";
import { program } from "commander";
import { initializeDatabase } from "./config/database";
import { getRequiredEnvString } from "./utils/helpers";

program
  .option("-s, --streaming", "Start streaming blockchain data")
  .option("-b, --backfill", "Start back filling blockchain data")
  .option("-r, --retry", "Start retrying failed blocks")
  .option("-m, --missing", "Process headers from the block");

program.parse(process.argv);

const SYNC_NETWORK = getRequiredEnvString("SYNC_NETWORK");

const options = program.opts();

/**
 * Main function to orchestrate the blockchain data synchronization process.
 * It initializes the database and starts the requested synchronization process based on the command line arguments.
 */
async function main() {
  try {
    console.log("Loading environment variables...");
    dotenv.config();
    console.log("Initializing database...");
    await initializeDatabase();

    if (options.streaming) {
      console.log("Starting streaming...");
      await startStreaming(SYNC_NETWORK);
    } else if (options.backfill) {
      console.log("Starting filling...");
      await startBackFill(SYNC_NETWORK);
    } else if (options.retry) {
      console.log("Starting retrying failed blocks...");
      await startRetryErrors(SYNC_NETWORK);
    } else if (options.missing) {
      console.log("Starting processing missing blocks...");
      await startMissingBlocks(SYNC_NETWORK);
    } else {
      console.log("No specific task requested.");
    }

    console.log("Blockchain data indexing process has finished.");
  } catch (error) {
    console.error("An error occurred during the data indexing process:", error);
  }
}

/**
 * Handles graceful shutdown of the application when receiving termination signals.
 * @param signal The signal received, triggering the shutdown process.
 */
async function handleGracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Graceful shutdown start.`);
  console.log("Graceful shutdown complete.");
  process.exit(0);
}

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);

main().then(() => console.log("Done!"));
