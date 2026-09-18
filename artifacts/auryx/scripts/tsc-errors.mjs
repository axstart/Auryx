import { execSync } from "child_process";
try {
  const out = execSync("pnpm exec tsc --noEmit --pretty false --incremental false", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  console.log("TSC_OK");
  if (out) console.log(out.slice(0, 500));
} catch (e) {
  const out = `${e.stdout || ""}${e.stderr || ""}`;
  console.log(
    out
      .split("\n")
      .filter((l) => l.includes("error TS"))
      .slice(0, 50)
      .join("\n"),
  );
  console.log("TSC_FAIL");
}
