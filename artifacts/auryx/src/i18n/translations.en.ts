import { HOME_FAQS, type HomeFaq } from "@/data/home-faqs";
import {
  termsEn,
} from "./pages/terms.en";
import {
  privacyEn,
} from "./pages/privacy.en";
import {
  contactEn,
  sourcesEn,
  notFoundEn,
  disclaimerEn,
} from "./pages/static.en";
import {
  aboutEn,
} from "./pages/about.en";
import {
  shopEn,
} from "./pages/shop.en";
import {
  cartEn,
} from "./pages/cart.en";
import {
  ourMethodEn,
} from "./pages/our-method.en";
import {
  protocolFinderEn,
} from "./pages/protocol-finder.en";
import {
  verifyCoaEn,
} from "./pages/verify-coa.en";
import {
  blogEn,
} from "./pages/blog.en";
import {
  productEn,
} from "./pages/product.en";
import {
  checkoutEn,
} from "./pages/checkout.en";
import {
  checkoutSuccessEn,
} from "./pages/checkout-success.en";
import {
  newYorkEn,
} from "./pages/new-york.en";
import {
  patientAssessmentEn,
} from "./components/patient-assessment.en";
import {
  consultationEn,
} from "./components/consultation.en";
import {
  reconKitEn,
} from "./components/reconstitution-kit.en";
import {
  protocolContinuationEn,
} from "./components/protocol-continuation.en";
import {
  chatEn,
} from "./components/chat.en";
import {
  learnEn,
} from "./pages/learn.en";

