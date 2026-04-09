/**
 * Efizientia Luz & Gas Sections
 * Design: Fondo blanco, layout 2 columnas con features e imagen
 * Sección Luz: "Conectamos tu factura con el mejor precio"
 * Sección Gas: "Afinamos tu llama: paga solo por el calor que usas"
 */
import { Zap, Flame, Clock, TrendingDown, Eye, Gauge, ArrowRight } from "lucide-react";

function FeatureItem({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
        style={{ backgroundColor: "#e91e8c" }}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <h4
          className="text-gray-900 font-black text-base mb-1"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {title}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function LuzSection() {
  return (
    <section className="section-light py-20" id="luz">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="label-tag mb-3">Nosotros</p>
            <h2
              className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Conectamos tu factura con{" "}
              <span style={{ color: "#e91e8c" }}>el mejor precio</span>
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Analizamos tu factura de luz y comparamos entre más de 175 compañías para darte
              siempre la tarifa que más te conviene, sin complicaciones.
            </p>

            <div className="space-y-6 mb-10">
              <FeatureItem
                icon={Clock}
                title="Estudio inmediato de tu factura"
                description="En menos de 1 minuto sabemos si estás pagando de más. Análisis automático y preciso."
              />
              <FeatureItem
                icon={TrendingDown}
                title="Ofertas que bajan tu coste al instante"
                description="Analizamos el mercado y te damos la tarifa más baja sin rodeos. Sin letra pequeña."
              />
            </div>

            <a
              href="#hero"
              className="inline-flex items-center gap-2 text-white font-black px-6 py-4 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#e91e8c",
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: "0 4px 20px rgba(233,30,140,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f72585")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
            >
              <Zap size={18} />
              Pasemos a la acción
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Right: Visual */}
          <div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: "#0a0a0a", minHeight: "380px" }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(circle at 70% 50%, #e91e8c, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e91e8c" }}>
                  <Zap size={20} className="text-white" />
                </div>
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Factura Luz
                </span>
              </div>
              {/* Mock comparison */}
              <div className="space-y-3">
                {[
                  { company: "Tu tarifa actual", price: "0.182 €/kWh", highlight: false },
                  { company: "Audax Energía", price: "0.064 €/kWh", highlight: true },
                  { company: "VM Energía", price: "0.071 €/kWh", highlight: false },
                  { company: "Aldro Energía", price: "0.078 €/kWh", highlight: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: item.highlight ? "#e91e8c" : "#111",
                      border: item.highlight ? "none" : "1px solid #222",
                    }}
                  >
                    <span className="text-white font-semibold text-sm">{item.company}</span>
                    <span className={`font-black text-sm ${item.highlight ? "text-white" : "text-white/60"}`}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "#e91e8c20", border: "1px solid #e91e8c40" }}>
                <p className="text-white/80 text-xs font-semibold text-center">
                  💰 Ahorro estimado:{" "}
                  <span style={{ color: "#e91e8c" }} className="font-black">145 €/año</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GasSection() {
  const gasStats = [
    { value: "8.500+", label: "Facturas de gas analizadas" },
    { value: "1.2 M+", label: "Ahorro anual activado a clientes" },
    { value: "28%+", label: "Ahorro medio vs. tarifa anterior" },
    { value: "45 K", label: "Compañías de gas" },
  ];

  return (
    <section className="section-light py-20" id="gas">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1 flex justify-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-gas-man-noa24tA76rogXJBbG7Mi4t.webp"
              alt="Hombre con factura de gas optimizada"
              className="rounded-2xl max-w-sm w-full object-cover shadow-2xl"
              style={{ maxHeight: "420px" }}
            />
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <p className="label-tag mb-3">Nosotros</p>
            <h2
              className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Afinamos tu llama:{" "}
              <span style={{ color: "#e91e8c" }}>paga solo por el calor que usas</span>
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Leemos tu factura, traducimos m³→kWh, cuadramos fijo/variable y peaje RL. Comparativa
              con +175 compañías y alta con firma segura.
            </p>

            <div className="space-y-6 mb-10">
              <FeatureItem
                icon={Eye}
                title="Lectura sin humo"
                description="Detectamos estimadas vs. reales, regularizaciones y extras camuflados. Te decimos en qué se va cada euro."
              />
              <FeatureItem
                icon={Gauge}
                title="Peaje a tu medida"
                description="Ajustamos RL (RL.1, RL.2, …) y el mix fijo/variable según tu patrón invierno/verano para que no pagues de más."
              />
            </div>

            {/* Gas stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {gasStats.map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: "#f9f9f9" }}>
                  <div
                    className="text-2xl font-black mb-1"
                    style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-600 text-xs font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#hero"
              className="inline-flex items-center gap-2 text-white font-black px-6 py-4 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#e91e8c",
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: "0 4px 20px rgba(233,30,140,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f72585")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
            >
              <Flame size={18} />
              Encender el ahorro de gas
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
