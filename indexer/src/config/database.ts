import fs from 'fs';

import { Sequelize, Transaction } from 'sequelize';
import { getRequiredEnvString } from '../utils/helpers';
import { Pool } from 'pg';

const DB_USERNAME = getRequiredEnvString('DB_USERNAME');
const DB_PASSWORD = getRequiredEnvString('DB_PASSWORD');
const DB_NAME = getRequiredEnvString('DB_NAME');
const DB_HOST = getRequiredEnvString('DB_HOST');
const DB_SSL_ENABLED = getRequiredEnvString('DB_SSL_ENABLED');
const DB_CONNECTION = `postgres://${DB_USERNAME}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/${DB_NAME}`;

const isSslEnabled = DB_SSL_ENABLED === 'true';

export const rootPgPool = new Pool({
  connectionString: DB_CONNECTION,
  ...(isSslEnabled && {
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(__dirname + '/global-bundle.pem').toString(),
    },
  }),
});

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
      max: 20,
      min: 1,
      acquire: 60000,
      idle: 10000,
    },
    retry: {
      max: 10,
    },
    logging: false,
    ...(isSslEnabled && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca: fs.readFileSync(__dirname + '/global-bundle.pem').toString(),
        },
      },
    }),
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  },
);

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    console.info('[INFO][DB][CONN] Database connection closed successfully.');
  } catch (error) {
    console.error('[ERROR][DB][CONN_LOST] Failed to close database connection:', error);
    throw error;
  }
}
