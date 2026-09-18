import {
  termsPt,
} from "./pages/terms.pt";
import {
  privacyPt,
} from "./pages/privacy.pt";
import {
  contactPt,
  sourcesPt,
  notFoundPt,
  disclaimerPt,
} from "./pages/static.pt";
import {
  aboutPt,
} from "./pages/about.pt";
import {
  shopPt,
} from "./pages/shop.pt";
import {
  cartPt,
} from "./pages/cart.pt";
import {
  ourMethodPt,
} from "./pages/our-method.pt";
import {
  protocolFinderPt,
} from "./pages/protocol-finder.pt";
import {
  verifyCoaPt,
} from "./pages/verify-coa.pt";
import {
  blogPt,
} from "./pages/blog.pt";
import {
  productPt,
} from "./pages/product.pt";
import {
  checkoutPt,
} from "./pages/checkout.pt";
import {
  checkoutSuccessPt,
} from "./pages/checkout-success.pt";
import {
  newYorkPt,
} from "./pages/new-york.pt";
import {
  patientAssessmentPt,
} from "./components/patient-assessment.pt";
import {
  consultationPt,
} from "./components/consultation.pt";
import {
  reconKitPt,
} from "./components/reconstitution-kit.pt";
import {
  protocolContinuationPt,
} from "./components/protocol-continuation.pt";
import {
  chatPt,
} from "./components/chat.pt";
import {
  learnPt,
} from "./pages/learn.pt";

