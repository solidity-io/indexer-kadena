import https from "https";
import { fetchAndSavePayloadWithRetry } from "../syncService";
import { syncStatusService } from "../syncStatusService";
import { SOURCE_STREAMING } from "../../models/syncStatus";

/**
 * Starts streaming headers from the Chainweb P2P network.
 * This method establishes a connection to the Chainweb node's header stream and listens for new headers.
 * Upon receiving a header, it saves the header and its payload to S3 and attempts to fetch the payload's transactions.
 * It retries fetching the payload up to a maximum number of attempts if necessary.
 *
 * @param {string} network - The network identifier (e.g., 'mainnet01').
 */
export async function startStreaming(network: string): Promise<void> {
  console.log("Starting streaming...");
  const options = {
    method: "GET",
    hostname: "api.chainweb.com",
    port: 443,
    path: `/chainweb/0.0/${network}/header/updates`,
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);

    res.on("data", async (chunk) => {
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
          const creationTime = blockData.header.creationTime;

          console.log(
            `chainId: ${chainId} - height: ${height} - creationTime: ${creationTime}`
          );

          const payloadHash = blockData.header.payloadHash;

          await fetchAndSavePayloadWithRetry(
            network,
            chainId,
            height,
            payloadHash,
            blockData
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

    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
}