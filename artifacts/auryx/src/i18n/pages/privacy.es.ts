export const privacyEs = {
  seoTitle: "Política de Privacidad | Auryx",
  seoDescription:
    "Política de Privacidad de Auryx. Sepa cómo recopilamos, usamos y protegemos su información personal al utilizar auryxlife.com.",
  eyebrow: "Legal",
  title: "Política de Privacidad",
  effectiveDate: "Fecha de vigencia: 16 de mayo de 2026",
  intro: {
    title: "1. Introducción",
    body: 'AURYX LLC ("Auryx," "nosotros," "nos" o "nuestro") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestro sitio web en auryxlife.com o nuestros servicios de telemedicina.',
  },
  collect: {
    title: "2. Información que recopilamos",
    lead: "Recopilamos los siguientes tipos de información:",
    items: [
      { label: "Identificadores personales:", text: "Nombre, dirección de correo electrónico, número de teléfono" },
      {
        label: "Información de salud:",
        text: "Historial médico, medicamentos actuales, objetivos de salud y respuestas de evaluación proporcionadas durante nuestro proceso de admisión",
      },
      {
        label: "Información de pago:",
        text: "Datos de transacciones procesados a través de nuestros socios de pago (no almacenamos los datos completos de la tarjeta de pago)",
      },
      {
        label: "Datos de uso:",
        text: "Dirección IP, tipo de navegador, páginas visitadas y datos de interacción recopilados mediante herramientas de analítica",
      },
    ],
  },
  use: {
    title: "3. Cómo usamos su información",
    lead: "Usamos su información para:",
    items: [
      "Procesar solicitudes de consulta y protocolo",
      "Facilitar la revisión y aprobación médica de su protocolo",
      "Comunicarnos con usted sobre su atención",
      "Enviar notificaciones administrativas y operativas",
      "Mejorar nuestros servicios y sitio web",
      "Cumplir obligaciones legales y regulatorias",
    ],
  },
  hipaa: {
    title: "4. Información de salud y HIPAA",
    body: "La información de salud que proporciona durante nuestro proceso de admisión se trata como sensible y confidencial. Implementamos salvaguardas administrativas, técnicas y físicas para proteger su información de salud de acuerdo con la ley aplicable. No vendemos su información de salud a terceros.",
  },
  sharing: {
    title: "5. Compartir información",
    lead: "No vendemos su información personal. Podemos compartir su información con:",
    items: [
      "Médicos con licencia y personal médico involucrado en su atención",
      "Farmacias de manipulación registradas ante la FDA que cumplen su receta",
      "Procesadores de pago que facilitan su transacción",
      "Proveedores de servicios tecnológicos que operan nuestra plataforma bajo acuerdos de confidencialidad",
      "Autoridades policiales o regulatorias cuando lo exija la ley",
    ],
  },
  retention: {
    title: "6. Conservación de datos",
    body: "Conservamos su información personal y de salud el tiempo necesario para prestar servicios y cumplir obligaciones legales, normalmente un mínimo de 7 años para historiales médicos de acuerdo con la ley de Florida.",
  },
  rights: {
    title: "7. Sus derechos",
    lead: "Usted tiene derecho a:",
    items: [
      "Acceder a la información personal que tenemos sobre usted",
      "Solicitar la corrección de información inexacta",
      "Solicitar la eliminación de su información, sujeto a requisitos legales de conservación",
      "Darse de baja de las comunicaciones de marketing en cualquier momento",
    ],
    contact: "Para ejercer estos derechos, contáctenos en info@auryxlife.com.",
    contactEmail: true,
  },
  cookies: {
    title: "8. Cookies y analítica",
    body: "Nuestro Sitio utiliza cookies y herramientas de analítica para entender cómo los visitantes interactúan con nuestro contenido. Puede desactivar las cookies en la configuración de su navegador, aunque algunas funciones pueden no operar correctamente.",
  },
  thirdParty: {
    title: "9. Enlaces de terceros",
    body: "Nuestro Sitio puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad de esos sitios y le recomendamos revisar sus políticas.",
  },
  children: {
    title: "10. Privacidad de menores",
    body: "Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos deliberadamente información personal de menores.",
  },
  changes: {
    title: "11. Cambios a esta política",
    body: "Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cambios materiales publicando la política actualizada en nuestro Sitio con una nueva fecha de vigencia.",
  },
  contact: {
    title: "12. Contacto",
    body: "Para preguntas o solicitudes relacionadas con la privacidad, contáctenos en info@auryxlife.com.",
    contactEmail: true,
  },
} as const;
