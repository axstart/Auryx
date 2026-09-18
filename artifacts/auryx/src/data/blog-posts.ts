import { initialLang, type Lang } from "@/i18n";
import type { BlogPost } from "./blog-post-types";

export type { Block, BlogPost } from "./blog-post-types";

const posts = (
  initialLang === "es"
    ? (await import("./blog-posts.es")).BLOG_POSTS_ES
    : initialLang === "pt"
      ? (await import("./blog-posts.pt")).BLOG_POSTS_PT
      : (await import("./blog-posts.en")).BLOG_POSTS
) as BlogPost[];

export function getPosts(_lang: Lang = initialLang): BlogPost[] {
  return posts;
}

export function getPost(slug: string, lang: Lang = initialLang): BlogPost | undefined {
  return getPosts(lang).find((post) => post.slug === slug);
}

export function formatDate(dateStr: string, lang: Lang = initialLang): string {
  const locale = lang === "es" ? "es-ES" : lang === "pt" ? "pt-BR" : "en-US";
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
