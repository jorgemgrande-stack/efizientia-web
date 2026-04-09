/**
 * LegalPage — Componente reutilizable para páginas legales
 * Design: Dark Tech con acentos magenta, fondo negro, tipografía Montserrat/Nunito Sans
 */
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LegalSection {
  title: string;
  content: string | string[];
}

interface LegalPageProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, subtitle, lastUpdated, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-32 pb-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #e91e8c 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
          <div className="text-center">
            <span
              className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "#1a1a1a", color: "#e91e8c", border: "1px solid #e91e8c33" }}
            >
              Efizientia Energías Renovables SL
            </span>
            <h1
              className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/50 text-lg" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {subtitle}
              </p>
            )}
            {lastUpdated && (
              <p className="text-white/30 text-sm mt-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Última actualización: {lastUpdated}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div
            className="rounded-2xl p-8 md:p-12 space-y-10"
            style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}
          >
            {sections.map((section, idx) => (
              <div key={idx}>
                <h2
                  className="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-3"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: "#e91e8c", color: "white" }}
                  >
                    {idx + 1}
                  </span>
                  {section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3 pl-10">
                    {section.content.map((item, i) => (
                      <li
                        key={i}
                        className="text-white/60 text-sm leading-relaxed flex items-start gap-2"
                        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: "#e91e8c" }} />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    className="text-white/60 text-sm leading-relaxed pl-10"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
                {idx < sections.length - 1 && (
                  <div className="mt-10 border-t border-white/5" />
                )}
              </div>
            ))}

            {/* Contact box */}
            <div
              className="rounded-xl p-6 mt-8"
              style={{ backgroundColor: "#0a0a0a", border: "1px solid #e91e8c33" }}
            >
              <p className="text-white/40 text-xs mb-3 font-bold uppercase tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Contacto del Responsable
              </p>
              <div className="space-y-1">
                <p className="text-white/70 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  <strong className="text-white">EFIZIENTIA ENERGÍAS RENOVABLES SL</strong>
                </p>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>CIF: B05310511</p>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Calle Joyería 8, 11408 Jerez de la Frontera (Cádiz)</p>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Email:{" "}
                  <a href="mailto:hola@efizientia.es" className="transition-colors" style={{ color: "#e91e8c" }}>
                    hola@efizientia.es
                  </a>
                </p>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Teléfono:{" "}
                  <a href="tel:+34856288341" className="transition-colors" style={{ color: "#e91e8c" }}>
                    +34 856 28 83 41
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
