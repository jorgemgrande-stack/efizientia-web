/**
 * Efizientia · Datos del equipo humano (asesores reales)
 * Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
 * Basado en el equipo real de efizientia.es/humanos/
 */

const CDN = "/images"; // avatares locales en /public/images/

export const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

export const WHATSAPP_BASE = "https://wa.me/34856288341";
export const PHONE = "tel:+34856288341";
export const EMAIL = "mailto:hola@efizientia.es";

export interface HumanoData {
  slug: string;
  name: string;
  fullName: string;
  role: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  status: "online" | "busy" | "offline";
  schedule: string;
  stats: { value: string; label: string }[];
  services: string[];
  testimonials: { text: string; author: string; detail: string }[];
  process: string[];
  topCompanies: { pos: number; name: string; color: string }[];
  whatsappMsg: string;
}

export const HUMANOS: HumanoData[] = [
  {
    slug: "manuel-reyes",
    name: "Manuel Reyes",
    fullName: "Manuel Reyes",
    role: "Asesor Senior · Luz & Gas",
    tagline: "El que lleva más facturas analizadas y menos pelos en la lengua.",
    description:
      "Manuel lleva más de 8 años en el sector energético. Empezó en una comercializadora grande, vio cómo funcionaba el sistema por dentro, y decidió pasarse al lado correcto. Ahora usa ese conocimiento para que sus clientes no paguen ni un céntimo de más. Especialista en hogares, pymes y comunidades de vecinos.",
    image: `${CDN}/avatar-manuel.jpg`,
    tags: ["Luz", "Gas", "Hogar", "Pyme"],
    status: "online",
    schedule: "08:00–20:00 (L–V)",
    stats: [
      { value: "+1.400", label: "Facturas optimizadas" },
      { value: "12 min", label: "Respuesta media" },
      { value: "22–38%", label: "Ahorro medio" },
    ],
    services: [
      "Optimización de potencia (P1–P6)",
      "Tarifa óptima Hogar & PyME",
      "Compensación de excedentes solar",
      "Altas, cambios de titular y SEPA",
      "Gas: RL, lecturas y regularizaciones",
      "Auditoría de facturas y penalizaciones",
    ],
    testimonials: [
      { text: "Bajó mi factura un 34% sin cambiar hábitos. Impecable.", author: "Patricia G.", detail: "Vivienda 4,6 kW · Sevilla" },
      { text: "En 24h tenía oferta firmada y potencias ajustadas.", author: "Óscar M.", detail: "Tienda de barrio · Cádiz" },
      { text: "Detectó un error de lectura que nadie veía desde hacía 2 años.", author: "Laura C.", detail: "Comunidad de vecinos · Jerez" },
    ],
    process: [
      "Sube tu factura o déjame tus datos.",
      "Analizo patrón de consumo y potencias.",
      "Te envío la mejor tarifa y el ahorro estimado.",
      "Cerramos el cambio con firma SEPA en minutos.",
    ],
    topCompanies: [
      { pos: 1, name: "Audax", color: "#e91e8c" },
      { pos: 2, name: "Repsol Energía", color: "#ff6b35" },
      { pos: 3, name: "Naturgy", color: "#39d353" },
      { pos: 4, name: "Iberdrola", color: "#3b82f6" },
      { pos: 5, name: "Holaluz", color: "#a855f7" },
      { pos: 6, name: "TotalEnergies", color: "#f59e0b" },
      { pos: 7, name: "Candela Energía", color: "#ec4899" },
      { pos: 8, name: "Lucera", color: "#06b6d4" },
      { pos: 9, name: "Factor Energía", color: "#84cc16" },
      { pos: 10, name: "Gana Energía", color: "#f97316" },
    ],
    whatsappMsg: "Hola Manuel, me gustaría que me ayudaras a optimizar mi factura de luz/gas.",
  },
  {
    slug: "faustino-lobato",
    name: "Faustino Lobato",
    fullName: "Faustino Lobato",
    role: "Especialista · Gas & Pyme",
    tagline: "El que traduce m³ a euros y te dice exactamente cuánto te están robando.",
    description:
      "Faustino es el especialista en gas del equipo. Domina la conversión m³→kWh, los peajes RL y las regularizaciones como nadie. También lleva la cartera de pymes: sabe que una empresa pequeña puede ahorrar más que un hogar grande si se optimiza bien la potencia y la discriminación horaria.",
    image: `${CDN}/avatar-faustino.jpg`,
    tags: ["Gas", "Pyme", "Optimización", "RL"],
    status: "online",
    schedule: "08:00–20:00 (L–V)",
    stats: [
      { value: "+1.200", label: "Facturas optimizadas" },
      { value: "12 min", label: "Respuesta media" },
      { value: "22–38%", label: "Ahorro medio" },
    ],
    services: [
      "Optimización de potencia (P1–P6)",
      "Tarifa óptima Hogar & PyME",
      "Compensación de excedentes",
      "Altas, cambios de titular y SEPA",
      "Gas: RL, lecturas y regularizaciones",
      "Auditoría de facturas y penalizaciones",
    ],
    testimonials: [
      { text: "Bajó mi factura un 31% sin cambiar hábitos. Impecable.", author: "Patricia G.", detail: "Vivienda 4,6 kW · Cádiz" },
      { text: "En 24h tenía oferta firmada y potencias ajustadas.", author: "Óscar M.", detail: "Tienda de barrio · Jerez" },
      { text: "Detectó un error de lectura que nadie veía.", author: "Laura C.", detail: "Comunidad · Sanlúcar" },
    ],
    process: [
      "Sube tu factura o déjame tus datos.",
      "Analizo patrón de consumo y potencias.",
      "Te envío la mejor tarifa y el ahorro estimado.",
      "Cerramos el cambio con firma SEPA en minutos.",
    ],
    topCompanies: [
      { pos: 1, name: "Endesa", color: "#e91e8c" },
      { pos: 2, name: "Repsol Energía", color: "#ff6b35" },
      { pos: 3, name: "Naturgy", color: "#39d353" },
      { pos: 4, name: "Iberdrola", color: "#3b82f6" },
      { pos: 5, name: "Holaluz", color: "#a855f7" },
      { pos: 6, name: "TotalEnergies", color: "#f59e0b" },
      { pos: 7, name: "Candela Energía", color: "#ec4899" },
      { pos: 8, name: "Lucera", color: "#06b6d4" },
      { pos: 9, name: "Factor Energía", color: "#84cc16" },
      { pos: 10, name: "Gana Energía", color: "#f97316" },
    ],
    whatsappMsg: "Hola Faustino, me gustaría que me ayudaras a optimizar mi factura de gas.",
  },
  {
    slug: "laura-sanchez",
    name: "Laura Sánchez",
    fullName: "Laura Sánchez",
    role: "Tarifa óptima · Hogar",
    tagline: "La que encuentra la tarifa perfecta para tu hogar en menos de 10 minutos.",
    description:
      "Laura se especializó en hogares porque es donde más gente paga de más sin saberlo. Conoce de memoria las tarifas de cada comercializadora y sabe exactamente cuándo merece la pena el PVPC y cuándo no. Su récord: 47% de ahorro en una familia de 4 personas en Jerez.",
    image: `${CDN}/avatar-laura.jpg`,
    tags: ["Luz", "Potencia", "Hogar", "PVPC"],
    status: "busy",
    schedule: "10:00–20:00 (L–V)",
    stats: [
      { value: "+980", label: "Hogares optimizados" },
      { value: "18 min", label: "Respuesta media" },
      { value: "28–47%", label: "Ahorro medio" },
    ],
    services: [
      "Análisis de tarifa óptima para hogar",
      "Comparativa PVPC vs. mercado libre",
      "Optimización de potencia contratada",
      "Discriminación horaria (2.0TD)",
      "Cambio de comercializadora sin cortes",
      "Seguimiento post-cambio",
    ],
    testimonials: [
      { text: "Laura encontró una tarifa que me ahorra 47€ al mes. No me lo creía.", author: "Carmen R.", detail: "Familia 4 personas · Jerez" },
      { text: "Me explicó todo sin tecnicismos. Por fin entiendo mi factura.", author: "Javier M.", detail: "Piso alquiler · Cádiz" },
      { text: "Cambió mi tarifa en 2 días. Sin cortes y sin papeleo.", author: "Ana B.", detail: "Chalet · El Puerto" },
    ],
    process: [
      "Sube tu factura de luz.",
      "Analizo tu consumo por horas y potencia.",
      "Te presento la tarifa óptima con ahorro estimado.",
      "Gestionamos el cambio sin que muevas un dedo.",
    ],
    topCompanies: [
      { pos: 1, name: "Audax", color: "#e91e8c" },
      { pos: 2, name: "VM Energía", color: "#ff6b35" },
      { pos: 3, name: "Aldro", color: "#39d353" },
      { pos: 4, name: "Holaluz", color: "#3b82f6" },
      { pos: 5, name: "Feníe Energía", color: "#a855f7" },
      { pos: 6, name: "Fox Energía", color: "#f59e0b" },
      { pos: 7, name: "Iberdrola", color: "#ec4899" },
      { pos: 8, name: "Repsol Luz", color: "#06b6d4" },
      { pos: 9, name: "Acciona", color: "#84cc16" },
      { pos: 10, name: "Endesa", color: "#f97316" },
    ],
    whatsappMsg: "Hola Laura, me gustaría que me ayudaras a encontrar la mejor tarifa para mi hogar.",
  },
  {
    slug: "ana-lopez",
    name: "Ana López",
    fullName: "Ana López",
    role: "Contratación · SEPA",
    tagline: "La que cierra el cambio en minutos y sin papeleo.",
    description:
      "Ana es la especialista en contratación y gestión documental. Si hay alguien que sabe hacer que el proceso de cambio de compañía sea rápido, indoloro y sin sorpresas, esa es Ana. Domina los procesos SEPA, las altas de nuevos suministros y los cambios de titular.",
    image: `${CDN}/avatar-ana.jpg`,
    tags: ["Contratación", "SEPA", "Altas", "Gestión"],
    status: "online",
    schedule: "09:00–18:00 (L–V)",
    stats: [
      { value: "+750", label: "Contratos gestionados" },
      { value: "8 min", label: "Respuesta media" },
      { value: "100%", label: "Sin errores SEPA" },
    ],
    services: [
      "Gestión completa del cambio de compañía",
      "Alta de nuevos suministros",
      "Cambios de titular y domiciliación SEPA",
      "Resolución de incidencias con distribuidoras",
      "Gestión de bajas y penalizaciones",
      "Seguimiento hasta activación del contrato",
    ],
    testimonials: [
      { text: "Ana gestionó mi cambio en un día. Sin llamadas, sin esperas.", author: "Roberto P.", detail: "Autónomo · Jerez" },
      { text: "Tenía un lío con el titular anterior. Lo resolvió en 3 días.", author: "María T.", detail: "Piso nuevo · Cádiz" },
      { text: "El proceso más fácil que he vivido con una compañía de luz.", author: "Fernando S.", detail: "Empresa · Sanlúcar" },
    ],
    process: [
      "Me envías los datos del suministro.",
      "Preparo toda la documentación necesaria.",
      "Gestionamos la firma SEPA de forma digital.",
      "Seguimiento hasta que el contrato está activo.",
    ],
    topCompanies: [
      { pos: 1, name: "Audax", color: "#e91e8c" },
      { pos: 2, name: "Naturgy", color: "#ff6b35" },
      { pos: 3, name: "Iberdrola", color: "#39d353" },
      { pos: 4, name: "Endesa", color: "#3b82f6" },
      { pos: 5, name: "Repsol", color: "#a855f7" },
      { pos: 6, name: "EDP", color: "#f59e0b" },
      { pos: 7, name: "Holaluz", color: "#ec4899" },
      { pos: 8, name: "Aldro", color: "#06b6d4" },
      { pos: 9, name: "VM Energía", color: "#84cc16" },
      { pos: 10, name: "Acciona", color: "#f97316" },
    ],
    whatsappMsg: "Hola Ana, necesito ayuda con la contratación o cambio de titular de mi suministro.",
  },
  {
    slug: "diego-perez",
    name: "Diego Pérez",
    fullName: "Diego Pérez",
    role: "Optimización · Potencia",
    tagline: "El que te dice exactamente cuánta potencia necesitas (pista: menos de la que tienes).",
    description:
      "Diego es el obseso de la potencia contratada. Sabe que la mayoría de hogares y empresas tienen más potencia de la que necesitan, y eso se paga todos los meses. Su especialidad es el análisis de maxímetro y la optimización de los períodos P1–P6 para reducir la factura sin tocar el consumo.",
    image: `${CDN}/avatar-diego.jpg`,
    tags: ["Potencia", "Optimización", "Pyme", "Industrial"],
    status: "busy",
    schedule: "10:00–19:00 (L–V)",
    stats: [
      { value: "+620", label: "Potencias optimizadas" },
      { value: "25 min", label: "Respuesta media" },
      { value: "15–28%", label: "Ahorro en potencia" },
    ],
    services: [
      "Análisis de maxímetro y potencia real",
      "Optimización de períodos P1–P6",
      "Reducción de penalizaciones por exceso",
      "Discriminación horaria para pymes",
      "Análisis de reactiva y armónicos",
      "Informe técnico de consumo",
    ],
    testimonials: [
      { text: "Redujo mi potencia de 15 a 10 kW. Ahorro 38€/mes en el término fijo.", author: "Paco L.", detail: "Taller mecánico · Jerez" },
      { text: "Detectó que pagaba penalización por reactiva desde hace 3 años.", author: "Empresa XYZ", detail: "Nave industrial · Cádiz" },
      { text: "Ajustó los períodos a nuestro horario real. Ahorro inmediato.", author: "Restaurante El Patio", detail: "Hostelería · El Puerto" },
    ],
    process: [
      "Analizo tu factura y el histórico de consumo.",
      "Identifico la potencia óptima por período.",
      "Te presento el ahorro estimado con el cambio.",
      "Gestionamos la modificación con la distribuidora.",
    ],
    topCompanies: [
      { pos: 1, name: "Audax", color: "#e91e8c" },
      { pos: 2, name: "VM Energía", color: "#ff6b35" },
      { pos: 3, name: "Iberdrola Pymes", color: "#39d353" },
      { pos: 4, name: "EDP Comercial", color: "#3b82f6" },
      { pos: 5, name: "Naturgy Pymes", color: "#a855f7" },
      { pos: 6, name: "Endesa", color: "#f59e0b" },
      { pos: 7, name: "Repsol", color: "#ec4899" },
      { pos: 8, name: "Aldro", color: "#06b6d4" },
      { pos: 9, name: "Plenitude", color: "#84cc16" },
      { pos: 10, name: "Acciona", color: "#f97316" },
    ],
    whatsappMsg: "Hola Diego, creo que tengo más potencia contratada de la que necesito. ¿Puedes ayudarme?",
  },
  {
    slug: "nuria-torres",
    name: "Nuria Torres",
    fullName: "Nuria Torres",
    role: "Gas · Lectura & RL",
    tagline: "La que lee tu factura de gas y encuentra lo que te cobran de más.",
    description:
      "Nuria es la especialista en gas del equipo junto a Faustino. Su fuerte son las lecturas estimadas vs. reales, las regularizaciones y los peajes RL. Ha encontrado errores de facturación en el 40% de las facturas de gas que ha revisado. Y eso, en euros, es mucho dinero.",
    image: `${CDN}/nuria_torres_humana_9c3f6a1d.jpg`,
    tags: ["Gas", "Lectura", "RL", "Regularización"],
    status: "online",
    schedule: "09:00–19:00 (L–V)",
    stats: [
      { value: "+540", label: "Facturas de gas revisadas" },
      { value: "40%", label: "Con errores detectados" },
      { value: "28%", label: "Ahorro medio en gas" },
    ],
    services: [
      "Revisión de lecturas estimadas vs. reales",
      "Detección de regularizaciones incorrectas",
      "Optimización del peaje RL (RL.1, RL.2…)",
      "Conversión m³→kWh y verificación",
      "Cambio de compañía de gas",
      "Gestión de incidencias con distribuidora",
    ],
    testimonials: [
      { text: "Encontró 3 lecturas estimadas seguidas que me habían cobrado de más.", author: "Concepción A.", detail: "Hogar · Jerez" },
      { text: "Bajó mi factura de gas un 31% ajustando el peaje RL.", author: "Bar La Esquina", detail: "Hostelería · Cádiz" },
      { text: "Detectó que me aplicaban el RL.2 cuando me correspondía el RL.1.", author: "Carlos M.", detail: "Comunidad · Sanlúcar" },
    ],
    process: [
      "Sube tu factura de gas.",
      "Verifico lecturas, peaje RL y conversión m³→kWh.",
      "Identifico errores y el ahorro potencial.",
      "Gestionamos el cambio o la reclamación.",
    ],
    topCompanies: [
      { pos: 1, name: "Audax Gas", color: "#e91e8c" },
      { pos: 2, name: "Naturgy", color: "#ff6b35" },
      { pos: 3, name: "Repsol Gas", color: "#39d353" },
      { pos: 4, name: "Iberdrola Gas", color: "#3b82f6" },
      { pos: 5, name: "Endesa Gas", color: "#a855f7" },
      { pos: 6, name: "EDP Gas", color: "#f59e0b" },
      { pos: 7, name: "Holaluz Gas", color: "#ec4899" },
      { pos: 8, name: "Acciona Gas", color: "#06b6d4" },
      { pos: 9, name: "Feníe Gas", color: "#84cc16" },
      { pos: 10, name: "TotalEnergies", color: "#f97316" },
    ],
    whatsappMsg: "Hola Nuria, me gustaría que revisaras mi factura de gas.",
  },
];
