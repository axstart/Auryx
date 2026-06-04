import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sessionAuth, requireAdmin } from "../../middlewares/sessionAuth.js";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

// POST /api/admin/auth/login
router.post("/admin/auth/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const { email, password } = parsed.data;

  // Check hardcoded admin credentials from secrets first
  const admins = getAdminCredentials();
  const adminMatch = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (adminMatch) {
    if (password !== adminMatch.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    req.session.user = { id: null, email: adminMatch.email, name: adminMatch.name, role: "admin" };
    req.session.cookie.maxAge = 8 * 60 * 60 * 1000; // 8 hours
    res.json({ email: adminMatch.email, name: adminMatch.name, role: "admin" });
    return;
  }

  // Check staff users in DB
  const [staff] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email.toLowerCase()));

  if (!staff || !staff.isActive) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Update last login
  await db.update(adminUsersTable)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsersTable.id, staff.id));

  req.session.user = { id: staff.id, email: staff.email, name: staff.name, role: staff.role as "staff" | "admin" };
  req.session.cookie.maxAge = 8 * 60 * 60 * 1000;
  res.json({ email: staff.email, name: staff.name, role: staff.role });
});

// POST /api/admin/auth/logout
router.post("/admin/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// GET /api/admin/auth/me
router.get("/admin/auth/me", sessionAuth, (req, res) => {
  res.json(req.session.user);
});

// ── Staff user management (admin only) ────────────────────────────────────

const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["staff", "admin"]).default("staff"),
});

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db.select({
    id: adminUsersTable.id,
    name: adminUsersTable.name,
    email: adminUsersTable.email,
    role: adminUsersTable.role,
    isActive: adminUsersTable.isActive,
    lastLoginAt: adminUsersTable.lastLoginAt,
    createdAt: adminUsersTable.createdAt,
  }).from(adminUsersTable).orderBy(adminUsersTable.createdAt);
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
    const [user] = await db.insert(adminUsersTable).values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    }).returning({
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
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = z.object({
    isActive: z.boolean().optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["staff", "admin"]).optional(),
  }).safeParse(req.body);

  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const updates: Partial<typeof adminUsersTable.$inferInsert> = {};
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;
  if (parsed.data.name) updates.name = parsed.data.name;
  if (parsed.data.role) updates.role = parsed.data.role;
  if (parsed.data.password) updates.passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const [user] = await db.update(adminUsersTable)
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

  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(user);
});

export default router;
