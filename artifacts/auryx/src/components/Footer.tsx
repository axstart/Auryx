import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-background border-t border-border py-16 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-serif tracking-widest text-primary font-bold block mb-4">
              AURYX
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Precision longevity and medically guided peptide therapy protocols for those who demand the highest performance from their biology.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground text-sm uppercase tracking-wider">
              <li><button onClick={() => scrollToSection("categories")} className="hover:text-primary transition-colors">Protocols</button></li>
              <li><button onClick={() => scrollToSection("process")} className="hover:text-primary transition-colors">Methodology</button></li>
              <li><button onClick={() => scrollToSection("education")} className="hover:text-primary transition-colors">Science</button></li>
              <li><button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">Philosophy</button></li>
              <li><button onClick={() => scrollToSection("faq")} className="hover:text-primary transition-colors">FAQ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><a href="mailto:auryxlife@zohomail.com" className="hover:text-primary transition-colors">auryxlife@zohomail.com</a></li>
              <li><a href="tel:9178539663" className="hover:text-primary transition-colors">(917) 853-9663</a></li>
              <li className="pt-2">Miami / New York / Boston</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} Auryx Medical. All rights reserved.</p>
          <p className="max-w-2xl text-center md:text-right">
            Disclaimer: The information provided is for educational purposes only. Peptide therapy should only be undertaken under the direct supervision of a licensed medical professional. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
