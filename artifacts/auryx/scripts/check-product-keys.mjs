import fs from "fs";

const d = fs.readFileSync("src/i18n/pages/product.ts", "utf8");
const p = fs.readFileSync("src/pages/product.tsx", "utf8");
const dictKeys = [...d.matchAll(/"([a-zA-Z]+)"\s*:/g)].map((m) => m[1]);
const used = [...p.matchAll(/copy\.([a-zA-Z]+)/g)].map((m) => m[1]);
const missing = [...new Set(used)].filter((k) => !dictKeys.includes(k));
console.log("dict", dictKeys.join(","));
console.log("used", [...new Set(used)].join(","));
console.log("missing", missing.join(",") || "none");
const idx = fs.readFileSync("src/i18n/index.tsx", "utf8");
console.log("langHref export", /export function langHref/.test(idx));
console.log("page langHref", /langHref\(/.test(p));
