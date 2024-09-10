const fs = require("fs");
const { Transaction } = require("sequelize");
const isSslEnabled = process.env.DB_SSL_ENABLED === "true";

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    ...(isSslEnabled && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca: fs
            .readFileSync(__dirname + "/../src/config/global-bundle.pem")
            .toString(),
        },
      },
    }),
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    pool: {
      max: 20,
      min: 1,
      acquire: 60000,
      idle: 10000,
    },
    retry: {
      max: 10,
    },
  },
};
