import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, // must be string
  port: Number(process.env.DB_PORT),
});

// quick startup connectivity check to provide a clear log when DB is unreachable
(async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    console.error(
      "DB connection error:",
      err instanceof Error ? err.message : String(err)
    );
  }
})();

