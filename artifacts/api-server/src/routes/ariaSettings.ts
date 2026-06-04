import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { ariaSettingsTable } from "@workspace/db/schema";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { DEFAULT_ARIA_INSTRUCTIONS } from "./chat/defaultInstructions.js";
import { clearAriaCache } from "./chat/instructionsCache.js";

const router = Router();

router.get("/admin/aria-settings/default", sessionAuth, (_req, res) => {
  res.json({ instructions: DEFAULT_ARIA_INSTRUCTIONS });
});

router.get("/admin/aria-settings", sessionAuth, async (_req, res) => {
  const [row] = await db.select().from(ariaSettingsTable).limit(1);
  res.json({
    instructions: row?.instructions ?? DEFAULT_ARIA_INSTRUCTIONS,
    updatedAt: row?.updatedAt ?? null,
    isCustom: !!row,
  });
});

router.put("/admin/aria-settings", sessionAuth, async (req, res) => {
  const { instructions } = req.body as { instructions: string };
  if (!instructions?.trim()) {
    res.status(400).json({ error: "instructions required" });
    return;
  }

  const [existing] = await db.select().from(ariaSettingsTable).limit(1);
  let row;
  if (existing) {
    [row] = await db
      .update(ariaSettingsTable)
      .set({ instructions, updatedAt: new Date() })
      .where(eq(ariaSettingsTable.id, existing.id))
      .returning();
  } else {
    [row] = await db
      .insert(ariaSettingsTable)
      .values({ instructions })
      .returning();
  }

  clearAriaCache();
  res.json({ instructions: row!.instructions, updatedAt: row!.updatedAt });
});

export default router;
