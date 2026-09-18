import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const en = {
  continue: "Continue",
  skipPreferNot: "Prefer not to share — skip this step",
  analyseProfile: "Analyse My Profile",
  ariaWorking: "Aria is working",
  loadingPhrases: [
    "Analysing your profile…",
    "Matching compounds to your biology…",
    "Calibrating protocol fit…",
  ],
  knowledge: {
    label: "Experience",
    headline: "How familiar are you with peptide therapy?",
    sub: "This helps us tailor the information and guidance we share with you.",
    options: [
      { value: "new", label: "New to peptides", desc: "I've heard about them but don't know much yet." },
      { value: "some", label: "Some knowledge", desc: "I've researched a few peptides and understand the basics." },
      { value: "experienced", label: "Experienced", desc: "I've used peptides before and understand protocols well." },
    ],
  },
  currentPeptides: {
    label: "Current stack",
    headline: "What peptides are you currently using?",
    sub: "Select all that apply. You can add custom compounds below — doses and frequency are optional.",
    customPlaceholder: "Other compounds (e.g. Epithalon 10mg, Kisspeptin 10mcg...)",
    notSpecified: "Not specified",
    preferNot: "Prefer not to say",
  },
  protocolIntent: {
    label: "Intent",
    headline: "What would you like from Auryx?",
    sub: "Given your experience with peptides, what would be most valuable for you right now?",
    options: [
      { value: "changes", label: "I'd like to optimize or change my protocol", desc: "I want to adjust doses, add compounds, cycle differently, or switch something." },
      { value: "questions", label: "I have specific questions", desc: "Mechanism of action, stacking, labs, side effects — I want expert answers." },
      { value: "continue", label: "Continue my exact protocol under Auryx", desc: "I'm happy with my current stack and just want to source it through Auryx." },
      { value: "maintaining", label: "I'm happy with my current protocol", desc: "I'm just exploring what Auryx offers and what's available." },
    ],
  },
  goal: {
    label: "Goals",
    headline: "What are your areas of focus?",
    sub: "Select all that apply. Your protocol can address multiple goals simultaneously.",
    options: [
      { value: "antiaging", label: "Anti-Aging & Longevity", desc: "Slow biological aging, improve cellular health, look and feel younger." },
      { value: "fatloss", label: "Fat Loss & Body Composition", desc: "Metabolic acceleration, weight reduction, lean mass preservation." },
      { value: "sexual", label: "Sexual Health & Vitality", desc: "Libido restoration, performance, hormonal balance." },
      { value: "recovery", label: "Recovery & Regeneration", desc: "Injury healing, post-surgical recovery, tissue repair." },
      { value: "cognitive", label: "Cognitive Performance", desc: "Focus, memory, neuroprotection, mental clarity." },
      { value: "energy", label: "Energy & Vitality", desc: "Eliminate fatigue, optimize mitochondria, sustain peak output." },
      { value: "unsure", label: "Not sure yet", desc: "I'd like guidance on what's most relevant for my situation." },
    ],
  },
  energySleep: {
    label: "Energy & Sleep",
    headline: "How would you describe your current energy and sleep?",
    sub: "Your baseline vitality shapes which protocols will deliver the most meaningful impact.",
    options: [
      { value: "excellent", label: "Consistently strong", desc: "I sleep well, wake rested, and sustain energy throughout the day." },
      { value: "variable", label: "Variable", desc: "Some good days, some bad — energy and sleep quality fluctuate." },
      { value: "low", label: "Often low", desc: "I frequently feel fatigued, struggle with afternoon crashes, or sleep poorly." },
      { value: "poor", label: "Significantly compromised", desc: "Chronic fatigue, poor sleep, and low energy are real ongoing issues for me." },
    ],
  },
  activity: {
    label: "Activity",
    headline: "How active is your lifestyle?",
    sub: "Activity level influences recovery demand, metabolic rate, and which compounds are most clinically relevant.",
    options: [
      { value: "very-active", label: "Very active", desc: "Training 5+ days/week — sport, strength, endurance, or performance-focused." },
      { value: "moderately-active", label: "Moderately active", desc: "Regular movement 3–4x/week. Health-conscious and consistent." },
      { value: "lightly-active", label: "Lightly active", desc: "Occasional exercise. Looking to build or rebuild a more active lifestyle." },
      { value: "sedentary", label: "Mostly sedentary", desc: "Desk-based, limited movement. Health optimization is a new priority." },
    ],
  },
  intent: {
    label: "Next step",
    headline: "What brings you to Auryx today?",
    sub: "There's no wrong answer. This helps us direct you to exactly the right next step.",
    options: [
      { value: "consultation", label: "I want a private consultation", desc: "I'm ready to speak with a physician and get a personalized protocol." },
      { value: "purchase", label: "I'm looking to purchase peptides", desc: "I know what I want and would like to proceed with an order." },
      { value: "learn", label: "I want to learn more first", desc: "I'm gathering information before making any decisions." },
      { value: "browse", label: "Just exploring", desc: "I'm curious about what Auryx offers and how this works." },
    ],
  },
  medical: {
    label: "Safety screen",
    headline: "Please review the following medical history items.",
    sub: "This information is used solely to ensure your safety and guide appropriate protocol design. Select all that apply.",
    options: [
      { value: "hormone-sensitive-cancer", label: "History of hormone-sensitive cancer", desc: "Breast, prostate, ovarian, endometrial, or other hormone-driven cancers." },
      { value: "other-cancer", label: "History of other cancer", desc: "Any malignancy not listed above, past or present." },
      { value: "active-treatment", label: "Currently undergoing cancer treatment", desc: "Chemotherapy, radiation, immunotherapy, or targeted therapy." },
      { value: "cardiovascular", label: "Significant cardiovascular disease", desc: "Heart attack, stroke, heart failure, or serious arrhythmia." },
      { value: "autoimmune", label: "Autoimmune condition", desc: "Lupus, MS, rheumatoid arthritis, IBD, or similar diagnosis." },
      { value: "pregnant", label: "Pregnant or nursing", desc: "Current pregnancy or breastfeeding." },
      { value: "none", label: "None of the above", desc: "I do not have any of the conditions listed." },
    ],
  },
  waiver: {
    title: "Informed Consent & Waiver",
    closeAria: "Close waiver",
    body1:
      "Peptide therapy involves compounds that may not be FDA-approved for all indicated uses. By continuing, you acknowledge that Auryx provides physician-guided protocols for eligible adults and that recommendations are educational until a licensed clinician completes review.",
    body2:
      "You confirm the information you provided is accurate to the best of your knowledge and agree to follow clinical guidance, disclose relevant medical history, and seek emergency care for any serious adverse symptoms.",
    agree: "I have read and agree to the informed consent and waiver.",
    accept: "Accept & Continue",
    cancel: "Cancel",
  },
  medicalResult: {
    title: "Clinical review recommended",
    body: "Based on your responses, we recommend speaking with a physician before starting a protocol. Our team can help determine the safest next step for you.",
    consult: "Book a Consultation",
    reset: "Start Over",
  },
  aiResult: {
    title: "Your recommended protocol",
    subtitle: "Matched to your goals, lifestyle, and safety profile.",
    whyTitle: "Why this fit",
    addToCart: "Add Protocol to Cart",
    consult: "Speak with a Physician",
    continueProtocol: "Continue My Existing Protocol",
    reset: "Retake Assessment",
    shopAll: "Browse Full Collection",
  },
  errorResult: {
    title: "We couldn't complete the match",
    body: "Something went wrong generating your recommendation. You can try again or book a consultation for personalized guidance.",
    reset: "Try Again",
    consult: "Book a Consultation",
  },
};

