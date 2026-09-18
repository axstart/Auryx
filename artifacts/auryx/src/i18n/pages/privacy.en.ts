export const privacyEn = {
  seoTitle: "Privacy Policy | Auryx",
  seoDescription:
    "Auryx Privacy Policy. Learn how we collect, use, and protect your personal information when using auryxlife.com.",
  eyebrow: "Legal",
  title: "Privacy Policy",
  effectiveDate: "Effective Date: May 16, 2026",
  intro: {
    title: "1. Introduction",
    body: 'AURYX LLC ("Auryx," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website at auryxlife.com or our telehealth services.',
  },
  collect: {
    title: "2. Information We Collect",
    lead: "We collect the following types of information:",
    items: [
      { label: "Personal identifiers:", text: "Name, email address, phone number" },
      {
        label: "Health information:",
        text: "Medical history, current medications, health goals, and screening responses provided during our intake process",
      },
      {
        label: "Payment information:",
        text: "Transaction data processed through our payment partners (we do not store full payment card details)",
      },
      {
        label: "Usage data:",
        text: "IP address, browser type, pages visited, and interaction data collected via analytics tools",
      },
    ],
  },
  use: {
    title: "3. How We Use Your Information",
    lead: "We use your information to:",
    items: [
      "Process consultation and protocol requests",
      "Facilitate physician review and approval of your protocol",
      "Communicate with you about your care",
      "Send administrative and operational notifications",
      "Improve our services and website",
      "Comply with legal and regulatory obligations",
    ],
  },
  hipaa: {
    title: "4. Health Information & HIPAA",
    body: "Health information you provide during our intake process is treated as sensitive and confidential. We implement administrative, technical, and physical safeguards to protect your health information in accordance with applicable law. We do not sell your health information to third parties.",
  },
  sharing: {
    title: "5. Sharing of Information",
    lead: "We do not sell your personal information. We may share your information with:",
    items: [
      "Licensed physicians and medical staff involved in your care",
      "FDA-registered compounding pharmacies fulfilling your prescription",
      "Payment processors facilitating your transaction",
      "Technology service providers operating our platform under confidentiality agreements",
      "Law enforcement or regulatory authorities when required by law",
    ],
  },
  retention: {
    title: "6. Data Retention",
    body: "We retain your personal and health information for as long as necessary to provide services and comply with legal obligations, typically a minimum of 7 years for medical records in accordance with Florida law.",
  },
  rights: {
    title: "7. Your Rights",
    lead: "You have the right to:",
    items: [
      "Access the personal information we hold about you",
      "Request correction of inaccurate information",
      "Request deletion of your information, subject to legal retention requirements",
      "Opt out of marketing communications at any time",
    ],
    contact: "To exercise these rights, contact us at info@auryxlife.com.",
    contactEmail: true,
  },
  cookies: {
    title: "8. Cookies & Analytics",
    body: "Our Site uses cookies and analytics tools to understand how visitors interact with our content. You may disable cookies in your browser settings, though some features may not function properly.",
  },
  thirdParty: {
    title: "9. Third-Party Links",
    body: "Our Site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies.",
  },
  children: {
    title: "10. Children's Privacy",
    body: "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors.",
  },
  changes: {
    title: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our Site with a new effective date.",
  },
  contact: {
    title: "12. Contact",
    body: "For privacy-related questions or requests, contact us at info@auryxlife.com.",
    contactEmail: true,
  },
} as const;
