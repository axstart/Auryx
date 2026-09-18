import fs from "fs";
const files = [
  "pages/learn.tsx",
  "pages/checkout.tsx",
  "pages/checkout-success.tsx",
  "pages/new-york.tsx",
  "pages/blog-post.tsx",
  "components/ConsultationModal.tsx",
  "components/ProtocolContinuationModal.tsx",
  "components/ChatWidget.tsx",
  "components/PatientAssessment.tsx",
];
for (const f of files) {
  const s = fs.readFileSync("src/" + f, "utf8");
  console.log(f.padEnd(45), "useI18n", s.includes("useI18n"), "dict.", /dict\.\w+/.test(s));
}
