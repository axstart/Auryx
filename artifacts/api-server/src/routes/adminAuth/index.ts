import { Router, type Request } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createHash, randomBytes, randomInt } from "crypto";
import { db } from "@workspace/db";
import { adminUsersTable, emailVerificationsTable } from "@workspace/db/schema";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";
import { checkBlocked, recordFailure, clearAttempts, getIp } from "../../lib/loginRateLimiter.js";
import { checkPersistentRateLimit } from "../../lib/otpRateLimiter.js";
import { sendMail } from "../../lib/mailer.js";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type PendingMfa = {
  id: number | null;
  email: string;
  name: string;
  role: "admin" | "staff";
};

function getAdminCredentials(): { email: string; password: string; name: string }[] {
  const admins: { email: string; password: string; name: string }[] = [];
  if (process.env.ADMIN_LEO_EMAIL && process.env.ADMIN_LEO_PASSWORD) {
    admins.push({ email: process.env.ADMIN_LEO_EMAIL, password: process.env.ADMIN_LEO_PASSWORD, name: "Leo" });
  }
  if (process.env.ADMIN_ROMY_EMAIL && process.env.ADMIN_ROMY_PASSWORD) {
    admins.push({ email: process.env.ADMIN_ROMY_EMAIL, password: process.env.ADMIN_ROMY_PASSWORD, name: "Romy" });
  }
  return admins;
}

function hashOtp(otp: string, salt: string) {
  return createHash("sha256").update(`${salt}:${otp}`).digest("hex");
}

function generateOtpSalt() {
  return randomBytes(16).toString("hex");
}

function mfaDisabled() {
  return process.env.ADMIN_MFA_DISABLED === "true";
}

async function sendAdminMfaOtp(email: string) {
  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const otpSalt = generateOtpSalt();
  const otpHash = hashOtp(otp, otpSalt);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const mfaEmail = `admin-mfa:${email.toLowerCase()}`;

  await db.insert(emailVerificationsTable).values({
    email: mfaEmail,
    otpHash,
    otpSalt,
    expiresAt,
  });

  await sendMail({
    to: email,
    subject: `Auryx admin verification code: ${otp}`,
    text: [
      `Your Auryx admin login code is:`,
      ``,
      `  ${otp}`,
      ``,
      `This code expires in 10 minutes.`,
      `If you did not attempt to sign in, reset your password and contact security.`,
      ``,
      `— Auryx Security`,
    ].join("\n"),
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[admin-mfa] OTP for ${email}: ${otp}`);
  }
}

function establishSession(req: Request, pending: PendingMfa) {
  req.session.user = pending;
  req.session.pendingMfa = undefined;
  req.session.cookie.maxAge = 8 * 60 * 60 * 1000;
}

// POST /api/admin/auth/login
router.post("/admin/auth/login", async (req, res) => {
  const ip = getIp(req as Parameters<typeof getIp>[0]);

  const blockCheck = checkBlocked(ip);
  if (blockCheck.blocked) {
    res.status(429).json({ error: blockCheck.error });
    return;
  }

  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const { email, password } = parsed.data;
  let pending: PendingMfa | null = null;

  const admins = getAdminCredentials();
  const adminMatch = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (adminMatch) {
    if (password !== adminMatch.password) {
      const { nowBlocked, remaining } = recordFailure(ip);
      if (nowBlocked) {
        res.status(429).json({ error: "Too many login attempts. Please try again in 15 minutes." });
      } else if (remaining <= 2) {
        res.status(401).json({ error: "Invalid credentials", attemptsRemaining: remaining });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }
    clearAttempts(ip);
    pending = { id: null, email: adminMatch.email, name: adminMatch.name, role: "admin" };
  } else {
    const [staff] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email.toLowerCase()));

    if (!staff || !staff.isActive) {
      const { nowBlocked, remaining } = recordFailure(ip);
      if (nowBlocked) {
        res.status(429).json({ error: "Too many login attempts. Please try again in 15 minutes." });
      } else if (remaining <= 2) {
        res.status(401).json({ error: "Invalid credentials", attemptsRemaining: remaining });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }

    const valid = await bcrypt.compare(password, staff.passwordHash);
    if (!valid) {
      const { nowBlocked, remaining } = recordFailure(ip);
      if (nowBlocked) {
        res.status(429).json({ error: "Too many login attempts. Please try again in 15 minutes." });
      } else if (remaining <= 2) {
        res.status(401).json({ error: "Invalid credentials", attemptsRemaining: remaining });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }

    clearAttempts(ip);
    await db
      .update(adminUsersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsersTable.id, staff.id));

    pending = {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role as "admin" | "staff",
    };
  }

  if (!pending) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (mfaDisabled()) {
    establishSession(req, pending);
    res.json({ email: pending.email, name: pending.name, role: pending.role, id: pending.id });
    return;
  }

  const allowed = await checkPersistentRateLimit(`admin-mfa:${pending.email.toLowerCase()}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    res.status(429).json({ error: "Too many MFA requests. Please wait 10 minutes." });
    return;
  }

  req.session.pendingMfa = pending;
  delete req.session.user;
  await sendAdminMfaOtp(pending.email);
  res.json({ mfaRequired: true, email: pending.email });
});

