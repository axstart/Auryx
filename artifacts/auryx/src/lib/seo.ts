const SITE_ORIGIN = "https://www.auryxlife.com";
const SITE_NAME = "Auryx";

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
  const url = siteUrl(path);
  document.title = title;
  setMeta("description", description);
  setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
  setCanonical(url);

  setOg("og:title", title);
  setOg("og:description", description);
  setOg("og:url", url);
  setOg("og:type", type === "product" ? "product" : type);
  setOg("og:image", image);
  setOg("og:image:alt", imageAlt);
  setOg("og:site_name", SITE_NAME);
  setOg("og:locale", "en_US");

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
