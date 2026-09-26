import { defineConfig } from "drizzle-kit";
import path from "path";
import { connectionStringWithPgSsl } from "./src/pgSsl";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set (Supabase or local Postgres)");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionStringWithPgSsl(process.env.DATABASE_URL),
  },
});
