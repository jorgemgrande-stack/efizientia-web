/**
 * Efizientia · Página de perfil individual /humanos/:slug
 * Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
 * Replicando fielmente el diseño de efizientia.es/humanos-team-faustinolobato/
 * Secciones: hero (foto + stats + CTA), top compañías, formulario de contacto,
 *            en qué te ayudo, testimonios, cómo trabajamos.
 */
import { useParams, Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Phone, MessageCircle, Mail, Zap, ArrowLeft,
  CheckCircle, Star, ChevronRight, User,
} from "lucide-react";
import { HUMANOS, WIDGET_URL, WHATSAPP_BASE, PHONE, EMAIL } from "@/data/humanos";

// Colores por índice para los avatares placeholder
const AVATAR_COLORS = [
  "#e91e8c", "#7b2ff7", "#f59e0b", "#39d353", "#3b82f6", "#ec4899",
];

function StatusDot({ status }: { status: "online" | "busy" | "offline" }) {
  const map = {
    online: { color: "#39d353", label: "Online" },
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
        }}
      />
      <span className="text-sm font-semibold" style={{ color: s.color }}>
        {s.label}
      </span>
      <span className="text-white/40 text-sm ml-1">· {status === "online" ? "08:00–20:00" : "10:00–20:00"}</span>
    </div>
  );
}

// Formulario de contacto que abre WhatsApp
function ContactForm({ humano }: { humano: typeof HUMANOS[0] }) {
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "", privacidad: false });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacidad) return;
    const msg = `Hola ${humano.name}, soy ${form.nombre}. ${form.mensaje || humano.whatsappMsg} Mi teléfono: ${form.telefono}. Mi email: ${form.email}.`;
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#39d353" }} />
        <h3 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
        <p className="text-white/60">Te hemos abierto WhatsApp. {humano.name} te responderá en breve.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold underline"
          style={{ color: "#e91e8c" }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-black text-white mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        Déjame tus datos y te atiendo por WhatsApp
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Nombre y apellidos</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Teléfono</label>
          <input
            type="tel"
            placeholder="+34 6XX XXX XXX"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
        <input
          type="email"
          placeholder="tucorreo@dominio.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Mensaje</label>
        <textarea
          placeholder="Cuéntame qué necesitas (luz, gas, potencia, RL…)"
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacidad"
          checked={form.privacidad}
          onChange={(e) => setForm({ ...form, privacidad: e.target.checked })}
          className="mt-0.5 w-4 h-4 accent-pink-500 flex-shrink-0"
          required
        />
        <label htmlFor="privacidad" className="text-xs text-white/50 leading-relaxed">
          Acepto la{" "}
          <Link href="/privacidad">
            <span className="underline cursor-pointer" style={{ color: "#e91e8c" }}>política de privacidad</span>
          </Link>
          . Tus datos se usarán solo para atender tu solicitud por WhatsApp.
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={16} />
          Enviar por WhatsApp
        </button>
        <a
          href={WIDGET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
            boxShadow: "0 0 20px rgba(233,30,140,0.3)",
          }}
        >
          <Zap size={16} />
          Subir factura ahora
        </a>
      </div>
    </form>
  );
}

