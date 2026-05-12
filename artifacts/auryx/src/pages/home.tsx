import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ConsultationModal } from "@/components/ConsultationModal";
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

  const peptides = [
    {
      name: "BPC-157",
      moa: "Accelerates angiogenesis and upregulates growth hormone receptors in targeted tissues.",
      benefits: ["Rapid tissue repair", "Gut lining restoration", "Potent anti-inflammatory"],
      candidate: "Individuals recovering from injuries, surgeries, or suffering from chronic joint/gut issues."
    },
    {
      name: "Semaglutide / Tirzepatide",
      moa: "GLP-1 and GIP receptor agonists that delay gastric emptying and signal satiety to the brain.",
      benefits: ["Significant fat reduction", "Improved insulin sensitivity", "Cardiovascular protection"],
      candidate: "Those seeking optimized body composition and metabolic health reset."
    },
    {
      name: "CJC-1295 + Ipamorelin",
      moa: "Synergistic GH secretagogues that stimulate the pituitary gland in natural pulsatile rhythms.",
      benefits: ["Increased deep sleep", "Enhanced lean muscle mass", "Skin elasticity improvement"],
      candidate: "Individuals focused on comprehensive anti-aging and vital restoration."
    },
    {
      name: "Thymosin Alpha-1",
      moa: "Modulates the immune system by stimulating T-cell maturation and downregulating inflammatory cytokines.",
      benefits: ["Immune system fortification", "Pathogen resistance", "Autoimmune modulation"],
      candidate: "Executives navigating high-stress environments seeking immune resilience."
    }
  ];

  const faqs = [
    { q: "Are peptides safe?", a: "When prescribed by a licensed medical professional and sourced from regulated compounding pharmacies, peptide therapy has a high safety profile. Our protocols are meticulously monitored." },
    { q: "How quickly will I see results?", a: "While responses vary based on individual biology and the specific peptide used, many patients report improvements in sleep and energy within weeks, with structural changes visible in 1-3 months." },
    { q: "Do I need to visit in person?", a: "We offer comprehensive telemedicine consultations and direct-to-door delivery of protocols for eligible patients, though in-person clinical assessments are available." },
    { q: "How are protocols personalized?", a: "Every protocol begins with an exhaustive biomarker panel, medical history review, and lifestyle assessment to engineer a highly specific therapeutic intervention." },
    { q: "Is Auryx right for me?", a: "Auryx is designed for individuals who view their health as their most critical asset and are willing to invest in precision medical optimization rather than reactive healthcare." },
  ];

  return (
    <div className="w-full bg-background text-foreground overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[100dvh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity }}
        >
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10" />
          <img 
            src="/hero-bg.png" 
            alt="Molecular structure" 
            className="w-full h-full object-cover object-center"
          />
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
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
              Elite, medically guided peptide therapy protocols designed for high-performance individuals. Precision science meets unparalleled luxury care.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base tracking-wide"
              >
                Book a Consultation
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection("categories")}
                className="border-primary/50 text-primary hover:bg-primary/10 h-14 px-8 text-base tracking-wide"
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
                { step: "01", title: "Private Medical Consultation", desc: "An exhaustive review of your health history, performance goals, and current baseline with our clinical team." },
                { step: "02", title: "Biomarker & Genomic Profiling", desc: "Comprehensive blood diagnostics and cellular analysis to identify precise optimization opportunities." },
                { step: "03", title: "Bespoke Protocol Architecture", desc: "The design of your customized peptide regimen, compounded specifically for your biology." },
                { step: "04", title: "Guided Administration & Optimization", desc: "Continuous monitoring, protocol adjustments, and dedicated concierge support to ensure maximum efficacy." }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {peptides.map((pep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/50 p-8 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif text-primary">{pep.name}</h3>
                </div>
                <p className="text-sm text-foreground/80 mb-6 italic leading-relaxed border-l-2 border-primary/30 pl-4">
                  "{pep.moa}"
                </p>
                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Primary Benefits</h4>
                  <ul className="space-y-2">
                    {pep.benefits.map((b, j) => (
                      <li key={j} className="flex items-center text-sm text-foreground/90">
                        <ChevronRight className="w-4 h-4 text-primary mr-2" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ideal Candidate</h4>
                  <p className="text-sm text-foreground/70">{pep.candidate}</p>
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
              Your Highest Self <br/> Is Waiting.
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
              Membership to our clinical practice is limited to ensure uncompromising care for every patient. Request an introductory consultation today.
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
    </div>
  );
}
