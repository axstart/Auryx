import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ConsultationModal } from "./ConsultationModal";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const isHome = location === "/" || location === "";
  const isShopSection = location.startsWith("/checkout");

  const lightNav = isShopSection;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          lightNav
            ? scrolled
              ? "bg-white border-[#E8E8E4] py-4 shadow-sm"
              : "bg-white border-[#E8E8E4] py-5"
            : scrolled
              ? "bg-[#0A0A0A]/85 backdrop-blur-md border-white/10 py-4"
              : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className={`text-2xl font-serif tracking-widest font-bold transition-colors ${
              lightNav ? "text-[#B8962E]" : "text-[#C9A844]"
            }`}
          >
            AURYX
          </Link>

          <div
            className={`hidden md:flex items-center gap-6 text-sm uppercase tracking-wide font-medium transition-colors ${
              lightNav ? "text-[#0A0A0A]/70" : "text-white/80"
            }`}
          >
            <Link
              href="/shop"
              className={`transition-colors ${
                lightNav
                  ? "text-[#0A0A0A] hover:text-[#B8962E]"
                  : "hover:text-[#C9A844]"
              } ${location.startsWith("/shop") ? (lightNav ? "text-[#B8962E]" : "text-[#C9A844]") : ""}`}
            >
              Shop
            </Link>
            {isHome && (
              <>
                <button onClick={() => scrollToSection("categories")} className="hover:text-[#C9A844] transition-colors whitespace-nowrap">Protocols</button>
                <button onClick={() => scrollToSection("process")} className="hover:text-[#C9A844] transition-colors whitespace-nowrap">Methodology</button>
                <button onClick={() => scrollToSection("about")} className="hover:text-[#C9A844] transition-colors whitespace-nowrap">Philosophy</button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className={`relative p-2 transition-colors ${
                lightNav
                  ? "text-[#0A0A0A]/60 hover:text-[#B8962E]"
                  : "text-white/70 hover:text-[#C9A844]"
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B8962E] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <Button
              onClick={() => setModalOpen(true)}
              className={`font-medium tracking-wide shrink-0 text-sm transition-colors ${
                lightNav
                  ? "bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/85"
                  : "bg-[#C9A844] text-[#0A0A0A] hover:bg-[#C9A844]/90"
              }`}
            >
              Consult
            </Button>
          </div>
        </div>
      </nav>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
