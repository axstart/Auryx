import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink } from "lucide-react";
import { applyPageSeo, setMeta, SITE_ORIGIN } from "@/lib/seo";

/* ─── Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = [
  "GLP-1 & Metabolic",
  "Growth Hormone",
  "Recovery & Regeneration",
  "Sexual Health & Vitality",
  "Immune & Cellular Biology",
  "Neuroprotective & CNS",
];

const CATEGORY_COLOR: Record<string, string> = {
  "GLP-1 & Metabolic":           "#B8962E",
  "Growth Hormone":               "#0D9488",
  "Recovery & Regeneration":      "#7C6A4A",
  "Sexual Health & Vitality":     "#9B4E7E",
  "Immune & Cellular Biology":           "#2E7D6A",
  "Neuroprotective & CNS":  "#4A6E9B",
};

interface PeptideEntry {
  slug: string;
  name: string;
  category: string;
  rx?: boolean;
  definition: string;
  mechanism: string;
  benefits: string[];
  typicalUse: string;
  researchNote?: string;
}

const PEPTIDES: PeptideEntry[] = [
  /* GLP-1 & Metabolic */
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 & Metabolic",
    rx: true,
    definition: "A long-acting GLP-1 receptor agonist that suppresses appetite, slows gastric emptying, and improves insulin sensitivity for sustained fat loss.",
    mechanism: "Semaglutide mimics glucagon-like peptide-1 (GLP-1), a gut hormone released after eating. By binding GLP-1 receptors in the pancreas, gut, and brain, it reduces hunger signals, delays gastric emptying, and improves glucose-dependent insulin secretion — creating a meaningful caloric deficit without direct stimulant effects.",
    benefits: ["Significant reduction in body weight and fat mass", "Improved fasting glucose and HbA1c", "Appetite suppression at neurological level", "Cardiovascular risk reduction in metabolic disease"],
    typicalUse: "Used for medically supervised weight loss and metabolic health improvement in individuals with obesity or metabolic syndrome.",
    researchNote: "Studied extensively in clinical research for its role in GLP-1 receptor biology and metabolic regulation.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 & Metabolic",
    rx: true,
    definition: "A dual GLP-1 and GIP receptor agonist researched for its effects on metabolic and glycemic parameters beyond GLP-1 monotherapy.",
    mechanism: "Tirzepatide acts on both GLP-1 and GIP (glucose-dependent insulinotropic polypeptide) receptors simultaneously. GIP activation adds a distinct anabolic fat-storage inhibition pathway on top of GLP-1's appetite suppression, producing greater fat mass reduction than single-agonist protocols in clinical trials.",
    benefits: ["Greater average fat loss vs. semaglutide in head-to-head trials", "Superior HbA1c reduction", "Preservation of lean muscle mass during weight loss", "Improved lipid panel and blood pressure"],
    typicalUse: "Preferred for individuals who need aggressive fat loss or who have not achieved goals with GLP-1 monotherapy.",
    researchNote: "Investigated in multiple large-scale clinical trials as a dual GLP-1/GIP receptor agonist. Phase 3 data demonstrates significant differential effects compared to GLP-1 monotherapy.",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 & Metabolic",
    definition: "A triple agonist targeting GLP-1, GIP, and glucagon receptors — the most advanced metabolic peptide in its class.",
    mechanism: "Adding glucagon receptor agonism to dual GLP-1/GIP action increases hepatic fat oxidation and energy expenditure, producing fat loss through three distinct pathways. Retatrutide addresses metabolic dysfunction at a breadth that earlier agonists cannot match.",
    benefits: ["Highest average weight reduction observed in class (up to 24% in Phase 2)", "Liver fat reduction (potential NASH application)", "Improved metabolic flexibility", "Appetite suppression with increased caloric output"],
    typicalUse: "Frontier metabolic protocol for individuals seeking maximum body composition transformation under clinical supervision.",
    researchNote: "Phase 3 trials ongoing as of 2025. Not yet FDA-approved — available under physician-supervised compounding protocols.",
  },
  {
    slug: "tesofensine",
    name: "Tesofensine",
    category: "GLP-1 & Metabolic",
    definition: "A triple monoamine reuptake inhibitor that reduces appetite and increases satiety through central nervous system pathways.",
    mechanism: "Tesofensine inhibits reuptake of serotonin, dopamine, and noradrenaline in the brain — raising synaptic levels of all three and creating strong appetite suppression and satiety signaling. Unlike stimulants, its mechanism does not produce significant cardiovascular side effects at therapeutic doses.",
    benefits: ["Aggressive appetite suppression without stimulant jitteriness", "Accelerated fat loss when combined with caloric deficit", "Improved mood and motivation during caloric restriction", "Does not raise blood glucose or IGF-1"],
    typicalUse: "Used as a standalone metabolic peptide or stacked with growth hormone secretagogues for combined fat loss and body recomposition.",
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "GLP-1 & Metabolic",
    definition: "A modified fragment (hGH 176–191) of human growth hormone that triggers fat burning without affecting blood glucose or IGF-1 levels.",
    mechanism: "AOD-9604 contains the lipolytic sequence of hGH — the C-terminal end responsible for fat-burning signaling — without the metabolic side effects of full HGH. It activates β3 adrenergic receptors to stimulate lipolysis in adipose tissue, particularly visceral and subcutaneous fat, while having no impact on cell proliferation or insulin resistance.",
    benefits: ["Targeted fat oxidation without glucose disruption", "No IGF-1 elevation — safe for longer-term protocols", "Supports visceral fat reduction", "Well-tolerated with a favorable safety profile"],
    typicalUse: "Ideal for individuals focused on targeted fat reduction who want to avoid the metabolic effects of full GH or GLP-1 protocols.",
    researchNote: "Subject of multiple research studies examining the lipolytic properties of the C-terminal fragment of human growth hormone. Received GRAS (Generally Recognized As Safe) status in the US for food applications.",
  },
  /* Growth Hormone */
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Growth Hormone",
    definition: "A synthetic analogue of growth hormone-releasing hormone (GHRH) that stimulates the pituitary gland to produce and release GH naturally.",
    mechanism: "Sermorelin binds GHRH receptors in the anterior pituitary, stimulating the natural pulse of growth hormone release. Unlike exogenous HGH, it works through the body's own feedback loop — preserving the pituitary's regulatory control and avoiding the suppression associated with synthetic GH administration.",
    benefits: ["Improved deep sleep (slow-wave stage) quality", "Gradual lean muscle accretion", "Reduced body fat, especially visceral", "Anti-aging effects including improved skin tone and energy", "Lower cost and risk profile vs. exogenous HGH"],
    typicalUse: "Entry-level growth hormone protocol for individuals seeking sleep improvement, recovery enhancement, and body composition support.",
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "Growth Hormone",
    definition: "A selective growth hormone secretagogue that amplifies GH pulses with minimal impact on cortisol or prolactin.",
    mechanism: "Ipamorelin is a ghrelin mimetic that binds the GHS-R1a receptor, triggering a clean, selective GH pulse. Unlike older GHRPs (e.g., GHRP-6), it does not significantly raise cortisol or prolactin at therapeutic doses — making it the preferred standalone GHRP for recovery-focused and anti-aging protocols.",
    benefits: ["Selective GH pulse without cortisol elevation", "Enhanced sleep quality and recovery", "Gradual lean body composition improvements", "Well-tolerated with minimal side effects", "Stackable with CJC-1295 or Tesamorelin for synergistic GH release"],
    typicalUse: "Used alone or as the GHRP component in combination stacks. Particularly suited to athletes, high performers, and anti-aging clients.",
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "Growth Hormone",
    definition: "The gold standard dual-action GH stack combining a long-acting GHRH analogue with a selective GHRP for sustained, physiologic GH elevation.",
    mechanism: "CJC-1295 (with DAC) extends the duration of GHRH receptor stimulation by binding albumin via the drug affinity complex, creating a sustained GH-releasing signal. When combined with Ipamorelin's pulsatile GHRP stimulation, the result is synergistic — producing greater total GH output than either compound alone while maintaining pituitary feedback regulation.",
    benefits: ["Deep, restorative sleep improvement", "Accelerated recovery from training and injury", "Lean muscle gain and fat loss over time", "Improved skin elasticity and hair density", "Broad anti-aging effect profile"],
    typicalUse: "One of the most widely used GH protocols. Suitable for adults over 30 seeking performance, recovery, or anti-aging benefits.",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Growth Hormone",
    rx: true,
    definition: "An extensively studied GHRH analogue researched for its effects on visceral adipose tissue and IGF-1 signaling.",
    mechanism: "Tesamorelin is a stabilized GHRH analogue that potently stimulates pituitary GH secretion, leading to IGF-1 elevation. Its clinical distinction is a documented, statistically significant reduction in visceral abdominal fat — the metabolically dangerous fat surrounding organs — even independent of dietary changes.",
    benefits: ["Visceral adipose tissue reduction studied in clinical research", "IGF-1 signaling elevation and anabolic pathway research", "Body composition effects studied in multiple trial contexts", "Metabolic parameter improvements in research settings"],
    typicalUse: "Preferred for clients with excess visceral fat, metabolic syndrome risk, or those seeking targeted abdominal body recomposition.",
    researchNote: "Originally studied in the context of lipodystrophy-associated visceral adiposity. Extensively studied in non-disease populations for its effects on the IGF-1 axis and adipose tissue dynamics.",
  },
  {
    slug: "tesamorelin-ipamorelin",
    name: "Tesamorelin + Ipamorelin",
    category: "Growth Hormone",
    rx: true,
    definition: "A premium GH stack combining Tesamorelin's visceral fat targeting with Ipamorelin's clean, selective GH pulse amplification.",
    mechanism: "This stack leverages complementary mechanisms: Tesamorelin provides sustained GHRH stimulation and visceral fat reduction via IGF-1 elevation, while Ipamorelin adds a clean ghrelin-mimetic GH pulse without cortisol or prolactin elevation. Together they produce broader, more comprehensive GH and IGF-1 support than either compound alone.",
    benefits: ["Visceral fat reduction + systemic GH optimization", "Superior recovery and sleep outcomes vs. either alone", "Lean body composition improvements across multiple pathways", "Anti-aging effects on skin, energy, and cognition"],
    typicalUse: "Premium protocol for high-performance individuals and clients with specific visceral adiposity concerns combined with recovery goals.",
  },
  /* Recovery & Regeneration */
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Recovery & Regeneration",
    definition: "Body Protection Compound 157 — a 15-amino-acid gastric peptide with systemic healing properties for tendons, joints, gut, and muscles.",
    mechanism: "BPC-157 upregulates growth hormone receptors on tendon fibroblasts, accelerates angiogenesis (new blood vessel formation) in damaged tissue, modulates nitric oxide systems, and reduces pro-inflammatory cytokines. It works both locally at injury sites and systemically when injected or taken orally (oral form benefits primarily the gut lining).",
    benefits: ["Accelerated tendon and ligament repair", "Reduced joint inflammation and pain", "Gut mucosal healing (effective for IBS, leaky gut, ulcers)", "Faster recovery from muscle tears and strains", "Neuroprotective effects in animal models"],
    typicalUse: "The most widely used recovery peptide. Ideal post-injury, post-surgery, and for chronic joint or gut issues.",
    researchNote: "Extensively studied in rodent models with hundreds of published studies. Human research ongoing. One of the most researched peptides in its class.",
  },
  {
    slug: "tb-500",
    name: "TB-500",
    category: "Recovery & Regeneration",
    definition: "Thymosin Beta-4 analogue — a systemic repair peptide that upregulates actin to accelerate tissue regeneration and reduce inflammation body-wide.",
    mechanism: "TB-500 promotes actin polymerization, a critical process in cell migration and tissue repair. By upregulating actin and its associated repair pathways, it enables faster mobilization of repair cells to injury sites, reduces inflammation, promotes angiogenesis, and supports healing across muscle, connective tissue, and cardiac tissue.",
    benefits: ["Systemic regenerative activity at distal tissue sites", "Reduced pro-inflammatory cytokine signaling", "Improved fibroblast activity and tissue remodeling", "Accelerated healing markers in preclinical models", "Cardiac tissue support in animal studies"],
    typicalUse: "Preferred for systemic recovery protocols, chronic injuries, and post-surgical recovery. Often stacked with BPC-157 for comprehensive healing.",
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Recovery & Regeneration",
    definition: "A tripeptide (Lys-Pro-Val) derived from the C-terminus of alpha-MSH with potent mucosal anti-inflammatory and wound healing effects.",
    mechanism: "KPV inhibits NF-κB signaling and pro-inflammatory cytokines (IL-1β, TNF-α, IL-6) directly in gut epithelial cells. This makes it particularly effective for gut mucosal inflammation. It also promotes keratinocyte migration for wound closure and has anti-microbial properties against pathogens like Candida albicans.",
    benefits: ["Reduces gut mucosal inflammation (Crohn's, IBD, IBS support)", "Promotes wound healing and tissue repair", "Anti-microbial and anti-fungal properties", "Systemic anti-inflammatory action", "Well-tolerated with no known receptor downregulation"],
    typicalUse: "Primarily used for gut health and systemic inflammation reduction. An excellent complementary peptide alongside BPC-157 for GI issues.",
  },
  /* Sexual Health & Vitality */
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Sexual Health & Vitality",
    rx: true,
    definition: "A melanocortin receptor agonist that increases sexual desire and arousal in both men and women through central nervous system activation.",
    mechanism: "PT-141 activates melanocortin-4 receptors (MC4R) in the hypothalamus — the brain's arousal center — triggering the neurological cascade of sexual desire without relying on vascular mechanisms. This makes it effective in both sexes and in individuals where PDE5 inhibitors (e.g., Viagra) have limited effect.",
    benefits: ["Increased libido and sexual desire in men and women", "Enhanced arousal independent of vascular function", "Rapid onset (1–4 hours after administration)", "Does not interact with cardiovascular system the way PDE5 inhibitors do"],
    typicalUse: "Used for hypoactive sexual desire disorder and arousal difficulties in both sexes. Particularly valuable when other approaches have failed.",
    researchNote: "Subject of multiple Phase 2 and Phase 3 clinical trials examining central melanocortin receptor agonism and its downstream effects on arousal neurocircuitry in both sexes.",
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Sexual Health & Vitality",
    definition: "A neuropeptide that stimulates GnRH secretion, researched for its role in HPG axis activation and endogenous gonadotropin signaling.",
    mechanism: "Kisspeptin binds the KiSS1-derived peptide receptor (KISS1R) in the hypothalamus, triggering pulsatile GnRH secretion — the upstream signal governing the HPG axis. This drives LH and FSH release and downstream gonadal signaling. Researchers study it as an alternative to exogenous hormone approaches due to its endogenous axis-preserving mechanism.",
    benefits: ["HPG axis activation and gonadotropin signaling research", "Endogenous hormone pathway modulation studies", "GnRH pulsatility and LH/FSH secretion research", "Sexual function research applications", "Preservation of natural hormonal feedback mechanisms"],
    typicalUse: "Researched in the context of HPG axis modulation and endogenous hormone signaling, particularly as an alternative-mechanism subject of study to exogenous hormone approaches.",
  },
  /* Immune & Cellular Biology */
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune & Cellular Biology",
    definition: "A thymic peptide that enhances T-cell maturation, cytokine regulation, and adaptive immune response.",
    mechanism: "Thymosin Alpha-1 (Tα1) is naturally produced by the thymus gland. It stimulates T-lymphocyte differentiation, activates dendritic cells, and modulates cytokine production (increasing IFN-γ, IL-2 while reducing excess inflammatory cytokines). This dual immunostimulatory and immunomodulatory profile makes it effective for both immune deficiency and dysregulation.",
    benefits: ["Enhanced T-cell and NK cell activity", "Improved viral clearance and vaccine response", "Reduced susceptibility to chronic infections", "Supportive therapy in autoimmune conditions (immunomodulation)", "Potential anti-tumor immune support"],
    typicalUse: "Used for immune optimization, post-viral recovery, chronic infection resilience, and cancer-adjacent support protocols.",
    researchNote: "Extensively studied in immunology research for its role in T-lymphocyte maturation and cytokine regulation. Subject of trials examining immune reconstitution and antiviral response mechanisms in preclinical and clinical settings.",
  },
  {
    slug: "epithalon",
    name: "Epithalon (Epitalon)",
    category: "Immune & Cellular Biology",
    definition: "A synthetic tetrapeptide (Ala-Glu-Asp-Gly) that activates telomerase, preserves telomere length, and restores circadian rhythm.",
    mechanism: "Epithalon was developed by the Russian Gerontology Institute and stimulates the pineal gland to produce melatonin while activating telomerase — the enzyme responsible for maintaining telomere length. Telomere shortening is a primary biomarker of cellular aging. By slowing this process, Epithalon supports cellular longevity and replication fidelity.",
    benefits: ["Telomere length preservation (anti-aging at cellular level)", "Improved melatonin production and circadian rhythm", "Antioxidant protection against oxidative stress", "Enhanced immune function in aging populations", "Neuroendocrine restoration"],
    typicalUse: "A flagship anti-aging and longevity peptide. Used in cyclical protocols for adults seeking cellular longevity and circadian optimization.",
    researchNote: "Developed by Prof. Vladimir Khavinson at the Saint Petersburg Institute of Bioregulation and Gerontology. Subject of over 100 published studies examining telomerase activity and cellular aging mechanisms.",
  },
  {
    slug: "pinealon",
    name: "Pinealon",
    category: "Immune & Cellular Biology",
    definition: "A neuroprotective tripeptide targeting the pineal gland and brain to reduce oxidative damage and optimize circadian function.",
    mechanism: "Pinealon (Glu-Asp-Arg) is a bioregulator peptide developed from pineal gland tissue. It penetrates the blood-brain barrier, reduces reactive oxygen species in neuronal tissue, and supports the synthesis of regulatory proteins involved in neurological repair. It also restores pineal gland function disrupted by aging, light pollution, and stress.",
    benefits: ["Neuroprotection against oxidative stress", "Circadian rhythm restoration and sleep improvement", "Support for age-related cognitive decline", "Brain tissue antioxidant activity", "Potential benefit in neurodegenerative prevention protocols"],
    typicalUse: "Used as a neuroprotective longevity peptide, often alongside Epithalon in circadian and anti-aging protocols.",
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Immune & Cellular Biology",
    definition: "A mitochondrial-derived peptide that activates AMPK pathways to improve metabolic flexibility, insulin sensitivity, and cellular energy.",
    mechanism: "MOTS-c is encoded in the mitochondrial genome and acts as a metabolic regulator by activating AMP-activated protein kinase (AMPK). This improves glucose uptake in muscle cells independent of insulin, increases fatty acid oxidation, reduces oxidative stress, and mimics some beneficial metabolic effects of exercise at the cellular level.",
    benefits: ["Improved insulin sensitivity and glucose regulation", "Increased fatty acid oxidation for energy", "Exercise-like metabolic effects at cellular level", "Longevity-associated pathway activation", "Anti-inflammatory and antioxidant effects"],
    typicalUse: "Used in metabolic optimization, longevity, and age-related insulin resistance protocols. Particularly relevant for individuals with metabolic dysregulation.",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Immune & Cellular Biology",
    definition: "A coenzyme central to mitochondrial energy metabolism, NAD-dependent enzyme activity, and sirtuin pathway research — a foundational subject in cellular aging science.",
    mechanism: "NAD+ (nicotinamide adenine dinucleotide) is required for over 500 enzymatic reactions including those in the electron transport chain (ATP production), DNA damage repair via PARP enzymes, and the activation of sirtuins — longevity proteins that regulate gene expression, metabolism, and stress resistance. NAD+ declines significantly with age.",
    benefits: ["Cellular energy metabolism (ATP pathway research)", "NAD-dependent enzyme and sirtuin pathway activity", "Mitochondrial function and biogenesis research", "Cellular maintenance mechanism studies", "Metabolic coenzyme replenishment research"],
    typicalUse: "A foundational longevity protocol. Used for energy optimization, post-viral fatigue, cognitive enhancement, and anti-aging.",
  },
  /* Neuroprotective & CNS */
  {
    slug: "semax",
    name: "Semax",
    category: "Neuroprotective & CNS",
    definition: "A synthetic ACTH 4–7 fragment that upregulates BDNF and improves working memory, focus, and neuroplasticity.",
    mechanism: "Semax is a heptapeptide derived from the ACTH 4–7 sequence with additional modifications for stability. It significantly upregulates brain-derived neurotrophic factor (BDNF) and nerve growth factor (NGF), promotes synaptogenesis, and modulates dopaminergic and serotonergic pathways. It also has neuroprotective effects in hypoxic and ischemic conditions.",
    benefits: ["Enhanced working memory and executive function", "Increased BDNF for neuroplasticity", "Neuroprotection against stroke and hypoxia", "Improved stress resilience", "Rapid CNS bioavailability"],
    typicalUse: "Used by professionals and biohackers for cognitive performance, and clinically in Russia for post-stroke recovery and neurodegenerative support.",
    researchNote: "Extensively studied for its effects on BDNF expression, neuroplasticity, and neuroprotection under hypoxic conditions in preclinical models. Significant published research base.",
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Neuroprotective & CNS",
    definition: "A synthetic anxiolytic peptide derived from tuftsin that reduces anxiety and improves cognitive clarity without sedation.",
    mechanism: "Selank modulates GABA-A receptor activity and increases expression of BDNF. It stabilizes enkephalin metabolism, raises serotonin and dopamine tone, and reduces cortisol output under stress — producing anxiolytic effects comparable to benzodiazepines without the dependency risk, sedation, or cognitive blunting.",
    benefits: ["Anxiety reduction without sedation or cognitive impairment", "Improved mood and emotional resilience", "Enhanced memory consolidation under stress", "BDNF upregulation supporting neuroplasticity", "Safe profile with no known dependency"],
    typicalUse: "Used for generalized anxiety, cognitive performance under pressure, and as an adjunct in protocols addressing stress-induced cognitive decline.",
    researchNote: "Studied for its anxiolytic and immunomodulatory properties in preclinical research, including effects on enkephalin metabolism and BDNF expression.",
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "Neuroprotective & CNS",
    definition: "A neuropeptide complex derived from porcine brain tissue that mimics NGF activity to support neuronal survival and cognitive function.",
    mechanism: "Cerebrolysin contains low-molecular-weight neuropeptides that cross the blood-brain barrier and mimic neurotrophic factors (NGF, BDNF, CNTF). Researchers study its effects on neuronal survival, amyloid toxicity modulation, and synaptic plasticity in the context of neurodegenerative and cognitive aging research.",
    benefits: ["Neuronal survival and neuroprotection research", "Memory and learning capacity studies", "Neurotrophic factor-mimetic activity research", "Neuropeptide effects on synaptic plasticity", "Cognitive aging and neurological recovery research"],
    typicalUse: "Studied for cognitive research applications, neurological aging, and as a subject of investigation in neuroprotection science.",
    researchNote: "Studied extensively as a neuropeptide complex for its neurotrophic factor-mimetic activity, including effects on neuronal survival and synaptic plasticity in preclinical and clinical research.",
  },
  {
    slug: "glow-complex",
    name: "Glow Complex",
    category: "Neuroprotective & CNS",
    definition: "An AURYX signature multi-peptide complex formulated for skin health, collagen support, and cellular regeneration.",
    mechanism: "The Glow Complex combines peptides targeting collagen synthesis (GHK-Cu analogs), wound-healing and skin barrier repair (BPC-derived fragments), and antioxidant protection. Together they support dermal extracellular matrix integrity, reduce oxidative skin aging, and promote tissue-level regeneration.",
    benefits: ["Collagen production and skin elasticity improvement", "Reduction in fine lines and skin oxidative damage", "Wound healing and barrier restoration", "Systemic antioxidant benefit", "Complements longevity protocols with aesthetic benefit"],
    typicalUse: "Used as a standalone skin health protocol or alongside longevity peptides for individuals prioritizing both internal and external anti-aging.",
  },
];

