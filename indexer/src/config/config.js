const fs = require("fs");

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync("src/config/global-bundle.pem").toString(),
      },
    },
  },
};
