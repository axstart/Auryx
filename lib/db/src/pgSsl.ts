import type { ConnectionOptions } from "node:tls";
import type { PoolConfig } from "pg";

/**
 * Hosted Postgres (Supabase) often presents a chain Node rejects with
 * SELF_SIGNED_CERT_IN_CHAIN. Keep TLS on; skip CA verification unless
 * DATABASE_SSL_REJECT_UNAUTHORIZED=true (when the CA bundle is installed).
 */
export function pgSslConfig(
  connectionString: string,
): boolean | ConnectionOptions | undefined {
  const local = /localhost|127\.0\.0\.1/.test(connectionString);
  const sslMode = connectionString.match(/[?&]sslmode=([^&]+)/i)?.[1]?.toLowerCase();

  if (sslMode === "disable" || (local && !sslMode)) {
    return undefined;
  }

  const verify =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true" ||
    sslMode === "verify-full" ||
    sslMode === "verify-ca";

  return { rejectUnauthorized: verify };
}

/** Rewrite sslmode so drizzle-kit / URL-only clients match pgSslConfig. */
export function connectionStringWithPgSsl(connectionString: string): string {
  const ssl = pgSslConfig(connectionString);
  if (ssl === undefined) return connectionString;
  const mode =
    typeof ssl === "object" && ssl.rejectUnauthorized === false ? "no-verify" : "require";
  if (/[?&]sslmode=/i.test(connectionString)) {
    return connectionString.replace(/sslmode=[^&]*/i, `sslmode=${mode}`);
  }
  return `${connectionString}${connectionString.includes("?") ? "&" : "?"}sslmode=${mode}`;
}

/**
 * Build a Pool config without `connectionString`.
 * node-pg does `Object.assign(config, parse(connectionString))`, so a URL
 * `sslmode=require` overwrites `ssl: { rejectUnauthorized: false }`.
 */
export function pgPoolConfig(connectionString: string): PoolConfig {
  const ssl = pgSslConfig(connectionString);
  const url = new URL(connectionString.replace(/^postgres(ql)?:/i, "http:"));
  const database = decodeURIComponent(url.pathname.replace(/^\//, "") || "postgres");
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    ssl,
  };
}
