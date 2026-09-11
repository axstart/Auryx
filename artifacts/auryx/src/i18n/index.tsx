import { createContext, useContext, type ReactNode } from "react";
import { translations, type Dict, type Lang } from "./translations";

export type { Lang, Dict };

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
  const dict = translations[lang];
  const t = (key: string): string => {
    const value = resolve(dict, key) ?? resolve(translations.en, key);
    return typeof value === "string" ? value : key;
  };
  return { lang, t, dict };
}
