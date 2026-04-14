/**
 * Efizientia · Página /humanos
 * Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
 * Galería del equipo humano de asesores energéticos.
 * Replicando fielmente el diseño de efizientia.es/humanos/
 */
import { Link } from "wouter";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, MessageCircle, Mail, Zap, Users, Star, TrendingDown } from "lucide-react";
import { WIDGET_URL, WHATSAPP_BASE, PHONE, EMAIL } from "@/data/humanos";
import type { HumanoData } from "@/data/humanos";

function normalizeApiProfile(p: Record<string, unknown>): HumanoData {
  return {
    slug: String(p.slug ?? ""),
    name: String(p.name ?? p.display_name ?? ""),
    fullName: String(p.fullName ?? p.display_name ?? ""),
    role: String(p.role ?? ""),
    tagline: String(p.tagline ?? ""),
    description: String(p.description ?? p.about_text ?? ""),
    image: String(p.image ?? p.photo_url ?? ""),
    tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    status: (["online", "busy", "offline"].includes(String(p.status)) ? p.status : "online") as HumanoData["status"],
    schedule: String(p.schedule ?? ""),
    stats: Array.isArray(p.stats) ? (p.stats as HumanoData["stats"]) : [],
    services: Array.isArray(p.services) ? p.services.map(String) : [],
    testimonials: Array.isArray(p.testimonials) ? (p.testimonials as HumanoData["testimonials"]) : [],
    process: Array.isArray(p.process) ? p.process.map(String) : [],
    topCompanies: Array.isArray(p.topCompanies) ? (p.topCompanies as HumanoData["topCompanies"]) : [],
    whatsappMsg: String(p.whatsappMsg ?? "Hola, me gustaría que me ayudaras con mi factura de energía."),
  };
}

// Placeholder de foto cuando no hay imagen real en CDN
const AVATAR_PLACEHOLDER = (name: string, color: string) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return { initials, color };
};

// Colores por índice para los avatares placeholder
const AVATAR_COLORS = [
  "#e91e8c", "#7b2ff7", "#f59e0b", "#39d353", "#3b82f6", "#ec4899",
];

function StatusDot({ status }: { status: "online" | "busy" | "offline" }) {
  const map = {
    online: { color: "#39d353", label: "En línea ahora" },
    busy: { color: "#f59e0b", label: "Respondiendo en breve" },
    offline: { color: "#6b7280", label: "Fuera de horario" },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          background: s.color,
          boxShadow: `0 0 8px ${s.color}`,
          animation: status === "online" ? "pulse 2s infinite" : "none",
        }}
      />
      <span className="text-xs font-semibold" style={{ color: s.color }}>
        {s.label}
      </span>
    </div>
  );
}

export default function Humanos() {
  // Solo mostramos los perfiles creados desde el gestor (API)
  const [humanos, setHumanos] = useState<HumanoData[]>([]);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((apiProfiles: unknown[]) => {
        const normalized = apiProfiles.map((p) => normalizeApiProfile(p as Record<string, unknown>));
        setHumanos(normalized);
      })
      .catch(() => { /* fallback silencioso */ });
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #0f0520 50%, #0a0a0a 100%)",
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(233,30,140,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
            style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
          >
            <Users size={12} />
            Asesoramiento Humano
          </div>
          <h1
            className="text-4xl md:text-6xl font-black text-white mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Habla con nuestros<br />
            <span style={{ color: "#e91e8c" }}>asesores</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Resolvemos tu factura y cerramos la mejor tarifa en minutos.
            Personas reales, sin bots, sin esperas.
          </p>

          {/* Stats rápidas */}
          <div className="flex flex-wrap justify-center gap-10 mt-10">
            {[
              { icon: TrendingDown, value: "32%", label: "Ahorro medio" },
              { icon: Star, value: "4.9★", label: "Valoración media" },
              { icon: Zap, value: "+5.000", label: "Facturas analizadas" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <s.icon size={16} style={{ color: "#e91e8c" }} />
                  <span
                    className="text-2xl font-black"
                    style={{ color: "#e91e8c", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {s.value}
                  </span>
                </div>
                <div className="text-white/50 text-xs uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID DE ASESORES ─────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {humanos.map((humano, idx) => {
              const avatar = AVATAR_PLACEHOLDER(humano.name, AVATAR_COLORS[idx % AVATAR_COLORS.length]);
              const whatsappUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent(humano.whatsappMsg)}`;

              return (
                <div
                  key={humano.slug}
                  className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Foto */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "4/3", background: "rgba(255,255,255,0.05)" }}
                  >
                    {/* Intentamos cargar la imagen real; si falla, mostramos el avatar */}
                    <img
                      src={humano.image}
                      alt={humano.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    {/* Fallback avatar */}
                    <div
                      className="absolute inset-0 items-center justify-center hidden"
                      style={{ background: `linear-gradient(135deg, ${avatar.color}30, rgba(0,0,0,0.8))` }}
                    >
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${avatar.color}, ${avatar.color}80)` }}
                      >
                        {avatar.initials}
                      </div>
                    </div>

                    {/* Indicador de estado (esquina superior derecha) */}
                    <div className="absolute top-3 right-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: humano.status === "online" ? "#39d353" : humano.status === "busy" ? "#f59e0b" : "#6b7280",
                          boxShadow: `0 0 8px ${humano.status === "online" ? "#39d353" : humano.status === "busy" ? "#f59e0b" : "#6b7280"}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Nombre + Ver perfil */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        className="text-2xl font-black text-white leading-tight"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {humano.name}
                      </h3>
                      <Link href={`/humanos/${humano.slug}`}>
                        <span
                          className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
                          style={{ background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.4)", color: "#e91e8c" }}
                        >
                          Ver perfil
                        </span>
                      </Link>
                    </div>

                    {/* Rol */}
                    <p className="text-white/50 text-sm mb-3">{humano.role}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {humano.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Estado + horario */}
                    <div className="flex items-center justify-between mb-5">
                      <StatusDot status={humano.status} />
                      <span className="text-white/40 text-xs">{humano.schedule}</span>
                    </div>

                    {/* Botones de acción */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <a
                        href={WIDGET_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                        style={{
                          background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                          boxShadow: "0 0 20px rgba(233,30,140,0.3)",
                        }}
                      >
                        <Zap size={14} />
                        Subir factura
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-white text-xs transition-all duration-200 hover:scale-105"
                        style={{ background: "#25D366" }}
                      >
                        <MessageCircle size={13} />
                        WhatsApp
                      </a>
                      <a
                        href={PHONE}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-white text-xs transition-all duration-200 hover:bg-white/10"
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        <Phone size={13} />
                        Llamar
                      </a>
                      <a
                        href={EMAIL}
                        className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-white text-xs transition-all duration-200 hover:bg-white/10"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        <Mail size={13} />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0f0520, #0a0a0a)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(233,30,140,0.3)",
              boxShadow: "0 0 80px rgba(233,30,140,0.12)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(233,30,140,0.12) 0%, transparent 60%)" }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                ¿No sabes con quién hablar?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                Llámanos o escríbenos y te asignamos el asesor que mejor encaja con tu caso.
                Sin esperas, sin bots, sin rollos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                    boxShadow: "0 0 30px rgba(233,30,140,0.4)",
                  }}
                >
                  <Zap size={18} />
                  Subir mi factura ahora
                </a>
                <a
                  href={`${WHATSAPP_BASE}?text=${encodeURIComponent("Hola, me gustaría hablar con un asesor de Efizientia.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle size={18} />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
