import { NETWORK } from "./utils/constants";
import { startBackFill, processHeaders } from "./api/blockchain";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";

async function main() {
  try {
    console.log("Loading environment variables...");

    dotenv.config();

    console.log("Initializing database...");
    await initializeDatabase();

    console.log(
      `process.env.AWS_S3_BUCKET_NAME: ${process.env.AWS_S3_BUCKET_NAME}`
    );

    console.log("Starting blockchain data indexing process...");

    await processHeaders(NETWORK, 1);
    // await startBackFill(NETWORK);

    console.log("Blockchain data indexing process has finished.");
  } catch (error) {
    console.error("An error occurred during the data indexing process:", error);
  }
}

main().then(() => console.log("Done"));
