/**
 * Efizientia · Página /gas
 * Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
 * Acento secundario: naranja/ámbar #f59e0b para diferenciarse de /luz
 * Landing page de servicio de Gas: hero, cómo funciona, comparativa de tarifas,
 * ranking de compañías, beneficios, FAQ y CTA al widget de Kiwatio.
 */
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Flame, CheckCircle, TrendingDown, Shield, Clock, Star,
  ChevronDown, ArrowRight, BarChart2, Thermometer, RefreshCw, FileText
} from "lucide-react";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

// Color de acento para gas (ámbar/naranja)
const GAS_COLOR = "#f59e0b";
const GAS_GLOW = "rgba(245,158,11,0.35)";

// ─── Datos de tarifas de gas ───────────────────────────────────────────────
const GAS_TARIFAS = [
  {
    company: "Audax Gas",
    plan: "Tarifa Gas Estable",
    badge: "🔥 Mejor precio",
    badgeColor: "#f59e0b",
    energia: "0.0581 €/kWh",
    fijo: "4.20 €/mes",
    ahorro: "~180 €/año",
    features: [
      "Sin permanencia",
      "Gas natural certificado",
      "App móvil y atención 24/7",
      "Precio fijo 12 meses",
    ],
    highlight: true,
  },
  {
    company: "Naturgy",
    plan: "Plan Gas Online",
    badge: "🥈 Top 2",
    badgeColor: "#C0C0C0",
    energia: "0.0612 €/kWh",
    fijo: "4.50 €/mes",
    ahorro: "~155 €/año",
    features: [
      "Sin permanencia",
      "Factura electrónica",
      "Atención personalizada",
      "Gestión online completa",
    ],
    highlight: false,
  },
  {
    company: "Repsol Gas",
    plan: "Tarifa Gas Plus",
    badge: "🥉 Top 3",
    badgeColor: "#CD7F32",
    energia: "0.0638 €/kWh",
    fijo: "4.80 €/mes",
    ahorro: "~135 €/año",
    features: [
      "Sin permanencia",
      "Gas 100% compensado",
      "App móvil y gestión online",
      "Atención personalizada",
    ],
    highlight: false,
  },
  {
    company: "Iberdrola Gas",
    plan: "Gas Eficiente",
    badge: "🌿 Eco",
    badgeColor: "#39d353",
    energia: "0.0655 €/kWh",
    fijo: "5.10 €/mes",
    ahorro: "~120 €/año",
    features: [
      "Sin permanencia",
      "Compensación de CO₂",
      "Factura unificada luz+gas",
      "App con huella de carbono",
    ],
    highlight: false,
  },
];

// ─── Ranking de compañías de gas ───────────────────────────────────────────
const RANKING = [
  { pos: 1, name: "Audax Gas", score: 95, pct: 95 },
  { pos: 2, name: "Naturgy", score: 89, pct: 89 },
  { pos: 3, name: "Repsol Gas", score: 84, pct: 84 },
  { pos: 4, name: "Iberdrola Gas", score: 80, pct: 80 },
  { pos: 5, name: "Endesa Gas", score: 75, pct: 75 },
  { pos: 6, name: "EDP Gas", score: 70, pct: 70 },
  { pos: 7, name: "Holaluz Gas", score: 66, pct: 66 },
  { pos: 8, name: "Acciona Gas", score: 61, pct: 61 },
  { pos: 9, name: "Feníe Gas", score: 57, pct: 57 },
  { pos: 10, name: "TotalEnergies", score: 52, pct: 52 },
];

// ─── FAQ de gas ────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "¿Cuánto tiempo tarda el cambio de compañía de gas?",
    a: "El proceso completo suele tardar entre 7 y 15 días hábiles. Durante ese tiempo nunca se interrumpe el suministro de gas. Recibirás un SMS de confirmación de la nueva compañía antes de que se active el cambio.",
  },
  {
    q: "¿Qué es el peaje RL y cómo me afecta?",
    a: "El peaje de red de distribución (RL) es el coste por usar la red de distribución de gas. Existen varios niveles (RL.1, RL.2, RL.3…) según tu consumo anual. Ajustamos el peaje correcto para que no pagues más de lo necesario.",
  },
  {
    q: "¿Puedo contratar luz y gas con la misma compañía?",
    a: "Sí, muchas compañías ofrecen descuentos por contratar ambos servicios juntos. Sin embargo, no siempre es la opción más económica. Analizamos ambas facturas por separado y te decimos si el paquete compensa o no.",
  },
  {
    q: "¿Qué diferencia hay entre m³ y kWh en la factura de gas?",
    a: "Las compañías miden el consumo en m³ pero facturan en kWh. La conversión depende del poder calorífico del gas de tu zona, que varía. Nosotros hacemos esta conversión automáticamente para que la comparativa sea justa.",
  },
  {
    q: "¿Funciona para comunidades de vecinos con calefacción central?",
    a: "Sí. Las comunidades con calefacción central tienen un perfil de consumo muy diferente al doméstico. Tenemos experiencia en optimizar estos contratos, que suelen tener mucho margen de ahorro.",
  },
];

