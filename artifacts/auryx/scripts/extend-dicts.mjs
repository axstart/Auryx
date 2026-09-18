import fs from "fs";
import path from "path";

const SRC = path.resolve("src");

// ── blog post chrome ────────────────────────────────────────────────
{
  const p = path.join(SRC, "i18n/pages/blog.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("postNotFound")) {
    const enInsert = `
  postNotFound: "Article not found.",
  backToJournal: "Back to Journal",
  journalName: "AURYX Journal",
  minReadLabel: "{n} min read",
  authorBio: "Physician and longevity medicine specialist at AURYX. Focused on evidence-based peptide protocols and precision metabolic health.",
  postCtaEyebrow: "Ready to Start Your Protocol?",
  postCtaTitleBefore: "Book a private",
  postCtaTitleEm: "consultation.",
  postCtaBody: "Our clinical team will design a protocol matched to your biology, goals, and lifestyle — physician-supervised from first order to ongoing optimization.",
  postCtaProtocol: "Find My Protocol",
  postCtaMore: "Read More Articles",
  medicalDisclaimerLabel: "Medical Disclaimer:",
  medicalDisclaimer: "This article is for educational purposes only and does not constitute medical advice, diagnosis, or treatment recommendations. All protocols are physician-supervised. These statements have not been evaluated by the Food and Drug Administration. Consult a licensed healthcare provider before beginning any peptide protocol.",
  breadcrumbHome: "Home",
  breadcrumbJournal: "Journal",
`;
    const esInsert = `
  postNotFound: "Artículo no encontrado.",
  backToJournal: "Volver al Journal",
  journalName: "Journal AURYX",
  minReadLabel: "{n} min de lectura",
  authorBio: "Médica y especialista en medicina de longevidad en AURYX. Enfocada en protocolos de péptidos basados en evidencia y salud metabólica de precisión.",
  postCtaEyebrow: "¿Listo para Empezar Tu Protocolo?",
  postCtaTitleBefore: "Reserva una",
  postCtaTitleEm: "consulta privada.",
  postCtaBody: "Nuestro equipo clínico diseñará un protocolo adaptado a tu biología, objetivos y estilo de vida — con supervisión médica desde el primer pedido hasta la optimización continua.",
  postCtaProtocol: "Encontrar Mi Protocolo",
  postCtaMore: "Leer Más Artículos",
  medicalDisclaimerLabel: "Aviso médico:",
  medicalDisclaimer: "Este artículo es solo educativo y no constituye consejo médico, diagnóstico ni recomendaciones de tratamiento. Todos los protocolos tienen supervisión médica. Estas declaraciones no han sido evaluadas por la FDA. Consulta a un profesional de la salud antes de comenzar cualquier protocolo de péptidos.",
  breadcrumbHome: "Inicio",
  breadcrumbJournal: "Journal",
`;
    const ptInsert = `
  postNotFound: "Artigo não encontrado.",
  backToJournal: "Voltar ao Journal",
  journalName: "Journal AURYX",
  minReadLabel: "{n} min de leitura",
  authorBio: "Médica e especialista em medicina da longevidade na AURYX. Focada em protocolos de peptídeos baseados em evidência e saúde metabólica de precisão.",
  postCtaEyebrow: "Pronto para Começar Seu Protocolo?",
  postCtaTitleBefore: "Agende uma",
  postCtaTitleEm: "consulta particular.",
  postCtaBody: "Nossa equipe clínica desenhará um protocolo alinhado à sua biologia, objetivos e estilo de vida — com supervisão médica do primeiro pedido à otimização contínua.",
  postCtaProtocol: "Encontrar Meu Protocolo",
  postCtaMore: "Ler Mais Artigos",
  medicalDisclaimerLabel: "Aviso médico:",
  medicalDisclaimer: "Este artigo é apenas educacional e não constitui aconselhamento médico, diagnóstico ou recomendações de tratamento. Todos os protocolos têm supervisão médica. Estas declarações não foram avaliadas pela FDA. Consulte um profissional de saúde antes de iniciar qualquer protocolo de peptídeos.",
  breadcrumbHome: "Início",
  breadcrumbJournal: "Journal",
`;
    // Insert before "} as const;" of blogEn (first occurrence)
    let i = s.indexOf("} as const;");
    if (i < 0) throw new Error("blogEn end not found");
    s = s.slice(0, i) + enInsert + s.slice(i);
    // Insert before each "} as unknown as typeof blogEn;"
    const marker = "} as unknown as typeof blogEn;";
    const first = s.indexOf(marker);
    const second = s.indexOf(marker, first + 1);
    if (first < 0 || second < 0) throw new Error("blog es/pt end not found");
    s = s.slice(0, first) + esInsert + s.slice(first);
    const second2 = s.indexOf(marker, first + esInsert.length + 1);
    s = s.slice(0, second2) + ptInsert + s.slice(second2);
    fs.writeFileSync(p, s);
    console.log("blog extended");
  } else console.log("blog ok");
}