export const dict = {
  nav: {
    shop: "Loja",
    ourMethod: "Nosso Método",
    learn: "Aprenda",
    pepTalk: "Pep Talk",
    protocolFinder: "Encontre seu Protocolo",
    consult: "Consulta",
    bookConsultation: "Agendar Consulta",
    compliance: "Protocolos de Longevidade Orientados por Médicos — Somente para Uso de Bem-Estar",
    openMenu: "Abrir menu de navegação",
    openCart: "Abrir carrinho",
    siteNavigation: "Navegação do site",
    siteNavigationDesc: "Navegue pelo site da Auryx ou agende uma consulta.",
    switchLanguage: "Mudar idioma",
  },
  footer: {
    shop: "Loja",
    ourMethod: "Nosso Método",
    learn: "Aprenda",
    pepTalk: "Pep Talk",
    about: "Sobre",
    verifyCoa: "Verificar COA",
    account: "Conta",
    importantLabel: "Importante:",
    disclaimer:
      "A Auryx é uma prática de telemedicina liderada por médicos. A elegibilidade, a rotulagem e o envio dos produtos seguem as regulamentações aplicáveis dos EUA e podem incluir compostos designados para pesquisa. Nada neste site diagnostica, trata, cura ou previne qualquer doença, e o conteúdo não substitui a orientação médica personalizada de um profissional licenciado.",
    copyright: "© 2026 Auryx. Todos os direitos reservados.",
    contact: "Contato",
    sources: "Fontes",
    privacy: "Privacidade",
    terms: "Termos",
    disclaimerLink: "Aviso Legal",
  },
  ageGate: {
    accessRestricted: "Acesso Restrito",
    mustBe21: "Você precisa ter 21 anos ou mais para acessar este site.",
    heading: "Verificação de Idade",
    headingEm: "Obrigatória",
    licensedUse: "Somente para uso de profissionais de saúde licenciados. Receita médica exigida quando aplicável.",
    enter: "Tenho 21 anos ou mais — Entrar",
    exit: "Tenho menos de 21 — Sair",
    finePrint1: "Ao entrar, você confirma que tem 21+ e concorda com nossos ",
    termsLink: "Termos e Condições",
    finePrint2: ".",
  },
  home: {
    seoTitle: "Auryx | Terapia com Peptídeos Conduzida por Médicos — Em Todos os EUA",
    seoDescription:
      "A Auryx oferece terapia com peptídeos conduzida por médicos em todos os EUA via telemedicina.",
    hero: {
      eyebrow: "Peptídeos de Precisão",
      title1: "Protocolos com respaldo médico.",
      titleEm: "Resultados reais.",
      title2: "Entrega rápida.",
      subtitle:
        "Sinta-se no seu melhor, recupere-se mais rápido e alcance seu desempenho máximo — frete grátis em todos os pedidos.*",
      ctaFind: "Encontre seus Peptídeos",
      ctaExplore: "Explore as Coleções",
      trustLine: "Testado por terceiros · Envio discreto · Acompanhamento concierge",
    },
    collections: {
      eyebrow: "Coleções de Protocolos",
      title1: "Suporte direcionado para",
      titleEm: "cada dimensão",
      title2: "de você.",
      items: [
        { title: "Suporte Metabólico", desc: "Favorece um metabolismo saudável e uma boa composição corporal." },
        { title: "Recuperação e Resiliência", desc: "Otimize a recuperação e construa resiliência de longo prazo." },
        { title: "Pele e Saúde Celular", desc: "Compostos estudados por seus mecanismos celulares e de matriz extracelular relacionados à pele." },
        { title: "Energia e Vitalidade", desc: "Mantenha a energia e a vitalidade diária de corpo e mente." },
        { title: "Neuroproteção", desc: "Compostos estudados por seus mecanismos neuroprotetores e do SNC." },
        { title: "Sono e Restauração", desc: "Sono mais profundo e suporte restaurador todos os dias." },
      ],
    },
    peptides: {
      eyebrow: "Coleção de Peptídeos",
      title1: "Protocolos de peptídeos selecionados",
      title2: "para o seu novo padrão.",
      subtitle:
        "Explore nossa coleção selecionada de peptídeos de grau de pesquisa — agonistas de GLP-1, secretagogos de GH, compostos de recuperação e muito mais.",
      viewAll: "Ver Todos os Peptídeos →",
      exploreAll: "Explorar Todos os Peptídeos →",
      details: "Detalhes →",
      addToCart: "Adicionar ao Carrinho",
      added: "Adicionado ✓",
      items: [
        { desc: "Favorece a reparação de tecidos, a recuperação e a regeneração sistêmica.", tag: "RECUPERAÇÃO" },
        { desc: "Favorece a recuperação e a saúde dos tecidos.", tag: "RECUPERAÇÃO" },
        { desc: "Uma coenzima estudada pelo metabolismo energético celular e pelos mecanismos de reparo do DNA.", tag: "ENERGIA" },
        { desc: "Apoia o hormônio do crescimento e a vitalidade metabólica.", tag: "VITALIDADE" },
      ],
      badges: [
        "Formulações com respaldo científico",
        "Pureza testada por laboratórios independentes",
        "Origem nos EUA, grau farmacêutico",
        "Acompanhamento concierge em cada etapa",
      ],
    },
    finder: {
      eyebrow: "Localizador de Protocolos Concierge",
      title1: "Seu protocolo começa",
      title2: "com o seu",
      titleEm: "ritmo.",
      subtitle:
        "Responda algumas perguntas sobre seus objetivos, estilo de vida e rotina atual. Vamos guiá-lo até a coleção AURYX que melhor combina com suas prioridades.",
      questions: [
        "Qual é o seu objetivo principal?",
        "Como você avalia sua energia?",
        "Como está a qualidade do seu sono?",
        "Qual é o seu nível de experiência?",
      ],
      start: "Iniciar Meu Protocolo",
      takes: "Leva menos de 60 segundos",
    },
    methodology: {
      eyebrow: "A Metodologia AURYX",
      title1: "Precisão por design.",
      title2Em: "Confiança",
      title2: " como padrão.",
      steps: [
        { title: "Mapeamento de Objetivos", desc: "Começamos entendendo suas prioridades específicas de pesquisa — os compostos, mecanismos e vias biológicas de interesse." },
        { title: "Análise do Estilo de Vida", desc: "Seu ritmo diário, padrões de sono, nutrição e atividade indicam quais protocolos de peptídeos podem apoiar melhor seus objetivos." },
        { title: "Escolha do Protocolo", desc: "Alinhamos seu perfil à coleção selecionada da AURYX de protocolos de peptídeos fundamentados em evidências." },
        { title: "Ritmo Contínuo", desc: "Precisão é uma prática. Oferecemos suporte concierge à medida que seu protocolo de pesquisa e seus objetivos evoluem ao longo do tempo." },
      ],
    },
    philosophy: {
      eyebrow: "Viva com Intenção",
      title1: "Precisão é uma ",
      titleEm: "prática",
      title2: ",",
      title3: "não um atalho.",
      body: "Acreditamos em escolhas consistentes, rotinas disciplinadas e um acompanhamento que ajuda você a prosperar no longo prazo.",
      cta: "Nossa Filosofia",
    },
    quality: {
      eyebrow: "Qualidade dos Compostos",
      title1: "Grau de pesquisa.",
      titleEm: "Verificado.",
      cards: [
        { stat: "≥99%", label: "Pureza verificada por análise HPLC de terceiros em cada lote" },
        { stat: "Somente EUA", label: "Obtidos exclusivamente de farmácias de manipulação registradas na FDA nos EUA" },
        { stat: "COA", label: "Certificado de Análise disponível para cada composto que fornecemos" },
      ],
      standard: "— Padrão de Qualidade AURYX",
      researchGrade: "Grau de Pesquisa",
    },
    faq: {
      eyebrow: "Perguntas Frequentes",
      title: "Respostas antes de começar.",
      items: [
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
      ],
    },
    cta: {
      eyebrow: "Pronto para Começar?",
      title1: "Sua melhor versão,",
      titleEm: "com respaldo.",
      body1: "Protocolos guiados. Peptídeos premium.",
      body2: "Personalizados para o seu ritmo.",
      button: "Encontre seus Peptídeos",
    },
  },
  terms: termsPt as any,
  privacy: privacyPt as any,
  contact: contactPt as any,
  sources: sourcesPt as any,
  notFound: notFoundPt as any,
  disclaimer: disclaimerPt as any,
  about: aboutPt as any,
  shop: shopPt as any,
  cart: cartPt as any,
  ourMethod: ourMethodPt as any,
  protocolFinder: protocolFinderPt as any,
  verifyCoa: verifyCoaPt as any,
  blog: blogPt as any,
  product: productPt as any,
  checkout: checkoutPt as any,
  checkoutSuccess: checkoutSuccessPt as any,
  newYork: newYorkPt as any,
  learn: learnPt as any,
  patientAssessment: patientAssessmentPt as any,
  consultation: consultationPt as any,
  protocolContinuation: protocolContinuationPt as any,
  chat: chatPt as any,
  reconKit: reconKitPt as any,
} as import("./translations.en").Dict;
