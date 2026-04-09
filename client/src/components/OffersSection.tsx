/**
 * Efizientia Offers Section
 * Design: Fondo negro, tarjetas de tarifas con borde magenta
 * Newsletter + Ofertas de última hora
 */
import { useState } from "react";
import { Zap, Mail, ChevronRight } from "lucide-react";

const offers = [
  {
    company: "Endesa",
    plan: "Tarifa Ahorro Smart",
    tagline: "La energía más barata del mercado, sin ataduras ⚡",
    energy: "0.064234 €/kWh",
    power: "0.094 €/kW/día",
    features: ["Sin permanencia", "Energía 100% renovable", "App móvil y atención 24/7"],
    savings: "145 €/año",
    logoColor: "#00A3E0",
  },
  {
    company: "Iberdrola",
    plan: "Plan Online",
    tagline: "Precio estable 24h, contratación digital y energía 100% verde.",
    energy: "0.064234 €/kWh",
    power: "0.094 €/kW/día",
    features: ["Sin permanencia", "Factura electrónica", "Energía 100% renovable"],
    savings: "145 €/año",
    logoColor: "#00A859",
  },
  {
    company: "Repsol",
    plan: "Tarifa Ahorro Plus",
    tagline: "Precio estable, sin permanencia y con energía 100% sostenible.",
    energy: "0.067 €/kWh",
    power: "0.095 €/kW/día",
    features: ["Sin permanencia", "Energía 100% renovable", "App móvil y gestión online"],
    savings: "138 €/año",
    logoColor: "#FF6B00",
  },
  {
    company: "ACCIONA",
    plan: "Tarifa Única",
    tagline: "Precio fijo 24h, 100% renovable y sin permanencia.",
    energy: "0.1506 €/kWh",
    power: "0.0696 €/kW/día",
    features: ["Sin permanencia", "Energía 100% renovable", "Atención y gestión online"],
    savings: "≈120–160 €/año",
    logoColor: "#C8102E",
  },
];

function OfferCard({ offer }: { offer: typeof offers[0] }) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #e91e8c",
        boxShadow: "0 0 20px rgba(233,30,140,0.1)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-white font-black text-lg"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {offer.plan}
          </p>
          <p className="text-white/50 text-xs mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            {offer.tagline}
          </p>
        </div>
        <span
          className="text-sm font-black px-2 py-1 rounded"
          style={{ color: offer.logoColor, fontFamily: "'Montserrat', sans-serif" }}
        >
          {offer.company}
        </span>
      </div>

      {/* Prices */}
      <div className="space-y-1">
        <p className="text-white/80 text-sm">
          <span className="font-bold">Energía:</span> {offer.energy}
        </p>
        <p className="text-white/80 text-sm">
          <span className="font-bold">Potencia:</span> {offer.power}
        </p>
        <p className="text-white/30 text-xs">(Precios con IVA incluido)</p>
      </div>

      {/* Features */}
      <ul className="space-y-1.5">
        {offer.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
            <span style={{ color: "#e91e8c" }}>✅</span>
            {f}
          </li>
        ))}
        <li className="flex items-center gap-2 text-sm font-bold text-white">
          <span>💰</span>
          Ahorro estimado: <span style={{ color: "#e91e8c" }}>{offer.savings}</span>
        </li>
      </ul>

      {/* CTA */}
      <a
        href="#hero"
        className="mt-auto flex items-center justify-center gap-2 py-3 rounded-lg text-white font-black text-sm transition-all duration-200"
        style={{
          border: "2px solid #e91e8c",
          color: "#e91e8c",
          fontFamily: "'Montserrat', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e91e8c";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#e91e8c";
        }}
      >
        <Zap size={16} />
        Contratar ahora ⚡
      </a>
    </div>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="section-dark py-16 border-t border-white/5" id="newsletter">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <p className="label-tag mb-3">Exclusivo para suscriptores</p>
        <h2
          className="text-2xl lg:text-3xl font-black text-white mb-3"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          De esto que te vamos a contar{" "}
          <span style={{ color: "#e91e8c" }}>nunca te enterarías...</span>
        </h2>
        <p className="text-white/50 mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Ofertas secretas, trucos para bajar tu factura y alertas de precios. Solo para suscriptores.
        </p>

        <div className="flex gap-3 max-w-md mx-auto">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 focus-within:border-[#e91e8c] transition-colors">
            <Mail size={16} className="text-white/40 flex-shrink-0" />
            <input
              type="email"
              placeholder="Solo pon aquí tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-white placeholder-white/30 text-sm font-medium outline-none flex-1 py-3"
            />
          </div>
          <button
            className="flex items-center gap-2 text-white font-black px-5 py-3 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{ backgroundColor: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f72585")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e91e8c")}
          >
            Suscribirme
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function OffersSection() {
  return (
    <section className="section-dark py-20" id="ofertas">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-tag mb-3">Comercializadoras</p>
          <h2
            className="text-3xl lg:text-4xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            OFERTAS DE{" "}
            <span style={{ color: "#e91e8c" }}>ÚLTIMA HORA</span>
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Las mejores tarifas disponibles ahora mismo. Actualizadas diariamente.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, i) => (
            <OfferCard key={i} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