// Barras animadas del ranking de compañías
function CompanyBar({ company, delay }: { company: { pos: number; name: string; color: string }; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setWidth(100 - (company.pos - 1) * 5);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [company.pos, delay]);

  return (
    <div ref={ref} className="flex items-center gap-3 py-2">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ background: company.pos === 1 ? company.color : "rgba(255,255,255,0.08)", color: company.pos === 1 ? "#fff" : "rgba(255,255,255,0.5)" }}
      >
        {company.pos}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-sm font-semibold truncate">{company.name}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${width}%`, background: company.color }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HumanoProfile() {
  const params = useParams<{ slug: string }>();
  const humano = HUMANOS.find((h) => h.slug === params.slug);

  if (!humano) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <User size={64} className="mb-6 opacity-20" style={{ color: "#e91e8c" }} />
          <h1 className="text-3xl font-black text-white mb-4">Asesor no encontrado</h1>
          <p className="text-white/50 mb-8">El perfil que buscas no existe o ha cambiado de URL.</p>
          <Link href="/humanos">
            <span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg, #e91e8c, #7b2ff7)" }}
            >
              <ArrowLeft size={16} />
              Ver todos los asesores
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const humanoIdx = HUMANOS.findIndex((h) => h.slug === humano.slug);
  const avatarColor = AVATAR_COLORS[humanoIdx % AVATAR_COLORS.length];
  const initials = humano.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const whatsappUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent(humano.whatsappMsg)}`;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-28 pb-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0f0520 60%, #0a0a0a 100%)" }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(233,30,140,0.08) 0%, transparent 60%)" }}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <Link href="/humanos">
            <span className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer mb-8">
              <ArrowLeft size={14} />
              Todos los asesores
            </span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Columna izquierda: info */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
                style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
              >
                Asesoramiento Humano
              </div>

              <h1
                className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {humano.fullName}
              </h1>
              <p className="text-white/50 text-lg mb-4">{humano.role}</p>
              <p className="text-white/70 text-base leading-relaxed mb-6">{humano.tagline}</p>

              {/* Estado online */}
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <StatusDot status={humano.status} />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mb-8">
                {humano.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="px-4 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="text-lg font-black" style={{ color: "#e91e8c" }}>{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-3 mb-4">
                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                    boxShadow: "0 0 24px rgba(233,30,140,0.35)",
                  }}
                >
                  <Zap size={16} />
                  Subir factura
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href={PHONE}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Phone size={16} />
                  Llamar
                </a>
                <a
                  href={EMAIL}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Mail size={16} />
                  Email
                </a>
              </div>
              <p className="text-white/30 text-xs">
                Te atiendo de {humano.schedule}. Urgencias por WhatsApp.
              </p>
            </div>

            {/* Columna derecha: foto */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 60px rgba(233,30,140,0.15)",
                }}
              >
                <img
                  src={humano.image}
                  alt={humano.name}
                  className="w-full object-cover object-top"
                  style={{ maxHeight: "520px" }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                {/* Fallback avatar */}
                <div
                  className="w-full hidden items-center justify-center py-24"
                  style={{ background: `linear-gradient(135deg, ${avatarColor}20, rgba(0,0,0,0.8))` }}
                >
                  <div
                    className="w-40 h-40 rounded-full flex items-center justify-center text-6xl font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}80)` }}
                  >
                    {initials}
                  </div>
                </div>
              </div>

              {/* QR decorativo */}
              <div
                className="absolute -bottom-4 -right-4 px-4 py-3 rounded-xl text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-xs text-white/40 mb-1">Escanéame</div>
                <div className="text-xs font-bold" style={{ color: "#e91e8c" }}>Acceso directo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP COMPAÑÍAS + FORMULARIO ───────────────────────────────── */}
      <section className="py-16" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top compañías */}
            <div
              className="lg:col-span-1 rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "#e91e8c" }}
              >
                Top 10 Compañías · Últimos 90 días
              </div>
              <div className="space-y-1">
                {humano.topCompanies.map((company, i) => (
                  <CompanyBar key={company.name} company={company} delay={i * 80} />
                ))}
              </div>
            </div>

            {/* Formulario de contacto */}
            <div
              className="lg:col-span-2 rounded-2xl p-8"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <ContactForm humano={humano} />
            </div>
          </div>
        </div>
      </section>

      {/* ── EN QUÉ TE AYUDO + TESTIMONIOS + PROCESO ──────────────────── */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #0a0a0a, #0f0520)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* En qué te ayudo */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2
                className="text-xl font-black text-white mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                En qué te ayudo
              </h2>
              <ul className="space-y-3">
                {humano.services.map((service) => (
                  <li key={service} className="flex items-start gap-3">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#39d353" }} />
                    <span className="text-white/70 text-sm leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>

              {/* Stats de rendimiento */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "95%", label: "Casos resueltos" },
                    { value: "48h", label: "Cambio cerrado" },
                    { value: "4.9/5", label: "Satisfacción" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-lg font-black" style={{ color: "#e91e8c" }}>{s.value}</div>
                      <div className="text-xs text-white/40 leading-tight mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonios */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2
                className="text-xl font-black text-white mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Qué dicen mis clientes
              </h2>
              <div className="space-y-5">
                {humano.testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-3 italic">"{t.text}"</p>
                    <div>
                      <div className="text-white font-bold text-sm">{t.author}</div>
                      <div className="text-white/40 text-xs">{t.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cómo trabajamos */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2
                className="text-xl font-black text-white mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cómo trabajamos
              </h2>
              <div className="space-y-5">
                {humano.process.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{
                        background: i === 0 ? "linear-gradient(135deg, #e91e8c, #7b2ff7)" : "rgba(255,255,255,0.07)",
                        color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-white/75 text-sm leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA final */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #e91e8c, #7b2ff7)",
                    boxShadow: "0 0 24px rgba(233,30,140,0.3)",
                  }}
                >
                  <Zap size={16} />
                  Empezar ahora — es gratis
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIPCIÓN LARGA ─────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2
            className="text-2xl font-black text-white mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Sobre {humano.name.split(" ")[0]}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">{humano.description}</p>
        </div>
      </section>

      {/* ── OTROS ASESORES ───────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #0a0a0a, #0f0520)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <h2
            className="text-2xl font-black text-white mb-8 text-center"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Otros asesores del equipo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HUMANOS.filter((h) => h.slug !== humano.slug)
              .slice(0, 3)
              .map((h, idx) => {
                const hIdx = HUMANOS.findIndex((x) => x.slug === h.slug);
                const hColor = AVATAR_COLORS[hIdx % AVATAR_COLORS.length];
                const hInitials = h.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <Link key={h.slug} href={`/humanos/${h.slug}`}>
                    <div
                      className="rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-pink-500/30"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={h.image}
                          alt={h.name}
                          className="w-16 h-16 rounded-full object-cover object-top"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-16 h-16 rounded-full hidden items-center justify-center text-xl font-black text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${hColor}, ${hColor}80)` }}
                        >
                          {hInitials}
                        </div>
                        <div
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                          style={{
                            background: h.status === "online" ? "#39d353" : "#f59e0b",
                            borderColor: "#0a0a0a",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-white truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {h.name}
                        </div>
                        <div className="text-white/50 text-xs truncate">{h.role}</div>
                      </div>
                      <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="text-center mt-8">
            <Link href="/humanos">
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm cursor-pointer transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
              >
                Ver todo el equipo
                <ChevronRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
