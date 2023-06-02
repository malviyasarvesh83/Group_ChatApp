const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize("groupchat", `${username}`, `${password}`, {
  dialect: "mysql",
  host: `${host}`,
});

module.exports = sequelize;