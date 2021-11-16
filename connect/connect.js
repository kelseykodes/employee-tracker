const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
  {
  host: "localhost",
  port: 3301,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
  },
  console.log(`Connected to the Team Database!`)
);

module.exports = db;