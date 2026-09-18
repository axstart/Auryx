import {
  termsEs,
} from "./pages/terms.es";
import {
  privacyEs,
} from "./pages/privacy.es";
import {
  contactEs,
  sourcesEs,
  notFoundEs,
  disclaimerEs,
} from "./pages/static.es";
import {
  aboutEs,
} from "./pages/about.es";
import {
  shopEs,
} from "./pages/shop.es";
import {
  cartEs,
} from "./pages/cart.es";
import {
  ourMethodEs,
} from "./pages/our-method.es";
import {
  protocolFinderEs,
} from "./pages/protocol-finder.es";
import {
  verifyCoaEs,
} from "./pages/verify-coa.es";
import {
  blogEs,
} from "./pages/blog.es";
import {
  productEs,
} from "./pages/product.es";
import {
  checkoutEs,
} from "./pages/checkout.es";
import {
  checkoutSuccessEs,
} from "./pages/checkout-success.es";
import {
  newYorkEs,
} from "./pages/new-york.es";
import {
  patientAssessmentEs,
} from "./components/patient-assessment.es";
import {
  consultationEs,
} from "./components/consultation.es";
import {
  reconKitEs,
} from "./components/reconstitution-kit.es";
import {
  protocolContinuationEs,
} from "./components/protocol-continuation.es";
import {
  chatEs,
} from "./components/chat.es";
import {
  learnEs,
} from "./pages/learn.es";

