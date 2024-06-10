import axios from "axios";
import { getRequiredEnvString } from "../../utils/helpers";

const SYNC_BASE_URL = getRequiredEnvString("SYNC_BASE_URL");

export interface FetchCutResult {
  hashes: {
    [chainId: string]: {
      height: number;
      hash: string;
    };
  };
}

/**
 * Fetches the current cut information from the network.
 *
 * @param network The network to fetch the cut from (e.g., "mainnet01").
 * @returns A promise resolving to the cut information.
 */
export async function fetchCut(network: string): Promise<any> {
  try {
    const endpoint = `${SYNC_BASE_URL}/${network}/cut`;
    const response = await axios.get(endpoint);
    return response.data as FetchCutResult;
  } catch (error) {
    console.error("Error fetching cut:", error);
    throw error;
  }
}

/**
 * Fetches the payloads for the given hashes from the network.
 * 
 * @param network The network to fetch payloads from (e.g., "mainnet01").
 * @param chainId The ID of the chain to fetch payloads for.
 * @param payloadHashes The hashes of the payloads to fetch.
 * @returns A promise resolving to the payloads.
 */
export async function fetchPayloads(network: string, chainId: number, payloadHashes: string[]) {
  const endpoint = `${SYNC_BASE_URL}/${network}/chain/${chainId}/payload/outputs/batch`;
  console.log("Fetching payloads from:", endpoint);
  const response = (await axios.post(endpoint, payloadHashes, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })) as any;
  return response.data;
}

/**
 * Fetches the headers for the given range of heights from the network.
 * 
 * @param network The network to fetch payloads from (e.g., "mainnet01").
 * @param chainId The ID of the chain to fetch payloads for.
 * @param minHeight The minimum height of the headers to fetch.
 * @param maxHeight The maximum height of the headers to fetch.
 * @returns A promise resolving to the headers.
 */
export async function fetchHeaders(network: string, chainId: number, minHeight: number, maxHeight: number) {
  const endpoint = `${SYNC_BASE_URL}/${network}/chain/${chainId}/header?minheight=${minHeight}&maxheight=${maxHeight}`;
  console.log("Fetching headers from:", endpoint);
  const response = await axios.get(endpoint, {
    headers: { Accept: "application/json;blockheader-encoding=object" },
  });
  return response.data.items;
}