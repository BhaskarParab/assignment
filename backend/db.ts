import { Pool } from "pg";

export const pool = new Pool({
  user: 'bhaskar',
  host: 'localhost',
  database: 'assignment',
  password: 'test8899', // MUST be string
  port: 5432,
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

