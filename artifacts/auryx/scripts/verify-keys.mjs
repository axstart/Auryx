import fs from "fs";

const learnDict = fs.readFileSync("src/i18n/pages/learn.ts", "utf8");
const learnPage = fs.readFileSync("src/pages/learn.tsx", "utf8");
console.log("dict heroEyebrow", learnDict.includes("heroEyebrow"));
console.log("dict heroTitleBefore", learnDict.includes("heroTitleBefore"));
console.log("dict ctaProtocol", learnDict.includes("ctaProtocol"));
console.log("dict allCategories", learnDict.includes("allCategories"));
console.log("dict faqs", /faqs:/.test(learnDict));
console.log("page LearnPage", /function LearnPage/.test(learnPage));
console.log("page activeCategory", learnPage.includes("activeCategory"));
console.log("page activeCategory", learnPage.includes("activeCategory"));

const consult = fs.readFileSync("src/i18n/components/consultation.ts", "utf8");
console.log("consultation interestOptions", consult.includes("interestOptions"));
console.log("consultation steps", consult.includes("steps:"));

const chat = fs.readFileSync("src/i18n/components/chat.ts", "utf8");
console.log("chat suggested", chat.includes("suggested"));
console.log("chat intakeSubmit", chat.includes("intakeSubmit"));

const pa = fs.readFileSync("src/i18n/components/patient-assessment.ts", "utf8");
console.log("pa knowledge", pa.includes("knowledge"));
console.log("pa analyseProfile", pa.includes("analyseProfile"));
console.log("pa results", pa.includes("results"));