// ─── Pasos del proceso ─────────────────────────────────────────────────────
const PASOS = [
  {
    icon: FileText,
    num: "01",
    title: "Sube tu factura",
    desc: "Arrastra el PDF o la foto de tu factura de gas. Con eso ya podemos empezar.",
  },
  {
    icon: BarChart2,
    num: "02",
    title: "Traducimos m³→kWh",
    desc: "Convertimos tu consumo real y cuadramos fijo/variable y peaje RL.",
  },
  {
    icon: TrendingDown,
    num: "03",
    title: "Comparamos +175 compañías",
    desc: "Sin letra pequeña. Elegimos la tarifa que más te ahorra según tu consumo real.",
  },
  {
    icon: Shield,
    num: "04",
    title: "Contratación segura",
    desc: "Firma digital y confirmación por SMS. Nos encargamos del papeleo.",
  },
  {
    icon: RefreshCw,
    num: "05",
    title: "Cambio sin cortes",
    desc: "En máximo 15 días estás con tu nueva compañía. Sin interrupciones.",
  },
];

// ─── Beneficios ────────────────────────────────────────────────────────────
const BENEFICIOS = [
  { icon: TrendingDown, title: "Ahorro real desde el primer mes", desc: "El ahorro medio en gas es del 28%. Detectamos estimadas vs. reales y regularizaciones ocultas." },
  { icon: Clock, title: "Análisis en menos de 2 minutos", desc: "Sube tu factura y en menos de 2 minutos tienes el estudio completo con la mejor opción." },
  { icon: Shield, title: "Sin permanencia", desc: "Solo recomendamos tarifas sin permanencia. Libertad total para cambiar cuando quieras." },
  { icon: Star, title: "+175 compañías analizadas", desc: "Comparamos todas las comercializadoras del mercado, incluyendo las que no anuncian en TV." },
  { icon: CheckCircle, title: "Peaje ajustado a tu consumo", desc: "Ajustamos el nivel RL correcto según tu patrón de consumo invierno/verano." },
  { icon: Thermometer, title: "Especialistas en calefacción", desc: "Optimizamos tanto contratos domésticos como de comunidades con calefacción central." },
];