const FAQS = [
  {
    q: "What are research peptides?",
    a: "Research peptides are short chains of amino acids studied for their biological activity in laboratory and preclinical settings. They are compounds of significant scientific interest for exploring molecular signaling pathways, receptor binding, cellular mechanisms, and biochemical processes. All compounds at AURYX are sold strictly for legitimate research purposes only and are not intended for human consumption.",
  },
  {
    q: "What is the regulatory status of these compounds?",
    a: "The compounds offered through AURYX are sold as research-grade peptides for laboratory use only. They have not been evaluated by the Food and Drug Administration for safety or efficacy in humans and are not intended to diagnose, treat, cure, or prevent any disease or condition. Buyers must acknowledge this prior to purchase.",
  },
  {
    q: "What is BPC-157?",
    a: "BPC-157 (Body Protection Compound 157) is a synthetic 15-amino-acid peptide originally derived from a protein sequence found in gastric secretion. It has been the subject of extensive preclinical investigation examining its effects on angiogenesis, fibroblast activity, nitric oxide signaling, and tissue-level biological mechanisms. It is available at AURYX strictly for research purposes.",
  },
  {
    q: "What is semaglutide?",
    a: "Semaglutide is a GLP-1 receptor agonist — a peptide compound that binds and activates glucagon-like peptide-1 receptors. It has been extensively studied in preclinical and clinical settings for its effects on glucose metabolism, gastric motility, and appetite-regulating neurocircuitry. It is available at AURYX strictly for research purposes.",
  },
  {
    q: "How do GHRH and GHRP compounds work?",
    a: "Growth hormone-releasing hormone (GHRH) analogues such as CJC-1295 bind GHRH receptors in the anterior pituitary, stimulating endogenous growth hormone secretion. Growth hormone-releasing peptides (GHRPs) such as ipamorelin act on ghrelin receptors to amplify GH pulses through a complementary mechanism. Both classes are of significant research interest for their effects on the somatotropic axis.",
  },
  {
    q: "What is NAD+?",
    a: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to numerous biochemical processes, including those involved in cellular energy metabolism, electron transport, and DNA repair mechanisms. It is a highly active area of research in molecular biology and cellular aging science. It is available at AURYX strictly for research purposes.",
  },
  {
    q: "Who are AURYX's compounds intended for?",
    a: "AURYX sells research-grade peptides exclusively to qualified researchers who acknowledge that all compounds are for legitimate scientific research purposes only — not for human consumption. Every buyer is required to confirm their research application, designate a research field, and agree to our terms of service prior to purchase.",
  },
  {
    q: "What quality standards do AURYX compounds meet?",
    a: "All compounds supplied by AURYX are sourced from US-based, FDA-registered compounding facilities and verified to ≥99% purity by independent third-party HPLC analysis. A Certificate of Analysis (COA) is available for every product and provided with every order.",
  },
  {
    q: "What are the ordering requirements?",
    a: "All orders require account creation with email verification, research field designation, and written acknowledgment of research-only terms prior to fulfillment. Orders are reviewed before shipment. We ship to physical addresses only within the United States — P.O. Box delivery is not accepted.",
  },
  {
    q: "Where does AURYX ship?",
    a: "AURYX ships to physical addresses in all 50 US states. International shipping is not currently available. P.O. Box addresses are not accepted. All shipments are reviewed for compliance prior to dispatch.",
  },
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.09]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-white/80 leading-snug">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#C9A844] shrink-0 mt-0.5" />
          : <ChevronDown className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pb-5"
        >
          <p className="text-[13px] text-white/50 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── SEO ──────────────────────────────────────────────────────────── */

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setMeta("geo.region", "US");
    setMeta("geo.placename", "United States");

    return applyPageSeo({
      title: "Peptide Therapy Education | Auryx Learn",
      description:
        "Your complete peptide therapy guide — how peptides work, what BPC-157, semaglutide, CJC-1295 ipamorelin, and NAD+ do, and how to start a physician-supervised protocol at Auryx's telehealth peptide clinic.",
      path: "/learn",
      jsonLd: [
        {
          id: "ld-learn-faq",
          data: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        },
        {
          id: "ld-learn-medical",
          data: {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Peptide Therapy Education | Auryx Learn",
            description:
              "Physician-reviewed educational resource covering peptide therapy, longevity protocols, metabolic health, and precision medicine compounds.",
            url: `${SITE_ORIGIN}/learn`,
            inLanguage: "en-US",
            audience: { "@type": "Patient" },
            medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
            author: {
              "@type": "Person",
              name: "Romy Fontoura, MD",
              jobTitle: "Physician, Longevity Medicine",
            },
            reviewedBy: {
              "@type": "Person",
              name: "Romy Fontoura, MD",
              jobTitle: "Physician, Longevity Medicine",
            },
            publisher: {
              "@type": "Organization",
              name: "Auryx",
              url: SITE_ORIGIN,
            },
            about: [
              { "@type": "MedicalCondition", name: "Metabolic Syndrome" },
              { "@type": "MedicalCondition", name: "Obesity" },
              { "@type": "MedicalTherapy", name: "Peptide Therapy" },
              { "@type": "MedicalTherapy", name: "Growth Hormone Optimization" },
            ],
            specialty: "Longevity Medicine",
          },
        },
      ],
    });
  }, []);

  const filteredPeptides = activeCategory
    ? PEPTIDES.filter(p => p.category === activeCategory)
    : PEPTIDES;

  const groupedByCategory = CATEGORIES.reduce<Record<string, PeptideEntry[]>>((acc, cat) => {
    acc[cat] = filteredPeptides.filter(p => p.category === cat);
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        {/* Right-side image */}
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/hero-learn.webp"
            alt="AURYX peptide encyclopedia — BPC-157 and CJC-1295 vials with reference books"
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: "center top", top: "-7%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 0%, transparent 22%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 55% 38%, rgba(201,168,68,0.07) 0%, transparent 60%)" }} />
        </div>
        {/* Mobile bg */}
        <div className="absolute inset-0 z-0 md:hidden" style={{ background: "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)" }} />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, rgba(10,10,10,0.95) 40%, transparent 100%)" }} />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-24 md:pt-36 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[520px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">Peptide Encyclopedia</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              Every peptide.{" "}
              <em className="not-italic text-[#C9A844]">Explained.</em>
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              A scientific reference guide to every compound in the AURYX catalog — molecular mechanisms, receptor targets, and published research properties. From semaglutide and BPC-157 to CJC-1295 ipamorelin and NAD+, each entry is a research resource for qualified scientists. All compounds sold for research purposes only.
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Browse All Peptides
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              26 compounds · 6 categories · Physician-reviewed
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── AEO intro ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F5EEE4" }} className="px-6 md:px-14 lg:px-20 py-14">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">What Are Research Peptides?</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  Research peptides are short chains of amino acids studied for their biological activity at the receptor and cellular level. All compounds in the AURYX collection are sold strictly for legitimate scientific research purposes only. Not intended for human consumption.
                </p>
              </div>
              <div className="md:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">How to Use This Reference</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  Browse all 26 compounds below, or filter by category — GLP-1 &amp; Metabolic, Growth Hormone, Recovery, Sexual Health, Immune, or Neuroprotective. Each entry covers molecular mechanism and observed research properties.
                </p>
              </div>
              <div className="md:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">Quality &amp; Sourcing</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  All compounds are sourced from US-based, FDA-registered compounding facilities and verified to ≥99% purity by independent third-party HPLC analysis. A Certificate of Analysis is available for every product.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── Category filter bar ───────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#E8E3D8] shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all ${
                !activeCategory
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-[#F5EEE4] text-[#0A0A0A]/55 hover:bg-[#EDE5D5]"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "text-white"
                    : "bg-[#F5EEE4] text-[#0A0A0A]/55 hover:bg-[#EDE5D5]"
                }`}
                style={activeCategory === cat ? { backgroundColor: CATEGORY_COLOR[cat] } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Peptide entries ───────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#FAFAF7" }} className="px-6 md:px-14 lg:px-20 py-16">
        <div className="container mx-auto max-w-7xl space-y-20">
          {CATEGORIES.map(cat => {
            const items = groupedByCategory[cat];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat} id={cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
                {/* Category heading */}
                <FadeIn>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLOR[cat] }} />
                    <h2 className="font-serif text-2xl md:text-3xl text-[#111]">{cat}</h2>
                    <div className="flex-1 h-px bg-[#E0D9CC]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#111]/30 font-medium shrink-0">{items.length} peptide{items.length > 1 ? "s" : ""}</span>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {items.map((p, i) => (
                    <FadeIn key={p.slug} delay={i * 0.06}>
                      <article className="group bg-white rounded-2xl border border-[#E0D9CC] hover:border-[#C9A844]/35 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-7 pt-7 pb-5 border-b border-[#F0EBE1]">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full text-white"
                                style={{ backgroundColor: CATEGORY_COLOR[cat] }}
                              >
                                {p.category}
                              </span>
                              {p.rx && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                                  Rx Required
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/shop/${p.slug}`}
                              className="shrink-0 text-[10px] text-[#B8962E] hover:text-[#C9A844] flex items-center gap-1 font-medium transition-colors opacity-0 group-hover:opacity-100"
                            >
                              Shop <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          <h3 className="font-serif text-xl md:text-2xl text-[#111] leading-snug mb-3">{p.name}</h3>
                          <p className="text-[13px] text-[#111]/60 leading-relaxed font-medium">{p.definition}</p>
                        </div>

                        {/* Body */}
                        <div className="px-7 py-5 flex-1 space-y-5">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B8962E] mb-2">How It Works</p>
                            <p className="text-[12px] text-[#111]/55 leading-relaxed">{p.mechanism}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#111]/40 mb-2.5">Research Properties</p>
                            <ul className="space-y-1.5">
                              {p.benefits.map((b, bi) => (
                                <li key={bi} className="flex items-start gap-2 text-[12px] text-[#111]/60">
                                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: CATEGORY_COLOR[cat] }} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {p.researchNote && (
                            <div className="bg-[#F9F5EC] rounded-xl px-4 py-3">
                              <p className="text-[11px] text-[#B8962E] leading-relaxed">
                                <span className="font-semibold">Research note: </span>{p.researchNote}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer CTA */}
                        <div className="px-7 pb-6 pt-1">
                          <Link
                            href={`/shop/${p.slug}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#B8962E] hover:gap-2.5 transition-all"
                          >
                            View Protocol <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </article>
                    </FadeIn>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-24 px-6 md:px-14 lg:px-20">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">Frequently Asked Questions</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-white">
              Common questions,<br />
              <em className="not-italic text-[#C9A844]">direct answers.</em>
            </h2>
          </FadeIn>
          <div>
            {FAQS.map((faq, i) => (
              <Accordion key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="bg-[#F5EEE4] py-20 px-6 md:px-14 lg:px-20 text-center">
        <div className="container mx-auto max-w-xl">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-5 font-medium">Ready to Begin?</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-[#111] mb-6">
              Find your protocol<br />in under a minute.
            </h2>
            <p className="text-[#111]/50 text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Answer a few questions about your goals and lifestyle. We'll match you to the protocols best suited to your rhythm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/protocol-finder"
                className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 border border-[#111]/20 text-[#111]/60 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#B8962E]/50 hover:text-[#B8962E] transition-colors"
              >
                Browse All Peptides
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Disclaimer ────────────────────────────────────────────────── */}
      <div className="bg-[#F0EAE0] px-6 md:px-14 lg:px-20 py-6">
        <div className="container mx-auto max-w-7xl">
          <p className="text-[11px] text-[#111]/35 leading-relaxed">
            <strong className="text-[#111]/50">Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice, diagnosis, or treatment recommendations. All protocols are physician-supervised. These statements have not been evaluated by the Food and Drug Administration. Consult a licensed healthcare provider before beginning any peptide protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
