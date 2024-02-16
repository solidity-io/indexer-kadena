import axios from "axios";
import {
  saveHeader,
  savePayload,
  saveLastCut,
  getLastSync,
  saveLastSync,
  saveSyncError,
} from "../services/s3Storage";
import { getDecoded } from "../utils/helpers";
import {
  BASE_URL,
  ATTEMPTS_MAX_RETRY,
  ATTEMPTS_INTERVAL_IN_MS,
  SYNC_MIN_HEIGHT,
  SYNC_FETCH_INTERVAL_IN_BLOCKS,
  TIME_BETWEEN_REQUESTS_IN_MS,
} from "../config/constants";

export async function startBackFill(network: string): Promise<void> {
  try {
    const result = await fetchCut(network);
    const hashes = result.hashes;

    await saveLastCut(network, result);

    for (const chainId in hashes) {
      const chain = hashes[chainId];
      console.log(`\nchainId: ${chainId}`);

      let { height: minHeight } = chain;
      const lastSync = await getLastSync(network, chainId);

      if (lastSync) {
        minHeight = lastSync.minHeight;
        console.log(`Using height from last sync: ${minHeight}`);
      } else {
        console.log(
          `No last sync found. Using height from last cut: ${minHeight}`
        );
      }

      await processChain(network, chainId, minHeight, chain.height);
    }
  } catch (error) {
    console.error("Error during backfilling:", error);
  }
}

async function processChain(
  network: string,
  chainId: string,
  minHeight: number,
  maxHeight: number
): Promise<void> {
  for (
    let actualHeight = minHeight;
    actualHeight > SYNC_MIN_HEIGHT;
    actualHeight -= SYNC_FETCH_INTERVAL_IN_BLOCKS
  ) {
    const NEXT_HEIGHT = actualHeight - SYNC_FETCH_INTERVAL_IN_BLOCKS;
    minHeight = NEXT_HEIGHT < SYNC_MIN_HEIGHT ? SYNC_MIN_HEIGHT : NEXT_HEIGHT;

    console.log(
      `Fetching headers from ${minHeight} to ${actualHeight} for chainId ${chainId}`
    );
    fetchHeaders(network, chainId, minHeight, actualHeight);
    await saveLastSync(network, chainId, minHeight, maxHeight);
    await delay(TIME_BETWEEN_REQUESTS_IN_MS);
  }
}

async function fetchCut(network: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/${network}/cut`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cut:", error);
    throw error;
  }
}

async function fetchHeaders(
  network: string,
  chainId: string,
  minHeight: number,
  maxHeight: number
): Promise<void> {
  try {
    const response = await axios.get(
      `${BASE_URL}/${network}/chain/${chainId}/header?minheight=${minHeight}&maxheight=${maxHeight}`,
      {
        headers: { Accept: "application/json;blockheader-encoding=object" },
      }
    );
    const items = response.data.items;
    for (const header of items) {
      await saveHeader(network, chainId, header.height, header);
      console.log("Payload hash:", header.payloadHash);
      fetchPayloadWithRetry(
        network,
        chainId,
        header.height,
        header.payloadHash
      );
    }
  } catch (error) {
    console.error("Error fetching header:", error);
  }
}

async function fetchPayloadWithRetry(
  network: string,
  chainId: string,
  height: number,
  payloadHash: string,
  attempt = 1
): Promise<void> {
  try {
    const response = await axios.get(
      `${BASE_URL}/${network}/chain/${chainId}/payload/${payloadHash}/outputs`
    );
    const transactions = response.data.transactions;
    console.log("Number of transactions:", transactions.length);
    transactions.forEach((transaction: any) => {
      transaction[0] = getDecoded(transaction[0]);
      transaction[1] = getDecoded(transaction[1]);
    });
    await savePayload(network, chainId, height, payloadHash, transactions);
  } catch (error) {
    if (attempt < ATTEMPTS_MAX_RETRY) {
      console.log(
        `Retrying... Attempt ${
          attempt + 1
        } of ${ATTEMPTS_MAX_RETRY} for payloadHash ${payloadHash}`
      );
      await delay(ATTEMPTS_INTERVAL_IN_MS);
      await fetchPayloadWithRetry(
        network,
        chainId,
        height,
        payloadHash,
        attempt + 1
      );
    } else {
      console.error(
        "Max retry attempts reached. Unable to fetch transactions for",
        { network, chainId, height, payloadHash }
      );
      await saveSyncError(network, chainId, height, payloadHash, error);
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
