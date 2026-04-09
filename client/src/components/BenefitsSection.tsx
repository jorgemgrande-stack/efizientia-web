/**
 * Efizientia Benefits Section
 * Design: Fondo blanco, lista de beneficios con checkmarks magenta
 * "Antes de lo que tardas en encender la luz, te optimizamos tu factura"
 */
import { CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  "Descubre Cuánto Puedes Ahorrar Cada Mes",
  "Encuentra la Mejor Oferta de Luz en Minutos",
  "Compara Todas las Compañías en un Solo Paso",
  "Sin Trampas, Sin Complicaciones",
];

export default function BenefitsSection() {
  return (
    <section className="section-light py-20" id="beneficios">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
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

            {/* Benefits list */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={22} style={{ color: "#e91e8c", flexShrink: 0 }} />
                  <span
                    className="text-gray-800 font-semibold"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597"
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

          {/* Right: Savings chart visual */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#111111", border: "1px solid #222" }}
          >
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">
              Ahorro medio según cliente
            </p>
            <h3
              className="text-white text-2xl font-black mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Hogares
            </h3>

            {/* Donut chart visual */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#222"
                    strokeWidth="12"
                  />
                  {/* Progress arc - 32% */}
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#e91e8c"
                    strokeWidth="12"
                    strokeDasharray={`${32 * 2.513} ${(100 - 32) * 2.513}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-white text-4xl font-black"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: "#e91e8c" }}
                  >
                    32%
                  </span>
                  <span className="text-white/50 text-xs font-semibold">ahorro medio</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {["Hogares", "Pymes", "Fábricas"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    tab === "Hogares"
                      ? "text-white"
                      : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                  style={tab === "Hogares" ? { backgroundColor: "#e91e8c" } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="text-white/50 text-sm mt-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Descubre cómo reducimos tu factura sin esfuerzo.
            </p>
            <a
              href="https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold transition-colors"
              style={{ color: "#e91e8c" }}
            >
              Comienza el ahorro <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
