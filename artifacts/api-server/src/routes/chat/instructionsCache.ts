import { db } from "@workspace/db";
import { ariaSettingsTable } from "@workspace/db/schema";
import { DEFAULT_ARIA_INSTRUCTIONS } from "./defaultInstructions.js";

let cached: string | null = null;
let cacheTime = 0;
const TTL_MS = 30_000;

export async function getAriaInstructions(): Promise<string> {
  if (cached !== null && Date.now() - cacheTime < TTL_MS) {
    return cached;
  }
  try {
    const [row] = await db.select().from(ariaSettingsTable).limit(1);
    cached = row?.instructions ?? DEFAULT_ARIA_INSTRUCTIONS;
    cacheTime = Date.now();
  } catch {
    if (cached === null) cached = DEFAULT_ARIA_INSTRUCTIONS;
  }
  return cached!;
}

export function clearAriaCache(): void {
  cached = null;
  cacheTime = 0;
}
