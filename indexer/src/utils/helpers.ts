import fs from "fs";
export function getDecoded(encodedData: string): any {
  const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
  try {
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("Error decoding data:", error);
    return null;
  }
}

export function createIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
