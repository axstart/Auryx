/**
 * Wire remaining ES/PT surfaces to existing i18n dicts.
 * Run: node scripts/wire-remaining-i18n.mjs
 */
import fs from "fs";
import path from "path";

const root = path.resolve("src");

function write(rel, content) {
  const p = path.join(root, rel);
  fs.writeFileSync(p, content);
  console.log("wrote", rel, content.length);
}

function patch(rel, transforms) {
  const p = path.join(root, rel);
  let s = fs.readFileSync(p, "utf8");
  for (const [from, to] of transforms) {
    if (typeof from === "string") {
      if (!s.includes(from)) {
        console.warn("MISS", rel, from.slice(0, 60).replace(/\n/g, "\\n"));
        continue;
      }
      s = s.split(from).join(to);
    } else {
      const next = s.replace(from, to);
      if (next === s) console.warn("MISS re", rel, String(from).slice(0, 60));
      s = next;
    }
  }
  fs.writeFileSync(p, s);
  console.log("patched", rel);
}

// ── Extend blog.ts with post chrome ─────────────────────────────────
{
  const p = path.join(root, "i18n/pages/blog.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("postNotFound")) {
    s = s.replace(
      `categories: {
    Fundamentals: "Fundamentals",
    "Metabolic Health": "Metabolic Health",
    Recovery: "Recovery",
    Longevity: "Longevity",
    "Growth Hormone": "Growth Hormone",
  } as Record<string, string>,
} as const;`,
      `categories: {
    Fundamentals: "Fundamentals",
    "Metabolic Health": "Metabolic Health",
    Recovery: "Recovery",
    Longevity: "Longevity",
    "Growth Hormone": "Growth Hormone",
  } as Record<string, string>,
  postNotFound: "Article not found.",
  backToJournal: "Back to Journal",
  journalName: "AURYX Journal",
  minReadLabel: "{n} min read",
  authorBio:
    "Physician and longevity medicine specialist at AURYX. Focused on evidence-based peptide protocols and precision metabolic health.",
  postCtaEyebrow: "Ready to Start Your Protocol?",
  postCtaTitleBefore: "Book a private",
  postCtaTitleEm: "consultation.",
  postCtaBody:
    "Our clinical team will design a protocol matched to your biology, goals, and lifestyle — physician-supervised from first order to ongoing optimization.",
  postCtaProtocol: "Find My Protocol",
  postCtaMore: "Read More Articles",
  medicalDisclaimerLabel: "Medical Disclaimer:",
  medicalDisclaimer:
    "This article is for educational purposes only and does not constitute medical advice, diagnosis, or treatment recommendations. All protocols are physician-supervised. These statements have not been evaluated by the Food and Drug Administration. Consult a licensed healthcare provider before beginning any peptide protocol.",
  breadcrumbHome: "Home",
  breadcrumbJournal: "Journal",
} as const;`,
    );
    s = s.replace(
      `categories: {
    Fundamentals: "Fundamentos",
    "Metabolic Health": "Salud Metabólica",
    Recovery: "Recuperación",
    Longevity: "Longevidad",
    "Growth Hormone": "Hormona de Crecimiento",
  } as Record<string, string>,
} as unknown as typeof blogEn;`,
      `categories: {
    Fundamentals: "Fundamentos",
    "Metabolic Health": "Salud Metabólica",
    Recovery: "Recuperación",
    Longevity: "Longevidad",
    "Growth Hormone": "Hormona de Crecimiento",
  } as Record<string, string>,
  postNotFound: "Artículo no encontrado.",
  backToJournal: "Volver al Journal",
  journalName: "Journal AURYX",
  minReadLabel: "{n} min de lectura",
  authorBio:
    "Médica y especialista en medicina de longevidad en AURYX. Enfocada en protocolos de péptidos basados en evidencia y salud metabólica de precisión.",
  postCtaEyebrow: "¿Listo para Empezar Tu Protocolo?",
  postCtaTitleBefore: "Reserva una",
  postCtaTitleEm: "consulta privada.",
  postCtaBody:
    "Nuestro equipo clínico diseñará un protocolo adaptado a tu biología, objetivos y estilo de vida — con supervisión médica desde el primer pedido hasta la optimización continua.",
  postCtaProtocol: "Encontrar Mi Protocolo",
  postCtaMore: "Leer Más Artículos",
  medicalDisclaimerLabel: "Aviso médico:",
  medicalDisclaimer:
    "Este artículo es solo educativo y no constituye consejo médico, diagnóstico ni recomendaciones de tratamiento. Todos los protocolos tienen supervisión médica. Estas declaraciones no han sido evaluadas por la FDA. Consulta a un profesional de la salud antes de comenzar cualquier protocolo de péptidos.",
  breadcrumbHome: "Inicio",
  breadcrumbJournal: "Journal",
} as unknown as typeof blogEn;`,
    );
    // only first ES block - need unique for PT
    const ptBlock = `categories: {
    Fundamentals: "Fundamentos",
    "Metabolic Health": "Saúde Metabólica",
    Recovery: "Recuperação",
    Longevity: "Longevidade",
    "Growth Hormone": "Hormônio do Crescimento",
  } as Record<string, string>,
} as unknown as typeof blogEn;`;
    if (s.includes(ptBlock)) {
      s = s.replace(
        ptBlock,
        `categories: {
    Fundamentals: "Fundamentos",
    "Metabolic Health": "Saúde Metabólica",
    Recovery: "Recuperação",
    Longevity: "Longevidade",
    "Growth Hormone": "Hormônio do Crescimento",
  } as Record<string, string>,
  postNotFound: "Artigo não encontrado.",
  backToJournal: "Voltar ao Journal",
  journalName: "Journal AURYX",
  minReadLabel: "{n} min de leitura",
  authorBio:
    "Médica e especialista em medicina da longevidade na AURYX. Focada em protocolos de peptídeos baseados em evidência e saúde metabólica de precisão.",
  postCtaEyebrow: "Pronto para Começar Seu Protocolo?",
  postCtaTitleBefore: "Agende uma",
  postCtaTitleEm: "consulta particular.",
  postCtaBody:
    "Nossa equipe clínica desenhará um protocolo alinhado à sua biologia, objetivos e estilo de vida — com supervisão médica do primeiro pedido à otimização contínua.",
  postCtaProtocol: "Encontrar Meu Protocolo",
  postCtaMore: "Ler Mais Artigos",
  medicalDisclaimerLabel: "Aviso médico:",
  medicalDisclaimer:
    "Este artigo é apenas educacional e não constitui aconselhamento médico, diagnóstico ou recomendações de tratamento. Todos os protocolos têm supervisão médica. Estas declarações não foram avaliadas pela FDA. Consulte um profissional de saúde antes de iniciar qualquer protocolo de peptídeos.",
  breadcrumbHome: "Início",
  breadcrumbJournal: "Journal",
} as unknown as typeof blogEn;`,
      );
    }
    fs.writeFileSync(p, s);
    console.log("extended blog.ts");
  } else {
    console.log("blog.ts already extended");
  }
}

