import { Router } from "express";
import { sessionAuth, requireAdmin } from "../middlewares/sessionAuth.js";
import { DEFAULT_ARIA_INSTRUCTIONS } from "./chat/defaultInstructions.js";

const router = Router();

router.get("/admin/aria-settings/default", sessionAuth, (_req, res) => {
  res.json({ instructions: DEFAULT_ARIA_INSTRUCTIONS });
});

router.get("/admin/aria-settings", sessionAuth, async (_req, res) => {
  res.json({
    instructions: DEFAULT_ARIA_INSTRUCTIONS,
    updatedAt: null,
    isCustom: false,
  });
});

router.put("/admin/aria-settings", sessionAuth, requireAdmin, async (_req, res) => {
  res.status(409).json({
    error: "Aria instructions are managed in the system prompt file.",
  });
});

export default router;