// ── chat intake ─────────────────────────────────────────────────────
{
  const p = path.join(SRC, "i18n/components/chat.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("intakeBlurb")) {
    const en = `
  intakeBlurb: "To personalise your experience, please share a few details.",
  intakeName: "Your name *",
  intakeEmail: "Email address",
  intakePhone: "Phone number",
  intakeHint: "* Required · Email or phone required",
  intakeNameError: "Please enter your name.",
  intakeContactError: "Please enter an email address or phone number.",
  intakeSubmit: "Start Conversation",
  welcomeNamed: "Hello, {name} — welcome to Auryx. I'm Aria, your personal health concierge.\\n\\nI'm here to answer your questions about precision longevity protocols and peptide therapy, and to help find the right path for you.",
  hoursNote: "\\n\\nOur team is currently outside business hours, but I'm here to help right now. I can also arrange for someone to reach out to you {when} — just let me know how you'd prefer to be contacted.",
`;
    const es = `
  intakeBlurb: "Para personalizar tu experiencia, comparte algunos datos.",
  intakeName: "Tu nombre *",
  intakeEmail: "Correo electrónico",
  intakePhone: "Teléfono",
  intakeHint: "* Obligatorio · Email o teléfono requerido",
  intakeNameError: "Introduce tu nombre.",
  intakeContactError: "Introduce un correo o un teléfono.",
  intakeSubmit: "Iniciar conversación",
  welcomeNamed: "Hola, {name} — bienvenido/a a Auryx. Soy Aria, tu conserje de salud personal.\\n\\nEstoy aquí para responder tus preguntas sobre protocolos de longevidad y terapia con péptidos, y ayudarte a encontrar el camino adecuado.",
  hoursNote: "\\n\\nNuestro equipo está fuera del horario laboral, pero puedo ayudarte ahora. También puedo coordinar que alguien te contacte {when} — dime cómo prefieres que te contactemos.",
`;
    const pt = `
  intakeBlurb: "Para personalizar sua experiência, compartilhe alguns dados.",
  intakeName: "Seu nome *",
  intakeEmail: "E-mail",
  intakePhone: "Telefone",
  intakeHint: "* Obrigatório · E-mail ou telefone necessário",
  intakeNameError: "Informe seu nome.",
  intakeContactError: "Informe um e-mail ou telefone.",
  intakeSubmit: "Iniciar conversa",
  welcomeNamed: "Olá, {name} — bem-vindo(a) à Auryx. Sou Aria, sua concierge de saúde pessoal.\\n\\nEstou aqui para responder perguntas sobre protocolos de longevidade e terapia com peptídeos, e ajudar a encontrar o caminho certo para você.",
  hoursNote: "\\n\\nNossa equipe está fora do horário comercial, mas posso ajudar agora. Também posso combinar que alguém entre em contato {when} — diga como prefere ser contatado.",
`;
    let i = s.indexOf("} as const;");
    s = s.slice(0, i) + en + s.slice(i);
    const marker = "} as unknown as typeof chatEn;";
    const a = s.indexOf(marker);
    s = s.slice(0, a) + es + s.slice(a);
    const b = s.indexOf(marker, a + es.length + 1);
    s = s.slice(0, b) + pt + s.slice(b);
    fs.writeFileSync(p, s);
    console.log("chat extended");
  } else console.log("chat ok");
}

// ── checkout nav/step keys ──────────────────────────────────────────
{
  const p = path.join(SRC, "i18n/pages/checkout.ts");
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("stepDetails")) {
    const en = `,
  "back": "Back",
  "backToShop": "Back to Shop",
  "stepDetails": "Details",
  "stepVerify": "Verify Email",
  "stepPayment": "Payment",
  "emailVerifyHint": "A verification code will be sent to this address before payment.",
  "researchDisclaimer": "Research-grade compounds are sold strictly for legitimate scientific research and are not intended for human consumption.",
  "researchAck": "I acknowledge that research-grade compounds in this order are sold strictly for legitimate research purposes and are not intended for human consumption.",
  "completeOrder": "Complete Order — $\{total}"
`;
    const es = `,
  "back": "Atrás",
  "backToShop": "Volver a la tienda",
  "stepDetails": "Datos",
  "stepVerify": "Verificar email",
  "stepPayment": "Pago",
  "emailVerifyHint": "Se enviará un código de verificación a esta dirección antes del pago.",
  "researchDisclaimer": "Los compuestos de grado investigación se venden estrictamente para investigación científica legítima y no están destinados al consumo humano.",
  "researchAck": "Reconozco que los compuestos de grado investigación de este pedido se venden estrictamente para investigación legítima y no están destinados al consumo humano.",
  "completeOrder": "Completar pedido — $\{total}"
`;
    const pt = `,
  "back": "Voltar",
  "backToShop": "Voltar à loja",
  "stepDetails": "Dados",
  "stepVerify": "Verificar e-mail",
  "stepPayment": "Pagamento",
  "emailVerifyHint": "Um código de verificação será enviado a este endereço antes do pagamento.",
  "researchDisclaimer": "Compostos de grau pesquisa são vendidos estritamente para pesquisa científica legítima e não se destinam ao consumo humano.",
  "researchAck": "Reconheço que os compostos de grau pesquisa neste pedido são vendidos estritamente para pesquisa legítima e não se destinam ao consumo humano.",
  "completeOrder": "Concluir pedido — $\{total}"
`;
    // Find otpResendFailed lines and insert after each
    const re = /"otpResendFailed":\s*"[^"]*"/g;
    const matches = [...s.matchAll(re)];
    if (matches.length !== 3) throw new Error("expected 3 otpResendFailed, got " + matches.length);
    // Insert from end so indexes stay valid
    const inserts = [en, es, pt];
    for (let i = 2; i >= 0; i--) {
      const m = matches[i];
      const at = m.index + m[0].length;
      s = s.slice(0, at) + inserts[i] + s.slice(at);
    }
    fs.writeFileSync(p, s);
    console.log("checkout extended");
  } else console.log("checkout ok");
}

console.log("done extensions");
