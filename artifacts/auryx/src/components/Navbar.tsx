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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isHome = location === "/" || location === "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-border py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif tracking-widest text-primary font-bold">
            AURYX
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-wide font-medium text-foreground/80">
            <Link href="/shop" className="hover:text-primary transition-colors whitespace-nowrap">
              Shop
            </Link>
            {isHome && (
              <>
                <button onClick={() => scrollToSection("categories")} className="hover:text-primary transition-colors whitespace-nowrap">Protocols</button>
                <button onClick={() => scrollToSection("process")} className="hover:text-primary transition-colors whitespace-nowrap">Methodology</button>
                <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors whitespace-nowrap">Philosophy</button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative text-foreground/70 hover:text-primary transition-colors p-2"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide shrink-0 text-sm"
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
