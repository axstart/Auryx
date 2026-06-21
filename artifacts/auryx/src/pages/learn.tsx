import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = [
  "GLP-1 & Metabolic",
  "Growth Hormone",
  "Recovery & Regeneration",
  "Sexual Health & Vitality",
  "Immune & Longevity",
  "Cognitive & Neuroprotective",
];

const CATEGORY_COLOR: Record<string, string> = {
  "GLP-1 & Metabolic":           "#B8962E",
  "Growth Hormone":               "#0D9488",
  "Recovery & Regeneration":      "#7C6A4A",
  "Sexual Health & Vitality":     "#9B4E7E",
  "Immune & Longevity":           "#2E7D6A",
  "Cognitive & Neuroprotective":  "#4A6E9B",
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
    researchNote: "FDA-approved under brand names Ozempic and Wegovy for glycemic control and chronic weight management.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 & Metabolic",
    rx: true,
    definition: "A dual GLP-1 and GIP receptor agonist delivering superior fat loss and glycemic control compared to GLP-1 alone.",
    mechanism: "Tirzepatide acts on both GLP-1 and GIP (glucose-dependent insulinotropic polypeptide) receptors simultaneously. GIP activation adds a distinct anabolic fat-storage inhibition pathway on top of GLP-1's appetite suppression, producing greater fat mass reduction than single-agonist protocols in clinical trials.",
    benefits: ["Greater average fat loss vs. semaglutide in head-to-head trials", "Superior HbA1c reduction", "Preservation of lean muscle mass during weight loss", "Improved lipid panel and blood pressure"],
    typicalUse: "Preferred for individuals who need aggressive fat loss or who have not achieved goals with GLP-1 monotherapy.",
    researchNote: "FDA-approved under Mounjaro (T2D) and Zepbound (obesity). SURMOUNT trials demonstrated up to 22.5% mean body weight reduction.",
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
    researchNote: "Studied in multiple human trials for obesity. Received GRAS (Generally Recognized As Safe) status in the US for food use.",
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
    definition: "A clinically proven, FDA-referenced GHRH analogue specifically effective at reducing visceral adipose tissue and elevating IGF-1.",
    mechanism: "Tesamorelin is a stabilized GHRH analogue that potently stimulates pituitary GH secretion, leading to IGF-1 elevation. Its clinical distinction is a documented, statistically significant reduction in visceral abdominal fat — the metabolically dangerous fat surrounding organs — even independent of dietary changes.",
    benefits: ["Clinically proven visceral fat reduction (FDA-approved for HIV-related lipodystrophy)", "Elevated IGF-1 supporting anabolism and recovery", "Improved body composition without significant muscle loss", "Metabolic health improvements including lipid profiles"],
    typicalUse: "Preferred for clients with excess visceral fat, metabolic syndrome risk, or those seeking targeted abdominal body recomposition.",
    researchNote: "FDA-approved under brand name Egrifta for HIV-associated lipodystrophy. Extensively studied in non-HIV populations for body composition.",
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
    benefits: ["Systemic injury recovery — effective from a distance of the injection site", "Reduced chronic inflammation", "Improved flexibility and range of motion", "Accelerated healing of chronic injuries", "Cardiac tissue support in animal studies"],
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
    researchNote: "FDA-approved for premenopausal women with HSDD under the brand name Vyleesi (subcutaneous injection).",
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Sexual Health & Vitality",
    definition: "A neuropeptide that stimulates GnRH secretion, driving natural testosterone and estrogen production with fertility support benefits.",
    mechanism: "Kisspeptin binds the KiSS1-derived peptide receptor (KISS1R) in the hypothalamus, triggering pulsatile GnRH secretion — the master hormone governing the entire HPG axis. This leads to LH and FSH release, which drive gonadal testosterone and estrogen production. Unlike exogenous hormones, kisspeptin works through the body's own regulatory axis.",
    benefits: ["Elevated testosterone in men with low-normal levels", "Improved estrogen regulation in women", "Fertility support (LH surge stimulation)", "Libido and energy improvement via natural hormone optimization", "Preserves HPG axis integrity vs. exogenous hormone replacement"],
    typicalUse: "Used for natural hormone optimization, fertility support, and in individuals seeking testosterone improvement without exogenous TRT.",
  },
  /* Immune & Longevity */
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune & Longevity",
    definition: "A thymic peptide that enhances T-cell maturation, cytokine regulation, and adaptive immune response.",
    mechanism: "Thymosin Alpha-1 (Tα1) is naturally produced by the thymus gland. It stimulates T-lymphocyte differentiation, activates dendritic cells, and modulates cytokine production (increasing IFN-γ, IL-2 while reducing excess inflammatory cytokines). This dual immunostimulatory and immunomodulatory profile makes it effective for both immune deficiency and dysregulation.",
    benefits: ["Enhanced T-cell and NK cell activity", "Improved viral clearance and vaccine response", "Reduced susceptibility to chronic infections", "Supportive therapy in autoimmune conditions (immunomodulation)", "Potential anti-tumor immune support"],
    typicalUse: "Used for immune optimization, post-viral recovery, chronic infection resilience, and cancer-adjacent support protocols.",
    researchNote: "Approved in over 37 countries for chronic hepatitis B and C, and studied extensively in COVID-19 severity reduction.",
  },
  {
    slug: "epithalon",
    name: "Epithalon (Epitalon)",
    category: "Immune & Longevity",
    definition: "A synthetic tetrapeptide (Ala-Glu-Asp-Gly) that activates telomerase, preserves telomere length, and restores circadian rhythm.",
    mechanism: "Epithalon was developed by the Russian Gerontology Institute and stimulates the pineal gland to produce melatonin while activating telomerase — the enzyme responsible for maintaining telomere length. Telomere shortening is a primary biomarker of cellular aging. By slowing this process, Epithalon supports cellular longevity and replication fidelity.",
    benefits: ["Telomere length preservation (anti-aging at cellular level)", "Improved melatonin production and circadian rhythm", "Antioxidant protection against oxidative stress", "Enhanced immune function in aging populations", "Neuroendocrine restoration"],
    typicalUse: "A flagship anti-aging and longevity peptide. Used in cyclical protocols for adults seeking cellular longevity and circadian optimization.",
    researchNote: "Developed by Prof. Vladimir Khavinson. Over 100 published studies, including human trials showing increased lifespan markers.",
  },
  {
    slug: "pinealon",
    name: "Pinealon",
    category: "Immune & Longevity",
    definition: "A neuroprotective tripeptide targeting the pineal gland and brain to reduce oxidative damage and optimize circadian function.",
    mechanism: "Pinealon (Glu-Asp-Arg) is a bioregulator peptide developed from pineal gland tissue. It penetrates the blood-brain barrier, reduces reactive oxygen species in neuronal tissue, and supports the synthesis of regulatory proteins involved in neurological repair. It also restores pineal gland function disrupted by aging, light pollution, and stress.",
    benefits: ["Neuroprotection against oxidative stress", "Circadian rhythm restoration and sleep improvement", "Support for age-related cognitive decline", "Brain tissue antioxidant activity", "Potential benefit in neurodegenerative prevention protocols"],
    typicalUse: "Used as a neuroprotective longevity peptide, often alongside Epithalon in circadian and anti-aging protocols.",
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Immune & Longevity",
    definition: "A mitochondrial-derived peptide that activates AMPK pathways to improve metabolic flexibility, insulin sensitivity, and cellular energy.",
    mechanism: "MOTS-c is encoded in the mitochondrial genome and acts as a metabolic regulator by activating AMP-activated protein kinase (AMPK). This improves glucose uptake in muscle cells independent of insulin, increases fatty acid oxidation, reduces oxidative stress, and mimics some beneficial metabolic effects of exercise at the cellular level.",
    benefits: ["Improved insulin sensitivity and glucose regulation", "Increased fatty acid oxidation for energy", "Exercise-like metabolic effects at cellular level", "Longevity-associated pathway activation", "Anti-inflammatory and antioxidant effects"],
    typicalUse: "Used in metabolic optimization, longevity, and age-related insulin resistance protocols. Particularly relevant for individuals with metabolic dysregulation.",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Immune & Longevity",
    definition: "A coenzyme central to mitochondrial energy metabolism, DNA repair, and sirtuin activation — a foundational longevity molecule.",
    mechanism: "NAD+ (nicotinamide adenine dinucleotide) is required for over 500 enzymatic reactions including those in the electron transport chain (ATP production), DNA damage repair via PARP enzymes, and the activation of sirtuins — longevity proteins that regulate gene expression, metabolism, and stress resistance. NAD+ declines significantly with age.",
    benefits: ["Increased cellular energy production (ATP)", "Enhanced DNA repair capacity", "Sirtuin activation and epigenetic benefits", "Improved mitochondrial function and biogenesis", "Support for cognitive clarity and physical endurance"],
    typicalUse: "A foundational longevity protocol. Used for energy optimization, post-viral fatigue, cognitive enhancement, and anti-aging.",
  },
  /* Cognitive & Neuroprotective */
  {
    slug: "semax",
    name: "Semax",
    category: "Cognitive & Neuroprotective",
    definition: "A synthetic ACTH 4–7 fragment that upregulates BDNF and improves working memory, focus, and neuroplasticity.",
    mechanism: "Semax is a heptapeptide derived from the ACTH 4–7 sequence with additional modifications for stability. It significantly upregulates brain-derived neurotrophic factor (BDNF) and nerve growth factor (NGF), promotes synaptogenesis, and modulates dopaminergic and serotonergic pathways. It also has neuroprotective effects in hypoxic and ischemic conditions.",
    benefits: ["Enhanced working memory and executive function", "Increased BDNF for neuroplasticity", "Neuroprotection against stroke and hypoxia", "Improved stress resilience", "Fast onset when delivered intranasally"],
    typicalUse: "Used by professionals and biohackers for cognitive performance, and clinically in Russia for post-stroke recovery and neurodegenerative support.",
    researchNote: "Approved in Russia and Ukraine for neurological disorders. Extensive preclinical and clinical research base.",
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Cognitive & Neuroprotective",
    definition: "A synthetic anxiolytic peptide derived from tuftsin that reduces anxiety and improves cognitive clarity without sedation.",
    mechanism: "Selank modulates GABA-A receptor activity and increases expression of BDNF. It stabilizes enkephalin metabolism, raises serotonin and dopamine tone, and reduces cortisol output under stress — producing anxiolytic effects comparable to benzodiazepines without the dependency risk, sedation, or cognitive blunting.",
    benefits: ["Anxiety reduction without sedation or cognitive impairment", "Improved mood and emotional resilience", "Enhanced memory consolidation under stress", "BDNF upregulation supporting neuroplasticity", "Safe profile with no known dependency"],
    typicalUse: "Used for generalized anxiety, cognitive performance under pressure, and as an adjunct in protocols addressing stress-induced cognitive decline.",
    researchNote: "Approved in Russia and Ukraine for anxiety disorders and as an immunomodulator.",
  },
  {
    slug: "cortagen",
    name: "Cortagen",
    category: "Cognitive & Neuroprotective",
    definition: "A cardioprotective and neuroprotective peptide bioregulator derived from heart tissue, supporting cardiac and vascular longevity.",
    mechanism: "Cortagen is a short bioregulator peptide that interacts with cardio-specific gene expression pathways. It reduces oxidative damage in cardiac myocytes, supports mitochondrial function in heart tissue, and has demonstrated neuroprotective effects by reducing neuronal apoptosis in aging brain tissue. Developed within the Russian peptide bioregulator program.",
    benefits: ["Cardiac muscle protection and regeneration support", "Vascular tissue anti-aging effects", "Reduction in cardiac oxidative stress", "Neuroprotective adjunct in longevity protocols", "Complementary to anti-aging peptide stacks"],
    typicalUse: "Used as a cardiac longevity peptide, particularly relevant for individuals over 40 with cardiovascular risk factors or as part of comprehensive anti-aging protocols.",
  },
  {
    slug: "cerebrolysin",
    name: "Cerebrolysin",
    category: "Cognitive & Neuroprotective",
    definition: "A neuropeptide complex derived from porcine brain tissue that mimics NGF activity to support neuronal survival and cognitive function.",
    mechanism: "Cerebrolysin contains low-molecular-weight neuropeptides that cross the blood-brain barrier and mimic neurotrophic factors (NGF, BDNF, CNTF). It promotes neuronal survival, reduces amyloid toxicity, supports synaptic plasticity, and has demonstrated clinical efficacy in vascular dementia and Alzheimer's disease management.",
    benefits: ["Neuronal survival and neuroprotection", "Improved memory and learning capacity", "Potential benefit in early neurodegenerative conditions", "Post-stroke cognitive recovery support", "Synaptogenesis and synaptic density support"],
    typicalUse: "Used in cognitive optimization, post-neurological event recovery, and preventive neuroprotection in aging protocols.",
    researchNote: "Approved in over 40 countries for Alzheimer's disease, vascular dementia, and stroke recovery.",
  },
  {
    slug: "glow-complex",
    name: "Glow Complex",
    category: "Cognitive & Neuroprotective",
    definition: "An AURYX signature multi-peptide complex formulated for skin health, collagen support, and cellular regeneration.",
    mechanism: "The Glow Complex combines peptides targeting collagen synthesis (GHK-Cu analogs), wound-healing and skin barrier repair (BPC-derived fragments), and antioxidant protection. Together they support dermal extracellular matrix integrity, reduce oxidative skin aging, and promote tissue-level regeneration.",
    benefits: ["Collagen production and skin elasticity improvement", "Reduction in fine lines and skin oxidative damage", "Wound healing and barrier restoration", "Systemic antioxidant benefit", "Complements longevity protocols with aesthetic benefit"],
    typicalUse: "Used as a standalone skin health protocol or alongside longevity peptides for individuals prioritizing both internal and external anti-aging.",
  },
];

