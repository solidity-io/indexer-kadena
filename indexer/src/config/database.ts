const fs = require("fs");

import { QueryTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(__dirname + "/global-bundle.pem").toString(),
      },
    },
  }
);

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }

  try {
    await sequelize.sync({ force: false });
    console.log("Tables have been synchronized successfully.");
  } catch (error) {
    console.error("Unable to create tables:", error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    console.log("Connection has been closed successfully.");
  } catch (error) {
    console.error("Unable to close the connection:", error);
    throw error;
  }
}
