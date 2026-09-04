import { DEFAULT_ARIA_INSTRUCTIONS } from "./defaultInstructions.js";

export async function getAriaInstructions(): Promise<string> {
  return DEFAULT_ARIA_INSTRUCTIONS;
}

export function clearAriaCache(): void {
  // Kept for compatibility with the admin settings route.
}
