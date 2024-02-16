import { startBackFill } from "./api/blockchain";
import { NETWORK } from "./config/constants";
import dotenv from "dotenv";

async function main() {
  try {
    console.log("Loading environment variables...");
    
    dotenv.config();

    console.log(`process.env.AWS_S3_BUCKET_NAME: ${process.env.AWS_S3_BUCKET_NAME}`);

    console.log("Starting blockchain data indexing process...");
    await startBackFill(NETWORK);
    console.log("Blockchain data indexing process has finished.");
  } catch (error) {
    console.error("An error occurred during the data indexing process:", error);
  }
}

main().then(() => console.log("Done"));
