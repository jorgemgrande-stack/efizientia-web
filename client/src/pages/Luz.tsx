/**
 * Efizientia · Página /luz
 * Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
 * Landing page de servicio de Luz: hero, cómo funciona, comparativa de tarifas,
 * ranking de compañías, beneficios, FAQ y CTA al widget de Kiwatio.
 */
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Zap, CheckCircle, TrendingDown, Shield, Clock, Star,
  ChevronDown, ArrowRight, BarChart2, Lightbulb, RefreshCw, FileText
} from "lucide-react";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

// ─── Datos de tarifas de luz ───────────────────────────────────────────────
const LUZ_TARIFAS = [
  {
    company: "Audax",
    plan: "Tarifa Ahorro Smart",
    badge: "⚡ Mejor precio",
    badgeColor: "#e91e8c",
    energia: "0.0612 €/kWh",
    potencia: "0.089 €/kW/día",
    ahorro: "~165 €/año",
    features: [
      "Sin permanencia",
      "Energía 100% renovable",
      "App móvil y atención 24/7",
      "Precio fijo 12 meses",
    ],
    highlight: true,
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/audax_logo_d3b4c7f1.png",
  },
  {
    company: "VM Energía",
    plan: "Plan Online Estable",
    badge: "🥈 Top 2",
    badgeColor: "#C0C0C0",
    energia: "0.0634 €/kWh",
    potencia: "0.091 €/kW/día",
    ahorro: "~152 €/año",
    features: [
      "Sin permanencia",
      "Factura electrónica",
      "Energía 100% renovable",
      "Gestión online completa",
    ],
    highlight: false,
    logo: null,
  },
  {
    company: "Aldro Energía",
    plan: "Tarifa Ahorro Plus",
    badge: "🥉 Top 3",
    badgeColor: "#CD7F32",
    energia: "0.0658 €/kWh",
    potencia: "0.093 €/kW/día",
    ahorro: "~138 €/año",
    features: [
      "Sin permanencia",
      "Energía 100% sostenible",
      "App móvil y gestión online",
      "Atención personalizada",
    ],
    highlight: false,
    logo: null,
  },
  {
    company: "Holaluz",
    plan: "Tarifa Verde Total",
    badge: "🌿 Eco",
    badgeColor: "#39d353",
    energia: "0.0671 €/kWh",
    potencia: "0.094 €/kW/día",
    ahorro: "~128 €/año",
    features: [
      "Sin permanencia",
      "100% energía verde certificada",
      "Compensación de CO₂",
      "App con huella de carbono",
    ],
    highlight: false,
    logo: null,
  },
];

// ─── Ranking de compañías ──────────────────────────────────────────────────
const RANKING = [
  { pos: 1, name: "Audax", score: 96, pct: 96 },
  { pos: 2, name: "VM Energía", score: 91, pct: 91 },
  { pos: 3, name: "Aldro", score: 87, pct: 87 },
  { pos: 4, name: "Holaluz", score: 82, pct: 82 },
  { pos: 5, name: "Feníe Energía", score: 78, pct: 78 },
  { pos: 6, name: "Fox Energía", score: 74, pct: 74 },
  { pos: 7, name: "Iberdrola", score: 70, pct: 70 },
  { pos: 8, name: "Repsol Luz", score: 65, pct: 65 },
  { pos: 9, name: "Acciona", score: 60, pct: 60 },
  { pos: 10, name: "Endesa", score: 55, pct: 55 },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "¿Cuánto tiempo tarda el cambio de compañía?",
    a: "El proceso completo suele tardar entre 5 y 7 días hábiles. Durante ese tiempo nunca se interrumpe el suministro eléctrico. Tú solo tienes que confirmar el SMS que te envía la nueva compañía.",
  },
  {
    q: "¿Tengo que pagar algo por el cambio?",
    a: "No. El cambio de comercializadora es completamente gratuito. Ni nosotros ni la nueva compañía te cobran nada por el proceso. Si tu tarifa actual tiene penalización por baja anticipada, te lo avisamos antes de proceder.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo tu factura de la luz (en PDF, foto o imagen). Con eso ya podemos analizar tu consumo, comparar todas las compañías y darte la mejor opción. El proceso dura menos de 2 minutos.",
  },
  {
    q: "¿Puedo volver a mi compañía anterior si no me gusta?",
    a: "Sí, siempre puedes cambiar de nuevo. La mayoría de tarifas que recomendamos no tienen permanencia, así que tienes total libertad para cambiar cuando quieras.",
  },
  {
    q: "¿Funciona para pymes y autónomos?",
    a: "Absolutamente. Tenemos Efis especializados en pymes y autónomos. El ahorro suele ser mayor porque hay más margen de optimización: potencia, discriminación horaria, reactiva… Cari es tu Efi para esto.",
  },
];

