import { Router } from "express";
import { db } from "@workspace/db";
import { ariaAnalyticsTable } from "@workspace/db/schema";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import { desc, gte, and, eq, sql } from "drizzle-orm";

const router = Router();

// ── Intent detection ─────────────────────────────────────────────────────────

const PEPTIDE_NAMES = [
  "semaglutide", "tirzepatide", "retatrutide", "tesofensine", "aod-9604", "aod9604",
  "sermorelin", "tesamorelin", "ipamorelin", "cjc-1295", "cjc1295",
  "bpc-157", "bpc157", "tb-500", "tb500", "kpv", "cortagen",
  "pt-141", "pt141", "bremelanotide", "kisspeptin",
  "thymosin alpha-1", "thymosin", "epitalon", "mots-c", "motsc", "nad+", "nad",
  "pinealon", "semax", "selank", "cerebrolysin",
  "glow complex", "klow complex",
];

export function detectIntent(message: string): string {
  const lower = message.toLowerCase();

  const purchaseTerms = ["buy", "order", "purchase", "add to cart", "checkout", "check out", "get started", "sign up", "how do i get", "where can i get", "ready to start"];
  const pricingTerms = ["price", "cost", "how much", "pricing", "per month", "/month", "$/mo", "afford", "expensive", "cheap", "discount"];
  const consultationTerms = ["consult", "consultation", "appointment", "doctor", "physician", "speak to", "talk to", "book", "schedule", "meet"];
  const medicalTerms = ["diabetes", "cancer", "heart", "autoimmune", "diagnosis", "diagnosed", "condition", "disease", "treatment", "dose", "dosage", "side effect", "interaction", "prescription", "medication", "drug"];

  if (purchaseTerms.some(t => lower.includes(t))) return "purchase";
  if (pricingTerms.some(t => lower.includes(t))) return "pricing";
  if (medicalTerms.some(t => lower.includes(t))) return "medical";
  if (consultationTerms.some(t => lower.includes(t))) return "consultation";
  return "general";
}

export function detectPeptide(message: string): string | null {
  const lower = message.toLowerCase();
  for (const name of PEPTIDE_NAMES) {
    if (lower.includes(name)) {
      if (name.includes("aod")) return "AOD-9604";
      if (name.includes("cjc")) return "CJC-1295 + Ipamorelin";
      if (name.includes("bpc")) return "BPC-157";
      if (name.includes("tb-5") || name === "tb500") return "TB-500";
      if (name.includes("pt-1") || name === "pt141") return "PT-141";
      if (name.includes("mots")) return "MOTS-c";
      if (name.includes("thymosin")) return "Thymosin Alpha-1";
      if (name.includes("glow")) return "GLOW Complex";
      if (name.includes("klow")) return "KLOW Complex";
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  return null;
}

// ── Admin routes ─────────────────────────────────────────────────────────────

router.get("/admin/aria-analytics", sessionAuth, async (req, res) => {
  const { from, to, intent } = req.query as Record<string, string | undefined>;

  const conditions = [];
  if (from) conditions.push(gte(ariaAnalyticsTable.createdAt, new Date(from)));
  if (to)   conditions.push(gte(new Date(to), ariaAnalyticsTable.createdAt));
  if (intent && intent !== "all") conditions.push(eq(ariaAnalyticsTable.detectedIntent, intent));

  const rows = await db
    .select()
    .from(ariaAnalyticsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(ariaAnalyticsTable.createdAt))
    .limit(500);

  res.json(rows);
});

router.get("/admin/aria-analytics/summary", sessionAuth, async (req, res) => {
  const { from } = req.query as Record<string, string | undefined>;
  const since = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [intentRows, peptideRows, totalRow] = await Promise.all([
    db
      .select({ intent: ariaAnalyticsTable.detectedIntent, count: sql<number>`count(*)::int` })
      .from(ariaAnalyticsTable)
      .where(gte(ariaAnalyticsTable.createdAt, since))
      .groupBy(ariaAnalyticsTable.detectedIntent),

    db
      .select({ peptide: ariaAnalyticsTable.peptideMentioned, count: sql<number>`count(*)::int` })
      .from(ariaAnalyticsTable)
      .where(and(gte(ariaAnalyticsTable.createdAt, since), sql`${ariaAnalyticsTable.peptideMentioned} is not null`))
      .groupBy(ariaAnalyticsTable.peptideMentioned)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(ariaAnalyticsTable)
      .where(gte(ariaAnalyticsTable.createdAt, since)),
  ]);

  res.json({
    total: totalRow[0]?.count ?? 0,
    intents: intentRows,
    topPeptides: peptideRows,
  });
});

export default router;