export const dict = {
  nav: {
    shop: "Shop",
    ourMethod: "Our Method",
    learn: "Learn",
    pepTalk: "Pep Talk",
    protocolFinder: "Protocol Finder",
    consult: "Consult",
    bookConsultation: "Book Consultation",
    compliance: "Physician-Guided Longevity Protocols — For Wellness Use Only",
    openMenu: "Open navigation menu",
    openCart: "Open cart",
    siteNavigation: "Site navigation",
    siteNavigationDesc: "Navigate the Auryx website or book a consultation.",
    switchLanguage: "Switch language",
  },
  footer: {
    shop: "Shop",
    ourMethod: "Our Method",
    learn: "Learn",
    pepTalk: "Pep Talk",
    about: "About",
    verifyCoa: "Verify COA",
    account: "Account",
    importantLabel: "Important:",
    disclaimer:
      "Auryx is an MD-led telemedicine practice. Product eligibility, labeling, and fulfillment follow applicable U.S. regulations and may include research-designated compounds. Nothing on this website diagnoses, treats, cures, or prevents any disease, and content here does not replace personalized medical advice from a licensed clinician.",
    copyright: "© 2026 Auryx. All rights reserved.",
    contact: "Contact",
    sources: "Sources",
    privacy: "Privacy",
    terms: "Terms",
    disclaimerLink: "Disclaimer",
  },
  ageGate: {
    accessRestricted: "Access Restricted",
    mustBe21: "You must be 21 years of age or older to access this site.",
    heading: "Age Verification",
    headingEm: "Required",
    licensedUse: "For licensed healthcare use only. Prescription required where applicable.",
    enter: "I am 21 or older — Enter",
    exit: "I am under 21 — Exit",
    finePrint1: "By entering you confirm you are 21+ and agree to our ",
    termsLink: "Terms & Conditions",
    finePrint2: ".",
  },
  home: {
    seoTitle: "Auryx | MD-Led Peptide Therapy — Nationwide",
    seoDescription:
      "Auryx offers MD-led peptide therapy nationwide via telemedicine with physician-supervised protocols.",
    hero: {
      eyebrow: "Precision Peptides",
      title1: "Physician-backed protocols.",
      titleEm: "Real results.",
      title2: "Delivered fast.",
      subtitle:
        "Auryx delivers MD-led peptide therapy nationwide. Feel your best, recover faster, and perform at your peak — free shipping on every order.*",
      ctaFind: "Find Your Peptides",
      ctaExplore: "Explore Collections",
      trustLine: "Third-party tested · Discreet shipping · Concierge guidance",
    },
    collections: {
      eyebrow: "Protocol Collections",
      title1: "Targeted support for",
      titleEm: "every dimension",
      title2: "of you.",
      items: [
        { title: "Metabolic Support", desc: "Support healthy metabolism and body composition." },
        { title: "Recovery & Resilience", desc: "Optimize recovery and build long-term resilience." },
        { title: "Skin & Cellular Health", desc: "Compounds studied for skin-related cellular and extracellular matrix mechanisms." },
        { title: "Energy & Vitality", desc: "Sustain energy and daily mind-body vitality." },
        { title: "Neuroprotection", desc: "Compounds studied for neuroprotective and CNS mechanisms." },
        { title: "Sleep & Restoration", desc: "Deeper sleep and daily restorative support." },
      ],
    },
    peptides: {
      eyebrow: "Peptide Collection",
      title1: "Curated peptide protocols",
      title2: "for your next standard.",
      subtitle:
        "Explore our curated collection of research-grade peptides — GLP-1 agonists, GH secretagogues, recovery compounds, and more.",
      viewAll: "View All Peptides →",
      exploreAll: "Explore All Peptides →",
      details: "Details →",
      addToCart: "Add to Cart",
      added: "Added ✓",
      items: [
        { desc: "Supports tissue repair, recovery, and systemic regeneration.", tag: "RECOVERY" },
        { desc: "Supports recovery and tissue health.", tag: "RECOVERY" },
        { desc: "A coenzyme studied for cellular energy metabolism and DNA repair mechanisms.", tag: "ENERGY" },
        { desc: "Supports growth hormone and metabolic vitality.", tag: "VITALITY" },
      ],
      badges: [
        "Science-backed formulations",
        "Third-party tested for purity",
        "US-sourced, pharma-grade",
        "Concierge guidance, every step",
      ],
    },
    finder: {
      eyebrow: "Concierge Protocol Finder",
      title1: "Your protocol starts",
      title2: "with your",
      titleEm: "rhythm.",
      subtitle:
        "Answer a few questions about your goals, lifestyle, and current routine. We'll guide you toward the AURYX collection that best matches your priorities.",
      questions: [
        "What is your primary goal?",
        "How would you rate your energy?",
        "How is your sleep quality?",
        "What's your experience level?",
      ],
      start: "Start My Protocol",
      takes: "Takes less than 60 seconds",
    },
    methodology: {
      eyebrow: "The AURYX Methodology",
      title1: "Precision by design.",
      title2Em: "Trust",
      title2: " by standard.",
      steps: [
        { title: "Goal Mapping", desc: "We begin by understanding your specific research priorities — the compounds, mechanisms, and biological pathways of interest." },
        { title: "Lifestyle Review", desc: "Your daily rhythm, sleep patterns, nutrition, and activity inform which peptide protocols may best support your goals." },
        { title: "Protocol Matching", desc: "We align your profile with AURYX's curated collection of evidence-informed peptide protocols." },
        { title: "Ongoing Rhythm", desc: "Precision is a practice. We provide concierge support as your research protocol and goals evolve over time." },
      ],
    },
    philosophy: {
      eyebrow: "Live With Intention",
      title1: "Precision is a ",
      titleEm: "practice",
      title2: ",",
      title3: "not a shortcut.",
      body: "We believe in consistent choices, disciplined routines, and support that helps you thrive for the long run.",
      cta: "Our Philosophy",
    },
    quality: {
      eyebrow: "Compound Quality",
      title1: "Research-grade.",
      titleEm: "Verified.",
      cards: [
        { stat: "≥99%", label: "Purity verified by third-party HPLC analysis on every lot" },
        { stat: "US-Only", label: "Sourced exclusively from FDA-registered US compounding facilities" },
        { stat: "COA", label: "Certificate of Analysis available for every compound we supply" },
      ],
      standard: "— AURYX Quality Standard",
      researchGrade: "Research Grade",
    },
    faq: {
      eyebrow: "Frequently Asked Questions",
      title: "Answers before you begin.",
      items: HOME_FAQS as HomeFaq[],
    },
    cta: {
      eyebrow: "Ready To Begin?",
      title1: "Your best,",
      titleEm: "supported.",
      body1: "Guided protocols. Premium peptides.",
      body2: "Personalized for your rhythm.",
      button: "Find Your Peptides",
    },
  },
  terms: termsEn,
  privacy: privacyEn,
  contact: contactEn,
  sources: sourcesEn,
  notFound: notFoundEn,
  disclaimer: disclaimerEn,
  about: aboutEn,
  shop: shopEn,
  cart: cartEn,
  ourMethod: ourMethodEn,
  protocolFinder: protocolFinderEn,
  verifyCoa: verifyCoaEn,
  blog: blogEn,
  product: productEn,
  checkout: checkoutEn,
  checkoutSuccess: checkoutSuccessEn,
  newYork: newYorkEn,
  learn: learnEn,
  patientAssessment: patientAssessmentEn,
  consultation: consultationEn,
  protocolContinuation: protocolContinuationEn,
  chat: chatEn,
  reconKit: reconKitEn,
};

export type Dict = typeof dict;
