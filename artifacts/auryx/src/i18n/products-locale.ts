export type ProductLocaleOverlay = {
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  dosingInfo: string;
  physicianNote?: string;
};

export const productsLocaleEs: Record<string, ProductLocaleOverlay> = {
  tirzepatide: {
    shortDescription: "Agonista dual de receptores GLP-1/GIP investigado en parámetros metabólicos y glucémicos.",
    fullDescription: "La tirzepatida activa de forma simultánea los receptores GLP-1 y GIP, y se investiga por sus efectos sobre parámetros metabólicos y el control glucémico. Los datos de ensayos publicados exploran resultados diferenciales frente a agentes GLP-1 de mecanismo único, incluidos efectos sobre el tejido adiposo visceral y la masa magra.",
    benefits: [
      "Mecanismo de doble receptor estudiado frente a agentes GLP-1 de mecanismo único",
      "Control glucémico superior en pacientes con resistencia a la insulina",
      "Preservación de masa muscular magra durante la pérdida de peso",
      "Reducción de grasa visceral con beneficios cardiovasculares",
    ],
    dosingInfo: "Inyección subcutánea semanal, 2,5 mg titulando hasta 15 mg durante 12–20 semanas. Duración del protocolo: 16–32 semanas. Toda la dosificación bajo supervisión de médicos Auryx.",
  },
  "tirzepatide-b12-glycine": {
    shortDescription: "Protocolo metabólico de triple acción que combina agonismo de doble receptor con apoyo energético mitocondrial y amortiguación glucémica.",
    fullDescription: "Esta formulación propietaria de Auryx combina el agonismo dual GLP-1/GIP de la tirzepatida con metilcobalamina B12 y glicina para crear un protocolo integral de optimización metabólica. La tirzepatida impulsa la reducción de grasa y el control glucémico mediante activación de doble receptor. La metilcobalamina B12 apoya el metabolismo energético mitocondrial, la función neurológica y las vías de metilación críticas para la salud metabólica. La glicina actúa como agente amortiguador del glucagón, apoya la síntesis de colágeno y mejora la sensibilidad a la insulina mediante modulación de AMPK. Juntos, estos tres compuestos abordan la disfunción metabólica desde múltiples ángulos — regulación del apetito, producción de energía, señalización de insulina y reparación tisular —, lo que hace de esta combinación una opción ideal para pacientes que buscan una transformación metabólica máxima.",
    benefits: [
      "Activación dual de receptores GLP-1/GIP para mayor reducción de grasa y control glucémico",
      "Metilcobalamina B12 para metabolismo energético mitocondrial y apoyo neurológico",
      "Glicina para potenciar la sensibilidad a la insulina y amortiguar el glucagón",
      "Enfoque de triple mecanismo que aborda la disfunción metabólica desde múltiples vías",
    ],
    dosingInfo: "Inyección subcutánea semanal de tirzepatida 2,5–15 mg titulada durante 12–20 semanas, coformulada con metilcobalamina B12 (1 mg) y glicina (100 mg) por dosis. Duración del protocolo: 16–32 semanas. Toda la dosificación bajo supervisión de médicos Auryx. Se recomienda panel metabólico basal y niveles de B12 antes del inicio.",
    physicianNote: "La adición de B12 y glicina a la tirzepatida aborda dos carencias frecuentes de la terapia GLP-1: el agotamiento energético y la preservación muscular. La B12 apoya las demandas energéticas mitocondriales del cambio metabólico rápido, mientras que la glicina aporta amortiguación del glucagón que estabiliza la glucemia durante ventanas de ayuno. Recomendamos esta formulación a pacientes con deficiencia documentada de B12, a quienes experimentan fatiga con protocolos GLP-1 estándar, o a quien busque una optimización metabólica máxima más allá de enfoques de mecanismo único.",
  },
  semaglutide: {
    shortDescription: "Pérdida sostenida de grasa y mejor sensibilidad a la insulina.",
    fullDescription: "La semaglutida es un agonista del receptor GLP-1 que suprime el apetito, ralentiza el vaciamiento gástrico y mejora el control glucémico. Ofrece pérdida sostenida de grasa preservando la masa magra, lo que la convierte en el estándar de referencia para la optimización metabólica en pacientes con adiposidad excesiva o resistencia a la insulina.",
    benefits: [
      "Pérdida sostenida de grasa sin comprometer la masa magra",
      "Mejor sensibilidad a la insulina y control glucémico",
      "Reducción de marcadores de riesgo cardiovascular",
      "Regulación del apetito y reducción de antojos",
    ],
    dosingInfo: "Inyección subcutánea semanal, 0,25 mg titulando a 1–2,4 mg durante 4–8 semanas según tolerancia. Duración del protocolo: mínimo 12–24 semanas. Toda la dosificación bajo supervisión de médicos Auryx.",
  },
  retatrutide: {
    shortDescription: "Triple agonista — la frontera de la transformación de la composición corporal.",
    fullDescription: "La retatrutida es un agonista triple de receptores GLP-1/GIP/glucagón que representa la vanguardia de la farmacología metabólica. Al activar tres vías distintas, impulsa una reducción de grasa sin precedentes, acelera la tasa metabólica en reposo y apunta a la adiposidad visceral con precisión inigualable — ideal para pacientes que requieren una intervención metabólica agresiva.",
    benefits: [
      "Reducción de grasa sin precedentes vía activación de triple receptor",
      "Elevación de la tasa metabólica en reposo",
      "Mayor focalización de la grasa visceral",
      "Mejor sensibilidad a la insulina y perfiles lipídicos",
    ],
    dosingInfo: "Inyección subcutánea semanal, 2 mg titulando a 12 mg durante 24 semanas. Duración del protocolo: 24–48 semanas. Requiere panel metabólico completo antes del inicio.",
  },
  "aod-9604": {
    shortDescription: "Fragmento de GH para quema de grasa dirigida sin alterar glucosa ni IGF-1.",
    fullDescription: "AOD-9604 es un fragmento modificado de la molécula de hormona de crecimiento humana (aminoácidos 176–191) que retiene las propiedades lipolíticas de la GH sin elevar el IGF-1 ni afectar la glucemia. Estimula la lipólisis — en particular en depósitos de grasa visceral y abdominal — e inhibe la lipogénesis, lo que lo convierte en el péptido más limpio de focalización de grasa para pacientes que no pueden usar secretagogos de GH completos.",
    benefits: [
      "Lipólisis dirigida sin elevación de IGF-1",
      "Sin impacto en glucemia ni insulina",
      "Reducción de grasa visceral y abdominal",
      "Seguro en pacientes con resistencia a la insulina o diabetes",
    ],
    dosingInfo: "300–600 mcg por inyección subcutánea diaria, idealmente 30 minutos antes del ejercicio o al despertar en ayunas. Duración del protocolo: 12–24 semanas.",
  },
  sermorelin: {
    shortDescription: "Estimulación natural de GH para sueño, recuperación y composición corporal magra.",
    fullDescription: "La sermorelina es un análogo de GHRH que estimula a la hipófisis a producir y liberar hormona de crecimiento de forma natural, preservando los mecanismos de retroalimentación del organismo. Potencia la pulsatilidad de GH durante el sueño profundo, mejorando la calidad del sueño, acelerando la recuperación y apoyando la composición corporal magra — un protocolo de hormona de crecimiento ideal de entrada.",
    benefits: [
      "Estimula la liberación natural y pulsátil de GH",
      "Mejor calidad del sueño profundo y restauración",
      "Mejor composición corporal magra y recuperación",
      "Suave con el sistema endocrino — preserva los bucles de retroalimentación naturales",
    ],
    dosingInfo: "Inyección subcutánea 5 noches por semana antes de dormir, 200–300 mcg por dosis. Duración del protocolo: mínimo 12–24 semanas para beneficio completo.",
    physicianNote: "La sermorelina es nuestro punto de partida recomendado para pacientes nuevos en la optimización de hormona de crecimiento. Su vida media más corta y su mecanismo impulsado por la hipófisis la hacen el secretagogo de GH más seguro y fisiológico disponible.",
  },
  tesamorelin: {
    shortDescription: "Reducción clínicamente demostrada de grasa visceral y elevación de IGF-1.",
    fullDescription: "La tesamorelina es un análogo estabilizado de GHRH con la base de evidencia clínica más sólida de cualquier secretagogo de hormona de crecimiento. Aprobada por la FDA para adiposidad visceral en poblaciones específicas, eleva de forma fiable el IGF-1, reduce la grasa del tronco y mejora marcadores metabólicos. Ideal para pacientes con adiposidad visceral documentada o niveles de IGF-1 en declive.",
    benefits: [
      "Reducción clínicamente demostrada de grasa visceral",
      "Elevación de IGF-1 para reparación tisular y metabolismo",
      "Mejor masa magra y composición corporal",
      "Mayor claridad cognitiva y energía",
    ],
    dosingInfo: "Inyección subcutánea diaria, 1–2 mg antes de dormir. Duración del protocolo: 12–24 semanas. Laboratorios de IGF-1 recomendados en basal y a las 8 semanas.",
    physicianNote: "La tesamorelina cuenta con la base de evidencia más sólida de cualquier secretagogo de GH — sus datos de ensayo clínico sobre reducción de grasa visceral son inequívocos. La recomendamos a pacientes con VAT mensurable o declive documentado de IGF-1.",
  },
  ipamorelin: {
    shortDescription: "Amplificación limpia y selectiva del pulso de GH con sueño y recuperación superiores.",
    fullDescription: "El ipamorelin es un secretagogo de hormona de crecimiento altamente selectivo que estimula la liberación pulsátil de GH con mínimo efecto sobre cortisol o prolactina — el péptido de GH más limpio disponible. Su mecanismo selectivo preserva el bucle natural de retroalimentación de GH, lo que lo hace seguro para ciclos prolongados e ideal para pacientes que priorizan calidad del sueño, recuperación y ganancias de masa magra sin disrupción hormonal.",
    benefits: [
      "Amplificación selectiva del pulso de GH sin pico de cortisol",
      "Mejora del sueño profundo y recuperación nocturna",
      "Apoyo al crecimiento muscular magro y al metabolismo de grasas",
      "Seguro para ciclos a largo plazo — mínima disrupción hormonal",
    ],
    dosingInfo: "200–300 mcg por inyección subcutánea 5 noches por semana, administrado antes de dormir. Puede combinarse con CJC-1295 para amplificar la liberación de GH. Duración del protocolo: 12–24 semanas.",
  },
  "cjc-1295": {
    shortDescription: "Análogo fisiológico de GHRH para liberación pulsátil de hormona de crecimiento.",
    fullDescription: "CJC-1295 sin DAC (Drug Affinity Complex) es un análogo de GHRH con una vida media corta de aproximadamente 30 minutos, que produce una liberación natural y pulsátil de GH que refleja de cerca los patrones de secreción del propio organismo. Es más eficaz cuando se combina con un GHRP como Ipamorelin, amplificando el pulso de GH sin alterar el bucle de retroalimentación natural ni causar niveles hormonales suprafisiológicos.",
    benefits: [
      "Liberación pulsátil natural de GH que preserva los mecanismos de retroalimentación",
      "Mayor amplitud de GH al combinarse con un GHRP",
      "Mejor arquitectura del sueño y recuperación nocturna",
      "Apoyo a la masa magra y optimización de la composición corporal",
    ],
    dosingInfo: "100–200 mcg por inyección subcutánea 5 noches por semana antes de dormir. Más eficaz cuando se coadministra con Ipamorelin. Duración del protocolo: 12–24 semanas.",
    physicianNote: "La formulación sin DAC se prefiere en pacientes que desean el patrón de liberación de GH más fisiológico. Su corta vida media significa que actúa solo durante la ventana de inyección, ideal para imitar los pulsos nocturnos naturales de GH.",
  },
  "cjc-1295-dac": {
    shortDescription: "Análogo de GHRH de liberación prolongada para elevación sostenida de IGF-1 y producción de GH.",
    fullDescription: "CJC-1295 con DAC (Drug Affinity Complex) se une a la albúmina en el torrente sanguíneo, extendiendo su vida media a aproximadamente 6–8 días. Una sola inyección semanal mantiene elevados los niveles de hormona de crecimiento durante la semana — produciendo IGF-1 consistentemente elevado, mejor masa magra y recuperación acelerada. Ideal para pacientes que buscan comodidad y optimización de GH en estado estacionario.",
    benefits: [
      "Dosificación semanal con elevación sostenida de GH",
      "Elevación consistente de IGF-1 para reparación tisular y metabolismo",
      "Apoyo a la acreción de masa magra y recomposición corporal",
      "Mejor calidad de piel, síntesis de colágeno y recuperación",
    ],
    dosingInfo: "1–2 mg por inyección subcutánea una vez por semana. Duración del protocolo: 12–24 semanas. Se recomienda monitorización de IGF-1 a las 8 semanas para guiar el ajuste de dosis.",
    physicianNote: "La formulación con DAC conviene a pacientes que prefieren protocolos semanales y niveles hormonales constantes. Tenga en cuenta que su acción prolongada produce un perfil de GH menos pulsátil — una distinción clínica significativa frente a la versión sin DAC.",
  },
  "cjc-1295-ipamorelin": {
    shortDescription: "Restauración del sueño profundo, músculo magro y antienvejecimiento amplio.",
    fullDescription: "CJC-1295 es un análogo de GHRH que prolonga la vida media de la hormona liberadora de hormona de crecimiento endógena, mientras que Ipamorelin es un secretagogo selectivo de GH que amplifica la amplitud del pulso de GH sin elevar cortisol ni prolactina. Juntos producen una liberación sostenida y fisiológica de GH — restaurando la arquitectura del sueño profundo, acelerando el músculo magro y aportando beneficios antienvejecimiento integrales.",
    benefits: [
      "Restauración del sueño profundo y optimización del ritmo circadiano",
      "Acreción de músculo magro y recomposición corporal",
      "Mejor elasticidad cutánea y síntesis de colágeno",
      "Metabolismo de grasas potenciado sin elevación de cortisol",
      "Antienvejecimiento amplio a nivel celular",
    ],
    dosingInfo: "Inyección subcutánea 5 noches por semana antes de dormir. CJC-1295 (sin DAC) 100–200 mcg + Ipamorelin 100–200 mcg por dosis. Duración del protocolo: mínimo 12–24 semanas.",
    physicianNote: "CJC-1295 + Ipamorelin es nuestro protocolo de hormona de crecimiento de entrada más prescrito. La combinación maximiza la liberación pulsátil de GH manteniendo la seguridad hormonal — evitando los niveles planos y suprafisiológicos de la HGH exógena.",
  },
  "tesamorelin-ipamorelin": {
    shortDescription: "Stack premium: focalización de grasa visceral + amplificación del pulso de GH.",
    fullDescription: "El stack premium de hormona de crecimiento de Auryx combina la focalización de grasa visceral y la potencia clínica de la tesamorelina con la amplificación del pulso de GH y la mejora del sueño del ipamorelin. Esta combinación ofrece transformación integral de la composición corporal, recuperación optimizada y resultados antienvejecimiento superiores.",
    benefits: [
      "Reducción de grasa visceral de doble mecanismo",
      "Pulsatilidad de GH amplificada y elevación de IGF-1",
      "Mayor profundidad del sueño y recuperación",
      "Mejor masa magra y calidad de la piel",
    ],
    dosingInfo: "Tesamorelina 1 mg + Ipamorelin 200 mcg, inyección subcutánea nocturna. Duración del protocolo: 16–24 semanas. Se recomienda monitorización de IGF-1.",
    physicianNote: "Este es nuestro protocolo estrella de GH — la combinación produce efectos sinérgicos que ninguno de los compuestos logra por separado. Lo prescribimos a pacientes que buscan resultados máximos de antienvejecimiento y composición corporal.",
  },
  "bpc-157": {
    shortDescription: "Cicatrización de tendones, articulaciones e intestino con acción antiinflamatoria sistémica.",
    fullDescription: "BPC-157 (Body Protection Compound 157) es un pentadecapéptido derivado de una proteína gástrica que favorece la cicatrización en múltiples tipos de tejido. Acelera la reparación de tendones y ligamentos, resuelve la inflamación articular, restaura la integridad de la mucosa intestinal y apoya la regeneración nerviosa — un componente esencial de cualquier protocolo de recuperación o rehabilitación de lesiones.",
    benefits: [
      "Cicatrización acelerada de tendones y ligamentos",
      "Restauración del revestimiento intestinal y protección mucosa",
      "Resolución de la inflamación articular",
      "Reparación nerviosa y efectos neuroprotectores",
    ],
    dosingInfo: "200–500 mcg por inyección subcutánea o intramuscular, una vez al día cerca del sitio de la lesión. Dosificación oral disponible para aplicaciones intestinales (500–1000 mcg). Duración del protocolo: 4–12 semanas.",
  },
  "tb-500": {
    shortDescription: "Recuperación sistémica de lesiones y reducción rápida de la inflamación.",
    fullDescription: "TB-500 (timosina beta-4) es una proteína de origen natural que regula la actina, impulsa la migración celular hacia sitios de lesión y favorece el crecimiento de nuevos vasos sanguíneos. Ofrece una cicatrización sistémica que BPC-157 no puede replicar — ideal para inflamación generalizada, reparación de tejido cardiovascular y recuperación neurológica tras lesión o cirugía.",
    benefits: [
      "Recuperación sistémica de lesiones y regeneración tisular",
      "Reducción de inflamación y cicatrización",
      "Reparación de tejido cardiovascular",
      "Apoyo a la recuperación neurológica",
    ],
    dosingInfo: "2,5–5 mg por inyección subcutánea dos veces por semana durante 4–6 semanas de carga, luego 2,5 mg semanales de mantenimiento. Duración del protocolo: 8–16 semanas.",
  },
  "bpc-157-tb-500": {
    shortDescription: "Stack integral de reparación tisular dirigido a vías de lesión sistémicas y locales.",
    fullDescription: "Este stack sinérgico combina la cicatrización localizada de tendones, intestino y articulaciones de BPC-157 con la regeneración tisular sistémica y la acción antiinflamatoria de TB-500. Juntos abordan la recuperación de lesiones desde todos los ángulos — la combinación definitiva de reparación para atletas serios, pacientes postquirúrgicos y quienes afrontan lesiones musculoesqueléticas crónicas.",
    benefits: [
      "Cicatrización localizada y sistémica en un solo protocolo",
      "Recuperación acelerada de tendones, ligamentos y articulaciones",
      "Reparación de la mucosa intestinal junto con regeneración sistémica",
      "Plazo de recuperación significativamente reducido",
    ],
    dosingInfo: "BPC-157 200–500 mcg + TB-500 2,5–5 mg por inyección subcutánea, administrados juntos 3–5 veces por semana. Duración del protocolo: 6–12 semanas.",
  },
  kpv: {
    shortDescription: "Antiinflamatorio, cicatrización de heridas y protección de la mucosa intestinal.",
    fullDescription: "KPV es un fragmento tripéptido de la hormona estimulante de melanocitos alfa con potentes propiedades antiinflamatorias, de cicatrización de heridas y de protección intestinal. Modula citocinas inflamatorias, acelera el cierre de heridas, protege la integridad de la mucosa intestinal y restaura la función de barrera cutánea — valioso tanto en condiciones inflamatorias sistémicas como localizadas.",
    benefits: [
      "Potente modulación antiinflamatoria de citocinas",
      "Cicatrización acelerada de heridas y reparación tisular",
      "Protección de la mucosa intestinal y restauración de la barrera",
      "Reparación de la barrera cutánea y control de la inflamación",
    ],
    dosingInfo: "500 mcg–1 mg por inyección subcutánea una vez al día, o cápsula oral 500 mcg–2 mg para aplicaciones intestinales. Duración del protocolo: 4–8 semanas.",
  },
  "ghk-cu": {
    shortDescription: "Péptido de cobre para síntesis de colágeno, reparación de heridas y regeneración tisular.",
    fullDescription: "GHK-Cu (glicil-L-histidil-L-lisina cobre) es un péptido quelante de cobre de origen natural con roles bien documentados en reparación tisular, síntesis de colágeno y elastina, angiogénesis y señalización antiinflamatoria. Activa fibroblastos, acelera la cicatrización de heridas, estimula la actividad de folículos pilosos y ejerce efectos antioxidantes — un péptido fundacional para regeneración cutánea, reparación de tejido conectivo y protocolos de longevidad estética.",
    benefits: [
      "Estimulación de la síntesis de colágeno y elastina",
      "Cicatrización acelerada de heridas y reparación tisular",
      "Activación de folículos pilosos y mejora de la densidad",
      "Señalización antioxidante y antiinflamatoria",
    ],
    dosingInfo: "200–500 mcg por aplicación subcutánea o tópica una vez al día. Para reparación tisular sistémica, se prefiere la inyección subcutánea cerca del área objetivo. Duración del protocolo: 8–16 semanas.",
  },
  "pt-141": {
    shortDescription: "Mayor libido y excitación en hombres y mujeres vía activación central.",
    fullDescription: "PT-141 (bremelanotida) es un agonista de receptores de melanocortina que actúa de forma central — activando directamente las vías hipotalámicas que rigen la libido y la excitación. A diferencia de los inhibidores de PDE5 de acción periférica, PT-141 aborda la raíz neurológica de la función sexual, aportando mayor libido, mejor excitación y mejor función eréctil sin contraindicaciones cardiovasculares.",
    benefits: [
      "Mayor libido en hombres y mujeres",
      "Excitación potenciada vía activación hipotalámica central",
      "Mejor función eréctil",
      "No requiere excitación previa ni estimulación cardiovascular",
    ],
    dosingInfo: "1–2 mg por inyección subcutánea 1–2 horas antes de la actividad, según necesidad. Limitar a 2–3 usos por semana. Titular desde 0,5 mg para valorar la respuesta individual.",
  },
  kisspeptin: {
    shortDescription: "Neuropéptido que modula el eje HPG y la señalización endógena de gonadotropinas.",
    fullDescription: "La kisspeptina es un neuropéptido de origen natural que activa el eje hipotálamo-hipófisis-gónadas (HPG), estimulando la secreción pulsátil de GnRH y la liberación descendente de gonadotropinas. Los investigadores estudian su papel en la señalización hormonal endógena, la función sexual y la regulación del eje HPG como alternativa a intervenciones hormonales exógenas.",
    benefits: [
      "Investigación de activación del eje HPG y señalización de gonadotropinas",
      "Modulación de vías hormonales endógenas",
      "Aplicaciones de investigación en función sexual y libido",
      "Preservación de los mecanismos naturales de retroalimentación hormonal",
    ],
    dosingInfo: "0,3–1 nmol/kg por inyección subcutánea, 2–3 veces por semana. Duración del protocolo: 8–16 semanas. Se recomienda panel hormonal en basal.",
  },
  "thymosin-alpha-1": {
    shortDescription: "Péptido tímico investigado en modulación de células T y señalización del sistema inmune.",
    fullDescription: "La timosina alfa-1 es un péptido tímico estudiado por su papel en la modulación del sistema inmune — incluida la actividad de células T, la función de células natural killer y la presentación de antígenos. Es un área activa de investigación en inmunología, en particular respecto a la señalización inmune y el equilibrio de citocinas.",
    benefits: [
      "Investigación de actividad de células T y NK",
      "Señalización del sistema inmune y modulación de citocinas",
      "Investigación de vías autoinmunes y equilibrio de citocinas",
      "Estudios de regulación inmune con péptido tímico",
    ],
    dosingInfo: "1,6 mg por inyección subcutánea dos veces por semana. Duración del protocolo: 8–16 semanas para optimización inmune; continua para mantenimiento.",
  },
  epithalon: {
    shortDescription: "Preservación de la longitud de telómeros y restauración del ritmo circadiano.",
    fullDescription: "El epitalon (Epitalon) es un tetrapéptido derivado de la glándula pineal que activa la telomerasa, la enzima responsable del mantenimiento de los telómeros. Representa una de las intervenciones biológicas antienvejecimiento más directas disponibles — preservando la integridad cromosómica, potenciando la secreción de melatonina y restaurando el ritmo circadiano a nivel epigenético.",
    benefits: [
      "Activación de telomerasa y preservación de la longitud de telómeros",
      "Mayor producción de melatonina y calidad del sueño",
      "Restauración del ritmo circadiano",
      "Longevidad celular a nivel epigenético",
    ],
    dosingInfo: "5–10 mg por inyección subcutánea una vez al día durante 10–20 días, 1–2 ciclos por año. Preferiblemente por la noche.",
  },
  "mots-c": {
    shortDescription: "Biogénesis mitocondrial y flexibilidad metabólica.",
    fullDescription: "MOTS-c es un péptido de origen mitocondrial que regula la homeostasis metabólica, activa AMPK e impulsa la biogénesis mitocondrial. Mejora la sensibilidad a la insulina, potencia la resistencia física y activa vías de longevidad que se solapan con la restricción calórica — un compuesto fundacional de longevidad a nivel de energía celular.",
    benefits: [
      "Biogénesis mitocondrial y producción de energía",
      "Activación de AMPK y flexibilidad metabólica",
      "Mejor sensibilidad a la insulina y metabolismo de la glucosa",
      "Resistencia física y rendimiento en el ejercicio",
    ],
    dosingInfo: "5–10 mg por inyección subcutánea una vez al día, 3–5 días por semana. Duración del protocolo: 8–12 semanas, repetir 1–2 veces al año.",
  },
  "nad-plus": {
    shortDescription: "Coenzima metabólica investigada en función mitocondrial y actividad de la vía de las sirtuinas.",
    fullDescription: "El NAD+ (nicotinamida adenina dinucleótido) es una coenzima central en el metabolismo energético celular, la actividad enzimática dependiente de NAD y la investigación de la vía de las sirtuinas. Los niveles disminuyen con la edad — los investigadores estudian la suplementación por sus posibles efectos sobre la función mitocondrial, la señalización metabólica y los mecanismos de mantenimiento celular.",
    benefits: [
      "Investigación del metabolismo energético mitocondrial",
      "Actividad de la vía de sirtuinas dependiente de NAD",
      "Estudios de mecanismos de mantenimiento celular",
      "Investigación de reposición de coenzima metabólica",
    ],
    dosingInfo: "250–500 mg en infusión IV durante 2–4 horas, 1–3 veces por semana en fase de carga; 250 mg subcutáneos semanales para mantenimiento. Administrar lentamente para minimizar molestias.",
  },
  glutathione: {
    shortDescription: "Antioxidante maestro para desintoxicación celular, función inmune y reducción del estrés oxidativo.",
    fullDescription: "El glutatión es el antioxidante endógeno más abundante del organismo — un tripéptido (glutamato, cisteína, glicina) que neutraliza especies reactivas de oxígeno, regenera las vitaminas C y E e impulsa la desintoxicación hepática de fase II. Los niveles disminuyen con la edad, la enfermedad crónica y la exposición a toxinas ambientales. La administración IV y subcutánea aporta capacidad antioxidante sistémica que la suplementación oral no iguala, apoyando la resiliencia inmune, la luminosidad de la piel y la protección mitocondrial.",
    benefits: [
      "Reducción sistémica del estrés oxidativo y protección celular",
      "Apoyo a la desintoxicación hepática de fase II",
      "Función inmune potenciada y actividad de células NK",
      "Investigación de aclaramiento cutáneo y regulación de melanina",
    ],
    dosingInfo: "600–1200 mg en bolo IV o infusión IV lenta, 1–3 veces por semana. Dosificación subcutánea 200–400 mg diarios como alternativa. Duración del protocolo: 8–16 semanas.",
  },
  "ss-31": {
    shortDescription: "Antioxidante dirigido a mitocondrias investigado en cardioprotección y energía celular.",
    fullDescription: "SS-31 (elamipretida) es un tetrapéptido dirigido a mitocondrias que se concentra selectivamente en la membrana mitocondrial interna, donde estabiliza la cardiolipina y reduce la producción mitocondrial de especies reactivas de oxígeno. Es uno de los compuestos más investigados en disfunción mitocondrial — con datos publicados sobre insuficiencia cardíaca, isquemia renal, declive mitocondrial relacionado con la edad y condiciones neurodegenerativas.",
    benefits: [
      "Estabilización de la membrana mitocondrial interna vía unión a cardiolipina",
      "Reducción de ROS mitocondriales y optimización bioenergética",
      "Aplicaciones de investigación cardioprotectora y renoprotectora",
      "Investigación del declive mitocondrial relacionado con la edad",
    ],
    dosingInfo: "0,05–0,25 mg/kg por inyección subcutánea una vez al día. Duración del protocolo: 8–16 semanas, con ciclado periódico. Se recomienda monitorización clínica en indicaciones cardiometabólicas.",
  },
  pinealon: {
    shortDescription: "Neuroprotección profunda y optimización circadiana.",
    fullDescription: "Pinealon es un tripéptido de la glándula pineal que atraviesa la barrera hematoencefálica y ejerce efectos neuroprotectores a nivel celular. Reduce el estrés oxidativo en tejido neuronal, optimiza la señalización circadiana y demuestra una marcada preservación cognitiva — especialmente relevante como intervención preventiva frente a la neurodegeneración relacionada con la edad.",
    benefits: [
      "Neuroprotección penetrante de la barrera hematoencefálica",
      "Reducción del estrés oxidativo en tejido neuronal",
      "Optimización de la señalización circadiana",
      "Preservación cognitiva y prevención de la neurodegeneración",
    ],
    dosingInfo: "0,1–0,2 mg/kg por inyección subcutánea, una vez al día durante 10 días por ciclo. Se recomiendan dos ciclos al año.",
  },
  semax: {
    shortDescription: "Mayor neuroplasticidad, enfoque y estabilización del ánimo.",
    fullDescription: "Semax es un análogo sintético de ACTH que eleva el BDNF (factor neurotrófico derivado del cerebro), potencia la neuroplasticidad y afila la función ejecutiva. Mejora la memoria de trabajo, el enfoque y la fluidez verbal a la vez que aporta neuroprotección — desarrollado originalmente para rehabilitación cognitiva, hoy usado para optimización cognitiva de alto rendimiento.",
    benefits: [
      "Elevación de BDNF y neuroplasticidad",
      "Mayor enfoque, memoria de trabajo y fluidez verbal",
      "Neuroprotección y resiliencia cognitiva",
      "Estabilización del ánimo sin sedación",
    ],
    dosingInfo: "100–300 mcg por administración intranasal, 1–2 veces al día. Duración del protocolo: 2–4 semanas on, 2 semanas off.",
  },
  selank: {
    shortDescription: "Reducción de la ansiedad sin deterioro y potenciación de la memoria.",
    fullDescription: "Selank es un análogo sintético del péptido endógeno tuftsina con propiedades ansiolíticas y nootrópicas. Modula los sistemas GABA y serotonina sin causar sedación ni dependencia — aportando reducción limpia de la ansiedad, mejor consolidación de la memoria y estabilización del ánimo adecuada para uso diario.",
    benefits: [
      "Efectos ansiolíticos sin sedación ni dependencia",
      "Mayor consolidación y retención de la memoria",
      "Modulación de serotonina y GABA",
      "Ánimo estable y resiliencia al estrés",
    ],
    dosingInfo: "100–300 mcg por administración intranasal, 1–2 veces al día. Puede ciclarse junto con Semax para un beneficio cognitivo-ansiolítico sinérgico.",
  },
  cerebrolysin: {
    shortDescription: "Complejo de neuropéptidos investigado en supervivencia neuronal, señalización neurotrófica y función cognitiva.",
    fullDescription: "Cerebrolysin es un complejo de neuropéptidos de bajo peso molecular derivado de proteína cerebral porcina que atraviesa la barrera hematoencefálica. Los investigadores estudian su actividad mimética de factores neurotróficos — incluidos posibles efectos sobre la supervivencia neuronal, la plasticidad sináptica y la función cognitiva. Es un área activa de investigación en neurociencia y envejecimiento neurológico.",
    benefits: [
      "Investigación de actividad mimética de factores neurotróficos",
      "Estudios de supervivencia neuronal y plasticidad sináptica",
      "Aplicaciones de investigación en envejecimiento cognitivo y neurodegeneración",
      "Mayor memoria a largo plazo y recuerdo",
    ],
    dosingInfo: "5–30 mL por inyección intravenosa o intramuscular, diaria durante ciclos de 10–20 días. Protocolo diseñado de forma individual según objetivos neurológicos.",
  },
  "glow-complex": {
    shortDescription: "Luminosidad cutánea, regeneración capilar y síntesis de colágeno.",
    fullDescription: "El Auryx GLOW Complex es una mezcla propietaria de péptidos que apunta de forma simultánea a las vías de piel, cabello y tejido conectivo. Impulsa la síntesis de colágeno, estimula la regeneración de folículos pilosos y aporta una mejora mensurable en luminosidad y elasticidad cutánea — un protocolo integral de longevidad estética.",
    benefits: [
      "Mayor luminosidad y elasticidad cutánea",
      "Regeneración de folículos pilosos y densidad",
      "Síntesis acelerada de colágeno y elastina",
      "Rejuvenecimiento estético integral",
    ],
    dosingInfo: "Administrado según protocolo individualizado Auryx. Contacte a nuestro equipo clínico para el calendario de dosificación.",
  },
  "klow-complex": {
    shortDescription: "Reducción de inflamación, potenciación metabólica y energía celular.",
    fullDescription: "El Auryx KLOW Complex es una formulación propietaria multi-péptido dirigida a la inflamación sistémica, la tasa metabólica y la optimización de la energía celular. Combina péptidos antiinflamatorios, metabólicos y mitocondriales en un solo protocolo diseñado para individuos de alto rendimiento que buscan una optimización fisiológica integral.",
    benefits: [
      "Reducción de la inflamación sistémica",
      "Mayor tasa metabólica y termogénesis",
      "Optimización de energía celular y mitocondrial",
      "Potenciación del rendimiento fisiológico multisistémico",
    ],
    dosingInfo: "Administrado según protocolo individualizado Auryx. Contacte a nuestro equipo clínico para el calendario de dosificación.",
  },
  "reconstitution-kit": {
    shortDescription: "Todo lo necesario para reconstituir sus péptidos de forma segura.",
    fullDescription: "Cada kit de reconstitución Auryx incluye lo esencial para la preparación correcta de péptidos: 1x agua bacteriostática (30 ml), 10x toallitas de alcohol y 10x jeringas de insulina (0,5 cc, 31G, 5/16 in, envueltas individualmente). Todos los artículos son de origen estadounidense, estériles y empaquetados individualmente por seguridad y comodidad.",
    benefits: [
      "Agua bacteriostática para reconstitución segura de péptidos",
      "Toallitas de alcohol estériles para preparación del sitio de inyección",
      "Jeringas de insulina de precisión (0,5 cc, 31G) para dosificación exacta",
      "Envueltas individualmente por esterilidad y comodidad",
    ],
    dosingInfo: "Este es un kit de suministros para reconstitución y administración de péptidos. Siga el protocolo de su médico para las proporciones de reconstitución y la técnica de inyección.",
  },
  "test-charge": {
    shortDescription: "Producto interno de prueba administrativa para smoke testing de pagos.",
    fullDescription: "Producto de prueba interno para validación del flujo de pago. No visible en el catálogo de la tienda.",
    benefits: [],
    dosingInfo: "N/A",
  },
};

