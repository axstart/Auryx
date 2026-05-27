import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ConsultationModal } from "./ConsultationModal";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBg} py-4 md:py-5`}>
        {/* 3-column grid: left | center | right */}
        <div className="grid grid-cols-3 items-center px-5 md:px-10">

          {/* Left: hamburger (mobile) | nav links (desktop) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(m => !m)}
              className={`md:hidden p-1.5 ${iconColor} transition-colors`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/shop" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"} ${location.startsWith("/shop") ? (light ? "text-[#B8962E]" : "text-[#C9A844]") : ""}`}>
                Shop
              </Link>
              <Link href="/our-method" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"}`}>
                Our Method
              </Link>
              <Link href="/learn" className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${light ? "text-[#0A0A0A]/65 hover:text-[#B8962E]" : "text-white/60 hover:text-[#C9A844]"}`}>
                Learn
              </Link>
            </div>
          </div>

          {/* Center: AURYX logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <img
                src="/logo-transparent.png"
                alt="AURYX"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: cart icon */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={openCart}
              className={`relative p-1.5 transition-colors ${iconColor}`}
              aria-label="Open cart"
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
              Consult
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-20" style={{ backgroundColor: "#0A0A0A" }}>
          <nav className="flex flex-col gap-1 px-8 py-8">
            {[
              { label: "Shop", href: "/shop" },
              { label: "Protocol Finder", href: "/protocol-finder" },
              { label: "Learn", href: "/#education" },
              { label: "About", href: "/#philosophy" },
            ].map(l => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl text-white/80 hover:text-[#C9A844] transition-colors py-3 border-b border-white/8"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="px-8 mt-auto pb-12">
            <button
              onClick={() => { setMenuOpen(false); setModalOpen(true); }}
              className="w-full flex items-center justify-center bg-[#C9A844] text-[#0A0A0A] font-bold tracking-[0.15em] text-sm uppercase py-4 rounded-xl"
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
