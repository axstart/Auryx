import fs from "fs";
import { execSync } from "child_process";

const s = fs.readFileSync("src/data/blog-posts.ts", "utf8");
console.log("publishDate", /publishDate:/.test(s));
console.log("readTime", /readTime:/.test(s));
console.log("heroImage", /heroImage:/.test(s));
console.log("categories", [...s.matchAll(/category: "([^"]+)"/g)].map((m) => m[1]).slice(0, 8));

const blogPage = fs.readFileSync("src/pages/blog.tsx", "utf8");
const blogDict = fs.readFileSync("src/i18n/pages/blog.ts", "utf8");
console.log("page uses authoredBy", /authoredBy/.test(blogPage));
console.log("dict has authoredBy", /authoredBy:/.test(blogDict));
console.log("dict has ctaProtocol", /ctaProtocol:/.test(blogDict));
console.log("dict has heroBody", /heroBody:/.test(blogDict));
console.log("dict has latestEyebrow", /latestEyebrow:/.test(blogDict));
console.log("dict has minRead", /minRead:/.test(blogDict));
console.log("dict has categories", /categories:/.test(blogDict));

try {
  execSync("pnpm exec tsc --noEmit --pretty false --incremental false", {
    stdio: "pipe",
    encoding: "utf8",
  });
  console.log("TSC_OK");
} catch (e) {
  const out = (e.stdout || "") + (e.stderr || "");
  const lines = out.split("\n").filter((l) => l.includes("error TS")).slice(0, 40);
  console.log(lines.join("\n") || "no error lines parsed");
  console.log("TSC_FAIL");
}
