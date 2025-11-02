// 


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
      : false,
});

// ✅ Initialize database schema and indexes (run once)
async function initializeTables() {
  try {
    // 🧱 USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT NOT NULL,
        reset_token TEXT,
        reset_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 🧱 MESSAGES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ✅ Check existing user columns
    const res = await pool.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
    `);
    const existingCols = res.rows.map((r) => r.column_name);

    const missingColumns: { name: string; type: string }[] = [];

    if (!existingCols.includes("reset_token"))
      missingColumns.push({ name: "reset_token", type: "TEXT" });

    if (!existingCols.includes("reset_expires"))
      missingColumns.push({ name: "reset_expires", type: "TIMESTAMP" });

    // Add any missing columns
    for (const col of missingColumns) {
      await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
      console.log(`🆕 Added missing column: ${col.name}`);
    }

    // ✅ Create useful indexes (idempotent — won’t duplicate)
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`);

    console.log("✅ PostgreSQL tables & indexes ready");
  } catch (error) {
    console.error("❌ Error initializing PostgreSQL tables:", error);
  }
}

// Run initialization immediately
initializeTables();

export default pool;
