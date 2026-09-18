import fs from "fs";

const ny = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const en = ny.match(/export const newYorkEn = \{([\s\S]*?)\n\} as const/)?.[1] ?? "";
const keys = [...en.matchAll(/^\s+"?([a-zA-Z][a-zA-Z0-9]*)"?\s*:/gm)].map((m) => m[1]);
console.log("newYork keys:", [...new Set(keys)].join(", "));

const checkout = fs.readFileSync("src/i18n/pages/checkout.ts", "utf8");
const cEn = checkout.match(/export const checkoutEn = \{([\s\S]*?)\n\} as const/)?.[1] ?? "";
const cKeys = [...cEn.matchAll(/^\s+"?([a-zA-Z][a-zA-Z0-9]*)"?\s*:/gm)].map((m) => m[1]);
console.log("checkout keys:", [...new Set(cKeys)].join(", "));

const cs = fs.readFileSync("src/i18n/pages/checkout-success.ts", "utf8");
const csEn = cs.match(/export const checkoutSuccessEn = \{([\s\S]*?)\n\} as const/)?.[1] ?? "";
const csKeys = [...csEn.matchAll(/^\s+"?([a-zA-Z][a-zA-Z0-9]*)"?\s*:/gm)].map((m) => m[1]);
console.log("checkoutSuccess keys:", [...new Set(csKeys)].join(", "));

for (const f of [
  "ConsultationModal.tsx",
  "ProtocolContinuationModal.tsx",
  "PatientAssessment.tsx",
  "ChatWidget.tsx",
]) {
  const p = fs.readFileSync(`src/components/${f}`, "utf8");
  console.log(f, "lines", p.split("\n").length, "useI18n", /useI18n/.test(p));
}
