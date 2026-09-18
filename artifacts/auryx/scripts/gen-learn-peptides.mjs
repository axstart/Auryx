import fs from "fs";

const dir = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const en = JSON.parse(fs.readFileSync(`${dir}/_peptides-en.json`, "utf8"));
const es = JSON.parse(fs.readFileSync(`${dir}/_peptides-es.json`, "utf8"));
const pt = JSON.parse(fs.readFileSync(`${dir}/_peptides-pt.json`, "utf8"));

function toMap(arr) {
  const out = {};
  for (const p of arr) {
    const body = {
      definition: p.definition,
      mechanism: p.mechanism,
      benefits: p.benefits,
      typicalUse: p.typicalUse,
    };
    if (p.researchNote) body.researchNote = p.researchNote;
    out[p.slug] = body;
  }
  return out;
}

const enMap = toMap(en);
const esMap = toMap(es);
const ptMap = toMap(pt);
const enSlugs = Object.keys(enMap);
const issues = [];

for (const slug of enSlugs) {
  if (!esMap[slug]) issues.push(`missing ES: ${slug}`);
  if (!ptMap[slug]) issues.push(`missing PT: ${slug}`);
  if (esMap[slug]?.benefits.length !== enMap[slug].benefits.length) {
    issues.push(`ES benefits len ${slug}`);
  }
  if (ptMap[slug]?.benefits.length !== enMap[slug].benefits.length) {
    issues.push(`PT benefits len ${slug}`);
  }
  const enHas = !!enMap[slug].researchNote;
  if (enHas !== !!esMap[slug]?.researchNote) issues.push(`ES note mismatch ${slug}`);
  if (enHas !== !!ptMap[slug]?.researchNote) issues.push(`PT note mismatch ${slug}`);
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function emitBody(body, indent) {
  const sp = " ".repeat(indent);
  let s = `{\n`;
  s += `${sp}  definition: \`${esc(body.definition)}\`,\n`;
  s += `${sp}  mechanism: \`${esc(body.mechanism)}\`,\n`;
  s += `${sp}  benefits: [\n`;
  for (const b of body.benefits) {
    s += `${sp}    \`${esc(b)}\`,\n`;
  }
  s += `${sp}  ],\n`;
  s += `${sp}  typicalUse: \`${esc(body.typicalUse)}\`,`;
  if (body.researchNote) {
    s += `\n${sp}  researchNote: \`${esc(body.researchNote)}\`,`;
  }
  s += `\n${sp}}`;
  return s;
}

function emitRecord(name, map) {
  let s = `export const ${name}: Record<string, PeptideBody> = {\n`;
  for (const slug of enSlugs) {
    s += `  "${slug}": ${emitBody(map[slug], 2)},\n`;
  }
  s += `};\n`;
  return s;
}

let out = "";
out += `export type PeptideBody = {\n`;
out += `  definition: string;\n`;
out += `  mechanism: string;\n`;
out += `  benefits: string[];\n`;
out += `  typicalUse: string;\n`;
out += `  researchNote?: string;\n`;
out += `};\n\n`;
out += emitRecord("learnPeptidesEn", enMap) + "\n";
out += emitRecord("learnPeptidesEs", esMap) + "\n";
out += emitRecord("learnPeptidesPt", ptMap) + "\n";
out += `export function getPeptideBody(slug: string, lang: "en" | "es" | "pt"): PeptideBody | undefined {\n`;
out += `  const map = lang === "es" ? learnPeptidesEs : lang === "pt" ? learnPeptidesPt : learnPeptidesEn;\n`;
out += `  return map[slug] ?? learnPeptidesEn[slug];\n`;
out += `}\n`;

const dest = new URL("../src/i18n/pages/learn-peptides.ts", import.meta.url);
fs.writeFileSync(dest, out);
console.log("Wrote", dest.pathname);
console.log("Slugs:", enSlugs.length);
console.log(enSlugs.join("\n"));
