import { Link } from "wouter";
import { Instagram, Mail, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer style={{ backgroundColor: "#0A0A0A" }} className="border-t border-white/8">

      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-6 md:px-14 lg:px-20 pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">

          {/* Logo */}
          <Link href="/" className="inline-flex min-h-11 items-center text-2xl font-serif tracking-[0.28em] text-[#C9A844] font-bold">
            AURYX
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {[
              { label: t("footer.shop"), href: "/shop" },
              { label: t("footer.ourMethod"), href: "/our-method" },
              { label: "About", href: "/about" },
              { label: t("footer.learn"), href: "/learn" },
              { label: t("footer.pepTalk"), href: "/blog" },
              { label: t("footer.account"), href: "/admin" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-[#C9A844] transition-colors font-medium">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social / contact icons */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" aria-label="Instagram"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="mailto:info@auryxlife.com" aria-label="Email"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </a>
            <Link href="/shop" aria-label={t("footer.shop")}
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/8 pt-8 mb-6">
          <p className="text-[11px] text-white/28 leading-relaxed max-w-4xl">
            <span className="text-white/40 font-medium">{t("footer.importantLabel")}</span> {t("footer.disclaimer")}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[11px] text-white/22">{t("footer.copyright")}</p>
          <div className="flex items-center gap-5">
            {[
              { label: t("footer.privacy"), href: "/privacy" },
              { label: t("footer.terms"), href: "/terms" },
              { label: t("footer.disclaimerLink"), href: "/disclaimer" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center text-[11px] text-white/28 hover:text-[#C9A844] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
