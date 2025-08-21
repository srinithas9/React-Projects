const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // your PostgreSQL username
  host: "localhost",
  database: "To-Do-List", // your DB name
  password: "srinitha", 
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;
