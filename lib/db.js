import mysql from "mysql2/promise";
import { attachDatabasePool } from "@vercel/functions";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 1,
  // Must be less than connectionLimit or mysql2 skips idle cleanup entirely.
  maxIdle: 0,
  idleTimeout: 10000,
  timezone: "+05:30",
  ssl: {
    rejectUnauthorized: false,
  },
});

// attachDatabasePool expects the core pool (not the promise wrapper).
attachDatabasePool(pool.pool);

const STALE_CONNECTION_CODES = new Set([
  "PROTOCOL_CONNECTION_LOST",
  "ECONNRESET",
  "ETIMEDOUT",
  "EPIPE",
  "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR",
]);

function isStaleConnectionError(err) {
  if (!err) return false;
  if (STALE_CONNECTION_CODES.has(err.code)) return true;
  return /connection lost|server closed the connection|closed state/i.test(
    err.message ?? "",
  );
}

function drainIdleConnections(corePool) {
  if (!corePool?._freeConnections) return;
  while (corePool._freeConnections.length > 0) {
    corePool._freeConnections.pop().destroy();
  }
}

async function runWithStaleRetry(runQuery) {
  try {
    return await runQuery();
  } catch (err) {
    if (!isStaleConnectionError(err)) throw err;
    drainIdleConnections(pool.pool);
    return runQuery();
  }
}

const query = pool.query.bind(pool);
const execute = pool.execute.bind(pool);

const db = Object.assign(pool, {
  query(sql, params) {
    return runWithStaleRetry(() => query(sql, params));
  },
  execute(sql, params) {
    return runWithStaleRetry(() => execute(sql, params));
  },
});

export default db;
