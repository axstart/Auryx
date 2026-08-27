import { sql } from "drizzle-orm";
import { db } from "@workspace/db";

/**
 * DB-backed sliding-window-ish rate limiter. Atomic via a single upsert, so it
 * is race-safe under concurrent requests and works correctly across multiple
 * server instances (unlike an in-memory Map, which resets on restart and is
 * per-process).
 *
 * Returns true if the action is allowed (and records it), false if the caller
 * is over the limit for the current window.
 */
export async function checkPersistentRateLimit(
  key: string,
  maxCount: number,
  windowMs: number
): Promise<boolean> {
  const result = await db.execute(sql`
    INSERT INTO otp_rate_limits (rate_limit_key, count, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (rate_limit_key) DO UPDATE SET
      count = CASE
        WHEN otp_rate_limits.window_start < now() - (${windowMs} * interval '1 millisecond')
        THEN 1
        ELSE otp_rate_limits.count + 1
      END,
      window_start = CASE
        WHEN otp_rate_limits.window_start < now() - (${windowMs} * interval '1 millisecond')
        THEN now()
        ELSE otp_rate_limits.window_start
      END
    RETURNING count
  `);

  const row = result.rows[0] as { count: number } | undefined;
  const count = row?.count ?? maxCount + 1;
  return count <= maxCount;
}
