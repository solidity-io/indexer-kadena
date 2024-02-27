import {
  startStreaming,
  startBackFill,
  startRetryErrors,
  processHeaders,
  startMissingBlocks,
} from "./services/syncService";
import dotenv from "dotenv";
import { program } from "commander";
import { initializeDatabase } from "./config/database";

program
  .option("-s, --startStreaming", "Start streaming blockchain data")
  .option("-b, --startBackFill", "Start back filling blockchain data")
  .option("-r, --startRetryErrors", "Start retrying failed blocks")
  .option("-m, --startMissingBlocks", "Process headers from the block");

program.parse(process.argv);

if (!process.env.SYNC_NETWORK) {
  throw new Error("SYNC_NETWORK environment variable is not set");
}

const SYNC_NETWORK = process.env.SYNC_NETWORK;

const options = program.opts();

async function main() {
  try {
    console.log("Loading environment variables...");
    dotenv.config();
    console.log("Initializing database...");
    await initializeDatabase();

    if (options.startStreaming) {
      console.log("Starting streaming...");
      await startStreaming(SYNC_NETWORK);
    } else if (options.startBackFill) {
      console.log("Starting filling...");
      await startBackFill(SYNC_NETWORK);
    } else if (options.startRetryErrors) {
      console.log("Starting retrying failed blocks...");
      await startRetryErrors(SYNC_NETWORK);
    } else if (options.startMissingBlocks) {
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

async function handleGracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Graceful shutdown start.`);
  console.log("Graceful shutdown complete.");
  process.exit(0);
}

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);

main().then(() => console.log("Done"));
