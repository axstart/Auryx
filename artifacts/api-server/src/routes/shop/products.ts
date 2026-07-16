export interface ProductVariant {
  label: string;
  priceCents: number;
}

export interface ProductCOA {
  label: string;
  accession: string;
  lab: string;
  purity?: string;
  url: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  dosingInfo: string;
  physicianNote?: string;
  priceCents: number;
  requiresConsultation: boolean;
  regulatoryStatus: "prescription" | "research" | "standard";
  variants?: ProductVariant[];
  coas?: ProductCOA[];
}

export const PRODUCTS: Product[] = [
  // ── GLP-1 & Metabolic ─────────────────────────────────────────────────────
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 & Metabolic",
    regulatoryStatus: "prescription",
    shortDescription: "Dual GLP-1/GIP receptor agonist researched for metabolic and glycemic parameters.",
    fullDescription:
      "Tirzepatide activates both GLP-1 and GIP receptors simultaneously, and is researched for its effects on metabolic parameters and glycemic control. Published trial data investigates differential outcomes compared to single-mechanism GLP-1 agents, including effects on visceral adipose tissue and lean mass.",
    benefits: [
      "Dual-receptor mechanism studied vs. single-mechanism GLP-1 agents",
      "Superior glycemic control for insulin-resistant patients",
      "Preserved lean muscle mass during weight loss",
      "Visceral fat reduction with cardiovascular benefits",
    ],
    dosingInfo:
      "Weekly subcutaneous injection, 2.5 mg titrating up to 15 mg over 12–20 weeks. Protocol duration: 16–32 weeks. All dosing supervised by Auryx physicians.",
    requiresConsultation: true,
    priceCents: 19900,
    variants: [
      { label: "10 mg", priceCents: 19900 },
      { label: "30 mg", priceCents: 44900 },
      { label: "60 mg", priceCents: 74900 },
      { label: "90 mg", priceCents: 99900 },
    ],
    coas: [
      { label: "10 mg", accession: "2605140082", lab: "Freedom Diagnostics Testing", purity: "99.94%", url: "/coa/tirzepatide-10mg.pdf" },
      { label: "30 mg", accession: "2605190056", lab: "Freedom Diagnostics Testing", purity: "99.93%", url: "/coa/tirzepatide-30mg.pdf" },
    ],
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 & Metabolic",
    regulatoryStatus: "prescription",
    shortDescription: "Sustained fat loss and improved insulin sensitivity.",
    fullDescription:
      "Semaglutide is a GLP-1 receptor agonist that suppresses appetite, slows gastric emptying, and improves glycemic control. It delivers sustained fat loss while preserving lean mass, making it the gold standard for metabolic optimization in patients with excess adiposity or insulin resistance.",
    benefits: [
      "Sustained fat loss without lean mass compromise",
      "Improved insulin sensitivity and glycemic control",
      "Reduced cardiovascular risk markers",
      "Appetite regulation and reduced cravings",
    ],
    dosingInfo:
      "Weekly subcutaneous injection, 0.25 mg titrating to 1–2.4 mg over 4–8 weeks as tolerated. Protocol duration: 12–24 weeks minimum. All dosing supervised by Auryx physicians.",
    requiresConsultation: true,
    priceCents: 12900,
    variants: [
      { label: "5 mg",  priceCents: 12900 },
      { label: "20 mg", priceCents: 46900 },
    ],
    coas: [
      { label: "5 mg",  accession: "25082100012", lab: "Freedom Diagnostics Testing", url: "/coa/semaglutide-5mg.pdf" },
      { label: "10 mg", accession: "2510130019",  lab: "Freedom Diagnostics Testing", url: "/coa/semaglutide-10mg.pdf" },
      { label: "20 mg", accession: "2512080052",  lab: "Freedom Diagnostics Testing", url: "/coa/semaglutide-20mg.pdf" },
      { label: "25 mg", accession: "2510270070",  lab: "Freedom Diagnostics Testing", url: "/coa/semaglutide-25mg.pdf" },
    ],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 & Metabolic",
    regulatoryStatus: "research",
    shortDescription: "Triple agonist — the frontier of body composition transformation.",
    fullDescription:
      "Retatrutide is a triple GLP-1/GIP/glucagon receptor agonist representing the cutting edge of metabolic pharmacology. By activating three distinct pathways, it drives unprecedented fat reduction, accelerates resting metabolic rate, and targets visceral adiposity with unmatched precision — ideal for patients who require aggressive metabolic intervention.",
    benefits: [
      "Unprecedented fat reduction via triple receptor activation",
      "Elevated resting metabolic rate",
      "Superior visceral fat targeting",
      "Improved insulin sensitivity and lipid profiles",
    ],
    dosingInfo:
      "Weekly subcutaneous injection, 2 mg titrating to 12 mg over 24 weeks. Protocol duration: 24–48 weeks. Requires comprehensive metabolic panel prior to initiation.",
    requiresConsultation: true,
    priceCents: 34900,
    variants: [
      { label: "12 mg", priceCents: 34900 },
      { label: "24 mg", priceCents: 57900 },
      { label: "50 mg", priceCents: 99900 },
    ],
    coas: [
      { label: "12 mg", accession: "2602020260", lab: "Freedom Diagnostics Testing", purity: "99.94%",  url: "/coa/retatrutide-12mg.pdf" },
      { label: "24 mg", accession: "2602240131", lab: "Freedom Diagnostics Testing", purity: "99.617%", url: "/coa/retatrutide-24mg.pdf" },
    ],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "GLP-1 & Metabolic",
    regulatoryStatus: "research",
    shortDescription: "GH fragment for targeted fat burning without glucose or IGF-1 disruption.",
    fullDescription:
      "AOD-9604 is a modified fragment of the human growth hormone molecule (amino acids 176–191) that retains GH's fat-burning properties without raising IGF-1 or affecting blood glucose. It stimulates lipolysis — particularly in visceral and abdominal fat depots — and inhibits lipogenesis, making it the cleanest fat-targeting peptide available for patients who cannot use full GH secretagogues.",
    benefits: [
      "Targeted lipolysis without IGF-1 elevation",
      "No impact on blood glucose or insulin",
      "Visceral and abdominal fat reduction",
      "Safe for patients with insulin resistance or diabetes",
    ],
    dosingInfo:
      "300–600 mcg subcutaneous injection daily, ideally 30 minutes before exercise or upon waking on an empty stomach. Protocol duration: 12–24 weeks.",
    requiresConsultation: false,
    priceCents: 18900,
  },

  // ── Growth Hormone ─────────────────────────────────────────────────────────
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Growth Hormone",
    regulatoryStatus: "research",
    shortDescription: "Natural GH stimulation for sleep, recovery, and lean body composition.",
    fullDescription:
      "Sermorelin is a GHRH analogue that stimulates the pituitary gland to produce and release growth hormone naturally, preserving the body's own feedback mechanisms. It enhances GH pulsatility during deep sleep, improving sleep quality, accelerating recovery, and supporting lean body composition — making it an ideal entry-level growth hormone protocol.",
    benefits: [
      "Stimulates natural, pulsatile GH release",
      "Enhanced deep sleep quality and restoration",
      "Improved lean body composition and recovery",
      "Gentle on the endocrine system — preserves natural feedback loops",
    ],
    dosingInfo:
      "Subcutaneous injection 5 nights per week before sleep, 200–300 mcg per dose. Protocol duration: 12–24 weeks minimum for full benefit.",
    physicianNote:
      "Sermorelin is our recommended starting point for patients new to growth hormone optimization. Its shorter half-life and pituitary-driven mechanism make it the safest and most physiological GH secretagogue available.",
    requiresConsultation: false,
    priceCents: 9900,
    coas: [
      { label: "10 mg", accession: "SPL-2785", lab: "TrustPointe Analytics", url: "/coa/sermorelin-10mg.pdf" },
    ],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Growth Hormone",
    regulatoryStatus: "prescription",
    shortDescription: "Clinically proven visceral fat reduction and elevated IGF-1.",
    fullDescription:
      "Tesamorelin is a stabilized GHRH analogue with the strongest clinical evidence base of any growth hormone secretagogue. FDA-approved for visceral adiposity in specific populations, it reliably elevates IGF-1, reduces trunk fat, and improves metabolic markers. Ideal for patients with documented visceral adiposity or declining IGF-1 levels.",
    benefits: [
      "Clinically proven visceral fat reduction",
      "Elevated IGF-1 for tissue repair and metabolism",
      "Improved lean mass and body composition",
      "Enhanced cognitive clarity and energy",
    ],
    dosingInfo:
      "Daily subcutaneous injection, 1–2 mg before sleep. Protocol duration: 12–24 weeks. IGF-1 labs recommended at baseline and at 8 weeks.",
    physicianNote:
      "Tesamorelin carries the strongest evidence base of any GH secretagogue — its clinical trial data on visceral fat reduction is unambiguous. We recommend it for patients with measurable VAT or documented IGF-1 decline.",
    requiresConsultation: false,
    priceCents: 18900,
    variants: [
      { label: "10 mg", priceCents: 18900 },
    ],
    coas: [
      { label: "10 mg", accession: "2606120629", lab: "Freedom Diagnostics Testing", purity: "99.94%", url: "/coa/tesamorelin-10mg.pdf" },
      { label: "20 mg", accession: "SPL-1565",   lab: "TrustPointe Analytics",       url: "/coa/tesamorelin-20mg.pdf" },
    ],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "Growth Hormone",
    regulatoryStatus: "research",
    shortDescription: "Clean, selective GH pulse amplification with superior sleep and recovery.",
    fullDescription:
      "Ipamorelin is a highly selective growth hormone secretagogue that stimulates pulsatile GH release with minimal effect on cortisol or prolactin — making it the cleanest GH peptide available. Its selective mechanism preserves the natural GH feedback loop, making it safe for extended cycles and ideal for patients prioritising sleep quality, recovery, and lean mass gains without hormonal disruption.",
    benefits: [
      "Selective GH pulse amplification without cortisol spike",
      "Deep sleep enhancement and overnight recovery",
      "Lean muscle growth and fat metabolism support",
      "Safe for long-term cycles — minimal hormonal disruption",
    ],
    dosingInfo:
      "200–300 mcg subcutaneous injection 5 nights per week, administered before sleep. Can be stacked with CJC-1295 for amplified GH release. Protocol duration: 12–24 weeks.",
    requiresConsultation: false,
    priceCents: 13900,
    variants: [
      { label: "10 mg", priceCents: 13900 },
    ],
    coas: [
      { label: "10 mg", accession: "2508220022", lab: "Freedom Diagnostics Testing", purity: "99.76%", url: "/coa/ipamorelin-10mg.pdf" },
    ],
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295 (no DAC)",
    category: "Growth Hormone",
    regulatoryStatus: "research",
    shortDescription: "Physiological GHRH analogue for pulsatile growth hormone release.",
    fullDescription:
      "CJC-1295 without DAC (Drug Affinity Complex) is a GHRH analogue with a short half-life of approximately 30 minutes, producing a natural, pulsatile GH release that closely mirrors the body's own secretion patterns. It is most effective when paired with a GHRP such as Ipamorelin, amplifying the GH pulse without disrupting the natural feedback loop or causing supraphysiological hormone levels.",
    benefits: [
      "Natural pulsatile GH release preserving feedback mechanisms",
      "Enhanced GH amplitude when combined with a GHRP",
      "Improved sleep architecture and overnight recovery",
      "Lean mass support and body composition optimization",
    ],
    dosingInfo:
      "100–200 mcg subcutaneous injection 5 nights per week before sleep. Most effective when co-administered with Ipamorelin. Protocol duration: 12–24 weeks.",
    physicianNote:
      "The no-DAC formulation is preferred for patients who want the most physiological GH release pattern. Its short half-life means it acts only during the injection window, making it ideal for mimicking natural nocturnal GH pulses.",
    requiresConsultation: false,
    priceCents: 11900,
  },
  {
    slug: "cjc-1295-dac",
    name: "CJC-1295 (DAC)",
    category: "Growth Hormone",
    regulatoryStatus: "research",
    shortDescription: "Extended-release GHRH analogue for sustained IGF-1 elevation and GH output.",
    fullDescription:
      "CJC-1295 with DAC (Drug Affinity Complex) binds to albumin in the bloodstream, extending its half-life to approximately 6–8 days. A single weekly injection sustains elevated growth hormone levels throughout the week — producing consistently elevated IGF-1, improved lean mass, and accelerated recovery. Ideal for patients seeking convenience and steady-state GH optimization.",
    benefits: [
      "Once-weekly dosing with sustained GH elevation",
      "Consistent IGF-1 elevation for tissue repair and metabolism",
      "Lean mass accretion and body recomposition support",
      "Improved skin quality, collagen synthesis, and recovery",
    ],
    dosingInfo:
      "1–2 mg subcutaneous injection once weekly. Protocol duration: 12–24 weeks. IGF-1 monitoring recommended at 8 weeks to guide dose adjustment.",
    physicianNote:
      "The DAC formulation suits patients who prefer once-weekly protocols and consistent hormone levels. Note that its prolonged action produces a less pulsatile GH profile — a meaningful clinical distinction from the no-DAC version.",
    requiresConsultation: false,
    priceCents: 26900,
    variants: [
      { label: "10 mg", priceCents: 26900 },
    ],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "Growth Hormone",
    regulatoryStatus: "research",
    shortDescription: "Deep sleep restoration, lean muscle, and broad anti-aging.",
    fullDescription:
      "CJC-1295 is a GHRH analogue that extends the half-life of endogenous growth hormone releasing hormone, while Ipamorelin is a selective GH secretagogue that amplifies GH pulse amplitude without elevating cortisol or prolactin. Together they produce sustained, physiological GH release — restoring deep sleep architecture, accelerating lean muscle, and delivering comprehensive anti-aging benefits.",
    benefits: [
      "Deep sleep restoration and circadian rhythm optimization",
      "Lean muscle accretion and body recomposition",
      "Improved skin elasticity and collagen synthesis",
      "Enhanced fat metabolism without cortisol elevation",
      "Broad anti-aging at the cellular level",
    ],
    dosingInfo:
      "Subcutaneous injection 5 nights per week before sleep. CJC-1295 (no DAC) 100–200 mcg + Ipamorelin 100–200 mcg per dose. Protocol duration: 12–24 weeks minimum.",
    physicianNote:
      "CJC-1295 + Ipamorelin is our most prescribed entry-level growth hormone protocol. The combination maximizes pulsatile GH release while maintaining hormonal safety — avoiding the flat, supraphysiological levels seen with exogenous HGH.",
    requiresConsultation: false,
    priceCents: 17900,
    coas: [
      { label: "5/5 mg", accession: "2602130491", lab: "Freedom Diagnostics Testing", purity: "99.829%", url: "/coa/cjc-ipamorelin.pdf" },
    ],
  },
  {
    slug: "tesamorelin-ipamorelin",
    name: "Tesamorelin + Ipamorelin",
    category: "Growth Hormone",
    regulatoryStatus: "prescription",
    shortDescription: "Premium stack: visceral fat targeting + GH pulse amplification.",
    fullDescription:
      "The premium Auryx growth hormone stack combines the visceral fat targeting and clinical potency of Tesamorelin with the GH pulse amplification and sleep enhancement of Ipamorelin. This combination delivers comprehensive body composition transformation, optimized recovery, and superior anti-aging outcomes.",
    benefits: [
      "Dual-mechanism visceral fat reduction",
      "Amplified GH pulsatility and IGF-1 elevation",
      "Superior sleep depth and recovery",
      "Enhanced lean mass and skin quality",
    ],
    dosingInfo:
      "Tesamorelin 1 mg + Ipamorelin 200 mcg, subcutaneous injection nightly. Protocol duration: 16–24 weeks. IGF-1 monitoring recommended.",
    physicianNote:
      "This is our flagship GH protocol — the combination produces synergistic effects that neither compound achieves alone. We prescribe it for patients seeking maximal anti-aging and body composition results.",
    requiresConsultation: false,
    priceCents: 22900,
    coas: [
      { label: "10/2 mg", accession: "2606030541", lab: "Freedom Diagnostics Testing", purity: "99.50%", url: "/coa/tesamorelin-ipamorelin.pdf" },
    ],
  },

  // ── Recovery & Regeneration ────────────────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Recovery & Regeneration",
    regulatoryStatus: "research",
    shortDescription: "Tendon, joint, and gut healing with systemic anti-inflammatory action.",
    fullDescription:
      "BPC-157 (Body Protection Compound 157) is a pentadecapeptide derived from a gastric protein that promotes healing across multiple tissue types. It accelerates tendon and ligament repair, resolves joint inflammation, restores gut mucosal integrity, and supports nerve regeneration — making it an essential component of any recovery or injury rehabilitation protocol.",
    benefits: [
      "Accelerated tendon and ligament healing",
      "Gut lining restoration and mucosal protection",
      "Joint inflammation resolution",
      "Nerve repair and neuroprotective effects",
    ],
    dosingInfo:
      "200–500 mcg subcutaneous or intramuscular injection, once daily near the injury site. Oral dosing available for gut applications (500–1000 mcg). Protocol duration: 4–12 weeks.",
    requiresConsultation: false,
    priceCents: 9900,
    variants: [
      { label: "10 mg", priceCents: 9900 },
      { label: "20 mg", priceCents: 18900 },
    ],
    coas: [
      { label: "10 mg", accession: "2605140090", lab: "Freedom Diagnostics Testing", purity: "99.84%", url: "/coa/bpc-157-10mg.pdf" },
    ],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    category: "Recovery & Regeneration",
    regulatoryStatus: "research",
    shortDescription: "Systemic injury recovery and reduced inflammation at speed.",
    fullDescription:
      "TB-500 (Thymosin Beta-4) is a naturally occurring protein that regulates actin, drives cell migration to injury sites, and promotes new blood vessel growth. It delivers systemic healing that BPC-157 cannot replicate — ideal for widespread inflammation, cardiovascular tissue repair, and neurological recovery after injury or surgery.",
    benefits: [
      "Systemic injury recovery and tissue regeneration",
      "Reduced inflammation and scarring",
      "Cardiovascular tissue repair",
      "Neurological recovery support",
    ],
    dosingInfo:
      "2.5–5 mg subcutaneous injection twice weekly for 4–6 weeks loading phase, then 2.5 mg weekly for maintenance. Protocol duration: 8–16 weeks.",
    requiresConsultation: false,
    priceCents: 18900,
    variants: [
      { label: "10 mg", priceCents: 18900 },
    ],
    coas: [
      { label: "10 mg", accession: "2606030532", lab: "Freedom Diagnostics Testing", purity: "99.79%", url: "/coa/tb-500-10mg.pdf" },
    ],
  },
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500",
    category: "Recovery & Regeneration",
    regulatoryStatus: "research",
    shortDescription: "Comprehensive tissue repair stack targeting systemic and local injury pathways.",
    fullDescription:
      "This synergistic stack combines BPC-157's localized tendon, gut, and joint healing with TB-500's systemic tissue regeneration and anti-inflammatory action. Together they address injury recovery from every angle — making this combination the definitive repair protocol for serious athletes, post-surgical patients, and anyone dealing with chronic musculoskeletal injury.",
    benefits: [
      "Localized and systemic healing in a single protocol",
      "Accelerated tendon, ligament, and joint recovery",
      "Gut mucosal repair alongside systemic regeneration",
      "Significantly reduced recovery timeline",
    ],
    dosingInfo:
      "BPC-157 200–500 mcg + TB-500 2.5–5 mg subcutaneous injection, administered together 3–5 times per week. Protocol duration: 6–12 weeks.",
    requiresConsultation: false,
    priceCents: 24900,
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Recovery & Regeneration",
    regulatoryStatus: "research",
    shortDescription: "Anti-inflammatory, wound healing, and gut mucosal protection.",
    fullDescription:
      "KPV is a tripeptide fragment of alpha-melanocyte stimulating hormone with potent anti-inflammatory, wound healing, and gut protective properties. It modulates inflammatory cytokines, accelerates wound closure, protects gut mucosal integrity, and restores skin barrier function — making it valuable for both systemic and localized inflammatory conditions.",
    benefits: [
      "Potent anti-inflammatory cytokine modulation",
      "Accelerated wound healing and tissue repair",
      "Gut mucosal protection and barrier restoration",
      "Skin barrier repair and inflammation control",
    ],
    dosingInfo:
      "500 mcg–1 mg subcutaneous injection once daily, or oral capsule 500 mcg–2 mg for gut applications. Protocol duration: 4–8 weeks.",
    requiresConsultation: false,
    priceCents: 11900,
    coas: [
      { label: "10 mg", accession: "2605140084", lab: "Freedom Diagnostics Testing", purity: "99.42%", url: "/coa/kpv-10mg.pdf" },
    ],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    category: "Recovery & Regeneration",
    regulatoryStatus: "research",
    shortDescription: "Copper peptide for collagen synthesis, wound repair, and tissue regeneration.",
    fullDescription:
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper) is a naturally occurring copper-binding peptide with well-documented roles in tissue repair, collagen and elastin synthesis, angiogenesis, and anti-inflammatory signaling. It activates fibroblasts, accelerates wound healing, stimulates hair follicle activity, and exerts antioxidant effects — making it a foundational peptide for skin regeneration, connective tissue repair, and aesthetic longevity protocols.",
    benefits: [
      "Collagen and elastin synthesis stimulation",
      "Accelerated wound healing and tissue repair",
      "Hair follicle activation and density improvement",
      "Antioxidant and anti-inflammatory signaling",
    ],
    dosingInfo:
      "200–500 mcg subcutaneous or topical application once daily. For systemic tissue repair, subcutaneous injection near the target area is preferred. Protocol duration: 8–16 weeks.",
    requiresConsultation: false,
    priceCents: 9900,
    variants: [
      { label: "50 mg", priceCents: 9900 },
    ],
  },

  // ── Sexual Health & Vitality ───────────────────────────────────────────────
  {
    slug: "pt-141",
    name: "PT-141",
    category: "Sexual Health & Vitality",
    regulatoryStatus: "prescription",
    shortDescription: "Increased libido and arousal in men and women via central activation.",
    fullDescription:
      "PT-141 (Bremelanotide) is a melanocortin receptor agonist that acts centrally — directly activating the hypothalamic pathways governing libido and arousal. Unlike PDE5 inhibitors that work peripherally, PT-141 addresses the neurological root of sexual function, delivering enhanced libido, improved arousal, and improved erectile function without cardiovascular contraindications.",
    benefits: [
      "Increased libido in both men and women",
      "Enhanced arousal via central hypothalamic activation",
      "Improved erectile function",
      "Does not require prior arousal or cardiovascular stimulation",
    ],
    dosingInfo:
      "1–2 mg subcutaneous injection 1–2 hours before activity, as needed. Limit to 2–3 uses per week. Titrate from 0.5 mg to assess individual response.",
    requiresConsultation: false,
    priceCents: 11900,
    coas: [
      { label: "10 mg", accession: "2606120626", lab: "Freedom Diagnostics Testing", purity: "99.82%", url: "/coa/pt-141-10mg.pdf" },
    ],
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Sexual Health & Vitality",
    regulatoryStatus: "research",
    shortDescription: "Neuropeptide modulating the HPG axis and endogenous gonadotropin signaling.",
    fullDescription:
      "Kisspeptin is a naturally occurring neuropeptide that activates the hypothalamic-pituitary-gonadal (HPG) axis, stimulating pulsatile GnRH secretion and downstream gonadotropin release. Researchers study its role in endogenous hormone signaling, sexual function, and HPG axis regulation as an alternative to exogenous hormone interventions.",
    benefits: [
      "HPG axis activation and gonadotropin signaling research",
      "Endogenous hormone pathway modulation",
      "Sexual function and libido research applications",
      "Preservation of natural hormonal feedback mechanisms",
    ],
    dosingInfo:
      "0.3–1 nmol/kg subcutaneous injection, 2–3 times per week. Protocol duration: 8–16 weeks. Hormone panel recommended at baseline.",
    requiresConsultation: true,
    priceCents: 19900,
  },

  // ── Immune & Cellular Biology ─────────────────────────────────────────────────────
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Thymic peptide researched for T-cell modulation and immune system signaling.",
    fullDescription:
      "Thymosin Alpha-1 is a thymic peptide studied for its role in immune system modulation — including T-cell activity, natural killer cell function, and antigen presentation. It is an active area of research in immunology, particularly regarding immune system signaling and cytokine balance.",
    benefits: [
      "T-cell and NK cell activity research",
      "Immune system signaling and cytokine modulation",
      "Autoimmune pathway and cytokine balance research",
      "Thymic peptide immune regulation studies",
    ],
    dosingInfo:
      "1.6 mg subcutaneous injection twice weekly. Protocol duration: 8–16 weeks for immune optimization; ongoing for maintenance.",
    requiresConsultation: false,
    priceCents: 19900,
    coas: [
      { label: "10 mg", accession: "2602130489", lab: "Freedom Diagnostics Testing", purity: "99.22%", url: "/coa/thymosin-alpha-1-10mg.pdf" },
    ],
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Telomere length preservation and circadian rhythm restoration.",
    fullDescription:
      "Epithalon (Epitalon) is a tetrapeptide derived from the pineal gland that activates telomerase, the enzyme responsible for telomere maintenance. It represents one of the most direct biological anti-aging interventions available — preserving chromosomal integrity, enhancing melatonin secretion, and restoring circadian rhythm at the epigenetic level.",
    benefits: [
      "Telomerase activation and telomere length preservation",
      "Enhanced melatonin production and sleep quality",
      "Circadian rhythm restoration",
      "Cellular longevity at the epigenetic level",
    ],
    dosingInfo:
      "5–10 mg subcutaneous injection once daily for 10–20 days, 1–2 cycles per year. Best administered in the evening.",
    requiresConsultation: false,
    priceCents: 12900,
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Mitochondrial biogenesis and metabolic flexibility.",
    fullDescription:
      "MOTS-c is a mitochondrial-derived peptide that regulates metabolic homeostasis, activates AMPK, and drives mitochondrial biogenesis. It improves insulin sensitivity, enhances physical endurance, and activates longevity pathways that overlap with caloric restriction — making it a foundational longevity compound at the cellular energy level.",
    benefits: [
      "Mitochondrial biogenesis and energy production",
      "AMPK activation and metabolic flexibility",
      "Improved insulin sensitivity and glucose metabolism",
      "Physical endurance and exercise performance",
    ],
    dosingInfo:
      "5–10 mg subcutaneous injection once daily, 3–5 days per week. Protocol duration: 8–12 weeks, repeat 1–2 times per year.",
    requiresConsultation: false,
    priceCents: 12900,
    variants: [
      { label: "10 mg", priceCents: 12900 },
      { label: "30 mg", priceCents: 33900 },
    ],
    coas: [
      { label: "10 mg", accession: "2606030523", lab: "Freedom Diagnostics Testing", purity: "99.30%", url: "/coa/mots-c-10mg.pdf" },
    ],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Metabolic coenzyme researched for mitochondrial function and sirtuin pathway activity.",
    fullDescription:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to cellular energy metabolism, NAD-dependent enzyme activity, and sirtuin pathway research. Levels decline with age — researchers study supplementation for its potential effects on mitochondrial function, metabolic signaling, and cellular maintenance mechanisms.",
    benefits: [
      "Mitochondrial energy metabolism research",
      "NAD-dependent sirtuin pathway activity",
      "Cellular maintenance mechanism studies",
      "Metabolic coenzyme replenishment research",
    ],
    dosingInfo:
      "250–500 mg IV infusion over 2–4 hours, 1–3 times per week during loading phase; 250 mg subcutaneous weekly for maintenance. Administer slowly to minimize discomfort.",
    requiresConsultation: false,
    priceCents: 14900,
    variants: [
      { label: "500 mg",  priceCents: 14900 },
      { label: "1000 mg", priceCents: 24900 },
    ],
    coas: [
      { label: "1000 mg", accession: "2605080253", lab: "Freedom Diagnostics Testing", purity: "99.93%", url: "/coa/nad-plus-1g.pdf" },
    ],
  },
  {
    slug: "glutathione",
    name: "Glutathione",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Master antioxidant for cellular detoxification, immune function, and oxidative stress reduction.",
    fullDescription:
      "Glutathione is the body's most abundant endogenous antioxidant — a tripeptide (glutamate, cysteine, glycine) that neutralizes reactive oxygen species, regenerates vitamins C and E, and drives phase II hepatic detoxification. Levels decline with age, chronic illness, and environmental toxin exposure. IV and subcutaneous administration delivers systemic antioxidant capacity that oral supplementation cannot match, supporting immune resilience, skin luminance, and mitochondrial protection.",
    benefits: [
      "Systemic oxidative stress reduction and cellular protection",
      "Phase II hepatic detoxification support",
      "Enhanced immune function and NK cell activity",
      "Skin brightening and melanin regulation research",
    ],
    dosingInfo:
      "600–1200 mg IV push or slow IV infusion, 1–3 times per week. Subcutaneous dosing 200–400 mg daily as an alternative. Protocol duration: 8–16 weeks.",
    requiresConsultation: false,
    priceCents: 19900,
  },
  {
    slug: "ss-31",
    name: "SS-31",
    category: "Immune & Cellular Biology",
    regulatoryStatus: "research",
    shortDescription: "Mitochondria-targeted antioxidant researched for cardioprotection and cellular energy.",
    fullDescription:
      "SS-31 (Elamipretide) is a mitochondria-targeted tetrapeptide that selectively concentrates in the inner mitochondrial membrane, where it stabilizes cardiolipin and reduces mitochondrial reactive oxygen species production. It is one of the most researched compounds for mitochondrial dysfunction — with published data on heart failure, renal ischemia, age-related mitochondrial decline, and neurodegenerative conditions.",
    benefits: [
      "Inner mitochondrial membrane stabilization via cardiolipin binding",
      "Mitochondrial ROS reduction and bioenergetics optimization",
      "Cardioprotective and renoprotective research applications",
      "Age-related mitochondrial decline research",
    ],
    dosingInfo:
      "0.05–0.25 mg/kg subcutaneous injection once daily. Protocol duration: 8–16 weeks, with periodic cycling. Clinical monitoring recommended for cardiometabolic indications.",
    requiresConsultation: false,
    priceCents: 14900,
  },

  // ── Neuroprotective & CNS ────────────────────────────────────────────
  {
    slug: "pinealon",
    name: "Pinealon",
    category: "Neuroprotective & CNS",
    regulatoryStatus: "research",
    shortDescription: "Deep neuroprotection and circadian optimization.",
    fullDescription:
      "Pinealon is a tripeptide from the pineal gland that crosses the blood-brain barrier and exerts neuroprotective effects at the cellular level. It reduces oxidative stress in neuronal tissue, optimizes circadian signaling, and demonstrates marked cognitive preservation — particularly relevant as a preventive intervention against age-related neurodegeneration.",
    benefits: [
      "Blood-brain barrier penetrant neuroprotection",
      "Oxidative stress reduction in neuronal tissue",
      "Circadian signaling optimization",
      "Cognitive preservation and neurodegeneration prevention",
    ],
    dosingInfo:
      "0.1–0.2 mg/kg subcutaneous injection, once daily for 10 days per cycle. Two cycles per year recommended.",
    requiresConsultation: false,
    priceCents: 14900,
    coas: [
      { label: "20 mg", accession: "2509290026", lab: "Freedom Diagnostics Testing", purity: "99.949%", url: "/coa/pinealon-20mg.pdf" },
    ],
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Neuroprotective & CNS",
    regulatoryStatus: "research",
    shortDescription: "Elevated neuroplasticity, focus, and mood stabilization.",
    fullDescription:
      "Semax is a synthetic ACTH analogue that elevates BDNF (brain-derived neurotrophic factor), enhances neuroplasticity, and sharpens executive function. It improves working memory, focus, and verbal fluency while providing neuroprotection — originally developed for cognitive rehabilitation, now used for high-performance cognitive optimization.",
    benefits: [
      "Elevated BDNF and neuroplasticity",
      "Enhanced focus, working memory, and verbal fluency",
      "Neuroprotection and cognitive resilience",
      "Mood stabilization without sedation",
    ],
    dosingInfo:
      "100–300 mcg intranasal administration, 1–2 times daily. Protocol duration: 2–4 weeks on, 2 weeks off.",
    requiresConsultation: false,
    priceCents: 7900,
    variants: [
      { label: "30 mg", priceCents: 7900 },
    ],
    coas: [
      { label: "30 mg", accession: "2606030517", lab: "Freedom Diagnostics Testing", purity: "99.39%", url: "/coa/semax-30mg.pdf" },
    ],
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Neuroprotective & CNS",
    regulatoryStatus: "research",
    shortDescription: "Anxiety reduction without impairment and memory enhancement.",
    fullDescription:
      "Selank is a synthetic analogue of the endogenous tuftsin peptide with anxiolytic and nootropic properties. It modulates GABA and serotonin systems without causing sedation or dependence — delivering clean anxiety reduction, improved memory consolidation, and mood stabilization suitable for daily use.",
    benefits: [
      "Anxiolytic effects without sedation or dependence",
      "Enhanced memory consolidation and retention",
      "Serotonin and GABA modulation",
      "Stable mood and stress resilience",
    ],
    dosingInfo:
      "100–300 mcg intranasal administration, 1–2 times daily. Can be cycled alongside Semax for synergistic cognitive-anxiolytic benefit.",
    requiresConsultation: false,
    priceCents: 16900,
    coas: [
      { label: "10 mg", accession: "2605210086", lab: "Freedom Diagnostics Testing", purity: "99.82%", url: "/coa/selank-10mg.pdf" },
    ],
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "Neuroprotective & CNS",
    regulatoryStatus: "research",
    shortDescription: "Neuropeptide complex researched for neuronal survival, neurotrophic signaling, and cognitive function.",
    fullDescription:
      "Cerebrolysin is a low-molecular-weight neuropeptide complex derived from porcine brain protein that crosses the blood-brain barrier. Researchers study its neurotrophic factor-mimetic activity — including potential effects on neuronal survival, synaptic plasticity, and cognitive function. It is an active area of research in neuroscience and neurological aging.",
    benefits: [
      "Neurotrophic factor-mimetic activity research",
      "Neuronal survival and synaptic plasticity studies",
      "Cognitive aging and neurodegenerative research applications",
      "Enhanced long-term memory and recall",
    ],
    dosingInfo:
      "5–30 mL intravenous or intramuscular injection, daily for 10–20 day cycles. Protocol designed individually based on neurological goals.",
    requiresConsultation: true,
    priceCents: 29900,
    coas: [
      { label: "1200 mg", accession: "K2G5FD9F1885", lab: "Chromate Analytics", url: "/coa/cerebrolysin-1200mg.png" },
    ],
  },

  // ── Auryx Signature Complexes ──────────────────────────────────────────────
  {
    slug: "glow-complex",
    name: "GLOW Complex",
    category: "Auryx Signature Complexes",
    regulatoryStatus: "research",
    shortDescription: "Skin radiance, hair regeneration, and collagen synthesis.",
    fullDescription:
      "The Auryx GLOW Complex is a proprietary peptide blend targeting the skin, hair, and connective tissue pathways simultaneously. It drives collagen synthesis, stimulates hair follicle regeneration, and delivers a measurable improvement in skin radiance and elasticity — a comprehensive aesthetic longevity protocol.",
    benefits: [
      "Enhanced skin radiance and elasticity",
      "Hair follicle regeneration and density",
      "Accelerated collagen and elastin synthesis",
      "Comprehensive aesthetic rejuvenation",
    ],
    dosingInfo:
      "Administered per individualized Auryx protocol. Contact our clinical team for dosing schedule.",
    requiresConsultation: true,
    priceCents: 28900,
  },
  {
    slug: "klow-complex",
    name: "KLOW Complex",
    category: "Auryx Signature Complexes",
    regulatoryStatus: "research",
    shortDescription: "Inflammation reduction, metabolic enhancement, and cellular energy.",
    fullDescription:
      "The Auryx KLOW Complex is a proprietary multi-peptide formulation targeting systemic inflammation, metabolic rate, and cellular energy optimization. It combines anti-inflammatory, metabolic, and mitochondrial peptides into a single protocol designed for high-performance individuals seeking comprehensive physiological optimization.",
    benefits: [
      "Systemic inflammation reduction",
      "Enhanced metabolic rate and thermogenesis",
      "Cellular energy and mitochondrial optimization",
      "Multi-system physiological performance enhancement",
    ],
    dosingInfo:
      "Administered per individualized Auryx protocol. Contact our clinical team for dosing schedule.",
    requiresConsultation: true,
    priceCents: 28900,
    coas: [
      { label: "GHK-Cu/KPV/BPC-157/TB-500", accession: "2602240140", lab: "Freedom Diagnostics Testing", url: "/coa/klow-complex.pdf" },
    ],
  },

  // ── Accessories ───────────────────────────────────────────────────────────
  {
    slug: "reconstitution-kit",
    name: "Reconstitution Kit",
    category: "Accessories",
    regulatoryStatus: "standard",
    shortDescription: "Everything you need to safely reconstitute your peptides.",
    fullDescription:
      "Each Auryx Reconstitution Kit includes all essentials for proper peptide preparation: 1x Bacteriostatic Water (30ml), 10x Alcohol Prep Pads, and 10x Insulin Syringes (0.5cc, 31G, 5/16in, individually wrapped). All items are US-sourced, sterile, and individually packaged for safety and convenience.",
    benefits: [
      "Bacteriostatic water for safe peptide reconstitution",
      "Sterile alcohol prep pads for injection site preparation",
      "Precision insulin syringes (0.5cc, 31G) for accurate dosing",
      "Individually wrapped for sterility and convenience",
    ],
    dosingInfo:
      "This is a supply kit for peptide reconstitution and administration. Follow your physician's protocol for reconstitution ratios and injection technique.",
    requiresConsultation: false,
    priceCents: 3500,
  },

  // ── Admin test product — hidden from shop listing, accessible at /shop/test ──
  {
    slug: "test-charge",
    name: "TEST",
    category: "Research Peptides",
    regulatoryStatus: "standard",
    shortDescription: "Internal admin test product for payment smoke testing.",
    fullDescription: "Internal test product for payment flow validation. Not visible in the shop catalog.",
    benefits: [],
    dosingInfo: "N/A",
    requiresConsultation: false,
    priceCents: 100,
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);
