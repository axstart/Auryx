import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { pgPoolConfig } from "./pgSsl";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set (Supabase Postgres connection string, or local Postgres).",
  );
}

export const pool = new Pool(pgPoolConfig(process.env.DATABASE_URL));
export const db = drizzle(pool, { schema });

export { connectionStringWithPgSsl, pgPoolConfig, pgSslConfig } from "./pgSsl";
export * from "./schema";