// ─── Pasos del proceso ─────────────────────────────────────────────────────
const PASOS = [
  {
    icon: FileText,
    num: "01",
    title: "Sube tu factura",
    desc: "Arrastra el PDF o la foto de tu factura. Con eso ya tenemos todo lo que necesitamos.",
  },
  {
    icon: BarChart2,
    num: "02",
    title: "Comparamos por ti",
    desc: "Analizamos más de 175 compañías y tarifas. Sin letra pequeña, sin trampa.",
  },
  {
    icon: TrendingDown,
    num: "03",
    title: "Te damos la mejor opción",
    desc: "Te mostramos cuánto ahorras, con qué compañía y por qué. Tú decides.",
  },
  {
    icon: Shield,
    num: "04",
    title: "Contratación segura",
    desc: "Nos encargamos del papeleo. Firma digital y confirmación por SMS.",
  },
  {
    icon: RefreshCw,
    num: "05",
    title: "Cambio sin cortes",
    desc: "En máximo 7 días estás con tu nueva compañía. Sin interrupciones.",
  },
];

// ─── Beneficios ────────────────────────────────────────────────────────────
const BENEFICIOS = [
  { icon: TrendingDown, title: "Ahorro real desde el primer mes", desc: "El ahorro medio de nuestros clientes es del 32%. Sin trucos, sin letra pequeña." },
  { icon: Clock, title: "Menos de 2 minutos", desc: "Sube tu factura y en menos de 2 minutos tienes el estudio completo." },
  { icon: Shield, title: "Sin permanencia", desc: "Solo recomendamos tarifas sin permanencia. Libertad total para cambiar cuando quieras." },
  { icon: Star, title: "+175 compañías analizadas", desc: "Comparamos todas las comercializadoras del mercado, no solo las grandes." },
  { icon: CheckCircle, title: "Cambio sin cortes", desc: "El suministro nunca se interrumpe durante el cambio de compañía." },
  { icon: Lightbulb, title: "Asesoría personalizada", desc: "Cada cliente tiene un Efi asignado que conoce su perfil de consumo." },
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
          className="text-[#e91e8c] flex-shrink-0 ml-4 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
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
          <span className="text-sm font-bold" style={{ color: "#e91e8c" }}>
            {score}%
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${width}%`,
              background: isTop3
                ? "linear-gradient(90deg, #e91e8c, #7b2ff7)"
                : "linear-gradient(90deg, #e91e8c80, #7b2ff750)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function Luz() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #0f0520 50%, #0a0a0a 100%)",
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(123,47,247,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Texto */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
                style={{ background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
              >
                <Zap size={12} />
                Servicio de Luz
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Hackeamos tu<br />
                <span style={{ color: "#e91e8c" }}>factura</span><br />
                de la luz.
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                Sube tu factura y en menos de 2 minutos sabemos si estás pagando de más.
                Comparamos +175 compañías y te damos la tarifa que más te ahorra. Sin rodeos.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                    boxShadow: "0 0 30px rgba(233,30,140,0.4)",
                  }}
                >
                  <Zap size={18} />
                  Analiza tu factura gratis
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
                  { value: "32%", label: "Ahorro medio" },
                  { value: "+175", label: "Compañías" },
                  { value: "2 min", label: "Análisis" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}>
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
                  border: "1px solid rgba(233,30,140,0.3)",
                  boxShadow: "0 0 60px rgba(233,30,140,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #e91e8c, #7b2ff7)" }}
                  >
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Estudio de factura
                    </div>
                    <div className="text-white/40 text-xs">Gratuito · Sin compromiso</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: "Tarifa actual", value: "0.142 €/kWh", color: "#ff4444" },
                    { label: "Mejor tarifa", value: "0.0612 €/kWh", color: "#39d353" },
                    { label: "Ahorro mensual", value: "~22 €/mes", color: "#e91e8c" },
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
                  style={{ background: "linear-gradient(90deg, transparent, rgba(233,30,140,0.4), transparent)" }}
                />

                <div className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}>
                    32%
                  </div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">Ahorro estimado</div>
                </div>

                {/* Decoración de puntos */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full" style={{ background: "#e91e8c" }} />
                <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full" style={{ background: "#7b2ff7" }} />
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
              style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
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
              style={{ background: "linear-gradient(90deg, transparent, rgba(233,30,140,0.4), transparent)" }}
            />

            {PASOS.map((paso, i) => (
              <div key={paso.num} className="relative flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #e91e8c, #7b2ff7)"
                      : "rgba(255,255,255,0.05)",
                    border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: i === 0 ? "0 0 30px rgba(233,30,140,0.4)" : "none",
                  }}
                >
                  <paso.icon size={28} className={i === 0 ? "text-white" : "text-[#e91e8c]"} />
                </div>
                <div
                  className="text-xs font-black mb-2 tracking-widest"
                  style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
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
                background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                boxShadow: "0 0 30px rgba(233,30,140,0.35)",
              }}
            >
              <Zap size={18} />
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
              style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
            >
              Tarifas
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Las mejores tarifas<br />
              <span style={{ color: "#e91e8c" }}>de este mes</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Actualizamos el ranking cada semana. Precios con IVA incluido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LUZ_TARIFAS.map((tarifa) => (
              <div
                key={tarifa.company}
                className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: tarifa.highlight
                    ? "linear-gradient(135deg, rgba(233,30,140,0.15), rgba(123,47,247,0.15))"
                    : "rgba(255,255,255,0.04)",
                  border: tarifa.highlight
                    ? "1px solid rgba(233,30,140,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: tarifa.highlight ? "0 0 40px rgba(233,30,140,0.2)" : "none",
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
                    <span className="text-white/50 text-xs">Energía</span>
                    <span className="text-white text-xs font-bold">{tarifa.energia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-xs">Potencia</span>
                    <span className="text-white text-xs font-bold">{tarifa.potencia}</span>
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
                      <CheckCircle size={12} className="text-[#e91e8c] flex-shrink-0 mt-0.5" />
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
                          background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                          color: "white",
                          boxShadow: "0 0 20px rgba(233,30,140,0.4)",
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }
                  }
                >
                  Contratar ahora ⚡
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-xs mt-8">
            * Precios orientativos con IVA incluido. El precio final puede variar según zona, potencia y perfil de consumo.
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
                style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
              >
                Ranking
              </div>
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Top 10 compañías<br />
                <span style={{ color: "#e91e8c" }}>recomendadas</span>
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Puntuamos cada compañía en base a precio, atención al cliente, transparencia y facilidad de cambio.
                Actualizamos el ranking cada semana con datos reales del mercado.
              </p>
              <a
                href={WIDGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                  boxShadow: "0 0 25px rgba(233,30,140,0.35)",
                }}
              >
                <Zap size={16} />
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
              style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
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
                  style={{ background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.25)" }}
                >
                  <b.icon size={22} style={{ color: "#e91e8c" }} />
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
      <section className="py-24" style={{ background: "linear-gradient(135deg, #0f0520, #0a0a0a)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(233,30,140,0.3)",
              boxShadow: "0 0 80px rgba(233,30,140,0.15)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(233,30,140,0.15) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #e91e8c, #7b2ff7)" }}
              >
                <Zap size={32} className="text-white" />
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ¿Sigues pagando<br />
                <span style={{ color: "#e91e8c" }}>de más?</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Sube tu factura ahora. En menos de 2 minutos sabemos si te estamos ahorrando o si te estamos fallando.
                Spoiler: casi siempre ahorramos.
              </p>
              <a
                href={WIDGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-black text-white text-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                  boxShadow: "0 0 40px rgba(233,30,140,0.5)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <Zap size={22} />
                Analiza mi factura de luz — gratis
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
              style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
            >
              FAQ
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Preguntas frecuentes
            </h2>
            <p className="text-white/60">Todo lo que necesitas saber antes de cambiar de compañía.</p>
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
