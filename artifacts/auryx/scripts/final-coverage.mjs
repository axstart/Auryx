import fs from "fs";

const surfaces = [
  ["pages/our-method.tsx", "ourMethod"],
  ["pages/product.tsx", "product"],
  ["pages/learn.tsx", "learn"],
  ["pages/blog.tsx", "blog"],
  ["pages/blog-post.tsx", "blog"],
  ["pages/protocol-finder.tsx", "protocolFinder"],
  ["pages/new-york.tsx", "newYork"],
  ["pages/verify-coa.tsx", "verifyCoa"],
  ["pages/checkout.tsx", "checkout"],
  ["pages/checkout-success.tsx", "checkoutSuccess"],
  ["components/ConsultationModal.tsx", "consultation"],
  ["components/ProtocolContinuationModal.tsx", "protocolContinuation"],
  ["components/PatientAssessment.tsx", "patientAssessment"],
  ["components/ChatWidget.tsx", "chat"],
  ["components/ReconstitutionKitPopup.tsx", "reconKit"],
];

console.log("Surface wiring status:\n");
for (const [file, key] of surfaces) {
  const s = fs.readFileSync("src/" + file, "utf8");
  const wired = s.includes("useI18n") && (s.includes(`dict.${key}`) || s.includes(`copy.`));
  // Estimate leftover English UI strings (rough)
  const hard = (s.match(/"[A-Z][a-z]+ [a-z]+[^"]{8,}"/g) || []).length;
  console.log(`${wired ? "WIRED" : "OPEN "}  ${file.padEnd(42)} hard~${hard}`);
}

console.log("\nLeftover English (content bodies, not chrome):");
console.log("- learn.tsx: PEPTIDES encyclopedia definition/mechanism/benefits bodies");
console.log("- blog-post.tsx: article title/body from data/blog-posts (EN only)");
console.log("- product.tsx: API product name/description (no locale overlay file)");
console.log("- PatientAssessment: some medical/AI result body strings still EN");
console.log("- checkout: some PaymentNode error/validation strings still EN");
console.log("- ChatWidget: live assistant welcome template may still mix EN");
