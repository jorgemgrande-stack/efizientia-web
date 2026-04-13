/**
 * Efizientia · Perfil individual de asesor /humanos/:slug
 * Design: Dark Tech — fondo #0a0a0a, magenta #e91e8c, Montserrat/Nunito Sans
 *
 * Secciones:
 *  1. Hero: foto + info + stats + CTAs
 *  2. Widget Kiwatio (iframe, URL personalizable por asesor) + Ranking vivo
 *  3. En qué te ayudo + Testimonios (pool aleatorio) + Cómo trabajamos
 *  4. Formulario WhatsApp
 *  5. Sobre el asesor (condicional)
 *  6. Otros asesores del equipo
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
import type { HumanoData } from "@/data/humanos";

// ── Datos de respaldo (para perfiles recién creados sin contenido) ────────────

const DEFAULT_COMPANIES: HumanoData["topCompanies"] = [
  { pos: 1,  name: "Audax",           color: "#e91e8c" },
  { pos: 2,  name: "Repsol Energía",  color: "#ff6b35" },
  { pos: 3,  name: "Naturgy",         color: "#39d353" },
  { pos: 4,  name: "Iberdrola",       color: "#3b82f6" },
  { pos: 5,  name: "Holaluz",         color: "#a855f7" },
  { pos: 6,  name: "TotalEnergies",   color: "#f59e0b" },
  { pos: 7,  name: "Endesa",          color: "#ec4899" },
  { pos: 8,  name: "Lucera",          color: "#06b6d4" },
  { pos: 9,  name: "Aldro",           color: "#84cc16" },
  { pos: 10, name: "Acciona",         color: "#f97316" },
];

const DEFAULT_SERVICES = [
  "Optimización de potencia contratada (P1–P6)",
  "Comparativa y cambio de tarifa eléctrica",
  "Gestión del cambio de compañía sin cortes",
  "Revisión y auditoría de facturas de luz y gas",
  "Altas, cambios de titular y domiciliación SEPA",
  "Compensación de excedentes de energía solar",
];

const DEFAULT_PROCESS = [
  "Sube tu factura o déjame tus datos de contacto.",
  "Analizo tu consumo, potencias y tarifa actual.",
  "Te presento la mejor alternativa con el ahorro estimado.",
  "Gestionamos el cambio: firma digital, sin papeleo.",
];

const TESTIMONIAL_POOL: HumanoData["testimonials"] = [
  { text: "Bajé mi factura un 34% sin cambiar nada en casa. Lo vi en papel y no me lo creía.", author: "Patricia G.", detail: "Vivienda 4,6 kW · Sevilla" },
  { text: "En 24 h tenía la oferta firmada y las potencias ajustadas. Servicio impresionante.", author: "Óscar M.", detail: "Tienda de barrio · Cádiz" },
  { text: "Detectó un error de lectura que llevaba 2 años sin que nadie lo viera. Me devolvieron 340 €.", author: "Laura C.", detail: "Comunidad de vecinos · Jerez" },
  { text: "La potencia que tenía contratada era el doble de la que necesitaba. ¿Cómo nadie me lo había dicho?", author: "Javier M.", detail: "Piso en alquiler · Málaga" },
  { text: "Cambié de comercializadora sin cortes, sin papeles y ahorro 47 € al mes. ¡Recomendadísimo!", author: "Carmen R.", detail: "Familia · Jerez" },
  { text: "Me explicó la factura en 10 minutos. Por fin entiendo qué estoy pagando exactamente.", author: "Manolo P.", detail: "Bar · Sanlúcar" },
  { text: "Tenía el peaje RL.2 cuando me correspondía el RL.1. Tres años pagando de más sin saberlo.", author: "Carlos M.", detail: "Comunidad · El Puerto" },
  { text: "El lunes subí la factura y el miércoles ya tenía el contrato nuevo activo. Sin moverte del sofá.", author: "Susana F.", detail: "Hogar · Huelva" },
  { text: "Gestionó el cambio de titular del piso nuevo sin un solo problema. En tres días, resuelto.", author: "Roberto P.", detail: "Piso nuevo · Cádiz" },
  { text: "Me hicieron un estudio gratuito y ahorramos un 28 % desde el primer mes. Imposible no recomendar.", author: "Ana B.", detail: "Chalet · El Puerto" },
  { text: "Seis trabajadores, nave industrial. Reducimos la eléctrica un 31 % optimizando potencias P1–P3.", author: "Empresa Metalúrgica J.", detail: "Nave industrial · Cádiz" },
  { text: "Llevaba 5 años con la misma compañía sin mirarlo. Me ahorraron 380 € al año con un cambio de tarifa.", author: "Francisco L.", detail: "Piso · Algeciras" },
];

// ── Normalización de perfil API ───────────────────────────────────────────────

function normalizeApiProfile(p: Record<string, unknown>): HumanoData {
  return {
    slug:          String(p.slug ?? ""),
    name:          String(p.name ?? p.display_name ?? ""),
    fullName:      String(p.fullName ?? p.display_name ?? ""),
    role:          String(p.role ?? ""),
    tagline:       String(p.tagline ?? ""),
    description:   String(p.description ?? p.about_text ?? ""),
    image:         String(p.image ?? p.photo_url ?? ""),
    tags:          Array.isArray(p.tags) ? p.tags.map(String) : [],
    status:        (["online", "busy", "offline"].includes(String(p.status)) ? p.status : "online") as HumanoData["status"],
    schedule:      String(p.schedule ?? ""),
    stats:         Array.isArray(p.stats) ? (p.stats as HumanoData["stats"]) : [],
    services:      Array.isArray(p.services) ? p.services.map(String) : [],
    testimonials:  Array.isArray(p.testimonials) ? (p.testimonials as HumanoData["testimonials"]) : [],
    process:       Array.isArray(p.process) ? p.process.map(String) : [],
    topCompanies:  Array.isArray(p.topCompanies) ? (p.topCompanies as HumanoData["topCompanies"]) : [],
    whatsappMsg:   String(p.whatsappMsg ?? "Hola, me gustaría que me ayudaras con mi factura de energía."),
    invoiceCtaUrl: String(p.invoiceCtaUrl ?? p.invoice_cta_url ?? "") || undefined,
  };
}

// ── Colores de avatar placeholder ────────────────────────────────────────────
const AVATAR_COLORS = ["#e91e8c", "#7b2ff7", "#f59e0b", "#39d353", "#3b82f6", "#ec4899"];

// ── StatusDot ─────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: HumanoData["status"] }) {
  const map = {
    online:  { color: "#39d353", label: "Online" },
    busy:    { color: "#f59e0b", label: "Respondiendo en breve" },
    offline: { color: "#6b7280", label: "Fuera de horario" },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
      <span className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</span>
      <span className="text-white/40 text-sm ml-1">
        · {status === "online" ? "08:00–20:00" : status === "busy" ? "10:00–20:00" : ""}
      </span>
    </div>
  );
}

// ── LiveRanking — ranking animado ─────────────────────────────────────────────
function LiveRanking({ initialCompanies }: { initialCompanies: HumanoData["topCompanies"] }) {
  const source = initialCompanies.length >= 5 ? initialCompanies : DEFAULT_COMPANIES;
  const [list, setList] = useState(() => source.map((c, i) => ({ ...c, pos: i + 1 })));
  const [rising, setRising] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = 2200 + Math.random() * 1800;
      timer = setTimeout(() => {
        setList((prev) => {
          const arr = [...prev];
          const hi = Math.min(arr.length - 2, 8); // solo posiciones 3–9 se mueven
          if (hi < 2) return prev;
          const i = 2 + Math.floor(Math.random() * (hi - 2 + 1));
          const risingName = arr[i + 1]?.name;
          if (!risingName) return prev;
          setRising(risingName);
          setTimeout(() => setRising(null), 1800);
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          return arr.map((c, idx) => ({ ...c, pos: idx + 1 }));
        });
        tick();
      }, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2.5">
      {list.map((c) => {
        const isRising = c.name === rising;
        const barPct = Math.max(22, 100 - (c.pos - 1) * 7.8);
        return (
          <div key={c.name} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{
                background: c.pos === 1 ? c.color : isRising ? `${c.color}30` : "rgba(255,255,255,0.08)",
                color: c.pos === 1 ? "#fff" : isRising ? c.color : "rgba(255,255,255,0.5)",
                transition: "all 0.4s ease",
              }}
            >
              {c.pos}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-semibold text-white truncate flex-1">{c.name}</span>
                {isRising && <span className="text-xs font-black flex-shrink-0" style={{ color: "#39d353" }}>▲</span>}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${barPct}%`, background: c.color, transition: "width 0.8s ease" }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ContactForm (WhatsApp) ────────────────────────────────────────────────────
function ContactForm({ humano }: { humano: HumanoData }) {
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "", privacidad: false });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacidad) return;
    const msg = `Hola ${humano.name}, soy ${form.nombre}. ${form.mensaje || humano.whatsappMsg} Tel: ${form.telefono}. Email: ${form.email}.`;
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  };
  const inputCls = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";

  if (sent) {
    return (
      <div className="text-center py-10">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#39d353" }} />
        <h3 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
        <p className="text-white/60">{humano.name} te responderá en breve por WhatsApp.</p>
        <button onClick={() => setSent(false)} className="mt-5 text-sm font-semibold underline" style={{ color: "#e91e8c" }}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-black text-white mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        Déjame tus datos y te atiendo por WhatsApp
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Nombre y apellidos</label>
          <input type="text" placeholder="Tu nombre" required value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={inputCls} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Teléfono</label>
          <input type="tel" placeholder="+34 6XX XXX XXX" value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className={inputCls} style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
        <input type="email" placeholder="tucorreo@dominio.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputCls} style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Mensaje</label>
        <textarea placeholder="Cuéntame qué necesitas (luz, gas, potencia…)" rows={3}
          value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
      </div>
      <div className="flex items-start gap-3">
        <input type="checkbox" id="privacidad" required checked={form.privacidad}
          onChange={(e) => setForm({ ...form, privacidad: e.target.checked })}
          className="mt-0.5 w-4 h-4 accent-pink-500 flex-shrink-0" />
        <label htmlFor="privacidad" className="text-xs text-white/50 leading-relaxed">
          Acepto la{" "}
          <Link href="/privacidad">
            <span className="underline cursor-pointer" style={{ color: "#e91e8c" }}>política de privacidad</span>
          </Link>
          . Tus datos se usarán solo para atender tu solicitud.
        </label>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:scale-[1.02]"
        style={{ background: "#25D366" }}
      >
        <MessageCircle size={16} />
        Enviar por WhatsApp
      </button>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function HumanoProfile() {
  const params = useParams<{ slug: string }>();
  const [humano, setHumano] = useState<HumanoData | null | undefined>(
    HUMANOS.find((h) => h.slug === params.slug) ?? undefined
  );

  // Testimonios aleatorios — hook ANTES de cualquier return condicional
  const [testimonials, setTestimonials] = useState<HumanoData["testimonials"]>([]);

  useEffect(() => {
    fetch(`/api/profiles/${params.slug}`)
      .then((r) => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then((data) => setHumano(normalizeApiProfile(data as Record<string, unknown>)))
      .catch(() => setHumano((prev) => prev ?? null));
  }, [params.slug]);

  // Actualiza testimonios cuando humano carga (inicial o desde API)
  useEffect(() => {
    if (!humano) return;
    if (humano.testimonials.length >= 2) {
      setTestimonials(humano.testimonials);
    } else {
      setTestimonials([...TESTIMONIAL_POOL].sort(() => Math.random() - 0.5).slice(0, 3));
    }
  }, [humano]);

  // ── Estados de carga / no encontrado ──
  if (humano === undefined) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!humano) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <User size={64} className="mb-6 opacity-20" style={{ color: "#e91e8c" }} />
          <h1 className="text-3xl font-black text-white mb-4">Asesor no encontrado</h1>
          <p className="text-white/50 mb-8">El perfil que buscas no existe o ha cambiado de URL.</p>
          <Link href="/humanos">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg, #e91e8c, #7b2ff7)" }}>
              <ArrowLeft size={16} />Ver todos los asesores
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Datos con fallback ──
  const humanoIdx = HUMANOS.findIndex((h) => h.slug === humano.slug);
  const avatarColor = AVATAR_COLORS[Math.max(humanoIdx, 0) % AVATAR_COLORS.length];
  const initials = humano.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const whatsappUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent(humano.whatsappMsg)}`;
  const widgetUrl = humano.invoiceCtaUrl || WIDGET_URL;
  const services = humano.services.length >= 2 ? humano.services : DEFAULT_SERVICES;
  const process  = humano.process.length >= 2  ? humano.process  : DEFAULT_PROCESS;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar />

      {/* ══ 1. HERO — foto pequeña izq · iframe prominente der ════════════ */}
      <section
        id="factura"
        className="relative pt-24 pb-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #0f0520 55%, #0a0a0a 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(233,30,140,0.09) 0%, transparent 55%)" }}
        />
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <Link href="/humanos">
            <span className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer mb-8">
              <ArrowLeft size={14} />Todos los asesores
            </span>
          </Link>

          {/* Grid principal: tarjeta asesor (5/12) · iframe (7/12) */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">

            {/* ── Columna izquierda: tarjeta del asesor ── */}
            <div className="lg:col-span-5 flex flex-col">
              <div
                className="rounded-2xl p-7 flex flex-col flex-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Foto grande centrada */}
                <div className="flex flex-col items-center mb-5">
                  <div className="relative mb-4">
                    {humano.image ? (
                      <>
                        <img
                          src={humano.image}
                          alt={humano.name}
                          className="w-28 h-28 rounded-2xl object-cover object-top"
                          style={{ border: "2px solid rgba(233,30,140,0.35)" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fb = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fb) fb.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-28 h-28 rounded-2xl hidden items-center justify-center text-3xl font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}80)`, border: "2px solid rgba(233,30,140,0.35)" }}
                        >
                          {initials}
                        </div>
                      </>
                    ) : (
                      <div
                        className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}80)`, border: "2px solid rgba(233,30,140,0.35)" }}
                      >
                        {initials}
                      </div>
                    )}
                    {/* Dot de estado */}
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                      style={{
                        background: humano.status === "online" ? "#39d353" : humano.status === "busy" ? "#f59e0b" : "#6b7280",
                        borderColor: "#111",
                        boxShadow: `0 0 6px ${humano.status === "online" ? "#39d353" : humano.status === "busy" ? "#f59e0b" : "#6b7280"}`,
                      }}
                    />
                  </div>

                  {/* Badge + estado */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2 uppercase tracking-wider"
                    style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
                  >
                    Asesor Energético
                  </div>
                  <StatusDot status={humano.status} />
                </div>

                {/* Nombre + rol */}
                <h1
                  className="text-2xl font-black text-white mb-0.5 leading-tight text-center"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {humano.fullName || humano.name}
                </h1>
                {humano.role && <p className="text-white/50 text-sm mb-4 text-center">{humano.role}</p>}

                {/* Stats */}
                {humano.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {humano.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl px-3 py-2.5 text-center"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <div className="text-base font-black leading-none mb-0.5" style={{ color: "#e91e8c" }}>{stat.value}</div>
                        <div className="text-xs text-white/40 leading-tight">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Descripción del asesor */}
                {humano.description && (
                  <p className="text-white/60 text-sm leading-relaxed mb-5 text-center">{humano.description}</p>
                )}

                {/* Top compañías */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={12} style={{ color: "#e91e8c" }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#e91e8c" }}>
                      Top compañías ahora
                    </span>
                  </div>
                  <LiveRanking initialCompanies={humano.topCompanies} />
                </div>

                {/* CTAs */}
                <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle size={15} />WhatsApp
                    </a>
                    <a
                      href={PHONE}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      <Phone size={15} />Llamar
                    </a>
                  </div>
                  <a
                    href={EMAIL}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                  >
                    <Mail size={14} />{EMAIL.replace("mailto:", "")}
                  </a>
                  {humano.schedule && (
                    <p className="text-white/25 text-xs text-center mt-3">
                      Horario: {humano.schedule} · Urgencias por WhatsApp
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Columna derecha: iframe prominente ── */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} style={{ color: "#e91e8c" }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#e91e8c" }}>
                      Análisis gratuito · 2 minutos
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Sube tu factura y descubre cuánto ahorras
                  </h2>
                </div>
              </div>
              <div
                className="rounded-2xl overflow-hidden flex-1"
                style={{
                  border: "1px solid rgba(233,30,140,0.25)",
                  boxShadow: "0 0 60px rgba(233,30,140,0.12)",
                  minHeight: 820,
                }}
              >
                <iframe
                  src={widgetUrl}
                  title="Analiza tu factura de energía"
                  className="w-full h-full block"
                  style={{ minHeight: 820, border: "none", background: "#fff" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. SERVICIOS + PROCESO ════════════════════════════════════════ */}
      <section className="py-14" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* En qué te ayudo */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-lg font-black text-white mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                En qué te ayudo
              </h2>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service} className="flex items-start gap-3">
                    <CheckCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#39d353" }} />
                    <span className="text-white/70 text-sm leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cómo trabajamos */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-lg font-black text-white mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Cómo trabajamos
              </h2>
              <div className="space-y-4">
                {process.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background: i === 0 ? "linear-gradient(135deg, #e91e8c, #7b2ff7)" : "rgba(255,255,255,0.07)",
                        color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <a
                  href="#factura"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #7b2ff7)", boxShadow: "0 0 20px rgba(233,30,140,0.25)" }}
                >
                  <Zap size={15} />Empezar ahora — es gratis<ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. TESTIMONIOS ════════════════════════════════════════════════ */}
      <section className="py-14" style={{ background: "linear-gradient(180deg, #0a0a0a, #0f0520)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <h2
            className="text-xl font-black text-white mb-7 text-center"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Qué dicen mis clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 italic flex-1">"{t.text}"</p>
                <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-white font-bold text-sm">{t.author}</div>
                  <div className="text-white/40 text-xs mt-0.5">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. FORMULARIO WHATSAPP ═════════════════════════════════════════ */}
      <section className="py-14" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div
            className="rounded-2xl p-8"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <ContactForm humano={humano} />
          </div>
        </div>
      </section>

      {/* ══ 5. OTROS ASESORES ═════════════════════════════════════════════ */}
      <section className="py-14" style={{ background: "linear-gradient(180deg, #0a0a0a, #0f0520)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <h2 className="text-xl font-black text-white mb-7 text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Otros asesores del equipo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HUMANOS.filter((h) => h.slug !== humano.slug).slice(0, 3).map((h) => {
              const hIdx = HUMANOS.findIndex((x) => x.slug === h.slug);
              const hColor = AVATAR_COLORS[hIdx % AVATAR_COLORS.length];
              const hInitials = h.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <Link key={h.slug} href={`/humanos/${h.slug}`}>
                  <div
                    className="rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="relative flex-shrink-0">
                      {h.image ? (
                        <>
                          <img src={h.image} alt={h.name} className="w-12 h-12 rounded-xl object-cover object-top"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fb = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fb) fb.style.display = "flex";
                            }} />
                          <div className="w-12 h-12 rounded-xl hidden items-center justify-center text-base font-black text-white"
                            style={{ background: `linear-gradient(135deg, ${hColor}, ${hColor}80)` }}>
                            {hInitials}
                          </div>
                        </>
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${hColor}, ${hColor}80)` }}>
                          {hInitials}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                        style={{ background: h.status === "online" ? "#39d353" : "#f59e0b", borderColor: "#0a0a0a" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-white text-sm truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>{h.name}</div>
                      <div className="text-white/45 text-xs truncate mt-0.5">{h.role}</div>
                    </div>
                    <ChevronRight size={14} className="text-white/25 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-7">
            <Link href="/humanos">
              <span
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm cursor-pointer transition-all hover:scale-105"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
              >
                Ver todo el equipo<ChevronRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
