import fs from "fs";
import path from "path";

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".ts")) fixFile(p);
  }
}

function fixFile(filePath) {
  let s = fs.readFileSync(filePath, "utf8");
  const orig = s;

  // Pattern: export const fooEs: typeof fooEn = { ... };
  // Convert to: export const fooEs = { ... } as unknown as typeof fooEn;
  s = s.replace(
    /export const (\w+)(Es|Pt): typeof (\w+En) = (\{[\s\S]*?\n\});/g,
    (_m, name, lang, enName, obj) =>
      `export const ${name}${lang} = ${obj} as unknown as typeof ${enName};`,
  );

  // Also: export const fooEs = { ... } as const; where we want unknown cast — leave
  // Pattern already using `as unknown as typeof` — leave alone

  // Fix `: typeof XEn =` remaining simple cases without nested braces issues
  s = s.replace(
    /export const (\w+Es): typeof (\w+En) =/g,
    "export const $1 =",
  );
  s = s.replace(
    /export const (\w+Pt): typeof (\w+En) =/g,
    "export const $1 =",
  );

  if (s !== orig) {
    fs.writeFileSync(filePath, s);
    console.log("fixed", filePath);
  }
}

walk("src/i18n");
console.log("done");
