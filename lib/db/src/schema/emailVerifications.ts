import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const emailVerificationsTable = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  otpHash: text("otp_hash").notNull(),
  /** Per-record random salt mixed into the OTP hash — defense in depth against unsalted-hash lookups. */
  otpSalt: text("otp_salt").notNull().default(""),
  /** Number of failed verify attempts against this record. Locked out at MAX_OTP_ATTEMPTS (see checkoutRoute.ts). */
  attemptCount: integer("attempt_count").notNull().default(0),
  /** Set once attemptCount hits the limit — record is dead even if not yet expired. */
  lockedAt: timestamp("locked_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailVerification = typeof emailVerificationsTable.$inferSelect;
