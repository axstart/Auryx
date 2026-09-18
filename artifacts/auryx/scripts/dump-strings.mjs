import fs from "fs";

function dump(file, needles) {
  const s = fs.readFileSync(file, "utf8");
  console.log("\n===", file);
  for (const n of needles) {
    const i = s.indexOf(n);
    console.log(n, i >= 0 ? "YES" : "NO");
  }
}

dump("src/pages/learn.tsx", [
  "Peptide Encyclopedia",
  "Every peptide.",
  "Explained.",
  "Find My Protocol",
  "Browse All Peptides",
  "applyPageSeo",
  "LearnPage",
  "FAQS.map",
]);

dump("src/pages/checkout.tsx", [
  "Checkout | Auryx",
  "Contact Information",
  "RESEARCH_OPTIONS",
  "CheckoutPage",
  "Complete Order",
  "Order Summary",
]);

dump("src/pages/checkout-success.tsx", [
  "Order confirmed",
  "GOALS",
  "MEDICAL_HISTORY",
  "CheckoutSuccess",
]);

dump("src/components/ConsultationModal.tsx", [
  "INTEREST_OPTIONS",
  "STEPS",
  "Book a Consultation",
  "ConsultationModal",
]);

dump("src/components/ProtocolContinuationModal.tsx", [
  "SCREENING_QUESTIONS",
  "Continue My Protocol",
  "ProtocolContinuationModal",
]);

dump("src/components/ChatWidget.tsx", [
  "SUGGESTED",
  "Start Conversation",
  "Auryx Concierge",
]);

dump("src/components/PatientAssessment.tsx", [
  "New to peptides",
  "StepKnowledge",
  "PatientAssessment",
]);
