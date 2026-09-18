import fs from "fs";
const s = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const en = s.slice(s.indexOf("export const newYorkEn"), s.indexOf("export const newYorkEs"));
const keys = [...en.matchAll(/^\s+"?([a-zA-Z][a-zA-Z0-9]*)"?\s*:/gm)].map((x) => x[1]);
console.log([...new Set(keys)].join("\n"));
