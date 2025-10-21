import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URI as string;

if (!connectionString) {
  throw new Error("❌ Please add your PostgreSQL connection string to .env.local");
}

// ✅ Create PostgreSQL pool
const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // Needed for Render, Supabase, etc.
});

// ✅ Initialize database schema (run once)
async function initializeTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ PostgreSQL tables ready");
  } catch (error) {
    console.error("❌ Error initializing PostgreSQL tables:", error);
  }
}

// Run initialization immediately
initializeTables();

export default pool;
