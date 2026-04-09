/**
 * Efizientia What We Do Section
 * Design: Fondo oscuro, grid 2x3 de tarjetas con icono magenta
 * "¿QUÉ HACEMOS POR TÍ?"
 */
import { Upload, Search, Shield, MessageSquare, Zap, Euro, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Upload,
    title: "Sube tus facturas",
    description: "Arrastra tu PDF o foto. Con eso ya podemos empezar a rebajar tu recibo.",
    cta: "Saber más",
    href: "#",
  },
  {
    icon: Search,
    title: "Comparamos por ti",
    description: "Tarifas de todas las compañías, sin letra pequeña. Elegimos la que más te ahorra.",
    cta: "Saber más",
    href: "#",
  },
  {
    icon: Shield,
    title: "Contratación segura",
    description: "Nos encargamos del papeleo. Tú solo confirmas los datos y listo.",
    cta: "Saber más",
    href: "#",
  },
  {
    icon: MessageSquare,
    title: "SMS de confirmación",
    description: "Recibe un mensaje, aceptas y seguimos. Sin llamadas eternas.",
    cta: "Saber más",
    href: "#",
  },
  {
    icon: Zap,
    title: "Cambio sin cortes",
    description: "En menos de una semana estás pagando menos por lo mismo.",
    cta: "Saber más",
    href: "#",
  },
  {
    icon: Euro,
    title: "Ahorro medio 32%",
    description: "Hogares y pymes reales. Sin trucos: comparamos y bajamos tu factura.",
    cta: "Empezar ahora",
    href: "#hero",
    highlight: true,
  },
];

function ServiceCard({ service }: { service: typeof services[0] }) {
  const Icon = service.icon;
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02] group"
      style={{
        backgroundColor: "#111111",
        border: service.highlight ? "1px solid #e91e8c" : "1px solid #222",
        boxShadow: service.highlight ? "0 0 20px rgba(233,30,140,0.15)" : "none",
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "#e91e8c20", border: "1px solid #e91e8c40" }}
      >
        <Icon size={22} style={{ color: "#e91e8c" }} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className="text-white font-black text-lg mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {service.title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {service.description}
        </p>
      </div>

      {/* CTA */}
      <a
        href={service.href}
        className="flex items-center gap-1 text-sm font-bold transition-all duration-200 group-hover:gap-2"
        style={{ color: "#e91e8c" }}
      >
        {service.cta}
        <ArrowRight size={14} />
      </a>
    </div>
  );
}

export default function WhatWeDoSection() {
  return (
    <section className="section-dark py-20" id="que-hacemos">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label-tag mb-3">Cambio de comercializadora</p>
          <h2
            className="text-3xl lg:text-4xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ¿QUÉ HACEMOS{" "}
            <span style={{ color: "#e91e8c" }}>POR TÍ?</span>
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Entérate y haz contratación directa de las comercializadoras con mejores precios
          </p>
        </div>

        {/* Grid 2x3 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
