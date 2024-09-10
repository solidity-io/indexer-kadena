import https from "https";
import { fetchAndSavePayloadWithRetry } from "./payload";
import { syncStatusService } from "../syncStatusService";
import { SOURCE_STREAMING } from "../../models/syncStatus";
import { getRequiredEnvString } from "../../utils/helpers";

const MAX_RETRIES = 50;
const RETRY_DELAY = 10000; // 10 seconds

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");
const SYNC_NETWORK = getRequiredEnvString("SYNC_NETWORK");

const url = new URL(`${SYNC_BASE_URL}/${SYNC_NETWORK}/header/updates`);
/**
 * Starts streaming headers from the Chainweb P2P network.
 * This method establishes a connection to the Chainweb node's header stream and listens for new headers.
 * Upon receiving a header, it saves the header and its payload to S3 and attempts to fetch the payload's transactions.
 * It retries fetching the payload up to a maximum number of attempts if necessary.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 * @param {number} retryCount - The current retry attempt count.
 */
export async function startStreaming(
  network: string,
  retryCount: number = 0,
): Promise<void> {
  console.log("Starting streaming...");
  const options = {
    method: "GET",
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);

    res.on("data", async (chunk) => {
      retryCount = 0;

      const chunkStr = chunk.toString();
      const dataLine = chunkStr
        .split("\n")
        .find((line: any) => line.startsWith("data:"));

      if (dataLine) {
        const jsonData = dataLine.replace("data:", "").trim();

        try {
          const blockData = JSON.parse(jsonData);
          const height = blockData.header.height;
          const chainId = blockData.header.chainId;

          console.log(
            `[chainId: ${chainId} height: ${height}] - Fetching payload ...`,
          );

          const payloadHash = blockData.header.payloadHash;

          await fetchAndSavePayloadWithRetry(
            network,
            chainId,
            height,
            payloadHash,
            blockData,
          );

          await syncStatusService.save({
            chainId: chainId,
            fromHeight: height,
            toHeight: height,
            network: network,
            source: SOURCE_STREAMING,
          } as any);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    });

    res.on("end", () => handleRetry(network, retryCount));
  });

  req.on("error", (e) => {
    handleRetry(network, retryCount);
  });

  req.end();
}

/**
 * Handles retry logic for reconnecting the stream.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 * @param {number} retryCount - The current retry attempt count.
 */
function handleRetry(network: string, retryCount: number): void {
  if (retryCount < MAX_RETRIES) {
    console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
    setTimeout(() => startStreaming(network, retryCount + 1), RETRY_DELAY);
  } else {
    console.error("Max retries reached. Giving up.");
  }
}