// ── Extend chat.ts with intake keys ─────────────────────────────────
{
  const p = path.join(root, "i18n/components/chat.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("intakeBlurb")) {
    const extraEn = `
  intakeBlurb: "To personalise your experience, please share a few details.",
  intakeName: "Your name *",
  intakeEmail: "Email address",
  intakePhone: "Phone number",
  intakeHint: "* Required · Email or phone required",
  intakeNameError: "Please enter your name.",
  intakeContactError: "Please enter an email address or phone number.",
  intakeSubmit: "Start Conversation",
  welcomeNamed:
    "Hello, {name} — welcome to Auryx. I'm Aria, your personal health concierge.\\n\\nI'm here to answer your questions about precision longevity protocols and peptide therapy, and to help find the right path for you.",
  hoursNote:
    "\\n\\nOur team is currently outside business hours, but I'm here to help right now. I can also arrange for someone to reach out to you {when} — just let me know how you'd prefer to be contacted.",
`;
    const extraEs = `
  intakeBlurb: "Para personalizar tu experiencia, comparte algunos datos.",
  intakeName: "Tu nombre *",
  intakeEmail: "Correo electrónico",
  intakePhone: "Teléfono",
  intakeHint: "* Obligatorio · Email o teléfono requerido",
  intakeNameError: "Introduce tu nombre.",
  intakeContactError: "Introduce un correo o un teléfono.",
  intakeSubmit: "Iniciar conversación",
  welcomeNamed:
    "Hola, {name} — bienvenido/a a Auryx. Soy Aria, tu conserje de salud personal.\\n\\nEstoy aquí para responder tus preguntas sobre protocolos de longevidad y terapia con péptidos, y ayudarte a encontrar el camino adecuado.",
  hoursNote:
    "\\n\\nNuestro equipo está fuera del horario laboral, pero puedo ayudarte ahora. También puedo coordinar que alguien te contacte {when} — dime cómo prefieres que te contactemos.",
`;
    const extraPt = `
  intakeBlurb: "Para personalizar sua experiência, compartilhe alguns dados.",
  intakeName: "Seu nome *",
  intakeEmail: "E-mail",
  intakePhone: "Telefone",
  intakeHint: "* Obrigatório · E-mail ou telefone necessário",
  intakeNameError: "Informe seu nome.",
  intakeContactError: "Informe um e-mail ou telefone.",
  intakeSubmit: "Iniciar conversa",
  welcomeNamed:
    "Olá, {name} — bem-vindo(a) à Auryx. Sou Aria, sua concierge de saúde pessoal.\\n\\nEstou aqui para responder perguntas sobre protocolos de longevidade e terapia com peptídeos, e ajudar a encontrar o caminho certo para você.",
  hoursNote:
    "\\n\\nNossa equipe está fora do horário comercial, mas posso ajudar agora. Também posso combinar que alguém entre em contato {when} — diga como prefere ser contatado.",
`;
    s = s.replace(
      `suggested: [
    "How does the Protocol Finder work?",
    "Do you ship nationwide?",
    "What's included in a consultation?",
  ],
} as const;`,
      `suggested: [
    "How does the Protocol Finder work?",
    "Do you ship nationwide?",
    "What's included in a consultation?",
  ],${extraEn}} as const;`,
    );
    s = s.replace(
      `suggested: [
    "¿Cómo funciona el Buscador de Protocolos?",
    "¿Envían a todo el país?",
    "¿Qué incluye una consulta?",
  ],
} as unknown as typeof chatEn;`,
      `suggested: [
    "¿Cómo funciona el Buscador de Protocolos?",
    "¿Envían a todo el país?",
    "¿Qué incluye una consulta?",
  ],${extraEs}} as unknown as typeof chatEn;`,
    );
    s = s.replace(
      `suggested: [
    "Como funciona o Localizador de Protocolos?",
    "Vocês enviam para todo o país?",
    "O que está incluso em uma consulta?",
  ],
} as unknown as typeof chatEn;`,
      `suggested: [
    "Como funciona o Localizador de Protocolos?",
    "Vocês enviam para todo o país?",
    "O que está incluso em uma consulta?",
  ],${extraPt}} as unknown as typeof chatEn;`,
    );
    fs.writeFileSync(p, s);
    console.log("extended chat.ts");
  }
}

