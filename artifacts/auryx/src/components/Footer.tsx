import { Link } from "wouter";
import { Instagram, Mail, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A0A0A" }} className="border-t border-white/8">

      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-6 md:px-14 lg:px-20 pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">

          {/* Logo */}
          <Link href="/" className="text-2xl font-serif tracking-[0.28em] text-[#C9A844] font-bold">
            AURYX
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {[
              { label: "Shop", href: "/shop" },
              { label: "Our Method", href: "/our-method" },
              { label: "Learn", href: "/learn" },
              { label: "Pep Talk", href: "/blog" },
              { label: "Account", href: "/admin" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-[#C9A844] transition-colors font-medium">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social / contact icons */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="mailto:admin@auryxlife.com" aria-label="Email"
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </a>
            <Link href="/shop" aria-label="Shop"
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[#C9A844] hover:border-[#C9A844]/40 transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/8 pt-8 mb-6">
          <p className="text-[11px] text-white/28 leading-relaxed max-w-4xl">
            <span className="text-white/40 font-medium">RESEARCH USE ONLY.</span> All compounds sold through AURYX are for legitimate scientific research purposes only and are not intended for human consumption. These products have not been evaluated by the Food and Drug Administration and are not intended to diagnose, treat, cure, or prevent any disease or condition. This website is for informational and educational purposes only and does not constitute medical advice.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[11px] text-white/22">© 2025 AURYX. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Disclaimer", href: "/disclaimer" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[11px] text-white/28 hover:text-[#C9A844] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
