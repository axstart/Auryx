import fs from "fs";
const ny = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const en = ny.slice(ny.indexOf("export const newYorkEn"), ny.indexOf("export const newYorkEs"));
for (const k of ["popular", "faqs", "why", "steps", "regions", "ctaProtocol", "jsonLdName"]) {
  console.log(k, en.includes(`"${k}"`) || en.includes(`${k}:`));
}
const popularIdx = en.indexOf("popular");
console.log(en.slice(popularIdx, popularIdx + 250));
