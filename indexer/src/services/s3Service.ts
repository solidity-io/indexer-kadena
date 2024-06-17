import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { register } from "../server/metrics";
import { Gauge } from "prom-client";
import { calculateDataSize, getRequiredEnvString } from "../utils/helpers";

const AWS_S3_BUCKET_NAME = getRequiredEnvString("AWS_S3_BUCKET_NAME");
const REGION = getRequiredEnvString("AWS_S3_REGION");
const ACCESS_KEY_ID = getRequiredEnvString("AWS_ACCESS_KEY_ID");
const SECRET_ACCESS_KEY = getRequiredEnvString("AWS_SECRET_ACCESS_KEY");

const metrics = {
  dataVolume: new Gauge({
    name: "sync_data_volume_bytes",
    help: "Volume of data processed in each sync operation",
    labelNames: ["network", "chainId", "height", "payloadHash", "type"],
    registers: [register],
  }),
};

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

/**
 * Saves block header data to an S3 bucket.
 *
 * @param network The network identifier.
 * @param chainId The chain ID associated with the header.
 * @param height The height of the block.
 * @param data The block header data.
 */
export async function saveHeader(
  network: string,
  chainId: number,
  height: number,
  data: any
): Promise<boolean> {
  const objectKey = `${network}/chains/${chainId}/headers/${height}.json`;
  const jsonData = JSON.stringify(data);
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: objectKey,
    Body: jsonData,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    metrics.dataVolume.set(
      {
        network,
        chainId: chainId.toString(),
        height: height.toString(),
        type: "header",
      },
      calculateDataSize(jsonData)
    );
    return true;
  } catch (error) {
    console.error("Error saving header to S3:", error);
    return false;
  }
}

/**
 * Saves payload data to an S3 bucket
 *
 * @param network The network identifier.
 * @param chainId The chain ID associated with the payload.
 * @param payloadHash The hash of the payload.
 * @param data The payload data.
 */
export async function savePayload(
  network: string,
  chainId: number,
  payloadHash: string,
  data: any
) {
  const timestamp = new Date().getTime();
  const objectKey = `${network}/chains/${chainId}/payloads/${timestamp}-${payloadHash}.json`;
  const jsonData = JSON.stringify(data);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: objectKey,
        Body: jsonData,
      })
    );
    metrics.dataVolume.set(
      {
        network,
        chainId: chainId.toString(),
        payloadHash,
        type: "payload",
      },
      calculateDataSize(jsonData)
    );
  } catch (error) {
    console.error("Error saving payload to S3:", error);
  }
}

/**
 * Lists S3 objects based on the specified network and chain ID
 *
 * @param network The network identifier.
 * @param chainId The chain ID for which to list headers.
 * @param prefix The prefix to use for filtering objects.
 * @param startAfter An optional parameter to specify the object key to start after for pagination.
 * @param maxKeys An optional parameter to specify the maximum number of objects to return.
 * @returns A Promise resolving to an array of S3 object keys.
 */
export async function listS3Objects(
  prefix: string,
  maxKeys?: number,
  startAfter?: string
): Promise<string[]> {
  try {
    let command = new ListObjectsV2Command({
      Bucket: AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    });

    if (startAfter) {
      command.input.StartAfter = startAfter;
    }

    if (maxKeys) {
      command.input.MaxKeys = maxKeys;
    }

    const { Contents } = await s3Client.send(command);
    if (!Contents) {
      // console.log(`Objects not found for prefix: ${prefix}`);
      return [];
    } else {
      console.log(`Objects found for prefix: ${prefix}:`, Contents.length);
    }

    return Contents.map((obj) => obj.Key ?? "");
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    throw error;
  }
}

/**
 * Reads and parses a JSON object from S3.
 *
 * @param key The key of the S3 object to read.
 * @returns A Promise resolving to the parsed JSON object.
 */
export async function readAndParseS3Object(key: string): Promise<any> {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(params));
    const content = await getStreamAsString(Body);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading and parsing S3 object ${key}:`, error);
    throw error;
  }
}

/**
 * Converts a stream into a string.
 *
 * @param stream The stream to convert.
 * @returns A Promise resolving to the string representation of the stream.
 */
async function getStreamAsString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk: any) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}
