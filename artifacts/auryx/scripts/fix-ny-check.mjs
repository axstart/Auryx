import fs from "fs";

const s = fs.readFileSync("src/pages/new-york.tsx", "utf8");
const fades = [...s.matchAll(/FadeIn|FadeIn/g)].map((m) => m[0]);
console.log("fade tokens", [...new Set(fades)]);
console.log("function", (s.match(/function \w+/g) || []).filter((x) => /Fade|fade/i.test(x)));
console.log("jsx opens", (s.match(/<\w+In /g) || []).slice(0, 5));

const ny = fs.readFileSync("src/i18n/pages/new-york.ts", "utf8");
const used = [...s.matchAll(/copy\.([a-zA-Z]+)/g)].map((m) => m[1]);
const missing = [...new Set(used)].filter((k) => !ny.includes(`"${k}"`) && !ny.includes(`${k}:`));
console.log("missing keys", missing.join(", ") || "none");
console.log("used", [...new Set(used)].join(", "));