export const productsLocalePt: Record<string, ProductLocaleOverlay> = {
  tirzepatide: {
    shortDescription:
      "Agonista dual de receptores GLP-1/GIP pesquisado para parâmetros metabólicos e glicêmicos.",
    fullDescription:
      "A tirzepatida ativa simultaneamente os receptores GLP-1 e GIP, e é pesquisada por seus efeitos sobre parâmetros metabólicos e o controle glicêmico. Dados de ensaios publicados investigam desfechos diferenciais em comparação com agentes GLP-1 de mecanismo único, incluindo efeitos sobre o tecido adiposo visceral e a massa magra.",
    benefits: [
      "Mecanismo de duplo receptor estudado vs. agentes GLP-1 de mecanismo único",
      "Controle glicêmico superior para pacientes com resistência à insulina",
      "Preservação da massa muscular magra durante a perda de peso",
      "Redução de gordura visceral com benefícios cardiovasculares",
    ],
    dosingInfo:
      "Injeção subcutânea semanal, 2,5 mg titulando até 15 mg ao longo de 12–20 semanas. Duração do protocolo: 16–32 semanas. Toda a dosagem supervisionada por médicos da Auryx.",
  },
  "tirzepatide-b12-glycine": {
    shortDescription:
      "Protocolo metabólico de ação tripla combinando agonismo de duplo receptor com suporte energético mitocondrial e tamponamento glicêmico.",
    fullDescription:
      "Esta formulação proprietária da Auryx combina o agonismo dual GLP-1/GIP da tirzepatida com metilcobalamina B12 e glicina para criar um protocolo abrangente de otimização metabólica. A tirzepatida impulsiona a redução de gordura e o controle glicêmico por meio da ativação de duplo receptor. A metilcobalamina B12 apoia o metabolismo energético mitocondrial, a função neurológica e as vias de metilação críticas para a saúde metabólica. A glicina atua como agente tamponador do glucagon, apoia a síntese de colágeno e potencializa a sensibilidade à insulina por modulação de AMPK. Juntos, esses três compostos abordam a disfunção metabólica sob múltiplos ângulos — regulação do apetite, produção de energia, sinalização de insulina e reparo tecidual — tornando esta combinação ideal para pacientes que buscam transformação metabólica máxima.",
    benefits: [
      "Ativação dual dos receptores GLP-1/GIP para redução superior de gordura e controle glicêmico",
      "Metilcobalamina B12 para metabolismo energético mitocondrial e suporte neurológico",
      "Glicina para potencializar a sensibilidade à insulina e tamponar o glucagon",
      "Abordagem de triplo mecanismo abordando a disfunção metabólica por múltiplas vias",
    ],
    dosingInfo:
      "Injeção subcutânea semanal de tirzepatida 2,5–15 mg titulada ao longo de 12–20 semanas, coformulada com metilcobalamina B12 (1 mg) e glicina (100 mg) por dose. Duração do protocolo: 16–32 semanas. Toda a dosagem supervisionada por médicos da Auryx. Painel metabólico basal e níveis de B12 recomendados antes do início.",
    physicianNote:
      "A adição de B12 e glicina à tirzepatida aborda duas lacunas comuns na terapia com GLP-1: depleção energética e preservação muscular. A B12 apoia as demandas energéticas mitocondriais da mudança metabólica rápida, enquanto a glicina fornece tamponamento do glucagon que estabiliza a glicemia durante janelas de jejum. Recomendamos esta formulação para pacientes com deficiência documentada de B12, aqueles que experimentam fadiga em protocolos GLP-1 padrão, ou qualquer pessoa que busque otimização metabólica máxima além de abordagens de mecanismo único.",
  },
  semaglutide: {
    shortDescription: "Perda sustentada de gordura e melhora da sensibilidade à insulina.",
    fullDescription:
      "A semaglutida é um agonista do receptor de GLP-1 que suprime o apetite, retarda o esvaziamento gástrico e melhora o controle glicêmico. Proporciona perda sustentada de gordura preservando a massa magra, tornando-se o padrão-ouro para otimização metabólica em pacientes com adiposidade excessiva ou resistência à insulina.",
    benefits: [
      "Perda sustentada de gordura sem comprometer a massa magra",
      "Melhora da sensibilidade à insulina e do controle glicêmico",
      "Redução de marcadores de risco cardiovascular",
      "Regulação do apetite e redução de desejos",
    ],
    dosingInfo:
      "Injeção subcutânea semanal, 0,25 mg titulando a 1–2,4 mg ao longo de 4–8 semanas conforme tolerado. Duração do protocolo: mínimo de 12–24 semanas. Toda a dosagem supervisionada por médicos da Auryx.",
  },
  retatrutide: {
    shortDescription: "Agonismo triplo — a fronteira da transformação da composição corporal.",
    fullDescription:
      "A retatrutida é um agonista triplo dos receptores GLP-1/GIP/glucagon que representa a vanguarda da farmacologia metabólica. Ao ativar três vias distintas, impulsiona redução de gordura sem precedentes, acelera a taxa metabólica de repouso e mira a adiposidade visceral com precisão inigualável — ideal para pacientes que requerem intervenção metabólica agressiva.",
    benefits: [
      "Redução de gordura sem precedentes via ativação de triplo receptor",
      "Elevação da taxa metabólica de repouso",
      "Orientação superior à gordura visceral",
      "Melhora da sensibilidade à insulina e dos perfis lipídicos",
    ],
    dosingInfo:
      "Injeção subcutânea semanal, 2 mg titulando a 12 mg ao longo de 24 semanas. Duração do protocolo: 24–48 semanas. Requer painel metabólico abrangente antes do início.",
  },
  "aod-9604": {
    shortDescription:
      "Fragmento de GH para queima direcionada de gordura sem disrupção de glicose ou IGF-1.",
    fullDescription:
      "AOD-9604 é um fragmento modificado da molécula de hormônio do crescimento humano (aminoácidos 176–191) que retém as propriedades de queima de gordura do GH sem elevar IGF-1 ou afetar a glicemia. Estimula a lipólise — particularmente em depósitos de gordura visceral e abdominal — e inibe a lipogênese, tornando-o o peptídeo de mira à gordura mais limpo disponível para pacientes que não podem usar secretagogos completos de GH.",
    benefits: [
      "Lipólise direcionada sem elevação de IGF-1",
      "Sem impacto na glicemia ou insulina",
      "Redução de gordura visceral e abdominal",
      "Seguro para pacientes com resistência à insulina ou diabetes",
    ],
    dosingInfo:
      "Injeção subcutânea de 300–600 mcg diária, idealmente 30 minutos antes do exercício ou ao acordar em jejum. Duração do protocolo: 12–24 semanas.",
  },
  sermorelin: {
    shortDescription:
      "Estimulação natural de GH para sono, recuperação e composição corporal magra.",
    fullDescription:
      "A sermorrelina é um análogo de GHRH que estimula a hipófise a produzir e liberar hormônio do crescimento naturalmente, preservando os mecanismos próprios de feedback. Potencializa a pulsatilidade de GH durante o sono profundo, melhora a qualidade do sono, acelera a recuperação e apoia a composição corporal magra — tornando-a um protocolo ideal de hormônio do crescimento de nível inicial.",
    benefits: [
      "Estimula a liberação natural e pulsátil de GH",
      "Melhora da qualidade do sono profundo e restauração",
      "Melhor composição corporal magra e recuperação",
      "Suave com o sistema endócrino — preserva os loops naturais de feedback",
    ],
    dosingInfo:
      "Injeção subcutânea 5 noites por semana antes de dormir, 200–300 mcg por dose. Duração do protocolo: mínimo de 12–24 semanas para benefício completo.",
    physicianNote:
      "A sermorrelina é nosso ponto de partida recomendado para pacientes novos na otimização de hormônio do crescimento. Sua meia-vida mais curta e mecanismo hipófise-dirigido a tornam o secretagogo de GH mais seguro e fisiológico disponível.",
  },
  tesamorelin: {
    shortDescription: "Redução clinicamente comprovada de gordura visceral e elevação de IGF-1.",
    fullDescription:
      "A tesamorrelina é um análogo estabilizado de GHRH com a base de evidência clínica mais sólida de qualquer secretagogo de hormônio do crescimento. Aprovada pela FDA para adiposidade visceral em populações específicas, eleva de forma confiável o IGF-1, reduz a gordura do tronco e melhora marcadores metabólicos. Ideal para pacientes com adiposidade visceral documentada ou níveis de IGF-1 em declínio.",
    benefits: [
      "Redução clinicamente comprovada de gordura visceral",
      "Elevação de IGF-1 para reparo tecidual e metabolismo",
      "Melhora da massa magra e da composição corporal",
      "Maior clareza cognitiva e energia",
    ],
    dosingInfo:
      "Injeção subcutânea diária, 1–2 mg antes de dormir. Duração do protocolo: 12–24 semanas. Labs de IGF-1 recomendados na linha de base e em 8 semanas.",
    physicianNote:
      "A tesamorrelina possui a base de evidência mais sólida de qualquer secretagogo de GH — seus dados de ensaios clínicos sobre redução de gordura visceral são inequívocos. Recomendamos para pacientes com VAT mensurável ou declínio documentado de IGF-1.",
  },
  ipamorelin: {
    shortDescription:
      "Amplificação limpa e seletiva do pulso de GH com sono e recuperação superiores.",
    fullDescription:
      "Ipamorelin é um secretagogo de hormônio do crescimento altamente seletivo que estimula a liberação pulsátil de GH com efeito mínimo sobre cortisol ou prolactina — tornando-o o peptídeo de GH mais limpo disponível. Seu mecanismo seletivo preserva o loop natural de feedback de GH, tornando-o seguro para ciclos prolongados e ideal para pacientes que priorizam qualidade do sono, recuperação e ganhos de massa magra sem disrupção hormonal.",
    benefits: [
      "Amplificação seletiva do pulso de GH sem pico de cortisol",
      "Potencialização do sono profundo e recuperação noturna",
      "Suporte ao crescimento muscular magro e metabolismo da gordura",
      "Seguro para ciclos de longo prazo — mínima disrupção hormonal",
    ],
    dosingInfo:
      "Injeção subcutânea de 200–300 mcg 5 noites por semana, administrada antes de dormir. Pode ser empilhada com CJC-1295 para amplificar a liberação de GH. Duração do protocolo: 12–24 semanas.",
  },
  "cjc-1295": {
    shortDescription: "Análogo fisiológico de GHRH para liberação pulsátil de hormônio do crescimento.",
    fullDescription:
      "CJC-1295 sem DAC (Drug Affinity Complex) é um análogo de GHRH com meia-vida curta de aproximadamente 30 minutos, produzindo liberação natural e pulsátil de GH que espelha de perto os padrões próprios de secreção do organismo. É mais eficaz quando pareado com um GHRP como Ipamorelin, amplificando o pulso de GH sem interromper o loop natural de feedback ou causar níveis hormonais suprafisiológicos.",
    benefits: [
      "Liberação pulsátil natural de GH preservando mecanismos de feedback",
      "Maior amplitude de GH quando combinado com um GHRP",
      "Melhor arquitetura do sono e recuperação noturna",
      "Suporte à massa magra e otimização da composição corporal",
    ],
    dosingInfo:
      "Injeção subcutânea de 100–200 mcg 5 noites por semana antes de dormir. Mais eficaz quando coadministrado com Ipamorelin. Duração do protocolo: 12–24 semanas.",
    physicianNote:
      "A formulação sem DAC é preferida para pacientes que desejam o padrão de liberação de GH mais fisiológico. Sua meia-vida curta significa que age apenas durante a janela de injeção, tornando-a ideal para mimetizar os pulsos noturnos naturais de GH.",
  },
  "cjc-1295-dac": {
    shortDescription:
      "Análogo de GHRH de liberação prolongada para elevação sustentada de IGF-1 e produção de GH.",
    fullDescription:
      "CJC-1295 com DAC (Drug Affinity Complex) liga-se à albumina na corrente sanguínea, estendendo sua meia-vida para aproximadamente 6–8 dias. Uma única injeção semanal sustenta níveis elevados de hormônio do crescimento ao longo da semana — produzindo IGF-1 consistentemente elevado, melhor massa magra e recuperação acelerada. Ideal para pacientes que buscam conveniência e otimização de GH em estado estacionário.",
    benefits: [
      "Dosagem semanal com elevação sustentada de GH",
      "Elevação consistente de IGF-1 para reparo tecidual e metabolismo",
      "Acreção de massa magra e suporte à recomposição corporal",
      "Melhor qualidade da pele, síntese de colágeno e recuperação",
    ],
    dosingInfo:
      "Injeção subcutânea de 1–2 mg uma vez por semana. Duração do protocolo: 12–24 semanas. Monitoramento de IGF-1 recomendado em 8 semanas para orientar ajuste de dose.",
    physicianNote:
      "A formulação DAC atende pacientes que preferem protocolos semanais e níveis hormonais consistentes. Observe que sua ação prolongada produz um perfil de GH menos pulsátil — uma distinção clínica significativa em relação à versão sem DAC.",
  },
  "cjc-1295-ipamorelin": {
    shortDescription: "Restauração do sono profundo, músculo magro e anti-envelhecimento amplo.",
    fullDescription:
      "CJC-1295 é um análogo de GHRH que estende a meia-vida do hormônio liberador de hormônio do crescimento endógeno, enquanto Ipamorelin é um secretagogo seletivo de GH que amplifica a amplitude do pulso de GH sem elevar cortisol ou prolactina. Juntos produzem liberação sustentada e fisiológica de GH — restaurando a arquitetura do sono profundo, acelerando o músculo magro e entregando benefícios abrangentes de anti-envelhecimento.",
    benefits: [
      "Restauração do sono profundo e otimização do ritmo circadiano",
      "Acreção de músculo magro e recomposição corporal",
      "Melhor elasticidade da pele e síntese de colágeno",
      "Metabolismo da gordura potencializado sem elevação de cortisol",
      "Anti-envelhecimento amplo no nível celular",
    ],
    dosingInfo:
      "Injeção subcutânea 5 noites por semana antes de dormir. CJC-1295 (sem DAC) 100–200 mcg + Ipamorelin 100–200 mcg por dose. Duração do protocolo: mínimo de 12–24 semanas.",
    physicianNote:
      "CJC-1295 + Ipamorelin é nosso protocolo de hormônio do crescimento de nível inicial mais prescrito. A combinação maximiza a liberação pulsátil de GH mantendo a segurança hormonal — evitando os níveis planos e suprafisiológicos vistos com HGH exógeno.",
  },
  "tesamorelin-ipamorelin": {
    shortDescription: "Stack premium: mira à gordura visceral + amplificação do pulso de GH.",
    fullDescription:
      "O stack premium de hormônio do crescimento da Auryx combina a mira à gordura visceral e a potência clínica da tesamorrelina com a amplificação do pulso de GH e a potencialização do sono do Ipamorelin. Esta combinação entrega transformação abrangente da composição corporal, recuperação otimizada e desfechos superiores de anti-envelhecimento.",
    benefits: [
      "Redução de gordura visceral de duplo mecanismo",
      "Pulsatilidade de GH amplificada e elevação de IGF-1",
      "Maior profundidade do sono e recuperação",
      "Massa magra e qualidade da pele potencializadas",
    ],
    dosingInfo:
      "Tesamorrelina 1 mg + Ipamorelin 200 mcg, injeção subcutânea noturna. Duração do protocolo: 16–24 semanas. Monitoramento de IGF-1 recomendado.",
    physicianNote:
      "Este é nosso protocolo emblemático de GH — a combinação produz efeitos sinérgicos que nenhum dos compostos alcança isoladamente. Prescrevemos para pacientes que buscam resultados máximos de anti-envelhecimento e composição corporal.",
  },
  "bpc-157": {
    shortDescription:
      "Cicatrização de tendões, articulações e intestino com ação anti-inflamatória sistêmica.",
    fullDescription:
      "BPC-157 (Body Protection Compound 157) é um pentadecapeptídeo derivado de uma proteína gástrica que promove cicatrização em múltiplos tipos de tecido. Acelera o reparo de tendões e ligamentos, resolve inflamação articular, restaura a integridade da mucosa intestinal e apoia a regeneração nervosa — tornando-o um componente essencial de qualquer protocolo de recuperação ou reabilitação de lesões.",
    benefits: [
      "Cicatrização acelerada de tendões e ligamentos",
      "Restauração do revestimento intestinal e proteção mucosa",
      "Resolução da inflamação articular",
      "Reparo nervoso e efeitos neuroprotetores",
    ],
    dosingInfo:
      "Injeção subcutânea ou intramuscular de 200–500 mcg, uma vez ao dia perto do local da lesão. Dosagem oral disponível para aplicações intestinais (500–1000 mcg). Duração do protocolo: 4–12 semanas.",
  },
  "tb-500": {
    shortDescription: "Recuperação sistêmica de lesões e redução rápida da inflamação.",
    fullDescription:
      "TB-500 (timosina beta-4) é uma proteína naturalmente ocorrente que regula a actina, impulsiona a migração celular para sítios de lesão e promove o crescimento de novos vasos sanguíneos. Entrega cicatrização sistêmica que o BPC-157 não pode replicar — ideal para inflamação disseminada, reparo de tecido cardiovascular e recuperação neurológica após lesão ou cirurgia.",
    benefits: [
      "Recuperação sistêmica de lesões e regeneração tecidual",
      "Redução da inflamação e da cicatrização",
      "Reparo de tecido cardiovascular",
      "Suporte à recuperação neurológica",
    ],
    dosingInfo:
      "Injeção subcutânea de 2,5–5 mg duas vezes por semana por 4–6 semanas de fase de carga, depois 2,5 mg semanais para manutenção. Duração do protocolo: 8–16 semanas.",
  },
  "bpc-157-tb-500": {
    shortDescription:
      "Stack abrangente de reparo tecidual mirando vias de lesão sistêmicas e locais.",
    fullDescription:
      "Este stack sinérgico combina a cicatrização localizada de tendões, intestino e articulações do BPC-157 com a regeneração tecidual sistêmica e a ação anti-inflamatória do TB-500. Juntos abordam a recuperação de lesões sob todos os ângulos — tornando esta combinação o protocolo definitivo de reparo para atletas sérios, pacientes pós-cirúrgicos e qualquer pessoa lidando com lesão musculoesquelética crônica.",
    benefits: [
      "Cicatrização localizada e sistêmica em um único protocolo",
      "Recuperação acelerada de tendões, ligamentos e articulações",
      "Reparo da mucosa intestinal junto com regeneração sistêmica",
      "Prazo de recuperação significativamente reduzido",
    ],
    dosingInfo:
      "BPC-157 200–500 mcg + TB-500 2,5–5 mg em injeção subcutânea, administrados juntos 3–5 vezes por semana. Duração do protocolo: 6–12 semanas.",
  },
  kpv: {
    shortDescription: "Anti-inflamatório, cicatrização de feridas e proteção da mucosa intestinal.",
    fullDescription:
      "KPV é um fragmento tripeptídeo do hormônio estimulante de melanócitos alfa com potentes propriedades anti-inflamatórias, de cicatrização de feridas e de proteção intestinal. Modula citocinas inflamatórias, acelera o fechamento de feridas, protege a integridade da mucosa intestinal e restaura a função da barreira cutânea — tornando-o valioso tanto para condições inflamatórias sistêmicas quanto localizadas.",
    benefits: [
      "Modulação potente de citocinas anti-inflamatórias",
      "Cicatrização acelerada de feridas e reparo tecidual",
      "Proteção da mucosa intestinal e restauração da barreira",
      "Reparo da barreira cutânea e controle da inflamação",
    ],
    dosingInfo:
      "Injeção subcutânea de 500 mcg–1 mg uma vez ao dia, ou cápsula oral de 500 mcg–2 mg para aplicações intestinais. Duração do protocolo: 4–8 semanas.",
  },
  "ghk-cu": {
    shortDescription:
      "Peptídeo de cobre para síntese de colágeno, reparo de feridas e regeneração tecidual.",
    fullDescription:
      "GHK-Cu (glicil-L-histidil-L-lisina cobre) é um peptídeo de ligação ao cobre naturalmente ocorrente com papéis bem documentados em reparo tecidual, síntese de colágeno e elastina, angiogênese e sinalização anti-inflamatória. Ativa fibroblastos, acelera a cicatrização de feridas, estimula a atividade dos folículos pilosos e exerce efeitos antioxidantes — tornando-o um peptídeo fundamental para regeneração cutânea, reparo de tecido conjuntivo e protocolos de longevidade estética.",
    benefits: [
      "Estimulação da síntese de colágeno e elastina",
      "Cicatrização acelerada de feridas e reparo tecidual",
      "Ativação de folículos pilosos e melhora da densidade",
      "Sinalização antioxidante e anti-inflamatória",
    ],
    dosingInfo:
      "Aplicação subcutânea ou tópica de 200–500 mcg uma vez ao dia. Para reparo tecidual sistêmico, a injeção subcutânea perto da área-alvo é preferida. Duração do protocolo: 8–16 semanas.",
  },
  "pt-141": {
    shortDescription:
      "Aumento da libido e excitação em homens e mulheres via ativação central.",
    fullDescription:
      "PT-141 (bremelanotida) é um agonista de receptores de melanocortina que age centralmente — ativando diretamente as vias hipotalâmicas que governam a libido e a excitação. Diferentemente dos inibidores de PDE5 que agem perifericamente, o PT-141 aborda a raiz neurológica da função sexual, entregando libido aumentada, melhor excitação e melhor função erétil sem contraindicações cardiovasculares.",
    benefits: [
      "Aumento da libido em homens e mulheres",
      "Maior excitação via ativação hipotalâmica central",
      "Melhora da função erétil",
      "Não requer excitação prévia ou estimulação cardiovascular",
    ],
    dosingInfo:
      "Injeção subcutânea de 1–2 mg 1–2 horas antes da atividade, conforme necessário. Limitar a 2–3 usos por semana. Titular a partir de 0,5 mg para avaliar a resposta individual.",
  },
  kisspeptin: {
    shortDescription:
      "Neuropeptídeo que modula o eixo HPG e a sinalização endógena de gonadotrofinas.",
    fullDescription:
      "A kisspeptina é um neuropeptídeo naturalmente ocorrente que ativa o eixo hipotálamo-hipófise-gônadas (HPG), estimulando a secreção pulsátil de GnRH e a liberação descendente de gonadotrofinas. Pesquisadores estudam seu papel na sinalização hormonal endógena, função sexual e regulação do eixo HPG como alternativa a intervenções hormonais exógenas.",
    benefits: [
      "Pesquisa sobre ativação do eixo HPG e sinalização de gonadotrofinas",
      "Modulação de vias hormonais endógenas",
      "Aplicações de pesquisa em função sexual e libido",
      "Preservação dos mecanismos naturais de feedback hormonal",
    ],
    dosingInfo:
      "Injeção subcutânea de 0,3–1 nmol/kg, 2–3 vezes por semana. Duração do protocolo: 8–16 semanas. Painel hormonal recomendado na linha de base.",
  },
  "thymosin-alpha-1": {
    shortDescription:
      "Peptídeo tímico pesquisado para modulação de células T e sinalização do sistema imune.",
    fullDescription:
      "A timosina alfa-1 é um peptídeo tímico estudado por seu papel na modulação do sistema imune — incluindo atividade de células T, função de células natural killer e apresentação de antígenos. É uma área ativa de pesquisa em imunologia, particularmente em relação à sinalização do sistema imune e ao equilíbrio de citocinas.",
    benefits: [
      "Pesquisa sobre atividade de células T e NK",
      "Sinalização do sistema imune e modulação de citocinas",
      "Pesquisa sobre vias autoimunes e equilíbrio de citocinas",
      "Estudos de regulação imune com peptídeo tímico",
    ],
    dosingInfo:
      "Injeção subcutânea de 1,6 mg duas vezes por semana. Duração do protocolo: 8–16 semanas para otimização imune; contínua para manutenção.",
  },
  epithalon: {
    shortDescription: "Preservação do comprimento dos telômeros e restauração do ritmo circadiano.",
    fullDescription:
      "O epitalon (Epitalon) é um tetrapeptídeo derivado da glândula pineal que ativa a telomerase, a enzima responsável pela manutenção dos telômeros. Representa uma das intervenções biológicas de anti-envelhecimento mais diretas disponíveis — preservando a integridade cromossômica, potencializando a secreção de melatonina e restaurando o ritmo circadiano no nível epigenético.",
    benefits: [
      "Ativação da telomerase e preservação do comprimento dos telômeros",
      "Maior produção de melatonina e qualidade do sono",
      "Restauração do ritmo circadiano",
      "Longevidade celular no nível epigenético",
    ],
    dosingInfo:
      "Injeção subcutânea de 5–10 mg uma vez ao dia por 10–20 dias, 1–2 ciclos por ano. Melhor administrado à noite.",
  },
  "mots-c": {
    shortDescription: "Biogênese mitocondrial e flexibilidade metabólica.",
    fullDescription:
      "MOTS-c é um peptídeo de origem mitocondrial que regula a homeostase metabólica, ativa AMPK e impulsiona a biogênese mitocondrial. Melhora a sensibilidade à insulina, potencializa a resistência física e ativa vias de longevidade que se sobrepõem à restrição calórica — tornando-o um composto fundamental de longevidade no nível de energia celular.",
    benefits: [
      "Biogênese mitocondrial e produção de energia",
      "Ativação de AMPK e flexibilidade metabólica",
      "Melhora da sensibilidade à insulina e do metabolismo da glicose",
      "Resistência física e desempenho no exercício",
    ],
    dosingInfo:
      "Injeção subcutânea de 5–10 mg uma vez ao dia, 3–5 dias por semana. Duração do protocolo: 8–12 semanas, repetir 1–2 vezes por ano.",
  },
  "nad-plus": {
    shortDescription:
      "Coenzima metabólica pesquisada para função mitocondrial e atividade da via de sirtuínas.",
    fullDescription:
      "O NAD+ (nicotinamida adenina dinucleotídeo) é uma coenzima central no metabolismo energético celular, na atividade enzimática dependente de NAD e na pesquisa da via de sirtuínas. Os níveis declinam com a idade — pesquisadores estudam a suplementação por seus potenciais efeitos sobre a função mitocondrial, a sinalização metabólica e os mecanismos de manutenção celular.",
    benefits: [
      "Pesquisa sobre metabolismo energético mitocondrial",
      "Atividade da via de sirtuínas dependente de NAD",
      "Estudos de mecanismos de manutenção celular",
      "Pesquisa sobre reposição de coenzima metabólica",
    ],
    dosingInfo:
      "Infusão IV de 250–500 mg ao longo de 2–4 horas, 1–3 vezes por semana durante a fase de carga; 250 mg subcutâneos semanais para manutenção. Administrar lentamente para minimizar desconforto.",
  },
  glutathione: {
    shortDescription:
      "Antioxidante mestre para desintoxicação celular, função imune e redução do estresse oxidativo.",
    fullDescription:
      "A glutationa é o antioxidante endógeno mais abundante do organismo — um tripeptídeo (glutamato, cisteína, glicina) que neutraliza espécies reativas de oxigênio, regenera as vitaminas C e E e impulsiona a desintoxicação hepática de fase II. Os níveis declinam com a idade, doença crônica e exposição a toxinas ambientais. A administração IV e subcutânea entrega capacidade antioxidante sistêmica que a suplementação oral não consegue igualar, apoiando a resiliência imune, a luminosidade da pele e a proteção mitocondrial.",
    benefits: [
      "Redução sistêmica do estresse oxidativo e proteção celular",
      "Suporte à desintoxicação hepática de fase II",
      "Função imune potencializada e atividade de células NK",
      "Pesquisa sobre clareamento da pele e regulação da melanina",
    ],
    dosingInfo:
      "600–1200 mg em bolus IV ou infusão IV lenta, 1–3 vezes por semana. Dosagem subcutânea de 200–400 mg diários como alternativa. Duração do protocolo: 8–16 semanas.",
  },
  "ss-31": {
    shortDescription:
      "Antioxidante direcionado a mitocôndrias pesquisado para cardioproteção e energia celular.",
    fullDescription:
      "SS-31 (elamipretida) é um tetrapeptídeo direcionado a mitocôndrias que se concentra seletivamente na membrana mitocondrial interna, onde estabiliza a cardiolipina e reduz a produção mitocondrial de espécies reativas de oxigênio. É um dos compostos mais pesquisados para disfunção mitocondrial — com dados publicados sobre insuficiência cardíaca, isquemia renal, declínio mitocondrial relacionado à idade e condições neurodegenerativas.",
    benefits: [
      "Estabilização da membrana mitocondrial interna via ligação à cardiolipina",
      "Redução de ROS mitocondriais e otimização da bioenergética",
      "Aplicações de pesquisa cardioprotetora e renoprotetora",
      "Pesquisa sobre declínio mitocondrial relacionado à idade",
    ],
    dosingInfo:
      "Injeção subcutânea de 0,05–0,25 mg/kg uma vez ao dia. Duração do protocolo: 8–16 semanas, com ciclagem periódica. Monitoramento clínico recomendado para indicações cardiometabólicas.",
  },
  pinealon: {
    shortDescription: "Neuroproteção profunda e otimização circadiana.",
    fullDescription:
      "Pinealon é um tripeptídeo da glândula pineal que atravessa a barreira hematoencefálica e exerce efeitos neuroprotetores no nível celular. Reduz o estresse oxidativo no tecido neuronal, otimiza a sinalização circadiana e demonstra marcada preservação cognitiva — particularmente relevante como intervenção preventiva contra a neurodegeneração relacionada à idade.",
    benefits: [
      "Neuroproteção penetrante da barreira hematoencefálica",
      "Redução do estresse oxidativo no tecido neuronal",
      "Otimização da sinalização circadiana",
      "Preservação cognitiva e prevenção da neurodegeneração",
    ],
    dosingInfo:
      "Injeção subcutânea de 0,1–0,2 mg/kg, uma vez ao dia por 10 dias por ciclo. Dois ciclos por ano recomendados.",
  },
  semax: {
    shortDescription: "Neuroplasticidade elevada, foco e estabilização do humor.",
    fullDescription:
      "Semax é um análogo sintético de ACTH que eleva o BDNF (fator neurotrófico derivado do cérebro), potencializa a neuroplasticidade e aguça a função executiva. Melhora a memória de trabalho, o foco e a fluência verbal enquanto fornece neuroproteção — originalmente desenvolvido para reabilitação cognitiva, agora usado para otimização cognitiva de alto desempenho.",
    benefits: [
      "Elevação de BDNF e neuroplasticidade",
      "Maior foco, memória de trabalho e fluência verbal",
      "Neuroproteção e resiliência cognitiva",
      "Estabilização do humor sem sedação",
    ],
    dosingInfo:
      "Administração intranasal de 100–300 mcg, 1–2 vezes ao dia. Duração do protocolo: 2–4 semanas ativo, 2 semanas de pausa.",
  },
  selank: {
    shortDescription: "Redução da ansiedade sem prejuízo e potencialização da memória.",
    fullDescription:
      "Selank é um análogo sintético do peptídeo endógeno tuftsina com propriedades ansiolíticas e nootrópicas. Modula os sistemas GABA e serotonina sem causar sedação ou dependência — entregando redução limpa da ansiedade, melhor consolidação da memória e estabilização do humor adequada para uso diário.",
    benefits: [
      "Efeitos ansiolíticos sem sedação ou dependência",
      "Maior consolidação e retenção da memória",
      "Modulação de serotonina e GABA",
      "Humor estável e resiliência ao estresse",
    ],
    dosingInfo:
      "Administração intranasal de 100–300 mcg, 1–2 vezes ao dia. Pode ser ciclado junto com Semax para benefício cognitivo-ansiolítico sinérgico.",
  },
  cerebrolysin: {
    shortDescription:
      "Complexo de neuropeptídeos pesquisado para sobrevivência neuronal, sinalização neurotrófica e função cognitiva.",
    fullDescription:
      "Cerebrolysin é um complexo de neuropeptídeos de baixo peso molecular derivado de proteína cerebral suína que atravessa a barreira hematoencefálica. Pesquisadores estudam sua atividade mimética de fatores neurotróficos — incluindo potenciais efeitos sobre sobrevivência neuronal, plasticidade sináptica e função cognitiva. É uma área ativa de pesquisa em neurociência e envelhecimento neurológico.",
    benefits: [
      "Pesquisa sobre atividade mimética de fatores neurotróficos",
      "Estudos de sobrevivência neuronal e plasticidade sináptica",
      "Aplicações de pesquisa em envelhecimento cognitivo e neurodegeneração",
      "Memória de longo prazo e recordação potencializadas",
    ],
    dosingInfo:
      "Injeção intravenosa ou intramuscular de 5–30 mL, diária por ciclos de 10–20 dias. Protocolo desenhado individualmente com base em objetivos neurológicos.",
  },
  "glow-complex": {
    shortDescription: "Radiância da pele, regeneração capilar e síntese de colágeno.",
    fullDescription:
      "O GLOW Complex da Auryx é uma mistura proprietária de peptídeos que mira simultaneamente as vias da pele, do cabelo e do tecido conjuntivo. Impulsiona a síntese de colágeno, estimula a regeneração de folículos pilosos e entrega melhoria mensurável na radiância e elasticidade da pele — um protocolo abrangente de longevidade estética.",
    benefits: [
      "Maior radiância e elasticidade da pele",
      "Regeneração de folículos pilosos e densidade",
      "Síntese acelerada de colágeno e elastina",
      "Rejuvenescimento estético abrangente",
    ],
    dosingInfo:
      "Administrado conforme protocolo individualizado da Auryx. Contate nossa equipe clínica para o cronograma de dosagem.",
  },
  "klow-complex": {
    shortDescription: "Redução da inflamação, potencialização metabólica e energia celular.",
    fullDescription:
      "O KLOW Complex da Auryx é uma formulação proprietária multi-peptídeo que mira a inflamação sistêmica, a taxa metabólica e a otimização da energia celular. Combina peptídeos anti-inflamatórios, metabólicos e mitocondriais em um único protocolo projetado para indivíduos de alto desempenho que buscam otimização fisiológica abrangente.",
    benefits: [
      "Redução da inflamação sistêmica",
      "Maior taxa metabólica e termogênese",
      "Otimização da energia celular e mitocondrial",
      "Potencialização do desempenho fisiológico multi-sistema",
    ],
    dosingInfo:
      "Administrado conforme protocolo individualizado da Auryx. Contate nossa equipe clínica para o cronograma de dosagem.",
  },
  "reconstitution-kit": {
    shortDescription: "Tudo o que você precisa para reconstituir seus peptídeos com segurança.",
    fullDescription:
      "Cada kit de reconstituição Auryx inclui todos os essenciais para a preparação adequada de peptídeos: 1x água bacteriostática (30 ml), 10x compressas com álcool e 10x seringas de insulina (0,5 cc, 31G, 5/16 in, embaladas individualmente). Todos os itens são de origem americana, estéreis e embalados individualmente para segurança e conveniência.",
    benefits: [
      "Água bacteriostática para reconstituição segura de peptídeos",
      "Compressas com álcool estéreis para preparação do local de injeção",
      "Seringas de insulina de precisão (0,5 cc, 31G) para dosagem precisa",
      "Embaladas individualmente para esterilidade e conveniência",
    ],
    dosingInfo:
      "Este é um kit de suprimentos para reconstituição e administração de peptídeos. Siga o protocolo do seu médico para as proporções de reconstituição e a técnica de injeção.",
  },
  "test-charge": {
    shortDescription: "Produto interno de teste administrativo para smoke testing de pagamentos.",
    fullDescription: "Produto de teste interno para validação do fluxo de pagamento. Não visível no catálogo da loja.",
    benefits: [],
    dosingInfo: "N/A",
  },
};

export function applyProductLocale<
  T extends {
    slug: string;
    shortDescription: string;
    fullDescription?: string;
    benefits?: string[];
    dosingInfo?: string;
    physicianNote?: string;
    name?: string;
  },
>(product: T, lang: "en" | "es" | "pt"): T {
  if (lang === "en") return product;
  const overlay = (lang === "es" ? productsLocaleEs : productsLocalePt)[product.slug];
  if (!overlay) return product;
  return {
    ...product,
    shortDescription: overlay.shortDescription,
    ...(product.fullDescription !== undefined
      ? { fullDescription: overlay.fullDescription }
      : {}),
    ...(product.benefits !== undefined ? { benefits: overlay.benefits } : {}),
    ...(product.dosingInfo !== undefined ? { dosingInfo: overlay.dosingInfo } : {}),
    ...(overlay.physicianNote !== undefined || product.physicianNote !== undefined
      ? { physicianNote: overlay.physicianNote ?? product.physicianNote }
      : {}),
  };
}
