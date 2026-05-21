import { Link } from "wouter";

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border/50 pt-16 pb-10 px-6 md:px-16">
      <div className="container mx-auto max-w-7xl">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-serif tracking-widest text-primary font-bold block mb-4">
              AURYX
            </Link>
            <p className="text-foreground/40 text-sm leading-relaxed max-w-xs mb-6">
              A precision wellness and peptide education platform built for people who want to feel sharper, move better, and age with strategy.
            </p>
            <p className="text-xs text-foreground/30 leading-relaxed max-w-xs">
              Nationwide Telehealth · United States
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground/35 font-medium mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "About", action: () => scrollTo("about") },
                { label: "Protocols", href: "/shop" },
                { label: "Education", action: () => scrollTo("education") },
                { label: "Methodology", action: () => scrollTo("process") },
                { label: "FAQ", action: () => scrollTo("faq") },
              ].map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="text-sm text-foreground/45 hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <button onClick={item.action} className="text-sm text-foreground/45 hover:text-primary transition-colors text-left">
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol categories */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground/35 font-medium mb-5">Protocols</h4>
            <ul className="space-y-3">
              {[
                "Metabolic Support",
                "Recovery & Resilience",
                "Skin & Healthy Aging",
                "Energy & Vitality",
                "Cognitive Performance",
                "Sleep & Restoration",
              ].map(cat => (
                <li key={cat}>
                  <Link href="/shop" className="text-sm text-foreground/45 hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground/35 font-medium mb-5">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:admin@auryxlife.com" className="text-sm text-foreground/45 hover:text-primary transition-colors">
                  admin@auryxlife.com
                </a>
              </li>
              <li className="text-sm text-foreground/30">Telehealth — All 50 States</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border/40 pt-8 mb-6">
          <p className="text-xs text-foreground/30 leading-relaxed max-w-4xl">
            <strong className="text-foreground/40 font-medium">Disclaimer:</strong> This website is for educational purposes only and does not constitute medical advice. The products and information presented are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Individual results vary and are not guaranteed. Always consult a licensed healthcare provider before beginning any new wellness protocol. Peptide protocols should only be used under the supervision of a qualified medical professional.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/25">© 2026 Auryx. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Disclaimer", href: "/disclaimer" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-xs text-foreground/25 hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
