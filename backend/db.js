const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       
  host: "localhost",
  database: "To-Do-List", 
  password: "srinitha", 
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;
