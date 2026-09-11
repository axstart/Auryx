import { getLangFromPath, stripLangPrefix, type Lang } from "@/i18n";

const SITE_ORIGIN = "https://www.auryxlife.com";
const SITE_NAME = "Auryx";

const OG_LOCALE: Record<Lang, string> = { en: "en_US", es: "es_ES", pt: "pt_BR" };
const HTML_LANG: Record<Lang, string> = { en: "en", es: "es", pt: "pt-BR" };

/** Prefix a language onto an unprefixed path ("/" stays bare for en). */
function localizedPath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Replace all hreflang alternate links for the current (unprefixed) path. */
function setAlternates(path: string) {
  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach(el => el.remove());
  const entries: Array<[string, string]> = [
    ["en", siteUrl(path)],
    ["es", siteUrl(localizedPath("es", path))],
    ["pt-BR", siteUrl(localizedPath("pt", path))],
    ["x-default", siteUrl(path)],
  ];
  for (const [hreflang, href] of entries) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = hreflang;
    link.href = href;
    document.head.appendChild(link);
  }
}

export function siteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

export function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function setJsonLd(id: string, data: object) {
  document.getElementById(id)?.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

export function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "product";
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  jsonLd?: Array<{ id: string; data: object }>;
};

/** Apply consistent document head tags for a route. */
export function applyPageSeo({
  title,
  description,
  path,
  type = "website",
  image = `${SITE_ORIGIN}/opengraph.jpg`,
  imageAlt = "Auryx — MD-led precision peptide therapy nationwide",
  noindex = false,
  jsonLd = [],
}: PageSeoInput) {
  const lang = getLangFromPath(window.location.pathname);
  // Pages pass unprefixed paths, but strip a language prefix defensively.
  const cleanPath = stripLangPrefix(path.startsWith("/") ? path : `/${path}`);
  const url = siteUrl(localizedPath(lang, cleanPath));
  document.documentElement.lang = HTML_LANG[lang];
  document.title = title;
  setMeta("description", description);
  setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
  setCanonical(url);
  setAlternates(cleanPath);

  setOg("og:title", title);
  setOg("og:description", description);
  setOg("og:url", url);
  setOg("og:type", type === "product" ? "product" : type);
  setOg("og:image", image);
  setOg("og:image:alt", imageAlt);
  setOg("og:site_name", SITE_NAME);
  setOg("og:locale", OG_LOCALE[lang]);

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);
  setMeta("twitter:image", image);
  setMeta("twitter:image:alt", imageAlt);

  for (const item of jsonLd) {
    setJsonLd(item.id, item.data);
  }

  return () => {
    for (const item of jsonLd) {
      removeJsonLd(item.id);
    }
  };
}

export { SITE_ORIGIN, SITE_NAME };
