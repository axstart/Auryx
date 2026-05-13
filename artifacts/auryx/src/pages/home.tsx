import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, lazy } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProtocolContinuationModal } from "@/components/ProtocolContinuationModal";
const MoleculeDockScene = lazy(() => import("@/components/MoleculeDockScene"));
import { PatientAssessment } from "@/components/PatientAssessment";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Activity, 
  Brain, 
  Dna, 
  Flame, 
  HeartPulse, 
  ShieldPlus,
  ArrowRight,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [continuationOpen, setContinuationOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    {
      title: "Anti-Aging & Longevity",
      icon: <Dna className="w-8 h-8 text-primary" />,
      desc: "Cellular rejuvenation, telomere support, and endogenous growth hormone optimization to slow biological aging."
    },
    {
      title: "Fat Loss & Body Composition",
      icon: <Flame className="w-8 h-8 text-primary" />,
      desc: "Metabolic acceleration and lean mass preservation for a sculpted, high-performance physique."
    },
    {
      title: "Sexual Health & Vitality",
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
      desc: "Restoration of libido, hormonal balance, and sexual performance through targeted peptide interventions."
    },
    {
      title: "Recovery & Regeneration",
      icon: <ShieldPlus className="w-8 h-8 text-primary" />,
      desc: "Accelerated tissue repair, injury healing, and post-exertion recovery for elite athletes and executives."
    },
    {
      title: "Cognitive Performance",
      icon: <Brain className="w-8 h-8 text-primary" />,
      desc: "Neuroprotection, enhanced focus, memory retention, and induced neuroplasticity for mental clarity."
    },
    {
      title: "Energy & Vitality",
      icon: <Activity className="w-8 h-8 text-primary" />,
      desc: "Mitochondrial optimization and sustained stamina to eliminate fatigue and operate at peak capacity."
    }
  ];

  const peptideCategories = [
    {
      category: "GLP-1 & Metabolic Peptides",
      description: "Next-generation weight management and metabolic optimization compounds. Each agent targets distinct receptor pathways — your physician will select based on your metabolic profile, weight loss goals, and cardiovascular risk factors.",
      peptides: [
        {
          name: "Semaglutide",
          moa: "Selective GLP-1 receptor agonist that suppresses appetite centers in the hypothalamus and slows gastric emptying, producing profound caloric reduction without hunger.",
          benefits: ["Sustained fat loss", "Improved insulin sensitivity", "Cardiovascular risk reduction", "Appetite normalization"],
          candidate: "Ideal for those with significant metabolic dysfunction or a BMI requiring meaningful body recomposition."
        },
        {
          name: "Tirzepatide",
          moa: "Dual GLP-1 and GIP receptor agonist delivering superior weight reduction versus GLP-1 monotherapy, with enhanced effects on glucose metabolism and adipose tissue.",
          benefits: ["Greater fat loss than semaglutide alone", "Improved lean mass preservation", "Superior glycemic control", "Enhanced lipid profile"],
          candidate: "Patients seeking maximum metabolic impact, particularly those with insulin resistance or type 2 diabetes."
        },
        {
          name: "Retatrutide",
          moa: "Triple agonist targeting GLP-1, GIP, and glucagon receptors simultaneously — the most potent metabolic signaling compound available, driving energy expenditure alongside appetite suppression.",
          benefits: ["Unprecedented fat reduction potential", "Accelerated metabolic rate", "Visceral fat targeting", "Liver fat reduction"],
          candidate: "High-performance individuals seeking the frontier of metabolic optimization and body composition transformation."
        }
      ]
    },
    {
      category: "Growth Hormone Secretagogues",
      description: "GH secretagogues stimulate the pituitary gland to release endogenous growth hormone in natural pulsatile rhythms — restoring youthful GH levels without the risks of exogenous HGH. Protocol selection depends on your goals, IGF-1 levels, and desired pulse characteristics.",
      note: "Choosing the right secretagogue matters. CJC-1295 + Ipamorelin is the versatile entry point — broad anti-aging benefits with a clean side-effect profile. Tesamorelin is more targeted, with the strongest clinical evidence for visceral fat reduction and is preferred when body composition is the primary goal. The Tesamorelin + Ipamorelin combination layers fat-burning specificity with deeper sleep and recovery enhancement, making it the premium choice for athletes and executives seeking both physique and performance outcomes.",
      peptides: [
        {
          name: "CJC-1295 + Ipamorelin",
          moa: "CJC-1295 extends the GHRH signal while Ipamorelin mimics ghrelin at the pituitary — together producing amplified, sustained GH pulses without cortisol or prolactin elevation.",
          benefits: ["Deep sleep restoration", "Lean muscle accretion", "Skin elasticity and collagen synthesis", "Fat metabolism improvement", "Broad anti-aging effects"],
          candidate: "The foundational anti-aging secretagogue stack. Ideal for those new to GH optimization seeking comprehensive restoration."
        },
        {
          name: "Tesamorelin",
          moa: "A stabilized GHRH analogue with the strongest clinical evidence base of any secretagogue — specifically proven to reduce visceral adipose tissue while elevating IGF-1 and preserving lean mass.",
          benefits: ["Clinically proven visceral fat reduction", "Enhanced IGF-1 elevation", "Improved lipid profile", "Cognitive function support", "Cardiovascular protection"],
          candidate: "Those prioritizing targeted abdominal fat loss, metabolic health, and evidence-backed GH optimization."
        },
        {
          name: "Tesamorelin + Ipamorelin",
          moa: "A precision-engineered combination that pairs Tesamorelin's visceral fat targeting with Ipamorelin's clean GH pulse amplification — layering metabolic specificity with recovery and sleep enhancement.",
          benefits: ["Visceral fat reduction with enhanced GH amplitude", "Superior sleep architecture", "Accelerated injury recovery", "Lean mass preservation", "Synergistic anti-aging effect"],
          candidate: "Athletes, executives, and longevity-focused individuals seeking the most comprehensive GH secretagogue protocol available."
        }
      ]
    },
    {
      category: "Recovery & Regeneration",
      description: "Precision peptides that accelerate the body's innate healing machinery — reducing downtime, resolving chronic injury, and restoring structural integrity at the cellular level.",
      peptides: [
        {
          name: "BPC-157",
          moa: "Body Protection Compound-157 accelerates angiogenesis, upregulates growth hormone receptors in injured tissue, and modulates the nitric oxide system to orchestrate comprehensive repair.",
          benefits: ["Rapid tendon and ligament healing", "Gut lining restoration", "Joint inflammation resolution", "Nerve repair support", "Systemic anti-inflammatory action"],
          candidate: "Individuals with chronic musculoskeletal injuries, post-surgical recovery needs, or gut permeability issues."
        },
        {
          name: "TB-500 (Thymosin Beta-4)",
          moa: "Regulates actin — a protein critical to cell structure — enabling accelerated cell migration to injury sites and promoting angiogenesis and muscle satellite cell activation.",
          benefits: ["Systemic injury recovery", "Flexible tissue healing", "Reduced inflammation and scar formation", "Enhanced cardiovascular tissue repair", "Neurological recovery support"],
          candidate: "Competitive athletes, post-surgical patients, and those with systemic or difficult-to-reach injuries."
        },
        {
          name: "KPV",
          moa: "A tripeptide derived from alpha-MSH that potently inhibits pro-inflammatory cytokine pathways — delivering targeted anti-inflammatory and wound-healing effects with exceptional tolerability.",
          benefits: ["Potent anti-inflammatory action", "Accelerated wound and tissue healing", "Gut mucosal protection", "Immune modulation", "Skin barrier restoration"],
          candidate: "Those managing inflammatory conditions, gut disorders, skin issues, or seeking a gentle but effective healing support peptide."
        }
      ]
    },
    {
      category: "Sexual Health & Vitality",
      description: "Targeted interventions that address the neurological, vascular, and hormonal drivers of sexual function — restoring desire, performance, and intimacy with clinical precision.",
      peptides: [
        {
          name: "PT-141 (Bremelanotide)",
          moa: "Melanocortin receptor agonist acting directly on the central nervous system to initiate desire — addressing the neurological root of sexual dysfunction independent of hormonal or vascular pathways.",
          benefits: ["Increased sexual desire in men and women", "Improved arousal and sensitivity", "Enhanced erectile function", "Centrally driven — works even with hormonal deficiency"],
          candidate: "Men and women experiencing low libido, arousal difficulties, or sexual dysfunction unresponsive to conventional therapies."
        },
        {
          name: "Kisspeptin",
          moa: "Master regulator of the hypothalamic-pituitary-gonadal axis — kisspeptin directly stimulates GnRH release, driving upstream hormonal cascades that govern reproduction, desire, and sexual behavior.",
          benefits: ["Natural testosterone and estrogen optimization", "Libido enhancement via hormonal axis", "Improved mood and emotional intimacy", "Fertility support", "Complementary to PT-141 for comprehensive sexual health"],
          candidate: "Individuals with hormonal root causes of sexual dysfunction, or those seeking a more physiological approach to desire restoration."
        }
      ]
    },
    {
      category: "Immune & Longevity",
      description: "Compounds that operate at the deepest levels of biological aging — modulating immunity, extending telomere length, and activating the mitochondrial pathways that govern how long and how well we live.",
      peptides: [
        {
          name: "Thymosin Alpha-1",
          moa: "Thymic peptide that stimulates T-cell maturation, enhances dendritic cell function, and downregulates pathological inflammatory signaling — rebuilding immune surveillance from the ground up.",
          benefits: ["Immune system fortification", "Enhanced pathogen resistance", "Autoimmune modulation", "Antiviral and antibacterial resilience", "Cancer immune surveillance support"],
          candidate: "Executives navigating high-stress environments, frequent travelers, or those with immune dysregulation."
        },
        {
          name: "Epithalon",
          moa: "Tetrapeptide that activates telomerase — the enzyme responsible for maintaining telomere length — while regulating the pineal gland and circadian melatonin secretion for comprehensive longevity signaling.",
          benefits: ["Telomere length preservation", "Enhanced melatonin production", "Circadian rhythm restoration", "Cellular senescence reduction", "Antioxidant upregulation"],
          candidate: "Longevity-focused individuals seeking to address biological aging at the chromosomal level."
        },
        {
          name: "Pinealon",
          moa: "A tripeptide derived from the pineal gland that penetrates the blood-brain barrier, reducing oxidative stress in neural tissue, regulating circadian biology, and demonstrating neuroprotective and pro-longevity properties.",
          benefits: ["Deep neuroprotection", "Circadian and sleep optimization", "Antioxidant neural defense", "Cognitive preservation with aging", "Longevity signaling synergy with Epithalon"],
          candidate: "Those with sleep dysregulation, cognitive aging concerns, or seeking to stack longevity peptides for comprehensive effect."
        },
        {
          name: "MOTS-c",
          moa: "A mitochondrial-derived peptide that translocates to the nucleus under metabolic stress, activating AMPK pathways and SIRT1 — the same longevity switches activated by caloric restriction and exercise.",
          benefits: ["Mitochondrial biogenesis", "Enhanced metabolic flexibility", "Insulin sensitivity improvement", "Exercise mimetic effects", "Longevity pathway activation"],
          candidate: "High-performance individuals seeking cellular energy optimization and metabolic anti-aging at the mitochondrial level."
        }
      ]
    },
    {
      category: "Cognitive & Neuroprotective",
      description: "Precision neuropeptides that enhance neurotransmitter dynamics, protect against neurodegeneration, and promote the neuroplasticity that underlies peak cognitive performance.",
      peptides: [
        {
          name: "Semax",
          moa: "Synthetic analogue of ACTH that increases BDNF expression, enhances dopaminergic and serotonergic neurotransmission, and promotes cerebral blood flow for acute and sustained cognitive enhancement.",
          benefits: ["Elevated BDNF and neuroplasticity", "Enhanced focus and working memory", "Neuroprotection under stress", "Mood stabilization", "Stroke and cognitive injury recovery"],
          candidate: "High-performers seeking a reliable cognitive edge, or those recovering from neurological events."
        },
        {
          name: "Selank",
          moa: "Anxiolytic neuropeptide analogue of tuftsin that modulates GABA, serotonin, and enkephalin systems — delivering calm, focused clarity without sedation or dependency.",
          benefits: ["Anxiety reduction without impairment", "Enhanced learning and memory consolidation", "Stable mood and emotional regulation", "Immune modulation", "Anti-fatigue effects"],
          candidate: "Individuals managing high cognitive load with anxiety or stress, seeking clarity without pharmaceutical sedation."
        },
        {
          name: "Cerebrolysin",
          moa: "A purified mixture of low-molecular-weight neuropeptides and amino acids that mimics endogenous neurotrophic factors — directly nourishing neural circuitry and reversing markers of neurodegeneration.",
          benefits: ["Robust neuroprotection", "Alzheimer's and cognitive decline prevention", "Post-stroke neural repair", "Enhanced memory and executive function", "Neurotrophin-level brain support"],
          candidate: "Those with family history of neurodegeneration, cognitive aging concerns, or seeking the most potent neuroprotective intervention available."
        },
        {
          name: "NAD+",
          moa: "Essential coenzyme at the center of cellular energy metabolism, DNA repair, and sirtuin (longevity gene) activation — levels decline 50% by age 50, making restoration one of the highest-leverage longevity interventions.",
          benefits: ["Cellular energy restoration", "DNA damage repair acceleration", "Sirtuin and longevity pathway activation", "Improved metabolic function", "Enhanced mental clarity and resilience"],
          candidate: "Any adult seeking foundational longevity support. Particularly impactful for those experiencing energy decline, brain fog, or accelerated biological aging."
        }
      ]
    },
    {
      category: "Auryx Signature Complexes",
      description: "Proprietary Auryx compounded formulations — physician-curated peptide blends engineered for specific outcomes that no single agent can achieve alone.",
      peptides: [
        {
          name: "GLOW Complex",
          moa: "An Auryx-formulated blend targeting the biological drivers of skin luminosity, hair density, and connective tissue integrity — combining collagen-stimulating, antioxidant, and dermal repair peptides.",
          benefits: ["Skin radiance and elasticity restoration", "Hair follicle regeneration", "Collagen and elastin synthesis", "Dermal inflammation reduction", "Nail and connective tissue strengthening"],
          candidate: "Those prioritizing aesthetic longevity — the visible expression of deep biological health and cellular renewal."
        },
        {
          name: "KLOW Complex",
          moa: "An Auryx-curated cellular optimization blend targeting mitochondrial efficiency, metabolic rate, and inflammation at the systemic level — the foundational stack for total-body performance.",
          benefits: ["Systemic inflammation reduction", "Metabolic rate enhancement", "Cellular energy optimization", "Recovery acceleration", "Whole-body performance baseline elevation"],
          candidate: "High-performance individuals seeking a comprehensive cellular foundation protocol before or alongside targeted therapeutic peptides."
        }
      ]
    }
  ];

  const faqs = [
    { q: "Are peptides safe?", a: "When prescribed by a licensed medical professional and sourced from regulated compounding pharmacies, peptide therapy has a high safety profile. Our protocols are meticulously monitored." },
    { q: "How quickly will I see results?", a: "While responses vary based on individual biology and the specific peptide used, many patients report improvements in sleep and energy within weeks, with structural changes visible in 1-3 months." },
    { q: "Do I need to visit in person?", a: "We offer comprehensive telemedicine consultations and direct-to-door delivery of protocols for eligible patients, though in-person clinical assessments are available." },
    { q: "How are protocols personalized?", a: "Every protocol begins with an exhaustive biomarker panel, medical history review, and lifestyle assessment to engineer a highly specific therapeutic intervention." },
    { q: "Is Auryx right for me?", a: "Auryx is designed for individuals who view their health as their most critical asset and are willing to invest in precision medical optimization rather than reactive healthcare." },
    { q: "How much does treatment cost?", a: "Protocols are priced individually based on your therapeutic plan — the compounds selected, doses, and duration are specific to your biology and goals. Pricing is discussed in full during your private consultation, with no obligation to proceed." },
    { q: "Does Auryx accept insurance?", a: "Peptide therapy is an elective, precision medicine service and is not covered by insurance. All protocols are self-pay. We accept credit and debit cards, Zelle, and Venmo for your convenience." },
    { q: "Who are Auryx's providers?", a: "Auryx was founded and is led by a licensed MD and a licensed nurse practitioner, both specializing in regenerative and integrative medicine. Every protocol is reviewed, prescribed, and monitored by our clinical team — you are always under direct medical supervision." },
    { q: "I'm already on a protocol from another provider. Can I continue it through Auryx?", a: "Yes — and we've made this as frictionless as possible. If you're already on an established peptide protocol and simply want to continue under Auryx's medical umbrella, you complete a brief intake form covering your current protocol, duration, and a short health screen. A physician reviews and approves within 24 hours, and your compounds are dispensed and delivered directly to you." },
    { q: "Is Auryx available in my state?", a: "Auryx offers telemedicine consultations and direct-to-door delivery. Reach out and our team will confirm availability and next steps for your location." },
  ];

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[100dvh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity }}
        >
          <div className="absolute inset-0 bg-background/55 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background z-10" />
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <MoleculeDockScene />
            </Suspense>
          </div>
        </motion.div>

        <div className="container relative z-20 px-6 md:px-12 mx-auto pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="text-primary tracking-[0.3em] text-sm font-medium uppercase">Precision Longevity</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 font-light">
              Longevity Is <br/> the New Luxury.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 font-light leading-relaxed">
              Elite, medically guided peptide therapy protocols designed for high-performance individuals. Precision science meets complete biological optimization.
            </p>
            <p className="text-sm text-primary/70 tracking-wide mb-12 font-light">
              Founded and led by licensed specialists in regenerative &amp; integrative medicine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base tracking-wide"
              >
                Book a Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => setContinuationOpen(true)}
                className="border-primary/50 text-primary hover:bg-primary/10 h-14 px-8 text-base tracking-wide"
              >
                Continue My Protocol
              </Button>
              <Button 
                variant="ghost"
                onClick={() => scrollToSection("categories")}
                className="text-muted-foreground hover:text-foreground h-14 px-8 text-base tracking-wide"
              >
                Explore Protocols
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="categories" className="py-32 px-6 md:px-12 bg-background relative z-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">Therapeutic Domains</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Targeted biological optimization across six core pillars of human performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-card border border-card-border hover:border-primary/50 transition-all duration-500 rounded-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 p-4 bg-background/50 rounded-full inline-block">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-serif mb-4 text-foreground">{cat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div id="assessment">
        <PatientAssessment onOpenConsult={() => setModalOpen(true)} onContinueProtocol={() => setContinuationOpen(true)} />
      </div>

      {/* PROCESS SECTION */}
      <section id="process" className="py-32 px-6 md:px-12 bg-card relative z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">The Auryx <br/> Methodology</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
                We do not guess. We measure, architect, and optimize. Our framework is rooted in rigorous clinical data and tailored exclusively to your unique physiological landscape.
              </p>
              <Button 
                onClick={() => setModalOpen(true)}
                variant="link" 
                className="text-primary p-0 h-auto text-lg group"
              >
                Initiate Your Process <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <div className="space-y-12 relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-border hidden md:block" />
              
              {[
                { step: "01", title: "Choose Your Path", desc: "New to peptides? Start with a private consultation. Already on an established protocol? Our streamlined intake gets you set up within 24 hours — no full consultation required." },
                { step: "02", title: "Clinical Review & Approval", desc: "A licensed Auryx physician reviews your intake or conducts your consultation — assessing your history, goals, and protocol fit before any compound is dispensed." },
                { step: "03", title: "Bespoke Protocol & Dispensing", desc: "Your protocol is prescribed, compounded by a US-licensed pharmacy, and delivered directly to your door — pharmaceutical-grade, 3rd-party tested." },
                { step: "04", title: "Ongoing Optimization", desc: "Continuous monitoring, protocol adjustments, and dedicated concierge support — including Aria, available around the clock — to ensure maximum efficacy." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-8 relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-background border border-primary flex items-center justify-center shrink-0 text-primary font-serif">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif mb-2 text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section id="education" className="py-32 px-6 md:px-12 bg-background relative z-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <span className="text-primary tracking-[0.2em] text-sm uppercase mb-4 block">Peptide Science</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Molecules of Mastery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Peptides are short chains of amino acids that serve as highly specific signaling molecules, instructing the body to repair, regenerate, and optimize itself.
            </p>
          </motion.div>

          <div className="space-y-20">
            {peptideCategories.map((cat, ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.05 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-[1px] w-8 bg-primary/60" />
                    <h3 className="text-2xl md:text-3xl font-serif text-foreground">{cat.category}</h3>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mb-4">{cat.description}</p>
                  {"note" in cat && cat.note && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-2">
                      <p className="text-sm uppercase tracking-wider text-primary mb-2">Physician's Note — Protocol Selection</p>
                      <p className="text-base text-foreground/80 leading-relaxed italic">{cat.note}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {cat.peptides.map((pep, i) => (
                    <div
                      key={i}
                      className="bg-card/50 p-7 rounded-lg border border-border hover:border-primary/40 transition-colors duration-300"
                    >
                      <h4 className="text-xl font-serif text-primary mb-4">{pep.name}</h4>
                      <p className="text-sm text-foreground/75 mb-5 leading-relaxed border-l-2 border-primary/30 pl-3 italic">
                        {pep.moa}
                      </p>
                      <div className="mb-5">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Primary Benefits</p>
                        <ul className="space-y-1.5">
                          {pep.benefits.map((b, j) => (
                            <li key={j} className="flex items-start text-sm text-foreground/85">
                              <ChevronRight className="w-3.5 h-3.5 text-primary mr-1.5 mt-0.5 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-border/40">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-1.5">Ideal Candidate</p>
                        <p className="text-sm text-foreground/65 leading-relaxed">{pep.candidate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground text-sm italic max-w-2xl mx-auto">
              Our formulary includes dozens of additional specialized compounds. Protocols are synthesized specifically for your bio-individual needs.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT / PHILOSOPHY SECTION */}
      <section id="about" className="py-32 px-6 md:px-12 bg-card relative z-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
              <img 
                src="/about-bg.png" 
                alt="Auryx consultation room" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-10"
            >
              <h3 className="text-primary tracking-[0.2em] text-sm uppercase mb-4">Our Philosophy</h3>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                Age is a variable. <br/> <span className="text-muted-foreground">Optimization is a choice.</span>
              </h2>
              
              <div className="space-y-6 text-lg text-foreground/80 font-light leading-relaxed mb-10">
                <p>
                  Most medicine is designed to keep you from dying. Auryx is designed to redefine how you live. We believe that physiological decline is not an inevitability to be accepted, but an engineering problem to be solved.
                </p>
                <p>
                  You demand excellence in your career, your relationships, and your environment. Your biology should be no exception. We provide world-class, discreet, and bespoke therapeutic protocols to those who refuse to leave their potential on the table.
                </p>
                <p className="text-primary font-medium italic border-l-2 border-primary pl-6 py-2">
                  "The ultimate luxury is the mastery over one's own physical and cognitive capacity."
                </p>
              </div>

              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base tracking-wide"
              >
                Begin Your Protocol
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUALITY & STANDARDS SECTION */}
      <section className="py-24 px-6 md:px-12 bg-background relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,68,0.06),transparent_60%)]" />
        <div className="container mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-primary tracking-[0.2em] text-sm uppercase mb-4">Pharmaceutical Excellence</p>
            <h2 className="text-4xl md:text-5xl font-serif mb-5">No Compromises. No Shortcuts.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Every compound in every Auryx protocol is held to the same standard: pharmaceutical-grade purity, sourced on American soil, and verified by independent science.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              {
                icon: "🇺🇸",
                title: "US-Sourced",
                body: "All peptides are compounded exclusively by FDA-registered US pharmacies operating under strict cGMP manufacturing standards.",
              },
              {
                icon: "⚗️",
                title: "Pharmaceutical Grade",
                body: "We work only with licensed compounding pharmacies — not research-grade or grey-market suppliers. Medical quality, full stop.",
              },
              {
                icon: "🔬",
                title: "3rd Party Tested",
                body: "Every batch is independently verified by accredited third-party laboratories before it reaches a single patient.",
              },
              {
                icon: "✦",
                title: "99%+ Purity",
                body: "Purity certificates are available on request. We maintain a 99% minimum purity standard across all compounds in our formulary.",
              },
              {
                icon: "⚕️",
                title: "Physician-Led",
                body: "Auryx is founded and led by a licensed MD and a licensed nurse practitioner — both specializing in regenerative and integrative medicine. Every protocol is prescribed and monitored by our clinical team.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border hover:border-primary/30 transition-colors rounded-xl p-7"
              >
                <div className="text-3xl mb-5">{item.icon}</div>
                <h3 className="text-lg font-serif text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary/5 border border-primary/25 rounded-xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-lg">✓</span>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">Certificates of Analysis available on request</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ask for the CoA on any compound in your protocol at any time. Transparency is not a feature — it is the standard.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 whitespace-nowrap shrink-0 px-7"
            >
              Request a CoA
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-32 px-6 md:px-12 bg-background relative z-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Inquiries</h2>
            <p className="text-muted-foreground">Clarity before commitment.</p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-2">
                <AccordionTrigger className="text-left font-serif text-xl hover:text-primary transition-colors hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-40 px-6 md:px-12 bg-card relative z-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight font-light">
              Your Biology. <br/> Optimized.
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
              Membership to our clinical practice is limited to ensure uncompromising care for every patient. Protocols are priced individually based on your therapeutic plan — pricing is discussed during your private consultation, with no obligation to proceed.
            </p>
            <Button 
              onClick={() => setModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-12 text-lg tracking-widest uppercase font-medium shadow-2xl shadow-primary/20"
            >
              Request Private Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
      <ProtocolContinuationModal
        open={continuationOpen}
        onOpenChange={setContinuationOpen}
        onSwitchToConsultation={() => { setContinuationOpen(false); setModalOpen(true); }}
      />
    </div>
  );
}
