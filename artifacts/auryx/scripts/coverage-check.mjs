import fs from "fs";
const blog = fs.readFileSync("src/i18n/pages/blog.ts", "utf8");
const page = fs.readFileSync("src/pages/blog-post.tsx", "utf8");
const used = [...page.matchAll(/copy\.([a-zA-Z]+)/g)].map((m) => m[1]);
const missing = [...new Set(used)].filter((k) => !blog.includes(k + ":") && !blog.includes(`"${k}"`));
console.log("used", [...new Set(used)].join(", "));
console.log("missing", missing.join(", ") || "none");

// Also check learn wiring status
const learn = fs.readFileSync("src/pages/learn.tsx", "utf8");
console.log("learn useI18n", learn.includes("useI18n"));
for (const f of [
  "checkout.tsx",
  "checkout-success.tsx",
  "components/ConsultationModal.tsx",
  "components/ProtocolContinuationModal.tsx",
  "components/PatientAssessment.tsx",
  "components/ChatWidget.tsx",
]) {
  const p = fs.readFileSync("src/" + f, "utf8");
  console.log(f, "useI18n", p.includes("useI18n"));
}
