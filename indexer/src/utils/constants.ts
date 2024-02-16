import { join } from "path";

export const BASE_URL_LOCALNET: string =
  "https://ec2-44-221-155-251.compute-1.amazonaws.com:1789/chainweb/0.0";
export const BASE_URL_MAINNET: string = "https://api.chainweb.com/chainweb/0.0";

export const BASE_URL: string = BASE_URL_MAINNET;

export const SYNC_MIN_HEIGHT: number = 4516000;
export const SYNC_FETCH_INTERVAL_IN_BLOCKS: number = 10;
export const TIME_BETWEEN_REQUESTS_IN_MS: number = 5000;
export const ATTEMPTS_MAX_RETRY: number = 10;
export const ATTEMPTS_INTERVAL_IN_MS: number = 2000;

export const NETWORK: string = "mainnet01";

export const DATA_DIR = join(__dirname, "../../", "data");

console.log("DATA_DIR", DATA_DIR);

