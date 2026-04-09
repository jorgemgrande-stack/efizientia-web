/**
 * Efizientia Benefits Section
 * Design: Fondo blanco, lista de beneficios con checkmarks magenta
 * Panel derecho: donut SVG animado con rotación automática entre perfiles
 * Perfiles: Hogares 32%, Pymes 41%, Restaurantes 27%, Fábricas 46%
 */
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

const PERFILES = [
  { tipo: "Hogares",      ahorro: 32 },
  { tipo: "Pymes",        ahorro: 41 },
  { tipo: "Restaurantes", ahorro: 27 },
  { tipo: "Fábricas",     ahorro: 46 },
];

const BENEFITS = [
  "Descubre Cuánto Puedes Ahorrar Cada Mes",
  "Encuentra la Mejor Oferta de Luz en Minutos",
  "Compara Todas las Compañías en un Solo Paso",
  "Sin Trampas, Sin Complicaciones",
];

/* ── Donut SVG animado ── */
function DonutChart() {
  const [idx, setIdx]           = useState(0);
  const [displayPct, setDisplay] = useState(0);
  const [paused, setPaused]     = useState(false);

  const rafRef    = useRef<number | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPct   = useRef(0);

  // Parámetros del SVG (viewBox 36×36, r=15.9155 → circunferencia ≈ 100)
  const CIRCUM = 100;
  const target  = PERFILES[idx].ahorro;
  const offset  = CIRCUM - (CIRCUM * target) / 100;

  // Animación numérica
  const animateNumber = useCallback((from: number, to: number, ms: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t     = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevPct.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Cambio de perfil
  const goTo = useCallback((i: number) => {
    setIdx(i);
    animateNumber(prevPct.current, PERFILES[i].ahorro, 1000);
  }, [animateNumber]);

  // Ciclo automático
  const startCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % PERFILES.length;
        animateNumber(prevPct.current, PERFILES[next].ahorro, 1000);
        return next;
      });
    }, 3800);
  }, [animateNumber]);

  useEffect(() => {
    animateNumber(0, PERFILES[0].ahorro, 1000);
    startCycle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current)   cancelAnimationFrame(rafRef.current);
    };
  }, [animateNumber, startCycle]);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      startCycle();
    }
  }, [paused, startCycle]);

  return (
    <div
      className="rounded-2xl p-8"
      style={{ backgroundColor: "#111111", border: "1px solid #222" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
        Ahorro medio según cliente
      </p>
      <h3
        className="text-white text-2xl font-black mb-6"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {PERFILES[idx].tipo}
      </h3>

      {/* Donut SVG */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative" style={{ width: 180, height: 180 }}>
          <svg
            viewBox="0 0 36 36"
            style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            {/* Fondo */}
            <path
              d="M18 2.0845 a15.9155 15.9155 0 1 1 0 31.831 a15.9155 15.9155 0 1 1 0 -31.831"
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="3.8"
            />
            {/* Progreso */}
            <path
              d="M18 2.0845 a15.9155 15.9155 0 1 1 0 31.831 a15.9155 15.9155 0 1 1 0 -31.831"
              fill="none"
              stroke="#e91e8c"
              strokeWidth="3.8"
              strokeLinecap="round"
              style={{
                strokeDasharray: `${CIRCUM}`,
                strokeDashoffset: `${offset}`,
                transition: "stroke-dashoffset 1000ms ease",
                filter: "drop-shadow(0 0 6px rgba(233,30,140,0.6))",
              }}
            />
          </svg>
          {/* Texto central */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ transform: "none" }}
          >
            <span
              className="font-black leading-none"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 40,
                color: "#e91e8c",
                textShadow: "0 0 20px rgba(233,30,140,0.5)",
              }}
            >
              {displayPct}%
            </span>
            <span className="text-white/50 text-xs font-semibold mt-1">ahorro medio</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {PERFILES.map((p, i) => (
          <button
            key={p.tipo}
            onClick={() => { goTo(i); setPaused(true); }}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
            style={
              i === idx
                ? { backgroundColor: "#e91e8c", color: "#fff" }
                : { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }
            }
          >
            {p.tipo}
          </button>
        ))}
      </div>

      <p className="text-white/50 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        Descubre cómo reducimos tu factura sin esfuerzo.
      </p>
      <a
        href={WIDGET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
        style={{ color: "#e91e8c" }}
      >
        Comienza el ahorro <ArrowRight size={14} />
      </a>
    </div>
  );
}

/* ── Sección principal ── */
export default function BenefitsSection() {
  return (
    <section className="section-light py-20" id="beneficios">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Izquierda: Texto + beneficios */}
          <div>
            <h2
              className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Antes de lo que tardas en encender la luz,{" "}
              <span style={{ color: "#e91e8c" }}>te optimizamos tu factura</span>
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Súbenos tu factura y déjanos hacer el trabajo duro. Revisamos cada compañía, cada
              tarifa y cada opción disponible para ti. Te devolvemos un estudio claro, con la mejor
              alternativa para tu bolsillo.
            </p>

            <ul className="space-y-4 mb-10">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={22} style={{ color: "#e91e8c", flexShrink: 0 }} />
                  <span
                    className="text-gray-800 font-semibold"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={WIDGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-black px-6 py-4 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#e91e8c",
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: "0 4px 20px rgba(233,30,140,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f72585")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
            >
              Empecemos ahora con tu factura
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Derecha: Donut animado */}
          <DonutChart />
        </div>
      </div>
    </section>
  );
}