const FAQS = [
  {
    q: "What is peptide therapy?",
    a: "Peptide therapy uses short chains of amino acids — called peptides — to send precise signals to your cells. These signals can support fat loss, muscle recovery, better sleep, stronger immunity, and healthy aging. Peptide therapy is a form of precision medicine: instead of broad interventions, it targets specific biological pathways. At AURYX, all peptide therapy protocols are physician-supervised and compounded to pharmaceutical-grade standards.",
  },
  {
    q: "Are peptides safe?",
    a: "Most therapeutic peptides are structurally similar to molecules your body already produces naturally. That's why they tend to have good safety profiles. Several peptides in our catalog — including semaglutide, tirzepatide, and tesamorelin — are FDA-approved drugs with large clinical trial data sets. Others are available through physician-supervised compounding with established research bases. AURYX only offers compounds with documented safety and efficacy data, and every protocol includes clinical review.",
  },
  {
    q: "What is BPC-157?",
    a: "BPC-157 (Body Protection Compound 157) is a 15-amino-acid peptide derived from a protein found in the stomach. It may support healing in tendons, ligaments, joints, and the gut lining. BPC-157 is one of the most studied recovery peptides in the literature, with hundreds of published animal studies showing potential benefits for injury repair, inflammation reduction, and angiogenesis (new blood vessel formation). It is available through AURYX's physician-supervised recovery protocols.",
  },
  {
    q: "What is semaglutide?",
    a: "Semaglutide is a GLP-1 receptor agonist — a class of compounds that mimic a gut hormone called glucagon-like peptide-1. It works by reducing appetite, slowing digestion, and improving how the body manages blood sugar. Semaglutide is FDA-approved under the brand names Ozempic (for type 2 diabetes) and Wegovy (for obesity). In clinical trials, it produced an average 14.9% reduction in body weight. At AURYX, semaglutide is available through a physician-supervised metabolic protocol.",
  },
  {
    q: "How do growth hormone peptides work?",
    a: "Growth hormone peptides like CJC-1295 and ipamorelin work by stimulating your pituitary gland to release more of your own growth hormone — not by adding synthetic GH from outside. CJC-1295 is a GHRH analogue that extends the duration of growth hormone release. Ipamorelin is a GHRP that triggers a clean GH pulse without raising cortisol. When used together, CJC-1295 + ipamorelin produces synergistic GH elevation that may support better sleep, faster recovery, lean muscle, and fat loss.",
  },
  {
    q: "What is NAD+?",
    a: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme your cells need to produce energy, repair DNA, and activate longevity proteins called sirtuins. NAD+ levels drop by roughly 50% between your 40s and 60s, which is linked to fatigue, slower metabolism, and cognitive decline. NAD+ therapy — delivered intravenously or subcutaneously — may support cellular energy, mitochondrial function, and healthy aging. It is a foundational compound in many longevity protocols.",
  },
  {
    q: "How is AURYX different from other peptide providers?",
    a: "AURYX is a physician-supervised telehealth peptide clinic — not a supplement store or research chemical supplier. Every protocol starts with a clinical intake assessment, and all compounds are compounded at FDA-registered US pharmacies to ≥99% purity with third-party testing. We offer concierge guidance through Aria, our AI health concierge, plus direct access to our medical team. We do not sell peptides for self-directed or research use.",
  },
  {
    q: "Do I need a prescription for peptide therapy?",
    a: "Some peptides require a prescription — including GLP-1 agonists like semaglutide, tirzepatide, and retatrutide. Others are available through physician-supervised compounding without a traditional prescription. At AURYX, every order goes through a clinical review process, regardless of the compound. This is what separates a legitimate telehealth peptide clinic from an unregulated research chemical supplier.",
  },
  {
    q: "How long until I see results from peptide therapy?",
    a: "It depends on the compound and your goal. BPC-157 for injury recovery may show results in 2–4 weeks. Semaglutide or tirzepatide for weight loss typically produces noticeable changes by weeks 4–8. Growth hormone peptides like CJC-1295 + ipamorelin usually take 8–12 weeks for visible body composition changes — though sleep improvements often come sooner. Longevity protocols like epithalon are designed for long-term biological effects measured over months.",
  },
  {
    q: "Is peptide therapy available in my state?",
    a: "AURYX operates as a nationwide telehealth peptide clinic serving patients across the United States. Availability of specific compounds may vary based on state regulations and individual clinical review. Our intake process determines which protocols are appropriate for you based on your location, health history, and goals. We currently serve patients in all 50 states for most protocols.",
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

/* ── SEO helpers ──────────────────────────────────────────────────── */
function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}
function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
  el.href = url;
}
function setJsonLd(id: string, data: object) {
  document.getElementById(id)?.remove();
  const s = document.createElement("script");
  s.id = id; s.type = "application/ld+json"; s.text = JSON.stringify(data);
  document.head.appendChild(s);
}

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const CANONICAL = "https://www.auryxlife.com/learn";

    /* ── Basic SEO ─────────────────────────────────────────────── */
    document.title = "Peptide Therapy Education | Auryx Learn";
    setMeta("description", "Your complete peptide therapy guide — how peptides work, what BPC-157, semaglutide, CJC-1295 ipamorelin, and NAD+ do, and how to start a physician-supervised protocol at AURYX's telehealth peptide clinic.");
    setMeta("keywords", "peptide therapy guide, how peptides work, BPC-157, semaglutide, CJC-1295 ipamorelin, telehealth peptide clinic, physician-supervised peptides, compounded peptides, longevity protocols, peptide therapy education");

    /* ── Canonical ─────────────────────────────────────────────── */
    setCanonical(CANONICAL);

    /* ── GEO tags (US nationwide) ──────────────────────────────── */
    setMeta("geo.region", "US");
    setMeta("geo.placename", "United States");
    setMeta("geo.position", "37.0902;-95.7129");
    setMeta("ICBM", "37.0902, -95.7129");

    /* ── Open Graph ────────────────────────────────────────────── */
    setOg("og:title", "Peptide Therapy Education | Auryx Learn");
    setOg("og:description", "Physician-reviewed guides on peptide therapy — semaglutide, BPC-157, CJC-1295 ipamorelin, NAD+, and 22 more compounds. AURYX's telehealth peptide clinic.");
    setOg("og:url", CANONICAL);
    setOg("og:type", "website");

    /* ── FAQPage JSON-LD ───────────────────────────────────────── */
    setJsonLd("ld-learn-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });

    /* ── MedicalWebPage JSON-LD ────────────────────────────────── */
    setJsonLd("ld-learn-medical", {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: "Peptide Therapy Education | Auryx Learn",
      description: "Physician-reviewed educational resource covering peptide therapy, longevity protocols, metabolic health, and precision medicine compounds.",
      url: CANONICAL,
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
        name: "AURYX",
        url: "https://www.auryxlife.com",
      },
      about: [
        { "@type": "MedicalCondition", name: "Metabolic Syndrome" },
        { "@type": "MedicalCondition", name: "Obesity" },
        { "@type": "MedicalTherapy", name: "Peptide Therapy" },
        { "@type": "MedicalTherapy", name: "Growth Hormone Optimization" },
      ],
      specialty: "Longevity Medicine",
    });

    return () => {
      document.getElementById("ld-learn-faq")?.remove();
      document.getElementById("ld-learn-medical")?.remove();
    };
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
            src="/hero-learn.png"
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
              A physician-reviewed guide to every compound in the AURYX collection — what each peptide does, how it works, and what the clinical evidence shows. From semaglutide and BPC-157 to CJC-1295 ipamorelin and NAD+, each entry is written to help you make informed decisions about your longevity protocol.
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
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">What is Peptide Therapy?</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  Peptide therapy uses short amino acid chains to send targeted signals to your cells — supporting fat loss, tissue repair, immune function, hormone optimization, and healthy aging. All protocols at AURYX are physician-supervised and compounded to pharmaceutical-grade standards.
                </p>
              </div>
              <div className="md:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">How to Use This Guide</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  Browse all 26 compounds below, or filter by category — Metabolic &amp; GLP-1, Recovery, Growth Hormone, Longevity, Immune, or Cognitive. Each entry covers the mechanism, key benefits, typical use, and links directly to its protocol page.
                </p>
              </div>
              <div className="md:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#B8962E] mb-3 font-semibold">Physician-Supervised Protocols</p>
                <p className="text-[13px] text-[#111]/60 leading-relaxed">
                  AURYX is a telehealth peptide clinic serving patients nationwide. Every order includes clinical review by Romy Fontoura, MD. Compounded peptides are sourced from US-based, FDA-registered pharmacies with ≥99% purity verified by third-party HPLC testing.
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
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#111]/40 mb-2.5">Key Benefits</p>
                            <ul className="space-y-1.5">
                              {p.benefits.map((b, bi) => (
                                <li key={bi} className="flex items-start gap-2 text-[12px] text-[#111]/60">
                                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: CATEGORY_COLOR[cat] }} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#111]/40 mb-1.5">Typical Use</p>
                            <p className="text-[12px] text-[#111]/50 leading-relaxed">{p.typicalUse}</p>
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
