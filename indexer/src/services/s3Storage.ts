import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import "dotenv/config";

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

if (!AWS_S3_BUCKET_NAME) {
  console.error("Missing AWS S3 bucket name in environment variables");
  process.exit(1);
}

export async function saveHeader(
  network: string,
  chainId: string,
  height: number,
  data: any
) {
  const objectKey = `${network}/chains/${chainId}/headers/${network}_${chainId}_${height}.json`;
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: objectKey,
    Body: JSON.stringify(data),
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    // console.log("Header saved:", objectKey);
  } catch (error) {
    console.error("Error saving header to S3:", error);
  }
}

export async function saveSyncError(
  network: string,
  chainId: string,
  height: number,
  payloadHash: string,
  error: any
) {
  const objectKey = `${network}/chains/${chainId}/errors/${network}_${chainId}_${height}_${payloadHash}_error.json`;
  const data = JSON.stringify(error);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: data,
      })
    );
    // console.log("Sync error saved to S3:", objectKey);
  } catch (error) {
    console.error("Error saving sync error to S3:", error);
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
  const objectKey = `${network}/chains/${chainId}/payloads/${network}_${chainId}_${height}_${payloadHash}${suffix}.json`;
  const jsonData = JSON.stringify(data);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: jsonData,
      })
    );
    // console.log("Payload saved to S3:", objectKey);
  } catch (error) {
    console.error("Error saving payload to S3:", error);
  }
}

export async function saveLastSync(
  network: string,
  chainId: string,
  minHeight: number,
  maxHeight: number
) {
  const objectKey = `${network}/chains/${chainId}/${network}_${chainId}_lastSync.json`;
  const data = JSON.stringify({
    minHeight: minHeight,
    maxHeight: maxHeight,
  });

  try {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: objectKey,
      Body: data,
    });
    await s3Client.send(command);
    // console.log("Last sync saved to S3:", objectKey);
  } catch (error) {
    console.error("Error saving last sync to S3:", error);
  }
}

export async function getLastSync(network: string, chainId: string) {
  const objectKey = `${network}/chains/${chainId}/${network}_${chainId}_lastSync.json`;

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: objectKey,
    });
    const { Body } = await s3Client.send(command);
    const data = (await getStreamAsString(Body)) as string;
    const lastSync = JSON.parse(data);
    console.log("Last sync fetched from S3:", lastSync);
    return lastSync;
  } catch (error: any) {
    if (error.name === "NoSuchKey") {
      console.log("Last sync does not exist.");
      return null;
    } else {
      console.error("Error getting last sync from S3:", error);
      throw error;
    }
  }
}

export async function saveLastCut(network: string, data: any) {
  const objectKey = `${network}/cut/${network}_lastCut.json`;
  const jsonData = JSON.stringify(data);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: jsonData,
      })
    );
    // console.log("Last cut saved to S3:", objectKey);
  } catch (error) {
    console.error("Error saving last cut to S3:", error);
  }
}

async function getStreamAsString(stream: any) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk: any) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}
