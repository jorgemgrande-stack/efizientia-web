/**
 * Efizientia Hero Section
 * Design: Fondo blanco/claro con formulario wizard de 4 pasos
 * - Supertítulo: "!!aunque parezca mentira!!"
 * - Título: "Sube tu factura. Nosotros hackeamos tu precio de la luz."
 * - Formulario: teléfono, tipo (luz/gas), subir factura, privacidad, CTA
 */
import { useState } from "react";
import { Upload, Phone, Zap, Flame, CheckSquare, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, label: "Sube tus facturas", icon: Upload },
  { id: 2, label: "Comparamos por ti", icon: Zap },
  { id: 3, label: "Contratación segura", icon: CheckSquare },
  { id: 4, label: "SMS de confirmación", icon: Phone },
];

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [tipoFactura, setTipoFactura] = useState<"luz" | "gas">("luz");
  const [privacidad, setPrivacidad] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [dragging, setDragging] = useState(false);

  return (
    <section className="section-light pt-20 pb-16 min-h-[90vh] flex items-center" id="hero" style={{ background: 'linear-gradient(135deg, #fff 0%, #fdf0f7 50%, #fff 100%)' }}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <p
              className="text-sm font-bold tracking-widest uppercase mb-3"
              style={{ color: "#e91e8c", fontFamily: "'Nunito Sans', sans-serif" }}
            >
              !!aunque parezca mentira!!
            </p>
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Sube tu factura.{" "}
              <span style={{ color: "#e91e8c" }}>Nosotros hackeamos</span> tu precio de la luz.
            </h1>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Sube tu factura y olvídate de las tarifas abusivas. Hackeamos el mercado eléctrico,
              cazamos el mejor precio oculto y lo ponemos a tu nombre. Sin rodeos, sin tecnicismos,
              solo ahorro real.
            </p>

            {/* Steps indicator */}
            <div className="flex flex-wrap gap-3 mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeStep === step.id
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={
                      activeStep === step.id
                        ? { backgroundColor: "#e91e8c" }
                        : {}
                    }
                  >
                    <Icon size={14} />
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Step description */}
            <div className="text-gray-700 text-sm font-medium">
              {activeStep === 1 && "Introduce una o varias facturas de la luz en nuestra plataforma."}
              {activeStep === 2 && "Analizamos todas las compañías y te mostramos la que más ahorro te aporta."}
              {activeStep === 3 && "Adjunta los datos necesarios y validamos la documentación de forma segura."}
              {activeStep === 4 && "La compañía elegida te enviará un SMS para confirmar el alta."}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="rounded-2xl p-6 lg:p-8 shadow-2xl"
            style={{ backgroundColor: "#111111", border: "1px solid #222" }}
          >
            <h2
              className="text-white text-xl font-black mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Optimiza tu factura ahora
            </h2>

            {/* Phone input */}
            <div className="mb-4">
              <label className="text-white/70 text-sm font-semibold mb-2 block">
                Teléfono de contacto
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-within:border-[#e91e8c] transition-colors">
                <Phone size={16} className="text-white/40" />
                <input
                  type="tel"
                  placeholder="600 000 000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="bg-transparent text-white placeholder-white/30 text-sm font-medium outline-none flex-1"
                />
              </div>
            </div>

            {/* Tipo de factura */}
            <div className="mb-4">
              <label className="text-white/70 text-sm font-semibold mb-2 block">
                Tipo de factura
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTipoFactura("luz")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                    tipoFactura === "luz"
                      ? "text-white"
                      : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                  }`}
                  style={tipoFactura === "luz" ? { backgroundColor: "#e91e8c" } : {}}
                >
                  <Zap size={16} />
                  Luz
                </button>
                <button
                  onClick={() => setTipoFactura("gas")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                    tipoFactura === "gas"
                      ? "text-white"
                      : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                  }`}
                  style={tipoFactura === "gas" ? { backgroundColor: "#e91e8c" } : {}}
                >
                  <Flame size={16} />
                  Gas
                </button>
              </div>
            </div>

            {/* File upload */}
            <div className="mb-4">
              <label className="text-white/70 text-sm font-semibold mb-2 block">
                Sube tu factura
              </label>
              <div
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                  dragging
                    ? "border-[#e91e8c] bg-[#e91e8c]/10"
                    : "border-white/20 hover:border-[#e91e8c]/50 hover:bg-white/5"
                }`}
              >
                <Upload size={24} className="mx-auto mb-2 text-white/40" />
                <p className="text-white/60 text-sm">
                  Arrastra tu PDF o foto aquí
                </p>
                <p className="text-white/30 text-xs mt-1">PDF, JPG, PNG</p>
                <label className="mt-3 inline-block text-xs font-bold px-3 py-1.5 rounded cursor-pointer transition-colors"
                  style={{ backgroundColor: "#e91e8c", color: "white" }}>
                  Seleccionar archivo
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>
            </div>

            {/* Privacy checkbox */}
            <div className="mb-6 flex items-start gap-3">
              <input
                type="checkbox"
                id="privacidad"
                checked={privacidad}
                onChange={(e) => setPrivacidad(e.target.checked)}
                className="mt-0.5 accent-[#e91e8c]"
              />
              <label htmlFor="privacidad" className="text-white/50 text-xs leading-relaxed">
                Acepto la{" "}
                <a href="#" style={{ color: "#e91e8c" }} className="underline">
                  política de privacidad y protección de datos
                </a>
              </label>
            </div>

            {/* CTA Button */}
            <button
              className="w-full py-4 rounded-lg text-white font-black text-base transition-all duration-200 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f72585";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(233,30,140,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#e91e8c";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Zap size={18} />
              Optimización
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
