import { useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar, User } from "lucide-react";
import { getPost, formatDate, type Block } from "@/data/blog-posts";

/* ─── SEO head injection ──────────────────────────────────────────── */
function injectMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function injectOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function injectCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

function injectJsonLd(id: string, data: object) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

/* ─── Block renderer ──────────────────────────────────────────────── */
function RenderBlock({ block }: { block: Block }) {
  if (block.type === "h2") {
    return (
      <h2 className="font-serif text-2xl md:text-3xl text-[#111] mt-12 mb-4 leading-snug">
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3 className="font-serif text-xl text-[#111] mt-8 mb-3 leading-snug">
        {block.text}
      </h3>
    );
  }
  if (block.type === "p") {
    return (
      <p className="text-[15px] text-[#111]/70 leading-[1.85] mb-5">
        {block.text}
      </p>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="mb-5 space-y-2.5 ml-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[14px] text-[#111]/65 leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A844] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "callout") {
    return (
      <div className="my-8 px-6 py-5 rounded-2xl border border-[#C9A844]/30 bg-[#FBF6EC]">
        <p className="text-[13px] text-[#7A5C1A] leading-relaxed font-medium">
          {block.text}
        </p>
      </div>
    );
  }
  return null;
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? "");
  const scriptRef = useRef<boolean>(false);

  useEffect(() => {
    if (!post) return;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/blog/${post.slug}`;

    document.title = `${post.title} | AURYX`;
    injectMeta("description", post.metaDescription);
    injectOg("og:title", post.title);
    injectOg("og:description", post.metaDescription);
    injectOg("og:url", canonicalUrl);
    injectOg("og:type", "article");
    injectOg("og:image", `${origin}${post.heroImage}`);
    injectCanonical(canonicalUrl);

    if (!scriptRef.current) {
      scriptRef.current = true;

      /* Article JSON-LD */
      injectJsonLd("ld-article", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription,
        author: {
          "@type": "Person",
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "AURYX",
          url: origin,
        },
        datePublished: post.publishDate,
        image: `${origin}${post.heroImage}`,
        url: canonicalUrl,
      });

      /* FAQPage JSON-LD — auto-generated from h2 blocks with faqAnswer */
      const faqBlocks = post.content.filter(
        (b): b is Extract<Block, { type: "h2" }> => b.type === "h2" && !!b.faqAnswer
      );
      if (faqBlocks.length > 0) {
        injectJsonLd("ld-faq", {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqBlocks.map(b => ({
            "@type": "Question",
            name: b.text,
            acceptedAnswer: {
              "@type": "Answer",
              text: b.faqAnswer,
            },
          })),
        });
      }
    }

    return () => {
      document.getElementById("ld-article")?.remove();
      document.getElementById("ld-faq")?.remove();
      scriptRef.current = false;
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Article not found.</p>
          <Link href="/blog" className="text-[#C9A844] hover:underline text-sm">
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[72vh] flex items-end overflow-hidden bg-[#0A0A0A]">
        <img
          src={post.heroImage}
          alt={post.heroImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 25%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.3) 70%, rgba(10,10,10,0.2) 100%)",
          }}
        />
        <div className="relative z-10 w-full px-6 md:px-14 lg:px-20 pb-16 pt-32">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-[#C9A844] text-[10px] uppercase tracking-widest font-semibold mb-6 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> AURYX Journal
              </Link>
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-full text-white"
                  style={{
                    backgroundColor:
                      {
                        Fundamentals: "#7C6A4A",
                        "Metabolic Health": "#B8962E",
                        Recovery: "#0D9488",
                        Longevity: "#2E7D6A",
                        "Growth Hormone": "#4A6E9B",
                      }[post.category] ?? "#B8962E",
                  }}
                >
                  {post.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.12] font-light text-white max-w-3xl mb-6">
                {post.title}
              </h1>
              {/* Byline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-white/45">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-semibold text-white/65">{post.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.publishDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime} min read
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Article body ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#FAFAF7" }}>
        <div className="container mx-auto max-w-4xl px-6 md:px-14 lg:px-20 py-16">
          <div className="max-w-2xl mx-auto">
            {post.content.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </div>

          {/* Divider */}
          <div className="max-w-2xl mx-auto mt-16 pt-10 border-t border-[#E0D9CC]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A844]/15 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-[#B8962E]" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#111]">{post.author}</p>
                <p className="text-[11px] text-[#111]/45 mt-0.5 leading-snug">
                  Physician and longevity medicine specialist at AURYX. Focused on evidence-based peptide protocols and precision metabolic health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-20 px-6 md:px-14 lg:px-20 text-center">
        <div className="container mx-auto max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">
            Ready to Start Your Protocol?
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-white mb-6">
            Book a private{" "}
            <em className="not-italic text-[#C9A844]">consultation.</em>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Our clinical team will design a protocol matched to your biology, goals, and lifestyle — physician-supervised from first order to ongoing optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/protocol-finder"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
            >
              Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/55 font-medium tracking-[0.12em] text-[11px] uppercase px-10 py-4 rounded-xl hover:border-[#C9A844]/50 hover:text-white/80 transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </section>

      {/* ── Medical disclaimer ────────────────────────────────── */}
      <div className="bg-[#F0EAE0] px-6 md:px-14 lg:px-20 py-5">
        <div className="container mx-auto max-w-4xl">
          <p className="text-[11px] text-[#111]/35 leading-relaxed">
            <strong className="text-[#111]/45">Medical Disclaimer:</strong> This article is for educational purposes only and does not constitute medical advice, diagnosis, or treatment recommendations. All protocols are physician-supervised. These statements have not been evaluated by the Food and Drug Administration. Consult a licensed healthcare provider before beginning any peptide protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
