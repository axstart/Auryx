import type { ConnectionOptions } from "node:tls";

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