const es = JSON.parse(JSON.stringify(en));
es.continue = "Continuar";
es.skipPreferNot = "Prefiero no compartir — omitir este paso";
es.analyseProfile = "Analizar Mi Perfil";
es.ariaWorking = "Aria está trabajando";
es.loadingPhrases = ["Analizando tu perfil…", "Emparejando compuestos con tu biología…", "Calibrando el ajuste del protocolo…"];
es.knowledge = { label: "Experiencia", headline: "¿Qué tan familiarizado estás con la terapia de péptidos?", sub: "Esto nos ayuda a adaptar la información y la orientación que compartimos contigo.", options: [
  { value: "new", label: "Nuevo en péptidos", desc: "He oído hablar de ellos pero aún no sé mucho." },
  { value: "some", label: "Algo de conocimiento", desc: "He investigado algunos péptidos y entiendo lo básico." },
  { value: "experienced", label: "Experimentado", desc: "He usado péptidos antes y entiendo bien los protocolos." },
]};
es.currentPeptides = { label: "Stack actual", headline: "¿Qué péptidos estás usando actualmente?", sub: "Selecciona todos los que correspondan. Puedes añadir compuestos personalizados abajo — dosis y frecuencia son opcionales.", customPlaceholder: "Otros compuestos (p. ej. Epitalon 10 mg…)", notSpecified: "No especificado", preferNot: "Prefiero no decir" };
es.protocolIntent = { label: "Intención", headline: "¿Qué te gustaría de Auryx?", sub: "Dada tu experiencia, ¿qué sería más valioso ahora?", options: [
  { value: "changes", label: "Optimizar o cambiar mi protocolo", desc: "Ajustar dosis, añadir compuestos, ciclar distinto o cambiar algo." },
  { value: "questions", label: "Tengo preguntas específicas", desc: "Mecanismo, stacks, labs, efectos — quiero respuestas expertas." },
  { value: "continue", label: "Continuar mi protocolo exacto con Auryx", desc: "Estoy contento con mi stack y solo quiero obtenerlo por Auryx." },
  { value: "maintaining", label: "Estoy contento con mi protocolo actual", desc: "Solo exploro lo que ofrece Auryx." },
]};
es.goal = { label: "Objetivos", headline: "¿Cuáles son tus áreas de enfoque?", sub: "Selecciona todas las que correspondan.", options: [
  { value: "antiaging", label: "Antiaging y longevidad", desc: "Ralentizar el envejecimiento biológico y mejorar la salud celular." },
  { value: "fatloss", label: "Pérdida de grasa y composición", desc: "Aceleración metabólica, reducción de peso, masa magra." },
  { value: "sexual", label: "Salud sexual y vitalidad", desc: "Libido, rendimiento, equilibrio hormonal." },
  { value: "recovery", label: "Recuperación y regeneración", desc: "Lesiones, postquirúrgico, reparación tisular." },
  { value: "cognitive", label: "Rendimiento cognitivo", desc: "Enfoque, memoria, claridad mental." },
  { value: "energy", label: "Energía y vitalidad", desc: "Eliminar fatiga y sostener el rendimiento." },
  { value: "unsure", label: "Aún no estoy seguro", desc: "Quiero orientación sobre lo más relevante." },
]};
es.energySleep = { label: "Energía y sueño", headline: "¿Cómo describirías tu energía y sueño actuales?", sub: "Tu vitalidad basal determina el impacto del protocolo.", options: [
  { value: "excellent", label: "Consistentemente fuerte", desc: "Duermo bien y mantengo energía todo el día." },
  { value: "variable", label: "Variable", desc: "Buenos y malos días — energía y sueño fluctúan." },
  { value: "low", label: "A menudo baja", desc: "Fatiga frecuente, caídas de tarde o mal sueño." },
  { value: "poor", label: "Muy comprometida", desc: "Fatiga crónica y bajo sueño son problemas persistentes." },
]};
es.activity = { label: "Actividad", headline: "¿Qué tan activo es tu estilo de vida?", sub: "Influye en recuperación, metabolismo y compuestos relevantes.", options: [
  { value: "very-active", label: "Muy activo", desc: "Entreno 5+ días/semana." },
  { value: "moderately-active", label: "Moderadamente activo", desc: "Movimiento regular 3–4x/semana." },
  { value: "lightly-active", label: "Ligeramente activo", desc: "Ejercicio ocasional." },
  { value: "sedentary", label: "Mayormente sedentario", desc: "Poco movimiento; la salud es una nueva prioridad." },
]};
es.intent = { label: "Siguiente paso", headline: "¿Qué te trae a Auryx hoy?", sub: "No hay respuesta incorrecta.", options: [
  { value: "consultation", label: "Quiero una consulta privada", desc: "Listo para hablar con un médico." },
  { value: "purchase", label: "Busco comprar péptidos", desc: "Sé lo que quiero y quiero pedir." },
  { value: "learn", label: "Quiero aprender más primero", desc: "Estoy reuniendo información." },
  { value: "browse", label: "Solo explorando", desc: "Curiosidad sobre Auryx." },
]};
es.medical = { label: "Pantalla de seguridad", headline: "Revisa el historial médico.", sub: "Solo para seguridad y diseño del protocolo. Selecciona todo lo aplicable.", options: [
  { value: "hormone-sensitive-cancer", label: "Cáncer sensible a hormonas", desc: "Mama, próstata, ovario, endometrio u otros." },
  { value: "other-cancer", label: "Otro cáncer", desc: "Cualquier malignidad no listada." },
  { value: "active-treatment", label: "Tratamiento oncológico actual", desc: "Quimio, radiación, inmuno o dirigida." },
  { value: "cardiovascular", label: "Enfermedad cardiovascular significativa", desc: "Infarto, ACV, insuficiencia o arritmia grave." },
  { value: "autoimmune", label: "Enfermedad autoinmune", desc: "Lupus, EM, AR, EII o similar." },
  { value: "pregnant", label: "Embarazo o lactancia", desc: "Embarazo actual o lactancia." },
  { value: "none", label: "Ninguna de las anteriores", desc: "No tengo las condiciones listadas." },
]};
es.waiver = { title: "Consentimiento informado y exención", closeAria: "Cerrar", body1: "La terapia con péptidos puede incluir compuestos no aprobados por la FDA para todos los usos. Al continuar, reconoces que Auryx ofrece protocolos guiados por médicos para adultos elegibles y que las recomendaciones son educativas hasta la revisión clínica.", body2: "Confirmas que la información es precisa y aceptas seguir la orientación clínica, revelar historial relevante y buscar atención de emergencia ante síntomas graves.", agree: "He leído y acepto el consentimiento informado y la exención.", accept: "Aceptar y continuar", cancel: "Cancelar" };
es.medicalResult = { title: "Se recomienda revisión clínica", body: "Según tus respuestas, habla con un médico antes de iniciar un protocolo.", consult: "Reservar consulta", reset: "Empezar de nuevo" };
es.aiResult = { title: "Tu protocolo recomendado", subtitle: "Emparejado con tus objetivos, estilo de vida y seguridad.", whyTitle: "Por qué este ajuste", addToCart: "Añadir protocolo al carrito", consult: "Hablar con un médico", continueProtocol: "Continuar mi protocolo existente", reset: "Repetir evaluación", shopAll: "Explorar colección completa" };
es.errorResult = { title: "No pudimos completar el emparejamiento", body: "Algo salió mal. Inténtalo de nuevo o reserva una consulta.", reset: "Intentar de nuevo", consult: "Reservar consulta" };

