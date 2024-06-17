import express from "express";
import { collectDefaultMetrics, Registry } from "prom-client";
import { postgraphile } from "postgraphile";
import { getRequiredEnvString } from "../utils/helpers";
import path from "path";
import cors from "cors";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import { blockQueryPlugin } from "../models/block";
import {
  transactionByRequestKeyQueryPlugin,
  transactionsByBlockIdQueryPlugin,
} from "../models/transaction";
import { transfersByTypeQueryPlugin } from "../models/transfer";
import { Pool } from "pg";

const register = new Registry();

collectDefaultMetrics({ register });

const app = express();
const POST = 3000;
const DB_USERNAME = getRequiredEnvString("DB_USERNAME");
const DB_PASSWORD = getRequiredEnvString("DB_PASSWORD");
const DB_NAME = getRequiredEnvString("DB_NAME");
const DB_HOST = getRequiredEnvString("DB_HOST");
const SSL_CERT_PATH = path.resolve(__dirname, "../config/global-bundle.pem");
const DB_CONNECTION = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?ssl=true&&sslrootcert=${SSL_CERT_PATH}`;
const SCHEMAS: Array<string> = ["public"];

const rootPgPool = new Pool({
  connectionString: DB_CONNECTION,
});

app.use(cors());

app.get("/metrics", async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set("Content-Type", register.contentType);
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err);
  }
});

app.use(
  postgraphile(DB_CONNECTION, SCHEMAS, {
    graphileBuildOptions: {
      connectionFilterAllowNullInput: true,
      connectionFilterAllowEmptyObjectInput: true,
    },
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [
      ConnectionFilterPlugin,
      blockQueryPlugin,
      transactionsByBlockIdQueryPlugin,
      transactionByRequestKeyQueryPlugin,
      transfersByTypeQueryPlugin,
    ],
    async additionalGraphQLContextFromRequest(req, res) {
      return {
        rootPgPool,
      };
    },
  })
);

app.listen(POST, () => {
  console.log(`Metrics server listening at http://localhost:${POST}/metrics`);
  console.log(
    `Postgraphile server listening at http://localhost:${POST}/graphiql`
  );
});

export { register };
