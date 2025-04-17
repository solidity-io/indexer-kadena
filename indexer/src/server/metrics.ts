/**
 * @file metrics.ts
 * @description Express server setup for Prometheus metrics and GraphQL API endpoints
 *
 * This file configures and starts an Express web server that provides two main functionalities:
 * 1. A Prometheus metrics endpoint for monitoring system performance
 * 2. A GraphQL API endpoint powered by Postgraphile for querying the indexed blockchain data
 *
 * The server integrates multiple plugins for enhanced GraphQL functionality including connection
 * filtering, custom query extensions for blocks, transactions, transfers, and token holders.
 * It also configures database connectivity with proper SSL handling based on environment settings.
 *
 * TODO: We are not using this server anymore. Should we remove it?
 */

import express from 'express';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { postgraphile } from 'postgraphile';
import { getRequiredEnvString } from '../utils/helpers';
import path from 'path';
import cors from 'cors';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import { blockQueryPlugin } from '../models/block';
import {
  transactionByRequestKeyQueryPlugin,
  transactionsByBlockIdQueryPlugin,
  kadenaExtensionPlugin,
} from '../models/transaction';
import { transfersByTypeQueryPlugin } from '../models/transfer';
import { getHoldersPlugin } from '../models/balance';
import { Pool } from 'pg';

/**
 * Prometheus metrics registry instance
 * Used to collect and expose system metrics for monitoring
 */
const register = new Registry();

/**
 * Configure default Prometheus metrics collection
 * This automatically tracks Node.js metrics like memory usage, CPU usage, event loop lag, etc.
 */
collectDefaultMetrics({ register });

/**
 * Express application instance for the metrics and GraphQL server
 */
const app = express();

/**
 * Port number for the server to listen on
 */
const PORT = 3000;

/**
 * Database configuration from environment variables
 * These are used to construct the database connection string
 */
const DB_USERNAME = getRequiredEnvString('DB_USERNAME');
const DB_PASSWORD = getRequiredEnvString('DB_PASSWORD');
const DB_NAME = getRequiredEnvString('DB_NAME');
const DB_HOST = getRequiredEnvString('DB_HOST');

/**
 * SSL configuration for database connections
 * Determines whether SSL is enabled and locates the certificate path
 */
const SSL_CERT_PATH = path.resolve(__dirname, '../config/global-bundle.pem');
const DB_SSL_ENABLED = getRequiredEnvString('DB_SSL_ENABLED');
const isSslEnabled = DB_SSL_ENABLED === 'true';

/**
 * Complete database connection string with SSL configuration
 * Used by Postgraphile to connect to the database
 */
const DB_CONNECTION = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?sslmode=${
  isSslEnabled ? 'require' : 'disable'
}${isSslEnabled ? `&sslrootcert=${SSL_CERT_PATH}` : ''}`;

/**
 * PostgreSQL schemas to expose through the GraphQL API
 * Currently only the public schema is used
 */
const SCHEMAS: Array<string> = ['public'];

/**
 * Database connection pool for root-level PostgreSQL operations
 * This provides a pool of connections that can be reused across requests
 */
const rootPgPool = new Pool({
  connectionString: DB_CONNECTION,
});

// Uncomment to enable read uncommitted isolation level
// rootPgPool.on("connect", (client) => {
//   client.query("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
// });

/**
 * Initializes and starts the Express server with Postgraphile and metrics endpoints
 *
 * This function:
 * 1. Configures CORS to allow cross-origin requests
 * 2. Sets up the /metrics endpoint for Prometheus scraping
 * 3. Configures Postgraphile with the database connection and plugins
 * 4. Starts the server listening on the specified port
 *
 * @returns {Promise<void>} A promise that resolves when the server is started
 */
export async function usePostgraphile() {
  console.info('[INFO][API][BIZ_FLOW] Starting GraphQL and metrics server...');

  // Enable CORS for all routes
  app.use(cors());

  // Configure the Prometheus metrics endpoint
  app.get('/metrics', async (_req, res) => {
    try {
      const metrics = await register.metrics();
      res.set('Content-Type', register.contentType);
      res.end(metrics);
    } catch (err) {
      res.status(500).end(err);
    }
  });

  // Configure Postgraphile middleware with plugins and options
  app.use(
    postgraphile(DB_CONNECTION, SCHEMAS, {
      // Connection filter configuration options
      graphileBuildOptions: {
        connectionFilterAllowNullInput: true,
        connectionFilterAllowEmptyObjectInput: true,
      },
      // Disable watching the database for schema changes to improve performance
      watchPg: false,
      // Enable the GraphiQL interactive query interface
      graphiql: true,
      enhanceGraphiql: true,
      // Register custom plugins for extended functionality
      appendPlugins: [
        ConnectionFilterPlugin, // Enables advanced filtering in GraphQL queries
        blockQueryPlugin, // Custom block query capabilities
        transactionsByBlockIdQueryPlugin, // Query transactions by block ID
        transactionByRequestKeyQueryPlugin, // Query transactions by request key
        transfersByTypeQueryPlugin, // Query transfers by type
        kadenaExtensionPlugin, // Kadena-specific extensions
        getHoldersPlugin, // Token holder analytics
      ],
      // Add the connection pool to the GraphQL context for direct database access
      async additionalGraphQLContextFromRequest() {
        return {
          rootPgPool,
        };
      },
    }),
  );

  // Start the server and log the available endpoints
  app.listen(PORT, () => {
    console.info(
      `[INFO][API][BIZ_FLOW] Metrics server available at http://localhost:${PORT}/metrics`,
    );
    console.info(
      `[INFO][API][BIZ_FLOW] GraphQL interface available at http://localhost:${PORT}/graphiql`,
    );
  });
}

export { register, app };
