import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { createIfNotExists } from "../utils/helpers";

export const DATA_DIR = join(__dirname, "../../", "data");

export async function saveHeader(
  network: string,
  chainId: string,
  height: number,
  data: any
) {
  const dir = join(DATA_DIR, `${network}/chains/${chainId}/headers/`);
  await createIfNotExists(dir);
  const filePath = join(dir, `${chainId}_${height}.json`);
  try {
    await writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving header:", error);
  }
}

export async function saveSyncError(
  network: string,
  chainId: string,
  height: number,
  payloadHash: string,
  error: any
) {
  const dir = join(DATA_DIR, `sync/${network}/${chainId}/errors/`);
  createIfNotExists(dir);
  const filePath = join(
    dir,
    `${network}_${chainId}_${height}_${payloadHash}_error.json`
  );
  try {
    await writeFile(filePath, JSON.stringify(error));
  } catch (error) {
    console.error("Error saving sync error:", error);
  }
}

export async function savePayload(
  network: string,
  chainId: string,
  height: number,
  payloadHash: string,
  data: any,
  suffix: string = ""
) {
  const dir = join(DATA_DIR, `${network}/chains/${chainId}/payloads/`);
  createIfNotExists(dir);
  const filePath = join(
    dir,
    `${chainId}_${height}_${payloadHash}${suffix}.json`
  );
  try {
    await writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving payload:", error);
  }
}

export async function saveLastSync(
  network: string,
  chainId: string,
  minHeight: number,
  maxHeight: number
) {
  const dir = join(DATA_DIR, `sync/`);
  createIfNotExists(dir);
  const filePath = join(dir, `${network}_${chainId}_lastSync.json`);
  try {
    await writeFile(
      filePath,
      JSON.stringify({ maxHeight: maxHeight, minHeight: minHeight })
    );
  } catch (error) {
    console.error("Error saving last sync:", error);
  }
}

export async function getLastSync(network: string, chainId: string) {
  const filePath = join(DATA_DIR, `sync/${network}_${chainId}_lastSync.json`);
  try {
    if (existsSync(filePath)) {
      const data = await readFile(filePath, { encoding: "utf8" });
      const lastSync = JSON.parse(data);
      console.log("Last sync:", lastSync);
      return lastSync;
    }
  } catch (error) {
    console.error("Error getting last sync:", error);
  }
}

export async function saveLastCut(network: string, data: any) {
  const dir = join(DATA_DIR, `cut/`);
  createIfNotExists(dir);
  const filePath = join(dir, `${network}_lastCut.json`);
  try {
    await writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving last cut:", error);
  }
}
