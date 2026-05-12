import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ConsultationModal } from "./ConsultationModal";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider font-medium text-foreground/80">
            <button onClick={() => scrollToSection("categories")} className="hover:text-primary transition-colors">Protocols</button>
            <button onClick={() => scrollToSection("process")} className="hover:text-primary transition-colors">Methodology</button>
            <button onClick={() => scrollToSection("education")} className="hover:text-primary transition-colors">Science</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">Philosophy</button>
          </div>

          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide"
          >
            Request Private Consultation
          </Button>
        </div>
      </nav>

      <ConsultationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
