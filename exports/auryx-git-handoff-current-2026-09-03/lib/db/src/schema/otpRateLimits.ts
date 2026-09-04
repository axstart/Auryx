import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * Persistent (DB-backed) rate limit counters keyed by an arbitrary string
 * (e.g. "otp-request:email@x.com" or "otp-verify:203.0.113.5"). Survives
 * restarts and works correctly across multiple server instances, unlike an
 * in-memory Map.
 */
export const otpRateLimitsTable = pgTable("otp_rate_limits", {
  id: serial("id").primaryKey(),
  rateLimitKey: text("rate_limit_key").notNull().unique(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

export type OtpRateLimit = typeof otpRateLimitsTable.$inferSelect;
