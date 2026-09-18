import fs from "fs";

const i = fs.readFileSync("src/i18n/index.tsx", "utf8");
console.log({
  useI18n: /export function useI18n/.test(i),
  langHref: /export function langHref/.test(i),
});

const s = fs.readFileSync("src/lib/seo.ts", "utf8");
console.log({
  applyPageSeo: /export function applyPageSeo/.test(s),
  siteUrl: /export function siteUrl/.test(s),
});

const ny = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const enStart = ny.indexOf("export const newYorkEn");
const enEnd = ny.indexOf("export const newYorkEs");
const en = ny.slice(enStart, enEnd);
console.log("heroTitleBefore", en.includes("heroTitleBefore"));
console.log("popular sample", en.match(/popular: \[[\s\S]{0,180}/)?.[0]);
console.log("faqs sample", en.match(/faqs: \[[\s\S]{0,120}/)?.[0]);
console.log("why sample", en.match(/why: \[[\s\S]{0,120}/)?.[0]);
console.log("steps sample", en.match(/steps: \[[\s\S]{0,150}/)?.[0]);