// ─── Componente FAQ Item ───────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-white/10 rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "rgba(255,255,255,0.03)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-semibold text-white text-sm md:text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {q}
        </span>
        <ChevronDown
          size={20}
          className="flex-shrink-0 ml-4 transition-transform duration-300"
          style={{
            color: GAS_COLOR,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>
      {open && (
        <div className="px-6 pb-5 text-white/70 text-sm leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Componente barra de ranking animada ───────────────────────────────────
function RankBar({ pos, name, score, pct, delay }: { pos: number; name: string; score: number; pct: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(pct), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct, delay]);

  const isTop3 = pos <= 3;
  const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <div ref={ref} className="flex items-center gap-3 group">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{
          background: isTop3 ? medals[pos - 1] : "rgba(255,255,255,0.1)",
          color: isTop3 ? "#000" : "#fff",
          boxShadow: isTop3 ? `0 0 12px ${medals[pos - 1]}80` : "none",
        }}
      >
        {pos}
      </span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold text-white/90" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {name}
          </span>
          <span className="text-sm font-bold" style={{ color: GAS_COLOR }}>
            {score}%
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${width}%`,
              background: isTop3
                ? `linear-gradient(90deg, ${GAS_COLOR}, #e91e8c)`
                : `linear-gradient(90deg, ${GAS_COLOR}80, #e91e8c50)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function Gas() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #120a00 50%, #0a0a0a 100%)",
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${GAS_GLOW} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Texto */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
                style={{
                  background: `${GAS_COLOR}20`,
                  border: `1px solid ${GAS_COLOR}40`,
                  color: GAS_COLOR,
                }}
              >
                <Flame size={12} />
                Servicio de Gas
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Afinamos tu<br />
                <span style={{ color: GAS_COLOR }}>llama:</span><br />
                paga menos.
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                Leemos tu factura, traducimos m³→kWh, cuadramos fijo/variable y peaje RL.
                Comparamos +175 compañías y te damos la tarifa que más te ahorra. Sin humo.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`,
                    boxShadow: `0 0 30px ${GAS_GLOW}`,
                  }}
                >
                  <Flame size={18} />
                  Analiza tu factura de gas
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base transition-all duration-200 hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  Cómo funciona
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Stats rápidas */}
              <div className="flex gap-8 mt-10">
                {[
                  { value: "28%", label: "Ahorro medio" },
                  { value: "+175", label: "Compañías" },
                  { value: "2 min", label: "Análisis" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black mb-0.5" style={{ color: GAS_COLOR, fontFamily: "'Montserrat', sans-serif" }}>
                      {s.value}
                    </div>
                    <div className="text-white/50 text-xs uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta decorativa */}
            <div className="hidden lg:flex justify-center">
              <div
                className="relative w-full max-w-sm rounded-2xl p-8"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${GAS_COLOR}40`,
                  boxShadow: `0 0 60px ${GAS_GLOW}`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)` }}
                  >
                    <Flame size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Estudio de factura de gas
                    </div>
                    <div className="text-white/40 text-xs">Gratuito · Sin compromiso</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: "Tarifa actual", value: "0.098 €/kWh", color: "#ff4444" },
                    { label: "Mejor tarifa", value: "0.0581 €/kWh", color: "#39d353" },
                    { label: "Ahorro mensual", value: "~15 €/mes", color: GAS_COLOR },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{item.label}</span>
                      <span className="font-bold text-sm" style={{ color: item.color, fontFamily: "'Montserrat', sans-serif" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="h-px mb-6"
                  style={{ background: `linear-gradient(90deg, transparent, ${GAS_COLOR}60, transparent)` }}
                />

                {/* Detalle de factura */}
                <div className="space-y-2 mb-6">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Desglose detectado</div>
                  {[
                    { label: "Término fijo (RL.1)", value: "4.20 €/mes" },
                    { label: "Término variable", value: "0.0581 €/kWh" },
                    { label: "Impuesto sobre gas", value: "2.34%" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-white/50 text-xs">{item.label}</span>
                      <span className="text-white/80 text-xs font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: GAS_COLOR, fontFamily: "'Montserrat', sans-serif" }}>
                    28%
                  </div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">Ahorro estimado</div>
                </div>

                {/* Decoración */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full" style={{ background: GAS_COLOR }} />
                <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full" style={{ background: "#e91e8c" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24" style={{ background: "#0d0d0d" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
              style={{
                background: `${GAS_COLOR}18`,
                border: `1px solid ${GAS_COLOR}35`,
                color: GAS_COLOR,
              }}
            >
              Proceso
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Así de fácil funciona
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Cinco pasos. Menos de 10 minutos. Ahorro real desde el primer mes.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Línea conectora */}
            <div
              className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${GAS_COLOR}50, transparent)` }}
            />

            {PASOS.map((paso, i) => (
              <div key={paso.num} className="relative flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                  style={{
                    background: i === 0
                      ? `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`
                      : "rgba(255,255,255,0.05)",
                    border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: i === 0 ? `0 0 30px ${GAS_GLOW}` : "none",
                  }}
                >
                  <paso.icon size={28} style={{ color: i === 0 ? "white" : GAS_COLOR }} />
                </div>
                <div
                  className="text-xs font-black mb-2 tracking-widest"
                  style={{ color: GAS_COLOR, fontFamily: "'Montserrat', sans-serif" }}
                >
                  {paso.num}
                </div>
                <h3
                  className="text-sm font-bold text-white mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {paso.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={WIDGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`,
                boxShadow: `0 0 30px ${GAS_GLOW}`,
              }}
            >
              <Flame size={18} />
              Empezar ahora — es gratis
            </a>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA DE TARIFAS ────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
              style={{
                background: `${GAS_COLOR}18`,
                border: `1px solid ${GAS_COLOR}35`,
                color: GAS_COLOR,
              }}
            >
              Tarifas
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Las mejores tarifas<br />
              <span style={{ color: GAS_COLOR }}>de gas este mes</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Actualizamos el ranking cada semana. Precios con impuestos incluidos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAS_TARIFAS.map((tarifa) => (
              <div
                key={tarifa.company}
                className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: tarifa.highlight
                    ? `linear-gradient(135deg, ${GAS_COLOR}18, rgba(233,30,140,0.12))`
                    : "rgba(255,255,255,0.04)",
                  border: tarifa.highlight
                    ? `1px solid ${GAS_COLOR}60`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: tarifa.highlight ? `0 0 40px ${GAS_GLOW}` : "none",
                }}
              >
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mb-4 self-start"
                  style={{
                    background: `${tarifa.badgeColor}20`,
                    border: `1px solid ${tarifa.badgeColor}50`,
                    color: tarifa.badgeColor,
                  }}
                >
                  {tarifa.badge}
                </div>

                <h3
                  className="text-lg font-black text-white mb-1"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {tarifa.company}
                </h3>
                <p className="text-white/50 text-xs mb-5">{tarifa.plan}</p>

                {/* Precios */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span className="text-white/50 text-xs">Término variable</span>
                    <span className="text-white text-xs font-bold">{tarifa.energia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-xs">Término fijo</span>
                    <span className="text-white text-xs font-bold">{tarifa.fijo}</span>
                  </div>
                  <div
                    className="flex justify-between pt-2 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-white/70 text-xs font-semibold">Ahorro est.</span>
                    <span className="text-xs font-black" style={{ color: "#39d353" }}>
                      {tarifa.ahorro}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-6 flex-1">
                  {tarifa.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                      <CheckCircle size={12} style={{ color: GAS_COLOR }} className="flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={
                    tarifa.highlight
                      ? {
                          background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`,
                          color: "white",
                          boxShadow: `0 0 20px ${GAS_GLOW}`,
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }
                  }
                >
                  Contratar ahora 🔥
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-xs mt-8">
            * Precios orientativos con impuestos incluidos. El precio final puede variar según zona, nivel de peaje y perfil de consumo.
            Sube tu factura para obtener el estudio personalizado gratuito.
          </p>
        </div>
      </section>

      {/* ── RANKING DE COMPAÑÍAS ──────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0d0d0d" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
                style={{
                  background: `${GAS_COLOR}18`,
                  border: `1px solid ${GAS_COLOR}35`,
                  color: GAS_COLOR,
                }}
              >
                Ranking
              </div>
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Top 10 compañías<br />
                <span style={{ color: GAS_COLOR }}>de gas recomendadas</span>
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Puntuamos cada compañía en base a precio del kWh, término fijo, atención al cliente,
                transparencia en la factura y facilidad de cambio. Actualizamos el ranking cada semana.
              </p>
              <a
                href={WIDGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`,
                  boxShadow: `0 0 25px ${GAS_GLOW}`,
                }}
              >
                <Flame size={16} />
                Ver mi mejor opción
              </a>
            </div>

            <div className="space-y-4">
              {RANKING.map((item, i) => (
                <RankBar
                  key={item.name}
                  pos={item.pos}
                  name={item.name}
                  score={item.score}
                  pct={item.pct}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
              style={{
                background: `${GAS_COLOR}18`,
                border: `1px solid ${GAS_COLOR}35`,
                color: GAS_COLOR,
              }}
            >
              Por qué Efizientia
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Lo que nos diferencia
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${GAS_COLOR}18`,
                    border: `1px solid ${GAS_COLOR}35`,
                  }}
                >
                  <b.icon size={22} style={{ color: GAS_COLOR }} />
                </div>
                <h3
                  className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {b.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA CENTRAL ───────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #120a00, #0a0a0a)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${GAS_COLOR}40`,
              boxShadow: `0 0 80px ${GAS_GLOW}`,
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${GAS_GLOW} 0%, transparent 60%)`,
              }}
            />

            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)` }}
              >
                <Flame size={32} className="text-white" />
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ¿Tu calefacción<br />
                <span style={{ color: GAS_COLOR }}>te cuesta un riñón?</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Sube tu factura de gas ahora. En menos de 2 minutos detectamos si estás pagando
                de más y te damos la alternativa más barata del mercado.
              </p>
              <a
                href={WIDGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black text-white text-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${GAS_COLOR}, #e91e8c)`,
                  boxShadow: `0 0 40px ${GAS_GLOW}`,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <Flame size={22} />
                Analiza mi factura de gas — gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0d0d0d" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
              style={{
                background: `${GAS_COLOR}18`,
                border: `1px solid ${GAS_COLOR}35`,
                color: GAS_COLOR,
              }}
            >
              FAQ
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Preguntas frecuentes
            </h2>
            <p className="text-white/60">Todo lo que necesitas saber sobre el cambio de compañía de gas.</p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
