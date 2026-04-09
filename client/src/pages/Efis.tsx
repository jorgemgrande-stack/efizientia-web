// ============================================================
// EFIZIENTIA · Página galería de Efis
// Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
// Layout: Grid de tarjetas con hover 3D, aura neon, click → perfil
// ============================================================
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { EFIS } from "@/data/efis";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EfisPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero de la sección */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Fondo degradado */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(233,30,140,0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 0%, rgba(130,0,255,0.12), transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-[#e91e8c] font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#e91e8c] animate-pulse" />
            Equipo de asesores energéticos
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.05 }}
          >
            Los{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #e91e8c, #b300ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Efizientes
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Nuestro equipo de asesores energéticos no es normal. Son más raros, más rápidos y más efectivos que cualquier
            comercial de compañía eléctrica. Y tienen mucho más estilo.
          </p>
        </div>
      </section>

      {/* Grid de tarjetas */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EFIS.map((efi) => (
              <EfiCard key={efi.slug} efi={efi} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EfiCard({ efi }: { efi: (typeof EFIS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <Link href={`/efis/${efi.slug}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/8 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.03)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Glow de fondo al hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${efi.glowColor}, transparent 70%)`,
          }}
        />

        {/* Imagen del Efi */}
        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 80% at 50% 30%, ${efi.glowColor}, transparent 65%)`,
            }}
          />
          <img
            src={efi.image}
            alt={efi.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: "center 10%" }}
          />
          {/* Gradiente inferior para integrar con el fondo */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(10,10,10,0.95))",
            }}
          />
          {/* Badge de especialidad */}
          <div
            className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${efi.color}cc, ${efi.color}88)`,
              border: `1px solid ${efi.color}66`,
              color: "#fff",
            }}
          >
            {efi.badges[0]}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-black text-white">{efi.name}</h3>
              <p className="text-xs font-medium mt-0.5" style={{ color: efi.color }}>
                {efi.role.split("·")[0].trim()}
              </p>
            </div>
            {/* KPI destacado */}
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: efi.color }}>
                {efi.kpis[0].value}
              </div>
              <div className="text-xs text-white/40">{efi.kpis[0].label}</div>
            </div>
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{efi.tagline}</p>

          {/* Barra de habilidad principal */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>{efi.skills[0].label}</span>
              <span>{efi.skills[0].pct}%</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${efi.skills[0].pct}%`,
                  background: `linear-gradient(90deg, ${efi.color}, #ff2bd6)`,
                  boxShadow: `0 0 8px ${efi.color}88`,
                }}
              />
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {efi.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: `${efi.color}44`,
                  color: efi.color,
                  background: `${efi.color}11`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group-hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${efi.color}22, ${efi.color}11)`,
              border: `1px solid ${efi.color}44`,
              color: efi.color,
            }}
          >
            Ver perfil completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
