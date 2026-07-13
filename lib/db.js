import mysql from "mysql2/promise";

async function getConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    timezone: "+05:30",
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

const db = {
  async query(sql, params) {
    const connection = await getConnection();
    try {
      return await connection.query(sql, params);
    } finally {
      await connection.end();
    }
  },
  async execute(sql, params) {
    const connection = await getConnection();
    try {
      return await connection.execute(sql, params);
    } finally {
      await connection.end();
    }
  },
};

export default db;