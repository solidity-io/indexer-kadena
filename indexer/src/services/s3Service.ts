import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { register } from "../server/metrics";
import { Gauge } from "prom-client";

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_S3_REGION;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_S3_BUCKET_NAME) {
  console.error("Missing AWS S3 bucket name in environment variables");
  process.exit(1);
}

if (!REGION) {
  console.error("Missing AWS S3 region in environment variables");
  process.exit(1);
}

if (!ACCESS_KEY_ID) {
  console.error("Missing AWS access key ID in environment variables");
  process.exit(1);
}

if (!SECRET_ACCESS_KEY) {
  console.error("Missing AWS secret access key in environment variables");
  process.exit(1);
}

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

export async function saveHeader(
  network: string,
  chainId: number,
  height: number,
  data: any
) {
  const objectKey = `${network}/chains/${chainId}/headers/${network}_${chainId}_${height}.json`;
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
  } catch (error) {
    console.error("Error saving header to S3:", error);
  }
}

export async function savePayload(
  network: string,
  chainId: number,
  payloadHash: string,
  data: any,
  suffix: string = ""
) {
  const objectKey = `${network}/chains/${chainId}/payloads/${network}_${chainId}_${payloadHash}${suffix}.json`;
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
  } catch (error) {
    console.error("Error saving last cut to S3:", error);
  }
}

export async function listS3Objects(
  network: string,
  chainId: number,
  startAfter?: string,
  limit?: number
): Promise<string[]> {
  const prefix = `${network}/chains/${chainId}/headers/`;
  try {
    let command = new ListObjectsV2Command({
      Bucket: AWS_S3_BUCKET_NAME,
      Prefix: prefix,
    });

    if (startAfter) {
      command.input.StartAfter = startAfter;
    }

    if (limit) {
      command.input.MaxKeys = limit;
    }

    const { Contents } = await s3Client.send(command);
    if (!Contents) {
      console.log("No objects found in S3 for the given prefix:", prefix);
      return [];
    }

    return Contents.map((obj) => obj.Key ?? "");
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    throw error;
  }
}

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

async function getStreamAsString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk: any) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}

function calculateDataSize(data: any) {
  return Buffer.byteLength(JSON.stringify(data), "utf8");
}