export const dict = {
  nav: {
    shop: "Tienda",
    ourMethod: "Nuestro Método",
    learn: "Aprende",
    pepTalk: "Pep Talk",
    protocolFinder: "Encuentra tu Protocolo",
    consult: "Consulta",
    bookConsultation: "Reservar Consulta",
    compliance: "Protocolos de Longevidad Guiados por Médicos — Solo para Uso de Bienestar",
    openMenu: "Abrir menú de navegación",
    openCart: "Abrir carrito",
    siteNavigation: "Navegación del sitio",
    siteNavigationDesc: "Navega por el sitio de Auryx o reserva una consulta.",
    switchLanguage: "Cambiar idioma",
  },
  footer: {
    shop: "Tienda",
    ourMethod: "Nuestro Método",
    learn: "Aprende",
    pepTalk: "Pep Talk",
    about: "Acerca de",
    verifyCoa: "Verificar COA",
    account: "Cuenta",
    importantLabel: "Importante:",
    disclaimer:
      "Auryx es una práctica de telemedicina dirigida por médicos. La elegibilidad, el etiquetado y el despacho de los productos siguen las regulaciones aplicables de EE. UU. y pueden incluir compuestos designados para investigación. Nada en este sitio web diagnostica, trata, cura ni previene ninguna enfermedad, y el contenido no reemplaza el consejo médico personalizado de un profesional acreditado.",
    copyright: "© 2026 Auryx. Todos los derechos reservados.",
    contact: "Contacto",
    sources: "Fuentes",
    privacy: "Privacidad",
    terms: "Términos",
    disclaimerLink: "Aviso Legal",
  },
  ageGate: {
    accessRestricted: "Acceso Restringido",
    mustBe21: "Debes tener 21 años o más para acceder a este sitio.",
    heading: "Verificación de Edad",
    headingEm: "Requerida",
    licensedUse: "Solo para uso de profesionales de la salud autorizados. Se requiere receta médica cuando corresponda.",
    enter: "Tengo 21 años o más — Entrar",
    exit: "Soy menor de 21 — Salir",
    finePrint1: "Al entrar confirmas que tienes 21+ y aceptas nuestros ",
    termsLink: "Términos y Condiciones",
    finePrint2: ".",
  },
  home: {
    seoTitle: "Auryx | Terapia con Péptidos Dirigida por Médicos — En Todo EE. UU.",
    seoDescription:
      "Auryx ofrece terapia con péptidos dirigida por médicos en todo EE. UU. mediante telemedicina.",
    hero: {
      eyebrow: "Péptidos de Precisión",
      title1: "Protocolos respaldados por médicos.",
      titleEm: "Resultados reales.",
      title2: "Entrega rápida.",
      subtitle:
        "Siéntete en tu mejor momento, recupérate más rápido y rinde al máximo — envío gratis en cada pedido.*",
      ctaFind: "Encuentra tus Péptidos",
      ctaExplore: "Explora las Colecciones",
      trustLine: "Verificado por terceros · Envío discreto · Acompañamiento personalizado",
    },
    collections: {
      eyebrow: "Colecciones de Protocolos",
      title1: "Apoyo dirigido para",
      titleEm: "cada dimensión",
      title2: "de ti.",
      items: [
        { title: "Apoyo Metabólico", desc: "Favorece un metabolismo saludable y una mejor composición corporal." },
        { title: "Recuperación y Resiliencia", desc: "Optimiza la recuperación y construye resiliencia a largo plazo." },
        { title: "Piel y Salud Celular", desc: "Compuestos estudiados por sus mecanismos celulares y de matriz extracelular relacionados con la piel." },
        { title: "Energía y Vitalidad", desc: "Mantén tu energía y la vitalidad diaria de cuerpo y mente." },
        { title: "Neuroprotección", desc: "Compuestos estudiados por sus mecanismos neuroprotectores y del SNC." },
        { title: "Sueño y Restauración", desc: "Sueño más profundo y apoyo restaurador cada día." },
      ],
    },
    peptides: {
      eyebrow: "Colección de Péptidos",
      title1: "Protocolos de péptidos seleccionados",
      title2: "para tu nuevo estándar.",
      subtitle:
        "Explora nuestra colección seleccionada de péptidos de grado de investigación — agonistas GLP-1, secretagogos de GH, compuestos de recuperación y más.",
      viewAll: "Ver Todos los Péptidos →",
      exploreAll: "Explorar Todos los Péptidos →",
      details: "Detalles →",
      addToCart: "Agregar al Carrito",
      added: "Agregado ✓",
      items: [
        { desc: "Favorece la reparación de tejidos, la recuperación y la regeneración sistémica.", tag: "RECUPERACIÓN" },
        { desc: "Favorece la recuperación y la salud de los tejidos.", tag: "RECUPERACIÓN" },
        { desc: "Una coenzima estudiada por el metabolismo energético celular y los mecanismos de reparación del ADN.", tag: "ENERGÍA" },
        { desc: "Apoya la hormona del crecimiento y la vitalidad metabólica.", tag: "VITALIDAD" },
      ],
      badges: [
        "Formulaciones respaldadas por la ciencia",
        "Pureza verificada por laboratorios independientes",
        "Origen estadounidense, grado farmacéutico",
        "Acompañamiento personalizado en cada paso",
      ],
    },
    finder: {
      eyebrow: "Buscador de Protocolos Concierge",
      title1: "Tu protocolo comienza",
      title2: "con tu",
      titleEm: "ritmo.",
      subtitle:
        "Responde algunas preguntas sobre tus objetivos, estilo de vida y rutina actual. Te guiaremos hacia la colección AURYX que mejor se ajuste a tus prioridades.",
      questions: [
        "¿Cuál es tu objetivo principal?",
        "¿Cómo calificarías tu energía?",
        "¿Cómo es la calidad de tu sueño?",
        "¿Cuál es tu nivel de experiencia?",
      ],
      start: "Comenzar Mi Protocolo",
      takes: "Toma menos de 60 segundos",
    },
    methodology: {
      eyebrow: "La Metodología AURYX",
      title1: "Precisión por diseño.",
      title2Em: "Confianza",
      title2: " como estándar.",
      steps: [
        { title: "Mapeo de Objetivos", desc: "Comenzamos por entender tus prioridades específicas de investigación: los compuestos, mecanismos y vías biológicas de interés." },
        { title: "Revisión de Estilo de Vida", desc: "Tu ritmo diario, patrones de sueño, nutrición y actividad determinan qué protocolos de péptidos pueden apoyar mejor tus objetivos." },
        { title: "Selección de Protocolo", desc: "Alineamos tu perfil con la colección seleccionada de AURYX de protocolos de péptidos basados en evidencia." },
        { title: "Ritmo Continuo", desc: "La precisión es una práctica. Ofrecemos apoyo personalizado a medida que tu protocolo de investigación y tus objetivos evolucionan con el tiempo." },
      ],
    },
    philosophy: {
      eyebrow: "Vive con Intención",
      title1: "La precisión es una ",
      titleEm: "práctica",
      title2: ",",
      title3: "no un atajo.",
      body: "Creemos en decisiones consistentes, rutinas disciplinadas y un acompañamiento que te ayuda a prosperar a largo plazo.",
      cta: "Nuestra Filosofía",
    },
    quality: {
      eyebrow: "Calidad de los Compuestos",
      title1: "Grado de investigación.",
      titleEm: "Verificado.",
      cards: [
        { stat: "≥99%", label: "Pureza verificada mediante análisis HPLC de terceros en cada lote" },
        { stat: "Solo EE. UU.", label: "Obtenidos exclusivamente de instalaciones de preparación magistral registradas ante la FDA en EE. UU." },
        { stat: "COA", label: "Certificado de Análisis disponible para cada compuesto que suministramos" },
      ],
      standard: "— Estándar de Calidad AURYX",
      researchGrade: "Grado de Investigación",
    },
    faq: {
      eyebrow: "Preguntas Frecuentes",
      title: "Respuestas antes de comenzar.",
      items: [
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
      ],
    },
    cta: {
      eyebrow: "¿Listo para Comenzar?",
      title1: "Tu mejor versión,",
      titleEm: "respaldada.",
      body1: "Protocolos guiados. Péptidos premium.",
      body2: "Personalizados para tu ritmo.",
      button: "Encuentra tus Péptidos",
    },
  },
  terms: termsEs as any,
  privacy: privacyEs as any,
  contact: contactEs as any,
  sources: sourcesEs as any,
  notFound: notFoundEs as any,
  disclaimer: disclaimerEs as any,
  about: aboutEs as any,
  shop: shopEs as any,
  cart: cartEs as any,
  ourMethod: ourMethodEs as any,
  protocolFinder: protocolFinderEs as any,
  verifyCoa: verifyCoaEs as any,
  blog: blogEs as any,
  product: productEs as any,
  checkout: checkoutEs as any,
  checkoutSuccess: checkoutSuccessEs as any,
  newYork: newYorkEs as any,
  learn: learnEs as any,
  patientAssessment: patientAssessmentEs as any,
  consultation: consultationEs as any,
  protocolContinuation: protocolContinuationEs as any,
  chat: chatEs as any,
  reconKit: reconKitEs as any,
} as import("./translations.en").Dict;
