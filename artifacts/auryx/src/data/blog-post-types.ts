export type Block =
  | { type: "h2"; text: string; faqAnswer?: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: number;
  heroImage: string;
  heroImageAlt: string;
  metaDescription: string;
  content: Block[];
}