// ── Extend checkout with step/nav keys ──────────────────────────────
{
  const p = path.join(root, "i18n/pages/checkout.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("stepDetails")) {
    const add = (blockEnd, extras) => {
      s = s.replace(blockEnd, extras + blockEnd);
    };
    // Insert before closing of each locale object — fragile; do EN/ES/PT via unique otpResendFailed lines
    s = s.replace(
      `"otpResendFailed": "Could not resend code"\n} as const;`,
      `"otpResendFailed": "Could not resend code",
  "back": "Back",
  "backToShop": "Back to Shop",
  "stepDetails": "Details",
  "stepVerify": "Verify Email",
  "stepPayment": "Payment",
  "emailVerifyHint": "A verification code will be sent to this address before payment.",
  "researchDisclaimer": "Research-grade compounds are sold strictly for legitimate scientific research and are not intended for human consumption.",
  "researchAck": "I acknowledge that research-grade compounds in this order are sold strictly for legitimate research purposes and are not intended for human consumption.",
  "completeOrder": "Complete Order — $\{total}"
} as const;`,
    );
    // ES
    s = s.replace(
      /"otpResendFailed": "No se pudo reenviar el código"\n\} as unknown as typeof checkoutEn;/,
      `"otpResendFailed": "No se pudo reenviar el código",
  "back": "Atrás",
  "backToShop": "Volver a la tienda",
  "stepDetails": "Datos",
  "stepVerify": "Verificar email",
  "stepPayment": "Pago",
  "emailVerifyHint": "Se enviará un código de verificación a esta dirección antes del pago.",
  "researchDisclaimer": "Los compuestos de grado investigación se venden estrictamente para investigación científica legítima y no están destinados al consumo humano.",
  "researchAck": "Reconozco que los compuestos de grado investigación de este pedido se venden estrictamente para investigación legítima y no están destinados al consumo humano.",
  "completeOrder": "Completar pedido — $\{total}"
} as unknown as typeof checkoutEn;`,
    );
    // PT
    s = s.replace(
      /"otpResendFailed": "Não foi possível reenviar o código"\n\} as unknown as typeof checkoutEn;/,
      `"otpResendFailed": "Não foi possível reenviar o código",
  "back": "Voltar",
  "backToShop": "Voltar à loja",
  "stepDetails": "Dados",
  "stepVerify": "Verificar e-mail",
  "stepPayment": "Pagamento",
  "emailVerifyHint": "Um código de verificação será enviado a este endereço antes do pagamento.",
  "researchDisclaimer": "Compostos de grau pesquisa são vendidos estritamente para pesquisa científica legítima e não se destinam ao consumo humano.",
  "researchAck": "Reconheço que os compostos de grau pesquisa neste pedido são vendidos estritamente para pesquisa legítima e não se destinam ao consumo humano.",
  "completeOrder": "Concluir pedido — $\{total}"
} as unknown as typeof checkoutEn;`,
    );
    fs.writeFileSync(p, s);
    console.log("extended checkout.ts");
  }
}

console.log("dict extensions done");
