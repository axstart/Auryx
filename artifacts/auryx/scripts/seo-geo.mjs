/**
 * Crawlable #geo-static bodies for no-JS GPT-style crawlers.
 * Voice matches the React pages: research/educational, MD-led telemedicine, no dosing advice.
 */

const ORIGIN = "https://www.auryxlife.com";

export const ES_FAQS = [
  {
    q: "¿Son seguros los péptidos?",
    a: "La terapia con péptidos es segura cuando la prescribe un médico titulado y proviene de farmacias de preparación magistral reguladas en EE. UU. Todos los protocolos de Auryx son prescritos por médicos, verificados por laboratorios independientes y monitoreados durante todo el tratamiento.",
  },
  {
    q: "¿Qué tan rápido veré resultados?",
    a: "La mayoría de los pacientes nota mejoras en el sueño y la energía dentro de las primeras 2–4 semanas. Los cambios en la composición corporal y estructurales suelen hacerse visibles en 1–3 meses, según el protocolo y la biología de cada persona.",
  },
  {
    q: "¿Necesito una visita presencial?",
    a: "No se requiere ninguna visita presencial. Auryx ofrece consultas completas por telemedicina y entrega del protocolo directamente a tu puerta para pacientes elegibles en todo Estados Unidos.",
  },
  {
    q: "¿Cómo se personalizan los protocolos?",
    a: "Cada protocolo comienza con un panel completo de biomarcadores, una revisión exhaustiva del historial médico y una evaluación del estilo de vida — realizados por un médico titulado — para diseñar una intervención terapéutica específica para tu biología y tus objetivos.",
  },
  {
    q: "¿Es Auryx adecuado para mí?",
    a: "Auryx está diseñado para personas que tratan su salud como un activo de alto rendimiento y buscan una optimización médica de precisión — no una atención reactiva. Si ese es tu caso, somos la opción correcta.",
  },
  {
    q: "¿Cuánto cuesta el tratamiento?",
    a: "El precio del protocolo depende de los compuestos seleccionados, la dosificación y la duración — todo adaptado a tu biología. El precio completo se conversa durante tu consulta privada, sin obligación de continuar.",
  },
  {
    q: "¿Auryx acepta seguros médicos?",
    a: "Auryx no acepta seguros. La terapia con péptidos es un servicio electivo de medicina de precisión y se paga de forma directa. Aceptamos tarjetas de crédito y débito, Zelle y Venmo.",
  },
  {
    q: "¿Quiénes son los proveedores de Auryx?",
    a: "Auryx fue fundada y es dirigida por un médico titulado especializado en medicina regenerativa e integrativa. Cada protocolo es prescrito, revisado y monitoreado por nuestro equipo clínico — siempre estás bajo supervisión médica directa.",
  },
  {
    q: "Ya sigo un protocolo con otro proveedor. ¿Puedo continuarlo con Auryx?",
    a: "Sí — y toma menos de 24 horas. Completa un breve formulario de ingreso sobre tu protocolo actual y una evaluación médica corta. Un médico titulado lo revisa y aprueba, y tus compuestos se entregan directamente a tu puerta.",
  },
  {
    q: "¿Auryx está disponible en mi estado?",
    a: "Auryx atiende a pacientes en todo Estados Unidos mediante telemedicina con entrega directa a domicilio. Escríbenos y nuestro equipo confirmará la disponibilidad en tu ubicación.",
  },
];

