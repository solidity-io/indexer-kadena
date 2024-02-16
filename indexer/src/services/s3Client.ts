import { S3Client } from "@aws-sdk/client-s3";
import 'dotenv/config';

const REGION = process.env.AWS_S3_REGION;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!ACCESS_KEY_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error("Missing AWS credentials in environment variables");
  process.exit(1);
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export { s3Client };
