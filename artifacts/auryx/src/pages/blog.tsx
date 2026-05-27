import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { useEffect } from "react";
import { BLOG_POSTS, formatDate, type BlogPost } from "@/data/blog-posts";

const CATEGORY_COLORS: Record<string, string> = {
  Fundamentals: "#7C6A4A",
  "Metabolic Health": "#B8962E",
  Recovery: "#0D9488",
  Longevity: "#2E7D6A",
  "Growth Hormone": "#4A6E9B",
};

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const color = CATEGORY_COLORS[post.category] ?? "#B8962E";
  return (
    <FadeIn delay={index * 0.07}>
      <Link href={`/blog/${post.slug}`}>
        <article className="group bg-white border border-[#E0D9CC] rounded-2xl overflow-hidden hover:border-[#C9A844]/40 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#111]">
            <img
              src={post.heroImage}
              alt={post.heroImageAlt}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              style={{ objectPosition: "center 30%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.1) 50%, transparent 100%)",
              }}
            />
            <span
              className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {post.category}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col flex-1">
            <h2 className="font-serif text-xl text-[#111] leading-snug mb-3 group-hover:text-[#B8962E] transition-colors">
              {post.title}
            </h2>
            <p className="text-[12px] text-[#111]/55 leading-relaxed mb-5 flex-1">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE1]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold text-[#111]/70">
                  {post.author}
                </span>
                <div className="flex items-center gap-3 text-[10px] text-[#111]/35">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#B8962E] group-hover:gap-2 transition-all">
                Read <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}

export default function BlogPage() {
  useEffect(() => {
    document.title =
      "AURYX Blog — Peptide Science, Longevity & Precision Medicine";
    const desc = document.querySelector('meta[name="description"]');
    if (desc)
      desc.setAttribute(
        "content",
        "Physician-written articles on peptide therapy, longevity science, metabolic health, and precision medicine from the AURYX clinical team."
      );
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        <div className="absolute right-0 top-0 bottom-0 w-[52%] z-0 hidden md:block">
          <img
            src="/journal-hero.png"
            alt="AURYX Journal — precision science and peptide therapy"
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: "center top", top: "-7%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.55) 18%, rgba(10,10,10,0.05) 45%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #0A0A0A 0%, transparent 22%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 55% 38%, rgba(201,168,68,0.07) 0%, transparent 60%)",
            }}
          />
        </div>
        <div
          className="absolute inset-0 z-0 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, #0A0A0A 40%, rgba(10,10,10,0.88) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #0A0A0A 0%, rgba(10,10,10,0.95) 40%, transparent 100%)",
          }}
        />

        <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 pt-32 pb-24 md:pt-36 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-lg md:max-w-[520px]"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A844] mb-7 font-medium">
              AURYX Journal
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-[3rem] leading-[1.15] mb-6 font-light text-white">
              Precision science.{" "}
              <em className="not-italic text-[#C9A844]">Clearly explained.</em>
            </h1>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              Physician-written articles on peptide therapy, longevity science,
              metabolic health, and the emerging tools of precision medicine.
            </p>
            <div className="flex flex-col gap-3 max-w-[300px]">
              <Link
                href="/protocol-finder"
                className="flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:bg-[#D4B050] transition-colors"
              >
                Find My Protocol
              </Link>
              <Link
                href="/learn"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/65 font-medium tracking-[0.14em] text-[11px] uppercase px-8 py-4 rounded-lg hover:border-[#C9A844]/50 hover:text-white/90 transition-colors"
              >
                Peptide Encyclopedia
              </Link>
            </div>
            <p className="mt-7 text-[10px] text-white/30 tracking-[0.12em] uppercase">
              Authored by Romy Fontoura, MD · {BLOG_POSTS.length} articles
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Article grid ──────────────────────────────────────── */}
      <div style={{ backgroundColor: "#FAFAF7" }} className="px-6 md:px-14 lg:px-20 py-20">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#B8962E] mb-2 font-medium">
              Latest Articles
            </p>
            <div className="flex items-end gap-6">
              <h2 className="font-serif text-3xl text-[#111]">
                From the AURYX Journal
              </h2>
              <div className="flex-1 h-px bg-[#E0D9CC] mb-1.5" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-20 px-6 md:px-14 lg:px-20 text-center">
        <div className="container mx-auto max-w-xl">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C9A844] mb-5 font-medium">
              Ready to Begin?
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light text-white mb-6">
              Knowledge is the first step.{" "}
              <em className="not-italic text-[#C9A844]">
                Action is the second.
              </em>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Book a private consultation and let our clinical team design a
              protocol around your biology, goals, and lifestyle.
            </p>
            <Link
              href="/protocol-finder"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-[11px] uppercase px-10 py-4 rounded-xl hover:bg-[#D4B050] transition-colors"
            >
              Find My Protocol <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
