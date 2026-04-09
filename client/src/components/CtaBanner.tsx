/**
 * Efizientia CTA Banner
 * Design: Fondo oscuro con gradiente, mascota Efi a la derecha
 * "Los Efis te ayudan a optimizar tu factura de la luz"
 */
import { Zap } from "lucide-react";

export default function CtaBanner() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 50%, #1a0a2e 100%)",
        border: "1px solid #e91e8c20",
      }}
      id="efis"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 50%, #e91e8c, transparent 60%)" }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <p className="label-tag mb-3">Compara y ahorra</p>
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Los{" "}
              <span style={{ color: "#e91e8c" }}>Efis</span>{" "}
              te ayudan a optimizar tu factura de la luz
            </h2>
            <p
              className="text-white/60 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Sube tu factura y te mostramos, al instante, la mejor tarifa según tu consumo. Sin
              permanencias, sin letra pequeña.
            </p>
            <a
              href="#hero"
              className="inline-flex items-center gap-2 font-black px-6 py-4 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                border: "2px solid #e91e8c",
                color: "#e91e8c",
                fontFamily: "'Montserrat', sans-serif",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e91e8c";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(233,30,140,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#e91e8c";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Zap size={18} />
              Optimizar mi factura
            </a>
          </div>

          {/* Right: Mascot */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/efi-mascot-banner-eGDGuTnouC9PMaKu7WZBmA.webp"
              alt="Mascota Efi - tu asistente de ahorro energético"
              className="w-64 lg:w-80 object-contain drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 0 30px rgba(233,30,140,0.3))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
