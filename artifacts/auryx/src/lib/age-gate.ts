export const AGE_STORAGE_KEY = "auryx_age_verified";

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|gptbot|claude|perplexity|googleother|bytespider|amazonbot|applebot|duckduckbot/i;

/** True when the age overlay should mount. Bots and returning visitors skip it. */
export function ageGateRequired(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  if (BOT_UA.test(navigator.userAgent || "")) return false;
  return !localStorage.getItem(AGE_STORAGE_KEY);
}
