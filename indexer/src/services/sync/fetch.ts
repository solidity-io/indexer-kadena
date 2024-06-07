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
    const response = await axios.get(`${SYNC_BASE_URL}/${network}/cut`);
    return response.data as FetchCutResult;
  } catch (error) {
    console.error("Error fetching cut:", error);
    throw error;
  }
}
