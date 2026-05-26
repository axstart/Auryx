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
}

export const PRODUCTS: Product[] = [
  // ── GLP-1 & Metabolic ─────────────────────────────────────────────────────
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 & Metabolic",
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
    priceCents: 19900,
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 & Metabolic",
    shortDescription: "Dual GLP-1/GIP agonist — superior fat loss and glycemic control.",
    fullDescription:
      "Tirzepatide activates both GLP-1 and GIP receptors simultaneously, delivering superior fat reduction and glycemic control compared to GLP-1 monotherapy alone. Clinical trials demonstrate greater weight reduction than any single-mechanism GLP-1 agent, with significant visceral fat targeting and lean mass preservation.",
    benefits: [
      "Greater fat loss vs. single-mechanism GLP-1 agents",
      "Superior glycemic control for insulin-resistant patients",
      "Preserved lean muscle mass during weight loss",
      "Visceral fat reduction with cardiovascular benefits",
    ],
    dosingInfo:
      "Weekly subcutaneous injection, 2.5 mg titrating up to 15 mg over 12–20 weeks. Protocol duration: 16–32 weeks. All dosing supervised by Auryx physicians.",
    requiresConsultation: true,
    priceCents: 19900,
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 & Metabolic",
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
    priceCents: 19900,
  },

  // ── Growth Hormone ─────────────────────────────────────────────────────────
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "Growth Hormone",
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
    priceCents: 19900,
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Growth Hormone",
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
    priceCents: 19900,
  },
  {
    slug: "tesamorelin-ipamorelin",
    name: "Tesamorelin + Ipamorelin",
    category: "Growth Hormone",
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
    priceCents: 19900,
  },

  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Growth Hormone",
    shortDescription: "Natural GH stimulation for sleep, recovery, and lean body composition.",
    fullDescription:
      "Sermorelin is a GHRH analogue that stimulates the pituitary gland to produce and release growth hormone naturally, preserving the body's own feedback mechanisms. It enhances GH pulsatility during deep sleep, improving sleep quality, accelerating recovery, and supporting lean body composition — making it an ideal entry-level growth hormone protocol for patients new to peptide therapy.",
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
    priceCents: 16900,
  },

  // ── Recovery & Regeneration ────────────────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Recovery & Regeneration",
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
    priceCents: 19900,
  },
  {
    slug: "tb-500",
    name: "TB-500",
    category: "Recovery & Regeneration",
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
    priceCents: 19900,
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Recovery & Regeneration",
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
    priceCents: 19900,
  },

  // ── Sexual Health & Vitality ───────────────────────────────────────────────
  {
    slug: "pt-141",
    name: "PT-141",
    category: "Sexual Health & Vitality",
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
    priceCents: 19900,
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Sexual Health & Vitality",
    shortDescription: "Natural testosterone and estrogen optimization with fertility support.",
    fullDescription:
      "Kisspeptin is a naturally occurring neuropeptide that stimulates the hypothalamic-pituitary-gonadal axis, driving endogenous testosterone and estrogen production. It represents a physiological approach to hormonal optimization — enhancing libido, sexual function, and fertility without suppressing the HPG axis as exogenous hormone therapy does.",
    benefits: [
      "Endogenous testosterone and estrogen optimization",
      "Enhanced libido and sexual function",
      "Fertility support through HPG axis stimulation",
      "Maintains natural hormonal feedback loops",
    ],
    dosingInfo:
      "0.3–1 nmol/kg subcutaneous injection, 2–3 times per week. Protocol duration: 8–16 weeks. Hormone panel recommended at baseline.",
    requiresConsultation: true,
    priceCents: 19900,
  },

  // ── Immune & Longevity ─────────────────────────────────────────────────────
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune & Longevity",
    shortDescription: "Immune fortification and pathogen resistance.",
    fullDescription:
      "Thymosin Alpha-1 is a thymic peptide that modulates and fortifies the immune system — enhancing T-cell activity, natural killer cell function, and antigen presentation. It has been used clinically in immunocompromised patients and offers powerful preventive and therapeutic benefits for immune optimization and chronic infection resistance.",
    benefits: [
      "Enhanced T-cell and NK cell activity",
      "Improved resistance to viral and bacterial pathogens",
      "Autoimmune modulation and cytokine balance",
      "Adjunctive benefit during and after illness",
    ],
    dosingInfo:
      "1.6 mg subcutaneous injection twice weekly. Protocol duration: 8–16 weeks for immune optimization; ongoing for maintenance.",
    requiresConsultation: false,
    priceCents: 19900,
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    category: "Immune & Longevity",
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
    priceCents: 19900,
  },
  {
    slug: "pinealon",
    name: "Pinealon",
    category: "Immune & Longevity",
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
    priceCents: 19900,
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Immune & Longevity",
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
    priceCents: 19900,
  },

  // ── Cognitive & Neuroprotective ────────────────────────────────────────────
  {
    slug: "semax",
    name: "Semax",
    category: "Cognitive & Neuroprotective",
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
    priceCents: 19900,
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Cognitive & Neuroprotective",
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
    priceCents: 19900,
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "Cognitive & Neuroprotective",
    shortDescription: "Robust neuroprotection, post-stroke repair, and memory enhancement.",
    fullDescription:
      "Cerebrolysin is a peptide mixture derived from porcine brain protein that crosses the blood-brain barrier and delivers neurotrophic and neuroprotective effects comparable to endogenous growth factors. It is used clinically for Alzheimer's treatment, post-stroke recovery, and TBI rehabilitation — and used in longevity medicine for memory enhancement and neurodegeneration prevention.",
    benefits: [
      "Neurotrophic effects comparable to BDNF and NGF",
      "Alzheimer's prevention and cognitive preservation",
      "Post-stroke and TBI neurological repair",
      "Enhanced long-term memory and recall",
    ],
    dosingInfo:
      "5–30 mL intravenous or intramuscular injection, daily for 10–20 day cycles. Protocol designed individually based on neurological goals.",
    requiresConsultation: true,
    priceCents: 19900,
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Cognitive & Neuroprotective",
    shortDescription: "Cellular energy restoration, DNA repair, and mental clarity.",
    fullDescription:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to cellular energy metabolism, DNA repair, and sirtuins activation. Levels decline 50% by age 50 — supplementing via IV or subcutaneous injection restores mitochondrial function, activates longevity pathways, improves mental clarity, and accelerates recovery from both physical and neurological stress.",
    benefits: [
      "Mitochondrial energy production restoration",
      "DNA repair and sirtuin longevity pathway activation",
      "Enhanced mental clarity and cognitive function",
      "Accelerated physical and neurological recovery",
    ],
    dosingInfo:
      "250–500 mg IV infusion over 2–4 hours, 1–3 times per week during loading phase; 250 mg subcutaneous weekly for maintenance. Administer slowly to minimize discomfort.",
    requiresConsultation: false,
    priceCents: 19900,
  },

  // ── Auryx Signature Complexes ──────────────────────────────────────────────
  {
    slug: "glow-complex",
    name: "GLOW Complex",
    category: "Auryx Signature Complexes",
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
    priceCents: 19900,
  },
  {
    slug: "klow-complex",
    name: "KLOW Complex",
    category: "Auryx Signature Complexes",
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
    priceCents: 19900,
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);