const pt = JSON.parse(JSON.stringify(en));
pt.continue = "Continuar";
pt.skipPreferNot = "Prefiro não compartilhar — pular esta etapa";
pt.analyseProfile = "Analisar Meu Perfil";
pt.ariaWorking = "Aria está trabalhando";
pt.loadingPhrases = ["Analisando seu perfil…", "Combinando compostos com sua biologia…", "Calibrando o encaixe do protocolo…"];
pt.knowledge = { label: "Experiência", headline: "Quão familiarizado você está com a terapia de peptídeos?", sub: "Isso nos ajuda a adaptar as informações e a orientação.", options: [
  { value: "new", label: "Novo em peptídeos", desc: "Já ouvi falar, mas ainda não sei muito." },
  { value: "some", label: "Algum conhecimento", desc: "Pesquisei alguns peptídeos e entendo o básico." },
  { value: "experienced", label: "Experiente", desc: "Já usei peptídeos e entendo bem os protocolos." },
]};
pt.currentPeptides = { label: "Stack atual", headline: "Quais peptídeos você usa atualmente?", sub: "Selecione todos que se aplicam. Você pode adicionar compostos abaixo.", customPlaceholder: "Outros compostos (ex.: Epitalon 10 mg…)", notSpecified: "Não especificado", preferNot: "Prefiro não dizer" };
pt.protocolIntent = { label: "Intenção", headline: "O que você gostaria da Auryx?", sub: "Dada a sua experiência, o que seria mais valioso agora?", options: [
  { value: "changes", label: "Otimizar ou mudar meu protocolo", desc: "Ajustar doses, adicionar compostos ou trocar algo." },
  { value: "questions", label: "Tenho perguntas específicas", desc: "Mecanismo, stacks, labs, efeitos — quero respostas especialistas." },
  { value: "continue", label: "Continuar meu protocolo exato pela Auryx", desc: "Estou satisfeito e só quero obter pela Auryx." },
  { value: "maintaining", label: "Estou satisfeito com meu protocolo atual", desc: "Só estou explorando a Auryx." },
]};
pt.goal = { label: "Objetivos", headline: "Quais são suas áreas de foco?", sub: "Selecione todas que se aplicam.", options: [
  { value: "antiaging", label: "Antiaging e longevidade", desc: "Desacelerar o envelhecimento e melhorar a saúde celular." },
  { value: "fatloss", label: "Perda de gordura e composição", desc: "Aceleração metabólica, redução de peso, massa magra." },
  { value: "sexual", label: "Saúde sexual e vitalidade", desc: "Libido, desempenho, equilíbrio hormonal." },
  { value: "recovery", label: "Recuperação e regeneração", desc: "Lesões, pós-cirúrgico, reparo tecidual." },
  { value: "cognitive", label: "Desempenho cognitivo", desc: "Foco, memória, clareza mental." },
  { value: "energy", label: "Energia e vitalidade", desc: "Eliminar fadiga e sustentar o desempenho." },
  { value: "unsure", label: "Ainda não tenho certeza", desc: "Quero orientação sobre o mais relevante." },
]};
pt.energySleep = { label: "Energia e sono", headline: "Como você descreveria energia e sono atuais?", sub: "Sua vitalidade basal define o impacto do protocolo.", options: [
  { value: "excellent", label: "Consistentemente forte", desc: "Durmo bem e mantenho energia o dia todo." },
  { value: "variable", label: "Variável", desc: "Bons e maus dias — energia e sono flutuam." },
  { value: "low", label: "Frequentemente baixa", desc: "Fadiga frequente, quedas à tarde ou mau sono." },
  { value: "poor", label: "Muito comprometida", desc: "Fadiga crônica e mau sono são problemas contínuos." },
]};
pt.activity = { label: "Atividade", headline: "Quão ativo é o seu estilo de vida?", sub: "Influencia recuperação, metabolismo e compostos relevantes.", options: [
  { value: "very-active", label: "Muito ativo", desc: "Treino 5+ dias/semana." },
  { value: "moderately-active", label: "Moderadamente ativo", desc: "Movimento regular 3–4x/semana." },
  { value: "lightly-active", label: "Levemente ativo", desc: "Exercício ocasional." },
  { value: "sedentary", label: "Majoritarimente sedentário", desc: "Pouco movimento; saúde é nova prioridade." },
]};
pt.intent = { label: "Próximo passo", headline: "O que te traz à Auryx hoje?", sub: "Não há resposta errada.", options: [
  { value: "consultation", label: "Quero uma consulta particular", desc: "Pronto para falar com um médico." },
  { value: "purchase", label: "Busco comprar peptídeos", desc: "Sei o que quero e quero pedir." },
  { value: "learn", label: "Quero aprender mais primeiro", desc: "Estou reunindo informações." },
  { value: "browse", label: "Só explorando", desc: "Curiosidade sobre a Auryx." },
]};
pt.medical = { label: "Triagem de segurança", headline: "Revise o histórico médico.", sub: "Apenas para segurança e desenho do protocolo. Selecione tudo que se aplica.", options: [
  { value: "hormone-sensitive-cancer", label: "Câncer sensível a hormônios", desc: "Mama, próstata, ovário, endométrio ou outros." },
  { value: "other-cancer", label: "Outro câncer", desc: "Qualquer malignidade não listada." },
  { value: "active-treatment", label: "Tratamento oncológico atual", desc: "Quimio, radiação, imuno ou alvo." },
  { value: "cardiovascular", label: "Doença cardiovascular significativa", desc: "Infarto, AVC, insuficiência ou arritmia grave." },
  { value: "autoimmune", label: "Condição autoimune", desc: "Lúpus, EM, AR, DII ou similar." },
  { value: "pregnant", label: "Gestante ou lactante", desc: "Gravidez atual ou amamentação." },
  { value: "none", label: "Nenhuma das anteriores", desc: "Não tenho as condições listadas." },
]};
pt.waiver = { title: "Consentimento informado e isenção", closeAria: "Fechar", body1: "A terapia com peptídeos pode incluir compostos não aprovados pela FDA para todos os usos. Ao continuar, você reconhece que a Auryx oferece protocolos guiados por médicos para adultos elegíveis e que as recomendações são educativas até a revisão clínica.", body2: "Você confirma que as informações são precisas e concorda em seguir a orientação clínica, revelar histórico relevante e buscar emergência ante sintomas graves.", agree: "Li e concordo com o consentimento informado e a isenção.", accept: "Aceitar e continuar", cancel: "Cancelar" };
pt.medicalResult = { title: "Revisão clínica recomendada", body: "Com base nas respostas, fale com um médico antes de iniciar um protocolo.", consult: "Agendar consulta", reset: "Começar de novo" };
pt.aiResult = { title: "Seu protocolo recomendado", subtitle: "Combinado com objetivos, estilo de vida e segurança.", whyTitle: "Por que este encaixe", addToCart: "Adicionar protocolo ao carrinho", consult: "Falar com um médico", continueProtocol: "Continuar meu protocolo existente", reset: "Refazer avaliação", shopAll: "Explorar coleção completa" };
pt.errorResult = { title: "Não foi possível concluir a combinação", body: "Algo deu errado. Tente novamente ou agende uma consulta.", reset: "Tentar novamente", consult: "Agendar consulta" };

const out = `export const patientAssessmentEn = ${JSON.stringify(en, null, 2)} as const;

export const patientAssessmentEs = ${JSON.stringify(es, null, 2)} as unknown as typeof patientAssessmentEn;

export const patientAssessmentPt = ${JSON.stringify(pt, null, 2)} as unknown as typeof patientAssessmentEn;
`;
fs.writeFileSync(path.join(root, "src/i18n/components/patient-assessment.ts"), out);
console.log("patient-assessment rewritten");
