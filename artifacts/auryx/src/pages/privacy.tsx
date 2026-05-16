export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <p className="text-xs tracking-[0.2em] uppercase text-primary/60 mb-4 font-light">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 font-light tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-16 border-b border-border pb-8">
          Effective Date: May 16, 2026
        </p>

        <div className="space-y-12 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">1. Introduction</h2>
            <p>
              AURYX LLC ("Auryx," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website at auryxlife.com or our telehealth services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">2. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">—</span>
                <span><span className="text-foreground font-medium">Personal identifiers:</span> Name, email address, phone number</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">—</span>
                <span><span className="text-foreground font-medium">Health information:</span> Medical history, current medications, health goals, and screening responses provided during our intake process</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">—</span>
                <span><span className="text-foreground font-medium">Payment information:</span> Transaction data processed through our payment partners (we do not store full payment card details)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1 shrink-0">—</span>
                <span><span className="text-foreground font-medium">Usage data:</span> IP address, browser type, pages visited, and interaction data collected via analytics tools</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Process consultation and protocol requests",
                "Facilitate physician review and approval of your protocol",
                "Communicate with you about your care",
                "Send administrative and operational notifications",
                "Improve our services and website",
                "Comply with legal and regulatory obligations",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">4. Health Information & HIPAA</h2>
            <p>
              Health information you provide during our intake process is treated as sensitive and confidential. We implement administrative, technical, and physical safeguards to protect your health information in accordance with applicable law. We do not sell your health information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">5. Sharing of Information</h2>
            <p className="mb-4">We do not sell your personal information. We may share your information with:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Licensed physicians and medical staff involved in your care",
                "FDA-registered compounding pharmacies fulfilling your prescription",
                "Payment processors facilitating your transaction",
                "Technology service providers operating our platform under confidentiality agreements",
                "Law enforcement or regulatory authorities when required by law",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">6. Data Retention</h2>
            <p>
              We retain your personal and health information for as long as necessary to provide services and comply with legal obligations, typically a minimum of 7 years for medical records in accordance with Florida law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2 pl-4 mb-4">
              {[
                "Access the personal information we hold about you",
                "Request correction of inaccurate information",
                "Request deletion of your information, subject to legal retention requirements",
                "Opt out of marketing communications at any time",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:info@auryxlife.com" className="text-primary hover:text-primary/80 transition-colors">
                info@auryxlife.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">8. Cookies & Analytics</h2>
            <p>
              Our Site uses cookies and analytics tools to understand how visitors interact with our content. You may disable cookies in your browser settings, though some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">9. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">10. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our Site with a new effective date.
            </p>
          </section>

          <section className="border-t border-border pt-10">
            <h2 className="font-serif text-xl text-foreground mb-3 font-normal">12. Contact</h2>
            <p>
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:info@auryxlife.com" className="text-primary hover:text-primary/80 transition-colors">
                info@auryxlife.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
