import { useEffect } from "react";
import { Link } from "wouter";
import { applyPageSeo } from "@/lib/seo";

export default function Contact() {
  useEffect(() => {
    return applyPageSeo({
      title: "Contact Auryx | MD-Led Peptide Therapy",
      description:
        "Contact Auryx for MD-led peptide therapy nationwide. Email the clinic team or book a private telemedicine consultation.",
      path: "/contact",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-[calc(var(--site-header-height)+1.5rem)] pb-24 md:pt-[calc(var(--site-header-height)+3rem)] md:pb-32">
        <p className="text-xs tracking-[0.2em] uppercase text-primary/60 mb-4 font-light">Clinic</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 font-light tracking-tight">
          Contact
        </h1>
        <p className="text-sm text-muted-foreground mb-16 border-b border-border pb-8">
          Auryx clinical team · Nationwide telemedicine
        </p>

        <div className="space-y-12 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">Email</h2>
            <p>
              For scheduling, protocol transfers, and general clinic questions, write{" "}
              <a href="mailto:info@auryxlife.com" className="text-primary hover:text-primary/80 transition-colors">
                info@auryxlife.com
              </a>
              . Include your state of residence so we can confirm telemedicine availability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">Start a protocol</h2>
            <p className="mb-4">
              If you are ready for a physician review, use the protocol finder or shop. A licensed MD
              reviews every case before fulfillment.
            </p>
            <p>
              <Link href="/protocol-finder" className="text-primary hover:text-primary/80 transition-colors">
                Protocol finder
              </Link>
              {" · "}
              <Link href="/shop" className="text-primary hover:text-primary/80 transition-colors">
                Shop
              </Link>
              {" · "}
              <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
                About the physician
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">Legal</h2>
            <p>
              <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                Privacy
              </Link>
              {" · "}
              <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                Terms
              </Link>
              {" · "}
              <Link href="/sources" className="text-primary hover:text-primary/80 transition-colors">
                Sources
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