export const PT_FAQS = [
  {
    q: "Os peptídeos são seguros?",
    a: "A terapia com peptídeos é segura quando prescrita por um médico licenciado e obtida de farmácias de manipulação reguladas nos EUA. Todos os protocolos da Auryx são prescritos por médicos, testados por laboratórios independentes e monitorados durante todo o tratamento.",
  },
  {
    q: "Em quanto tempo verei resultados?",
    a: "A maioria dos pacientes percebe melhoras no sono e na energia nas primeiras 2–4 semanas. Mudanças na composição corporal e estruturais costumam ficar visíveis em 1–3 meses, dependendo do protocolo e da biologia de cada pessoa.",
  },
  {
    q: "Preciso de uma consulta presencial?",
    a: "Nenhuma visita presencial é necessária. A Auryx oferece consultas completas por telemedicina e entrega do protocolo diretamente na sua porta para pacientes elegíveis em todos os Estados Unidos.",
  },
  {
    q: "Como os protocolos são personalizados?",
    a: "Cada protocolo começa com um painel completo de biomarcadores, uma revisão detalhada do histórico médico e uma avaliação do estilo de vida — conduzidos por um médico licenciado — para desenhar uma intervenção terapêutica específica para a sua biologia e os seus objetivos.",
  },
  {
    q: "A Auryx é para mim?",
    a: "A Auryx foi criada para pessoas que tratam a saúde como um ativo de alta performance e buscam otimização médica de precisão — não um cuidado reativo. Se esse é o seu caso, somos a escolha certa.",
  },
  {
    q: "Quanto custa o tratamento?",
    a: "O preço do protocolo depende dos compostos selecionados, da dosagem e da duração — tudo ajustado à sua biologia. Os valores completos são discutidos na sua consulta particular, sem obrigação de prosseguir.",
  },
  {
    q: "A Auryx aceita plano de saúde?",
    a: "A Auryx não aceita planos de saúde. A terapia com peptídeos é um serviço eletivo de medicina de precisão, com pagamento direto. Aceitamos cartões de crédito e débito, Zelle e Venmo.",
  },
  {
    q: "Quem são os médicos da Auryx?",
    a: "A Auryx foi fundada e é liderada por um médico licenciado especializado em medicina regenerativa e integrativa. Cada protocolo é prescrito, revisado e monitorado pela nossa equipe clínica — você está sempre sob supervisão médica direta.",
  },
  {
    q: "Já sigo um protocolo com outro provedor. Posso continuá-lo pela Auryx?",
    a: "Sim — e leva menos de 24 horas. Preencha um breve formulário sobre seu protocolo atual e uma triagem médica rápida. Um médico licenciado revisa e aprova, e seus compostos são entregues diretamente a você.",
  },
  {
    q: "A Auryx está disponível no meu estado?",
    a: "A Auryx atende pacientes em todos os Estados Unidos via telemedicina, com entrega direta em domicílio. Entre em contato e nossa equipe confirmará a disponibilidade para a sua região.",
  },
];

