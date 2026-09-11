import { useState, useEffect, useRef, Fragment } from "react";
import { Link, useLocation } from "wouter";
import { ConsultationModal } from "./ConsultationModal";
import { ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useI18n, langHref, stripLangPrefix, type Lang } from "@/i18n";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

const LANGS: Lang[] = ["en", "es", "pt"];

function switchLanguage(target: Lang) {
  const path = stripLangPrefix(window.location.pathname);
  window.location.href =
    langHref(target, path) + window.location.search + window.location.hash;
}

function LangSwitcher({ light, size = "sm" }: { light?: boolean; size?: "sm" | "lg" }) {
  const { lang, t } = useI18n();
  const isLg = size === "lg";
  return (
    <div className="flex items-center" aria-label={t("nav.switchLanguage")}>
      {LANGS.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className={`${isLg ? "text-sm" : "text-[10px]"} ${light ? "text-[#0A0A0A]/20" : "text-white/20"}`}
            >
              |
            </span>
          )}
          <button
            onClick={() => l !== lang && switchLanguage(l)}
            aria-current={l === lang ? "true" : undefined}
            className={`${isLg ? "min-h-11 min-w-11 px-3 py-2 text-sm tracking-[0.2em]" : "px-1.5 py-1 text-[10px] tracking-[0.15em]"} uppercase font-semibold transition-colors ${
              l === lang
                ? light
                  ? "text-[#B8962E]"
                  : "text-[#C9A844]"
                : light
                  ? "text-[#0A0A0A]/45 hover:text-[#B8962E]"
                  : "text-white/40 hover:text-[#C9A844]"
            }`}
          >
            {l.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { t } = useI18n();
  const [location] = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${header.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, []);

  const isCheckout = location.startsWith("/checkout");
  const light = isCheckout;

  const navBg = light
    ? "bg-white border-[#E8E8E4] shadow-sm"
    : scrolled
      ? "bg-[#0A0A0A]/90 backdrop-blur-md border-white/8"
      : "bg-transparent border-transparent";

  const logoColor = light ? "text-[#B8962E]" : "text-[#C9A844]";
  const iconColor = light ? "text-[#0A0A0A]/60 hover:text-[#B8962E]" : "text-white/65 hover:text-[#C9A844]";

  return (
    <>
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 flex flex-col pt-[var(--safe-area-top)] bg-[#0A0A0A]">
        {/* ── Compliance disclaimer strip ── */}
        <div
          className={`w-full py-1.5 text-center border-b transition-colors duration-300 ${
            light
              ? "bg-[#F5F0E8] border-[#E4DDD0]"
              : "bg-[#0D0D0B] border-white/[0.06]"
          }`}
        >
          <p
            className={`text-[9.5px] uppercase tracking-[0.22em] font-medium ${
              light ? "text-[#8C7A5A]" : "text-white/32"
            }`}
          >
            {t("nav.compliance")}
          </p>
        </div>

      <nav className={`transition-all duration-300 border-b ${navBg} py-4 md:py-5`}>
        {/* 3-column grid: left | center | right */}
        <div className="grid grid-cols-3 items-center px-5 md:px-10">

          {/* Left: hamburger (mobile) | nav links (desktop) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden min-h-11 min-w-11 -ml-3 inline-flex items-center justify-center ${iconColor} transition-colors motion-reduce:transition-none`}
              aria-label={t("nav.openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/shop" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"} ${location.startsWith("/shop") ? (light ? "text-[#B8962E]" : "text-[#C9A844]") : ""}`}>
                {t("nav.shop")}
              </Link>
              <Link href="/our-method" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"}`}>
                {t("nav.ourMethod")}
              </Link>
              <Link href="/learn" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"}`}>
                {t("nav.learn")}
              </Link>
              <Link href="/blog" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"}`}>
                {t("nav.pepTalk")}
              </Link>
            </div>
          </div>

          {/* Center: AURYX logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex min-h-11 items-center">
              <img
                src="/logo-transparent.png"
                alt="AURYX"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: language switcher + cart icon */}
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:block">
              <LangSwitcher light={light} />
            </div>
            <button
              onClick={openCart}
              className={`relative min-h-11 min-w-11 -mr-3 inline-flex items-center justify-center transition-colors motion-reduce:transition-none ${iconColor}`}
              aria-label={t("nav.openCart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C9A844] text-[#0A0A0A] text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            {/* Consult button — desktop only */}
            <button
              onClick={() => setModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-bold px-4 py-2 rounded-lg transition-colors bg-[#C9A844] text-[#0A0A0A] hover:bg-[#D4B050]"
            >
              {t("nav.consult")}
            </button>
          </div>
        </div>
      </nav>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          id="mobile-navigation"
          className="md:hidden w-full max-w-none border-r-0 bg-[#0A0A0A] p-0 flex flex-col pt-[max(var(--site-header-height,6rem),env(safe-area-inset-top))] [&>button]:top-[max(1rem,env(safe-area-inset-top))] [&>button]:right-4 [&>button]:h-11 [&>button]:w-11 [&>button]:grid [&>button]:place-items-center [&>button]:text-white motion-reduce:transition-none"
        >
          <SheetTitle className="sr-only">{t("nav.siteNavigation")}</SheetTitle>
          <SheetDescription className="sr-only">{t("nav.siteNavigationDesc")}</SheetDescription>
          <nav className="flex flex-col gap-1 px-6 py-6 overflow-y-auto">
            {[
              { label: t("nav.shop"), href: "/shop" },
              { label: t("nav.protocolFinder"), href: "/protocol-finder" },
              { label: t("nav.ourMethod"), href: "/our-method" },
              { label: t("nav.learn"), href: "/learn" },
              { label: t("nav.pepTalk"), href: "/blog" },
            ].map(l => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl sm:text-4xl text-white/80 hover:text-[#C9A844] transition-colors motion-reduce:transition-none min-h-14 flex items-center border-b border-white/8"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
            <div className="flex justify-center mb-4">
              <LangSwitcher size="lg" />
            </div>
            <button
              onClick={() => { setMenuOpen(false); setModalOpen(true); }}
              className="w-full min-h-12 flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-sm uppercase py-3 rounded-xl"
            >
              {t("nav.bookConsultation")}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
