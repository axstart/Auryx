import { createContext, useContext, type ReactNode } from "react";
import type { Dict } from "./translations.en";

export type Lang = "en" | "es" | "pt";
export type { Dict };

/** Vite base path without trailing slash ("" when served from root). */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(pathname: string): string {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  return p || "/";
}

/** Detect the active language from a full window.location.pathname. */
export function getLangFromPath(pathname: string): Lang {
  const p = stripBase(pathname);
  if (p === "/es" || p.startsWith("/es/")) return "es";
  if (p === "/pt" || p.startsWith("/pt/")) return "pt";
  return "en";
}

/** Remove base + language prefix from a pathname, returning the app-relative path. */
export function stripLangPrefix(pathname: string): string {
  const p = stripBase(pathname);
  if (p === "/es" || p === "/pt") return "/";
  if (p.startsWith("/es/") || p.startsWith("/pt/")) return p.slice(3);
  return p;
}

/** Build an absolute-from-root href for `path` (unprefixed) under language `lang`. */
export function langHref(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const prefix = lang === "en" ? "" : `/${lang}`;
  const suffix = clean === "/" ? "" : clean;
  return `${BASE}${prefix}${suffix}` || "/";
}

/** Language detected once from the URL at app start. */
export const initialLang: Lang =
  typeof window !== "undefined" ? getLangFromPath(window.location.pathname) : "en";

const LanguageContext = createContext<Lang>("en");

let activeDict: Dict | null = null;

/** Load only the dictionary for the URL language. Call once before render. */
export async function bootI18n(): Promise<void> {
  if (initialLang === "es") {
    activeDict = (await import("./translations.es")).dict;
  } else if (initialLang === "pt") {
    activeDict = (await import("./translations.pt")).dict;
  } else {
    activeDict = (await import("./translations.en")).dict;
  }
}

export function LanguageProvider({
  lang = initialLang,
  children,
}: {
  lang?: Lang;
  children: ReactNode;
}) {
  return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
}

function resolve(obj: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>(
    (acc, part) =>
      acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined,
    obj,
  );
}

export function useI18n(): { lang: Lang; t: (key: string) => string; dict: Dict } {
  const lang = useContext(LanguageContext);
  if (!activeDict) {
    throw new Error("bootI18n() must run before render");
  }
  const current = activeDict;
  const t = (key: string): string => {
    const value = resolve(current, key);
    return typeof value === "string" ? value : key;
  };
  return { lang, t, dict: current };
}