router.post("/admin/auth/verify-mfa", async (req, res) => {
  const parsed = z.object({ otp: z.string().regex(/^\d{6}$/) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "6-digit code required" });
    return;
  }

  const pending = req.session.pendingMfa;
  if (!pending) {
    res.status(401).json({ error: "No pending MFA challenge. Sign in again." });
    return;
  }

  const mfaEmail = `admin-mfa:${pending.email.toLowerCase()}`;
  const [record] = await db
    .select()
    .from(emailVerificationsTable)
    .where(
      and(
        eq(emailVerificationsTable.email, mfaEmail),
        isNull(emailVerificationsTable.verifiedAt),
        gt(emailVerificationsTable.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(emailVerificationsTable.createdAt))
    .limit(1);

  if (!record) {
    res.status(401).json({ error: "Code expired. Sign in again." });
    return;
  }

  if (record.lockedAt || (record.attemptCount ?? 0) >= 5) {
    res.status(429).json({ error: "Too many invalid codes. Sign in again." });
    return;
  }

  const otpHash = hashOtp(parsed.data.otp, record.otpSalt);
  if (record.otpHash !== otpHash) {
    const attemptCount = (record.attemptCount ?? 0) + 1;
    await db
      .update(emailVerificationsTable)
      .set({
        attemptCount,
        lockedAt: attemptCount >= 5 ? new Date() : null,
      })
      .where(eq(emailVerificationsTable.id, record.id));
    res.status(401).json({ error: "Invalid code" });
    return;
  }

  await db
    .update(emailVerificationsTable)
    .set({ verifiedAt: new Date() })
    .where(eq(emailVerificationsTable.id, record.id));

  establishSession(req, pending);
  res.json({
    email: pending.email,
    name: pending.name,
    role: pending.role,
    id: pending.id,
  });
});

router.post("/admin/auth/resend-mfa", async (req, res) => {
  const pending = req.session.pendingMfa;
  if (!pending) {
    res.status(401).json({ error: "No pending MFA challenge" });
    return;
  }
  const allowed = await checkPersistentRateLimit(`admin-mfa:${pending.email.toLowerCase()}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    res.status(429).json({ error: "Too many MFA requests. Please wait 10 minutes." });
    return;
  }
  await sendAdminMfaOtp(pending.email);
  res.json({ ok: true });
});

router.post("/admin/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/admin/auth/me", sessionAuth, (req, res) => {
  res.json(req.session.user);
});

const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["staff", "admin"]).default("staff"),
});

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db
    .select({
      id: adminUsersTable.id,
      name: adminUsersTable.name,
      email: adminUsersTable.email,
      role: adminUsersTable.role,
      isActive: adminUsersTable.isActive,
      lastLoginAt: adminUsersTable.lastLoginAt,
      createdAt: adminUsersTable.createdAt,
    })
    .from(adminUsersTable)
    .orderBy(adminUsersTable.createdAt);
  res.json(users);
});

router.post("/admin/users", requireAdmin, async (req, res) => {
  const parsed = CreateStaffSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, role } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const [user] = await db
      .insert(adminUsersTable)
      .values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
      })
      .returning({
        id: adminUsersTable.id,
        name: adminUsersTable.name,
        email: adminUsersTable.email,
        role: adminUsersTable.role,
        isActive: adminUsersTable.isActive,
        createdAt: adminUsersTable.createdAt,
      });
    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: "Email already exists" });
  }
});

router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = z
    .object({
      isActive: z.boolean().optional(),
      name: z.string().min(1).optional(),
      password: z.string().min(8).optional(),
      role: z.enum(["staff", "admin"]).optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof adminUsersTable.$inferInsert> = {};
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;
  if (parsed.data.name) updates.name = parsed.data.name;
  if (parsed.data.role) updates.role = parsed.data.role;
  if (parsed.data.password) updates.passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const [user] = await db
    .update(adminUsersTable)
    .set(updates)
    .where(eq(adminUsersTable.id, id))
    .returning({
      id: adminUsersTable.id,
      name: adminUsersTable.name,
      email: adminUsersTable.email,
      role: adminUsersTable.role,
      isActive: adminUsersTable.isActive,
      lastLoginAt: adminUsersTable.lastLoginAt,
    });

  if (!user) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(user);
});

export default router;
