import { defineConfig } from "drizzle-kit";
import path from "path";
import { pgSslConfig } from "./src/pgSsl";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set (Supabase or local Postgres)");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: pgSslConfig(process.env.DATABASE_URL),
  },
});