export function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function href(path) {
  if (!path || path === "/") return ORIGIN;
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function a(path, label) {
  return `<a href="${href(path)}">${esc(label)}</a>`;
}

function byline(prefix = "Medically reviewed by") {
  return `<p class="byline">${prefix} <a rel="author" href="${href("/about")}">Romy Fontoura, MD</a></p>`;
}

function nav(extra = []) {
  const items = [
    ["/", "Home"],
    ["/shop", "Shop"],
    ["/learn", "Learn"],
    ["/blog", "Journal"],
    ["/our-method", "Our Method"],
    ["/about", "About"],
    ["/contact", "Contact"],
    ["/sources", "Sources"],
    ["/privacy", "Privacy"],
    ["/terms", "Terms"],
    ...extra,
  ];
  return `<nav>\n          ${items.map(([path, label]) => a(path, label)).join("\n          ")}\n        </nav>`;
}

function faqBlock(pairs) {
  return pairs
    .map((f) => `<h2>${esc(f.q)}</h2>\n        <p>${esc(f.a)}</p>`)
    .join("\n        ");
}

function article({ title, lead, sections, faqs = [], bylineHtml, navHtml }) {
  const mid = sections
    .map((s) => `<h2>${esc(s.h2)}</h2>\n        ${s.body}`)
    .join("\n        ");
  const faq = faqs.length ? `\n        ${faqBlock(faqs)}` : "";
  return `${bylineHtml}
        <h1>${esc(title)}</h1>
        <p data-geo-chunk="summary">${lead}</p>
        ${mid}${faq}
        ${navHtml}`;
}

function shopGeo(title) {
  return article({
    title,
    lead: `The Auryx shop is the catalog of physician-guided peptide compounds available through this MD-led telemedicine clinic: GLP-1 and metabolic peptides, growth hormone secretagogues, recovery compounds, cognitive and longevity protocols, and reconstitution supplies. Listings are educational until a licensed physician reviews eligibility and writes or approves a protocol.`,
    bylineHtml: byline(),
    navHtml: nav([["/protocol-finder", "Protocol Finder"]]),
    sections: [
      {
        h2: "What you can browse",
        body: `<p>The collection is grouped the same way as the live shop: GLP-1 and metabolic support, growth hormone, recovery and regeneration, sexual health and vitality, immune and cellular biology, neuroprotective and CNS compounds, Auryx signature complexes, and accessories. Featured compounds often include ${a("/shop/sermorelin", "sermorelin")}, ${a("/shop/bpc-157", "BPC-157")}, ${a("/shop/nad-plus", "NAD+")}, and ${a("/shop/cjc-1295-ipamorelin", "CJC-1295 + Ipamorelin")}. Metabolic listings include ${a("/shop/semaglutide", "semaglutide")}, ${a("/shop/tirzepatide", "tirzepatide")}, and ${a("/shop/retatrutide", "retatrutide")} when those protocols are offered.</p>
        <p>Each product page summarizes category, regulatory status as Auryx labels it, and a short educational description. Pricing shown in the catalog is not a diagnosis and does not replace a consultation. Use the ${a("/protocol-finder", "protocol finder")} if you are matching a goal rather than a compound name, or read the ${a("/learn", "Learn")} encyclopedia for mechanisms and published-research context.</p>`,
      },
      {
        h2: "How shopping works with physician oversight",
        body: `<p>Auryx is not an anonymous peptide checkout. Eligible patients complete a remote intake so a licensed MD can review history, goals, and any protocol you already follow. Compounds ship from regulated United States compounding pharmacies after clinical review. Patients transferring from another clinic can usually continue after a brief medical screen. The practice does not replace emergency care or advice from your own clinician.</p>
        <p>Quality language on the shop matches the clinic standard: third-party testing, certificates of analysis, and US-based fulfillment. Auryx is self-pay. Insurance is not accepted. Explore ${a("/our-method", "our method")} for the four-step process, ${a("/about", "about")} for physician leadership, and ${a("/contact", "contact")} if you need the clinic email before you browse.</p>`,
      },
      {
        h2: "Educational use of this catalog",
        body: `<p>This page does not give dosing instructions. Typical-use language elsewhere on the site is educational and must be confirmed in a physician visit. For citations behind educational claims, see ${a("/sources", "sources")}. For privacy and terms before you enroll, read ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. Spanish and Portuguese readers can start from ${a("/es", "Auryx en español")} or ${a("/pt", "Auryx em português")}.</p>`,
      },
    ],
  });
}

function learnGeo(title, learnFaqs) {
  const faqs = (learnFaqs && learnFaqs.length ? learnFaqs : []).slice(0, 10);
  return article({
    title,
    lead: `Auryx Learn is the physician-reviewed peptide therapy encyclopedia for this telehealth clinic: what peptides are, how compounds such as BPC-157, semaglutide, CJC-1295 with ipamorelin, and NAD+ are discussed in research, and how to start a supervised protocol. It is a reference, not a dosing guide and not a substitute for a licensed clinician.`,
    bylineHtml: byline(),
    navHtml: nav([["/protocol-finder", "Protocol Finder"]]),
    faqs,
    sections: [
      {
        h2: "How to use this reference",
        body: `<p>Browse the full catalog or filter by category — GLP-1 and metabolic, growth hormone, recovery and regeneration, sexual health and vitality, immune and cellular biology, or neuroprotective and CNS. Each entry covers a short definition and mechanism language used on the live Learn page. Pair a compound name with the matching ${a("/shop", "shop")} listing when you want fulfillment context, or open the ${a("/blog", "Journal")} for longer physician-authored explainers.</p>
        <p>Learn content is reviewed by the medical director before publication. Where evidence is early-stage or preclinical, Auryx says so rather than inventing outcomes. Primary literature indexes and federal compounding guidance are listed on ${a("/sources", "sources")}.</p>`,
      },
      {
        h2: "Quality, clinic context, and next steps",
        body: `<p>Compounds discussed here are sourced, when prescribed, from US-based, FDA-registered compounding facilities and described against a third-party purity standard with certificates of analysis. Auryx remains an MD-led telemedicine practice: eligibility, labeling, and fulfillment follow applicable US rules. Nothing on Learn diagnoses, treats, cures, or prevents disease.</p>
        <p>If you already know your goal, use the ${a("/protocol-finder", "protocol finder")} or read ${a("/our-method", "our method")}. For physician leadership, see ${a("/about", "about")}. Questions go to ${a("/contact", "contact")} or info@auryxlife.com. The questions below match the FAQPage schema already published on Learn.</p>`,
      },
    ],
  });
}

function blogGeo(title) {
  return article({
    title,
    lead: `The Auryx Journal publishes physician-written articles on peptide therapy, longevity science, metabolic health, and precision medicine. Pieces are educational explainers from the clinical team — clearly written, citation-aware, and not a treatment plan.`,
    bylineHtml: byline(),
    navHtml: nav([["/learn", "Peptide encyclopedia"]]),
    sections: [
      {
        h2: "Articles in the current journal",
        body: `<p>Live essays include ${a("/blog/what-is-peptide-therapy", "What Is Peptide Therapy? A Physician's Guide to Getting Started")}, ${a("/blog/semaglutide-vs-tirzepatide", "semaglutide versus tirzepatide")}, ${a("/blog/bpc-157-tb-500-recovery-stack", "BPC-157 and TB-500 recovery context")}, ${a("/blog/top-peptides-anti-aging-longevity-2026", "peptides discussed in longevity conversations")}, and ${a("/blog/cjc-1295-ipamorelin-growth-hormone-peptides", "CJC-1295 and ipamorelin growth-hormone peptides")}. Categories on the index include fundamentals, metabolic health, recovery, longevity, and growth hormone.</p>
        <p>Each article is authored or medically reviewed in the voice of Romy Fontoura, MD. Some posts carry visible question-and-answer blocks that match their own FAQPage schema. Use them as citable definitions, then return to the ${a("/learn", "Learn")} hub for compound-by-compound notes or the ${a("/shop", "shop")} for catalog context. The journal is written for patients and researchers who want mechanism-level education before a telemedicine visit, not a substitute for that visit.</p>`
      },
      {
        h2: "How journal pages are reviewed",
        body: `<p>Health content carries responsibility. Journal education follows the same medical-director review described on ${a("/about", "about")}: claims are grounded in peer-reviewed literature when we make them, and early or animal data is labeled. We do not invent outcome guarantees or publish dosing schedules as if they were universal.</p>
        <p>For the databases and federal pages behind those citations, see ${a("/sources", "sources")}. For the clinical process after you finish reading, see ${a("/our-method", "our method")} or start the ${a("/protocol-finder", "protocol finder")}. Clinic email and consultation intake live on ${a("/contact", "contact")}.</p>`,
      },
      {
        h2: "What this index is not",
        body: `<p>The journal index is not a diagnosis, not a shopping cart, and not personalized medical advice. Auryx serves eligible patients nationwide via telemedicine after an MD review. If you need legal or privacy language before you write in, use ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. Language homepages: ${a("/es", "español")} and ${a("/pt", "português")}.</p>`,
      },
    ],
  });
}

function methodGeo(title) {
  return article({
    title,
    lead: `Auryx's method is evidence-informed and physician-supervised: map your goals, review how you actually live, match a protocol from the curated collection, then keep an ongoing clinical rhythm. Longevity is treated as a practice, not a one-click product.`,
    bylineHtml: byline(),
    navHtml: nav([["/protocol-finder", "Protocol Finder"]]),
    sections: [
      {
        h2: "Four steps from goal to protocol",
        body: `<p>Goal mapping comes first. The clinic asks what you are optimizing for — recovery, cognition, vitality, metabolic support, or healthy aging — instead of recommending a generic stack. Lifestyle review comes next: sleep, training, stress, nutrition, and existing routines, because the same peptide can serve different people differently. Protocol matching then aligns that profile with Auryx collections spanning GLP-1 and metabolic support, growth hormone, recovery, cognitive performance, immune function, and longevity. Ongoing rhythm is the fourth step: goals and biology change, and concierge plus clinical follow-up is part of the model.</p>
        <p>You can start that path from the ${a("/protocol-finder", "protocol finder")} or browse compounds on the ${a("/shop", "shop")}. Educational mechanisms live on ${a("/learn", "Learn")}. None of those pages replace the MD review required before fulfillment.</p>`,
      },
      {
        h2: "Principles behind the method",
        body: `<p>The live method page states six operating principles: evidence-informed selection, physician supervision, US-sourced compounding pharmacies, pharma-grade purity with third-party testing and certificates of analysis, discreet temperature-aware shipping, and concierge access. Auryx does not stock a compound merely because it is trending. Complex orders may require a brief clinical consultation before fulfillment.</p>
        <p>Peptides are short amino-acid chains that act as messengers. Therapeutic use at Auryx is framed as amplifying or mimicking signals the body already uses — under a licensed physician — not as blunt one-size-fits-all pharmacology. This page does not prescribe dose, timing, or stacks. Those decisions stay in clinic.</p>`,
      },
      {
        h2: "Trust, citations, and who leads the work",
        body: `<p>Romy Fontoura, MD, is founder and medical director. Read her role on ${a("/about", "about")} and physician-authored essays in the ${a("/blog", "Journal")}. Citations that ground educational language are collected on ${a("/sources", "sources")}. For appointments, email ${a("/contact", "contact")} or info@auryxlife.com. Review ${a("/privacy", "privacy")} and ${a("/terms", "terms")} before you enroll. Auryx is self-pay telemedicine for eligible patients in the United States.</p>`,
      },
    ],
  });
}

function aboutGeo(title) {
  return article({
    title,
    lead: `Auryx is an MD-led telehealth peptide therapy clinic founded by Romy Fontoura, MD. The about page exists to show physician accountability, the medical review process behind educational pages, and the quality standards used when protocols are fulfilled in the United States.`,
    bylineHtml: byline(),
    navHtml: nav([["/our-method", "Our Method"]]),
    sections: [
      {
        h2: "Romy Fontoura, MD, founder and medical director",
        body: `<p>Dr. Fontoura founded Auryx to bring physician accountability to a category often defined by unregulated sourcing and anonymous storefronts. As medical director she oversees peptide therapy protocols offered via telehealth across the United States — compound selection, quality standards, and the clinical review behind published resources. Protocols are designed around individual goals and reviewed by licensed clinicians, not dispensed as one-size-fits-all stacks.</p>
        <p>Education and licensure details are available on request through the clinic while the public biography is completed. Verification questions can go to info@auryxlife.com or the ${a("/contact", "contact")} page. This biography is not a celebrity endorsement and does not claim outcomes.</p>`,
      },
      {
        h2: "Medical review process",
        body: `<p>Every Learn article, protocol page, and educational resource is reviewed by the medical director before it goes live. Content that describes compounds, mechanisms, or protocols does not publish without physician sign-off. Educational claims are grounded in published, peer-reviewed literature; early-stage or preclinical evidence is labeled. Peptide research moves quickly, so published material is re-reviewed against current literature and regulatory guidance and updated or retired when it no longer reflects the best available evidence.</p>
        <p>That standard is why ${a("/learn", "Learn")} and the ${a("/blog", "Journal")} should be cited as clinic education, not as anonymous blog copy. Primary indexes used in that work are listed on ${a("/sources", "sources")}.</p>`,
      },
      {
        h2: "Quality standards you can verify",
        body: `<p>Auryx describes four public standards: a minimum 99 percent purity threshold verified by independent analysis before inventory, third-party certificates of analysis, United States sourcing and fulfillment without an opaque offshore chain, and physician oversight via telehealth before, during, and after an order. Read the process end-to-end on ${a("/our-method", "our method")}, browse the ${a("/shop", "shop")}, or start the ${a("/protocol-finder", "protocol finder")}.</p>
        <p>Auryx does not replace emergency services. Nothing on this site diagnoses, treats, cures, or prevents disease. Legal pages: ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. Language homepages: ${a("/es", "español")} and ${a("/pt", "português")}.</p>`,
      },
    ],
  });
}

function contactGeo(title) {
  return article({
    title,
    lead: `Contact Auryx by email for MD-led peptide therapy nationwide — scheduling, protocol transfers, and clinic questions — or begin a private telemedicine consultation. Include your state of residence so the team can confirm availability.`,
    bylineHtml: byline(),
    navHtml: nav([["/protocol-finder", "Protocol Finder"]]),
    sections: [
      {
        h2: "Email the clinic",
        body: `<p>Write <a href="mailto:info@auryxlife.com">info@auryxlife.com</a> for scheduling, protocol transfers from another provider, and general clinic questions. Auryx is a nationwide telemedicine practice led by Romy Fontoura, MD. The inbox is for clinic operations, not emergency care. If you have chest pain, trouble breathing, or another urgent symptom, use local emergency services.</p>
        <p>Useful details to include: the US state where you will receive care, whether you already follow a peptide protocol, and whether you want education only or a physician review. The team can point you to ${a("/about", "about the physician")}, ${a("/our-method", "our method")}, or the ${a("/shop", "shop")} once your question is clear.</p>`,
      },
      {
        h2: "Start a protocol without guessing",
        body: `<p>If you are ready for clinical review, use the ${a("/protocol-finder", "protocol finder")} or browse the ${a("/shop", "shop")}. A licensed MD reviews every case before fulfillment. Patients already on a protocol elsewhere can usually transfer after a short intake and medical screen. Educational reading lives on ${a("/learn", "Learn")} and the ${a("/blog", "Journal")}; those pages do not approve a prescription.</p>
        <p>Auryx is self-pay. Insurance is not accepted. Pricing depends on compounds, dose, and duration discussed in consultation, with no obligation to proceed. Payment methods described on the site include credit and debit cards, Zelle, and Venmo. Citations behind educational language are on ${a("/sources", "sources")}.</p>`,
      },
      {
        h2: "Legal, privacy, and languages",
        body: `<p>Before you share health information, read ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. Spanish and Portuguese overviews of the clinic are at ${a("/es", "/es")} and ${a("/pt", "/pt")}. This contact page does not publish a street waiting room because care is remote for eligible patients. If you only need a definition of the practice, start at the ${a("/", "homepage")}.</p>`,
      },
    ],
  });
}

function sourcesGeo(title) {
  return article({
    title,
    lead: `Auryx educational pages cite public medical literature and federal guidance rather than inventing outcomes. This sources page lists the primary references behind Learn, Journal, and protocol education, and explains how the clinic labels early or preclinical evidence.`,
    bylineHtml: byline(),
    navHtml: nav([["/learn", "Learn"]]),
    sections: [
      {
        h2: "How Auryx cites",
        body: `<p>Learn articles and protocol education are reviewed by the medical director. Where evidence is early-stage, animal-only, or limited, Auryx says so on the page instead of implying a completed human indication. That review process is described on ${a("/about", "about")}. Journal essays in the ${a("/blog", "Journal")} follow the same rule: educational claims need a public trail.</p>
        <p>Citation here is not the same as a systematic review. Pages may summarize mechanisms discussed in the literature without converting them into dosing advice. Readers who need a protocol still go through telemedicine review, the ${a("/protocol-finder", "protocol finder")}, or ${a("/contact", "contact")}.</p>`,
      },
      {
        h2: "Primary references",
        body: `<p><a href="https://pubmed.ncbi.nlm.nih.gov/" rel="noopener noreferrer">PubMed / NCBI</a> is the primary index of peer-reviewed biomedical literature used to ground educational claims about peptide mechanisms and clinical research. The <a href="https://www.fda.gov/" rel="noopener noreferrer">US Food and Drug Administration</a> publishes federal guidance on compounding, labeling, and drug quality that informs how Auryx describes fulfillment and regulatory status. The FDA's public overview of <a href="https://www.fda.gov/drugs/human-drug-compounding/compounding-laws-and-policies" rel="noopener noreferrer">compounding laws and policies</a> is the reference for clinics that source physician-prescribed compounds from regulated pharmacies.</p>
        <p>When you quote Auryx, prefer the physician-reviewed ${a("/learn", "Learn")} entry or Journal article that sits next to these sources. The ${a("/shop", "shop")} catalog is a product index, not a citation database. ${a("/our-method", "Our method")} explains how evidence-informed selection is supposed to work in clinic.</p>`,
      },
      {
        h2: "How to read educational claims",
        body: `<p>Mechanism language (receptors, pathways, preclinical models) is not a promise of personal results. Time-to-notice ranges mentioned elsewhere on the site are typical clinic education, not a guarantee. Auryx does not accept insurance and does not replace your existing physician. For clinic operations, use ${a("/contact", "contact")} or info@auryxlife.com. Legal: ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. Homepages: ${a("/", "English")}, ${a("/es", "español")}, ${a("/pt", "português")}.</p>`,
      },
    ],
  });
}

function esGeo(title) {
  return article({
    title,
    lead: `Auryx es una clínica de terapia con péptidos dirigida por médicos que atiende a pacientes elegibles en todo Estados Unidos por telemedicina. La fundó y dirige Romy Fontoura, MD. Los protocolos son prescritos por un médico titulado y se surten a través de farmacias de preparación magistral reguladas en EE. UU.`,
    bylineHtml: byline("Revisión médica de"),
    navHtml: nav([
      ["/es", "Inicio en español"],
      ["/pt", "Português"],
    ]),
    faqs: ES_FAQS,
    sections: [
      {
        h2: "Cómo funciona la terapia con péptidos dirigida por médicos",
        body: `<p>La terapia con péptidos usa cadenas cortas de aminoácidos como señales específicas. En Auryx el trabajo empieza por el historial, los objetivos y, cuando corresponde, un panel de biomarcadores. El médico elige compuestos y seguimiento; no hay un catálogo anónimo sin revisión clínica. Quienes ya siguen un protocolo en otra clínica suelen poder transferirlo después de una evaluación médica breve.</p>
        <p>Los estándares de calidad incluyen pruebas de terceros, certificados de análisis y surtido en Estados Unidos. Auryx es una práctica de telemedicina de pago directo: no acepta seguros. El precio depende de los compuestos y la duración que se conversan en consulta. Explora la ${a("/shop", "tienda")}, las guías de ${a("/learn", "Aprende")} o el ${a("/protocol-finder", "buscador de protocolos")} si aún no sabes por dónde empezar.</p>`,
      },
      {
        h2: "Colecciones, método y liderazgo médico",
        body: `<p>Las colecciones descritas en el sitio cubren apoyo metabólico, recuperación, piel y salud celular, energía, neuroprotección, y sueño. La metodología Auryx —mapeo de objetivos, revisión de estilo de vida, selección de protocolo y ritmo continuo— está explicada en ${a("/our-method", "Nuestro método")}. Romy Fontoura, MD, es la fundadora y directora médica; su rol y el proceso de revisión de contenidos están en ${a("/about", "Acerca de Auryx")}.</p>
        <p>Las páginas educativas citan literatura pública en ${a("/sources", "Fuentes")} y no sustituyen el consejo de tu propio clínico ni la atención de urgencias. Para citas y preguntas de clínica usa ${a("/contact", "Contacto")} o info@auryxlife.com. Revisa ${a("/privacy", "privacidad")} y ${a("/terms", "términos")} antes de inscribirte. La portada en inglés está en ${a("/", "auryxlife.com")} y el portugués de Brasil en ${a("/pt", "/pt")}.</p>`,
      },
      {
        h2: "Qué es y qué no es esta página",
        body: `<p>Esta portada en español resume el mismo servicio de telemedicina: terapia con péptidos supervisada por médicos, de carácter educativo e investigativo en el contenido público, sin instrucciones de dosificación. Nada en este sitio diagnostica, trata, cura o previene enfermedades. Las preguntas siguientes coinciden con las preguntas frecuentes localizadas del sitio.</p>`,
      },
    ],
  });
}

function ptGeo(title) {
  return article({
    title,
    lead: `A Auryx é uma clínica de terapia com peptídeos conduzida por médicos que atende pacientes elegíveis em todos os Estados Unidos por telemedicina. Foi fundada e é liderada por Romy Fontoura, MD. Os protocolos são prescritos por um médico licenciado e enviados por farmácias de manipulação reguladas nos EUA.`,
    bylineHtml: byline("Revisão médica por"),
    navHtml: nav([
      ["/pt", "Início em português"],
      ["/es", "Español"],
    ]),
    faqs: PT_FAQS,
    sections: [
      {
        h2: "Como funciona a terapia com peptídeos conduzida por médicos",
        body: `<p>A terapia com peptídeos usa cadeias curtas de aminoácidos como sinais específicos. Na Auryx, o trabalho começa pelo histórico, pelos objetivos e, quando indicado, por um painel de biomarcadores. O médico escolhe os compostos e o acompanhamento — não há um catálogo anônimo sem revisão clínica. Quem já segue um protocolo em outra clínica em geral pode transferi-lo após uma triagem médica breve.</p>
        <p>Os padrões de qualidade incluem testes de terceiros, certificados de análise e fulfillment nos Estados Unidos. A Auryx é uma prática de telemedicina com pagamento direto: não aceita planos de saúde. O preço depende dos compostos e da duração conversados na consulta. Explore a ${a("/shop", "loja")}, os guias de ${a("/learn", "Aprenda")} ou o ${a("/protocol-finder", "localizador de protocolos")} se ainda não souber por onde começar.</p>`,
      },
      {
        h2: "Coleções, método e liderança médica",
        body: `<p>As coleções descritas no site cobrem suporte metabólico, recuperação, pele e saúde celular, energia, neuroproteção e sono. A metodologia Auryx — mapeamento de objetivos, análise do estilo de vida, escolha do protocolo e ritmo contínuo — está em ${a("/our-method", "Nosso método")}. Romy Fontoura, MD, é a fundadora e diretora médica; o papel dela e o processo de revisão de conteúdo estão em ${a("/about", "Sobre a Auryx")}.</p>
        <p>As páginas educativas citam literatura pública em ${a("/sources", "Fontes")} e não substituem o conselho do seu próprio clínico nem o atendimento de emergência. Para consultas e perguntas da clínica, use ${a("/contact", "Contato")} ou info@auryxlife.com. Leia ${a("/privacy", "privacidade")} e ${a("/terms", "termos")} antes de se inscrever. A página inicial em inglês está em ${a("/", "auryxlife.com")} e o espanhol em ${a("/es", "/es")}.</p>`,
      },
      {
        h2: "O que esta página é e o que ela não é",
        body: `<p>Esta página inicial em português (pt-BR) resume o mesmo serviço de telemedicina: terapia com peptídeos supervisionada por médicos, com conteúdo público educacional e de pesquisa, sem orientação de dosagem. Nada neste site diagnostica, trata, cura ou previne doenças. As perguntas a seguir coincidem com as perguntas frequentes localizadas do site.</p>`,
      },
    ],
  });
}

function defaultGeo(title, description) {
  return article({
    title,
    lead: esc(description),
    bylineHtml: byline(),
    navHtml: nav(),
    sections: [
      {
        h2: "About this Auryx page",
        body: `<p>Auryx is an MD-led peptide therapy clinic that serves eligible patients nationwide via telemedicine. Founded and led by Romy Fontoura, MD, the practice designs physician-supervised protocols and fulfills approved compounds through regulated United States compounding pharmacies. Public pages are research and education. They do not replace personalized advice from a licensed clinician and they do not give dosing instructions.</p>
        <p>For the catalog see ${a("/shop", "shop")}. For compound encyclopedic notes see ${a("/learn", "Learn")}. For physician-authored essays see the ${a("/blog", "Journal")}. For the clinical process see ${a("/our-method", "our method")}. For leadership and review standards see ${a("/about", "about")}.</p>`,
      },
      {
        h2: "How to continue",
        body: `<p>Questions and scheduling go through ${a("/contact", "contact")} or info@auryxlife.com. Citations sit on ${a("/sources", "sources")}. Legal pages are ${a("/privacy", "privacy")} and ${a("/terms", "terms")}. The English homepage is ${a("/", "Auryx")}; Spanish and Portuguese overviews are ${a("/es", "/es")} and ${a("/pt", "/pt")}.</p>`,
      },
    ],
  });
}

/**
 * @param {string} route
 * @param {{ title: string, description: string }} page
 * @param {{ learnFaqs?: { q: string, a: string }[] }} [ctx]
 */
export function buildGeoInner(route, page, ctx = {}) {
  const title = page.title;
  switch (route) {
    case "/shop":
      return shopGeo(title);
    case "/learn":
      return learnGeo(title, ctx.learnFaqs);
    case "/blog":
      return blogGeo(title);
    case "/our-method":
      return methodGeo(title);
    case "/about":
      return aboutGeo(title);
    case "/contact":
      return contactGeo(title);
    case "/sources":
      return sourcesGeo(title);
    case "/es":
      return esGeo(title);
    case "/pt":
      return ptGeo(title);
    default:
      return defaultGeo(title, page.description);
  }
}
