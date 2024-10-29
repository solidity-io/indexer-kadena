import express from "express";
import { collectDefaultMetrics, Registry } from "prom-client";
import { makeExtendSchemaPlugin, postgraphile } from "postgraphile";
import { getRequiredEnvString } from "../utils/helpers";
import path from "path";
import cors from "cors";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import { blockQueryPlugin } from "../models/block";
import {
  transactionByRequestKeyQueryPlugin,
  transactionsByBlockIdQueryPlugin,
  kadenaExtensionPlugin,
} from "../models/transaction";
import { transfersByTypeQueryPlugin } from "../models/transfer";
import { getHoldersPlugin } from "../models/balance";
import { Pool } from "pg";
import { GraphQLScalarType, Kind } from "graphql";

const register = new Registry();

collectDefaultMetrics({ register });

const app = express();
const PORT = 3000;
const EXTENSION_PORT = 3001;
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

rootPgPool.on('connect', (client) => {
  client.query('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED');
});

export async function useKadenaExtension() {
  console.log("Starting GraphQL server...");

  app.use(cors());

  app.use(
    postgraphile(DB_CONNECTION, SCHEMAS, {
      watchPg: false,
      graphiql: true,
      enhanceGraphiql: true,
      appendPlugins: [
        kadenaExtensionPlugin
      ],
      async additionalGraphQLContextFromRequest(req, res) {
        return {
          rootPgPool,
        };
      },
    })
  );
  app.listen(EXTENSION_PORT, () => {
    console.log(
      `Postgraphile server listening at http://localhost:${EXTENSION_PORT}/graphiql`
    );
  });
}

export async function usePostgraphile() {
  console.log("Starting GraphQL server...");

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
      watchPg: false,
      graphiql: true,
      enhanceGraphiql: true,
      appendPlugins: [
        ConnectionFilterPlugin,
        blockQueryPlugin,
        transactionsByBlockIdQueryPlugin,
        transactionByRequestKeyQueryPlugin,
        transfersByTypeQueryPlugin,
        kadenaExtensionPlugin,
        getHoldersPlugin
      ],
      async additionalGraphQLContextFromRequest(req, res) {
        return {
          rootPgPool,
        };
      },
    })
  );
  app.listen(PORT, () => {
    console.log(`Metrics server listening at http://localhost:${PORT}/metrics`);
    console.log(
      `Postgraphile server listening at http://localhost:${PORT}/graphiql`
    );
  });
}

export { register, app };