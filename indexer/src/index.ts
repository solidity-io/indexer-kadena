import { NETWORK } from "./utils/constants";
import {
  startStreaming,
  startBackfill,
  processHeaders,
} from "./api/blockchain";
import dotenv from "dotenv";
import { program } from "commander";
import { initializeDatabase } from "./config/database";

program
  .option("-s, --startStreaming", "Start streaming blockchain data")
  .option("-b, --startBackfill", "Start backfilling blockchain data");

program.parse(process.argv);

const options = program.opts();

async function main() {
  try {
    console.log("Loading environment variables...");
    dotenv.config();
    console.log("Initializing database...");
    await initializeDatabase();

    if (options.startStreaming) {
      console.log("Starting streaming...");
      await startStreaming(NETWORK);
    } else if (options.startBackfill) {
      console.log("Starting backfill...");
      await startBackfill(NETWORK);
    } else {
      console.log("No specific task requested.");
    }

    console.log("Blockchain data indexing process has finished.");
  } catch (error) {
    console.error("An error occurred during the data indexing process:", error);
  }
}

main().then(() => console.log("Done"));
