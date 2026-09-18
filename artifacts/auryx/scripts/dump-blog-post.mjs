import fs from "fs";
const s = fs.readFileSync("src/pages/blog-post.tsx", "utf8");
const snippets = [
  "Article not found",
  "Back to Journal",
  "AURYX Journal",
  "Auryx Journal",
  "min read",
  "Physician",
  "Ready to",
  "Book a private",
  "Find My Protocol",
  "Read More",
  "Medical Disclaimer",
  "[post]",
  "useI18n",
];
for (const sn of snippets) {
  const i = s.indexOf(sn);
  console.log("---", sn, i);
  if (i >= 0) console.log(JSON.stringify(s.slice(Math.max(0, i - 40), i + sn.length + 60)));
}
