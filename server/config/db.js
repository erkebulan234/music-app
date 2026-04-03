import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes("railway.internal")
          ? false
          : { rejectUnauthorized: false },
      }
    : {
        user: "postgres",
        host: "localhost",
        database: "music_app",
        password: "1234",
        port: 5432,
      }
);