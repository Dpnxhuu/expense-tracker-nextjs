import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 1,
  maxIdle: 1,
  idleTimeout: 10000,
  timezone: '+05:30',
  ssl: {
    rejectUnauthorized: false
  },
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default db;