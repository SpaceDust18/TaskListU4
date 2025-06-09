import dotenv from "dotenv";
import pg from "pg";

// Loads environment variables from .env file
dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

db.connect()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Database connection error:", error));

export default db;