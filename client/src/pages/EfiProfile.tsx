// ============================================================
// EFIZIENTIA · Página de perfil individual de cada Efi
// Design: Dark Tech, magenta #e91e8c, fondo negro #0a0a0a
// Incluye: KPIs, barras animadas, gráfico de ahorro, simulador,
//          ranking de compañías, avatar flotante con aura neon
// ============================================================
import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "wouter";
import { EFIS, WIDGET_URL } from "@/data/efis";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import ChatModal from "@/components/ChatModal";

// ── Animación de contador numérico ──────────────────────────
function useCountUp(target: number, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

// ── Gráfico de barras SVG ────────────────────────────────────
function SavingsChart({ data, color }: { data: { month: string; saving: number; bill: number }[]; color: string }) {
  const maxBill = Math.max(...data.map((d) => d.bill));
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-36">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "120px", justifyContent: "flex-end" }}>
              {/* Barra de factura */}
              <div
                className="w-full rounded-t-md relative overflow-hidden"
                style={{
                  height: `${(d.bill / maxBill) * 100}px`,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Barra de ahorro superpuesta */}
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md"
                  style={{
                    height: `${d.saving}%`,
                    background: `linear-gradient(to top, ${color}, ${color}88)`,
                    boxShadow: `0 0 8px ${color}66`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-white/40">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white/10" />
          <span>Factura original</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
          <span>Ahorro conseguido</span>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function EfiProfile() {
  const params = useParams<{ slug: string }>();
  const efi = EFIS.find((e) => e.slug === params.slug);

  const [visible, setVisible] = useState(false);
  const [simState, setSimState] = useState<Record<string, boolean>>({});
  const [chatOpen, setChatOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, [params.slug]);

  // Hover 3D en avatar
  const handleAvatarMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = avatarRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  }, []);
  const handleAvatarLeave = useCallback(() => {
    if (avatarRef.current) avatarRef.current.style.transform = "";
  }, []);

  // Cálculo del simulador
  const simSaving = efi
    ? efi.simItems.reduce((acc, item) => acc + (simState[item.id] ? item.pct : 0), 0)
    : 0;
  const simEur = Math.round(150 * simSaving / 100);

  if (!efi) return <NotFound />;

  const accentColor = efi.color;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Fondo con gradiente del color del Efi */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 70% 40% at 80% -5%, ${efi.glowColor}, transparent 60%), radial-gradient(ellipse 50% 30% at 10% 0%, rgba(130,0,255,0.08), transparent 55%)`,
        }}
      />

      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/efis" className="hover:text-white transition-colors">Los Efizientes</Link>
            <span>/</span>
            <span style={{ color: accentColor }}>{efi.name}</span>
          </div>

          {/* ── HEADER: Avatar + Título + CTAs ── */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-6 border border-white/8"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 85% -10%, ${efi.glowColor}, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 0%, rgba(130,0,255,0.08), transparent 55%), rgba(255,255,255,0.03)`,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset",
            }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar flotante con aura */}
              <div className="relative flex-shrink-0" style={{ animation: "efzFloat 5s ease-in-out infinite" }}>
                <div
                  ref={avatarRef}
                  onMouseMove={handleAvatarMove}
                  onMouseLeave={handleAvatarLeave}
                  className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: `0 0 30px ${efi.glowColor}, 0 0 0 1px rgba(255,255,255,0.08) inset`,
                    transition: "transform 0.15s ease",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <img src={efi.image} alt={efi.name} className="w-full h-full object-cover" />
                  {/* Aura pulsante */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(60% 60% at 50% 50%, ${efi.glowColor}, transparent 65%)`,
                      filter: "blur(16px)",
                      animation: "efzPulse 2.2s ease-in-out infinite",
                    }}
                  />
                </div>
                {/* Ring giratorio */}
                <div
                  className="absolute -inset-1 rounded-2xl pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${accentColor}cc, transparent 55%)`,
                    WebkitMask: "radial-gradient(closest-side, transparent 73%, #000 74%)",
                    mask: "radial-gradient(closest-side, transparent 73%, #000 74%)",
                    animation: "efzSpin 6s linear infinite",
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1
                  className="font-black text-white mb-1"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05 }}
                >
                  {efi.fullName}
                </h1>
                <p className="font-semibold mb-2" style={{ color: accentColor, fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                  {efi.role}
                </p>
                <p className="text-white/60 mb-4 max-w-xl" style={{ fontSize: "clamp(0.85rem, 2vw, 0.95rem)" }}>
                  {efi.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                  {efi.badges.map((b) => (
                    <span
                      key={b}
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}bb, #b300ffaa)`,
                        boxShadow: `0 0 12px ${accentColor}33`,
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href={WIDGET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #b300ff)`,
                      boxShadow: `0 0 24px ${accentColor}55`,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Optimizar mi factura
                  </a>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
                    style={{
                      background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                      border: `1px solid ${accentColor}55`,
                      boxShadow: `0 0 16px ${accentColor}22`,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Chatea con {efi.name}
                  </button>
                  <Link
                    href="/efis"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white/70 border border-white/12 hover:border-white/25 hover:text-white transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Ver todos los Efis
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── GRID PRINCIPAL ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Columna izquierda (3/5) */}
            <div className="lg:col-span-3 flex flex-col gap-6">

              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {efi.kpis.map((kpi, i) => (
                  <KpiCard key={i} value={kpi.value} label={kpi.label} color={accentColor} active={visible} />
                ))}
              </div>

              {/* Habilidades */}
              <div
                className="rounded-2xl p-5 border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span style={{ color: accentColor }}>⚡</span> Habilidades
                </h3>
                <div className="flex flex-col gap-3">
                  {efi.skills.map((skill, i) => (
                    <SkillBar key={i} label={skill.label} pct={skill.pct} color={accentColor} active={visible} delay={i * 100} />
                  ))}
                </div>
              </div>

              {/* Gráfico de ahorro */}
              <div
                className="rounded-2xl p-5 border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <span style={{ color: accentColor }}>📊</span> Ahorro medio mensual
                </h3>
                <p className="text-white/40 text-sm mb-4">Últimos 6 meses · Clientes de {efi.name}</p>
                <SavingsChart data={efi.chartData} color={accentColor} />
              </div>

              {/* Fun fact */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}11, rgba(130,0,255,0.08))`,
                  borderColor: `${accentColor}33`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
                      Dato curioso
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">{efi.funFact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Simulador de ahorro */}
              <div
                className="rounded-2xl p-5 border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <span style={{ color: accentColor }}>🔧</span> Simulador de ahorro
                </h3>
                <p className="text-white/40 text-xs mb-4">Activa las medidas que aplicarías</p>

                <div className="flex flex-col gap-2 mb-4">
                  {efi.simItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        background: simState[item.id] ? `${accentColor}15` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${simState[item.id] ? accentColor + "44" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.label}</p>
                        <p className="text-xs text-white/40 truncate">{item.hint}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold" style={{ color: accentColor }}>+{item.pct}%</span>
                        <div
                          className="relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer"
                          style={{
                            background: simState[item.id]
                              ? `linear-gradient(90deg, ${accentColor}, #b300ff)`
                              : "rgba(255,255,255,0.12)",
                          }}
                          onClick={() => setSimState((s) => ({ ...s, [item.id]: !s[item.id] }))}
                        >
                          <div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                            style={{ left: simState[item.id] ? "calc(100% - 18px)" : "2px" }}
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Resultado */}
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}44`,
                  }}
                >
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Ahorro estimado</p>
                    <p className="text-2xl font-black" style={{ color: accentColor }}>{simSaving}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50 mb-0.5">En euros/mes</p>
                    <p className="text-2xl font-black text-white">{simEur}€</p>
                  </div>
                </div>

                <a
                  href={WIDGET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl font-black text-white text-sm transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #b300ff)`,
                    boxShadow: `0 0 20px ${accentColor}44`,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Subir mi factura real
                </a>
              </div>

              {/* Top compañías recomendadas */}
              <div
                className="rounded-2xl p-5 border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <span style={{ color: accentColor }}>🏆</span> Top compañías
                </h3>
                <p className="text-white/40 text-xs mb-4">Recomendadas por {efi.name}</p>

                <div className="flex flex-col gap-3">
                  {efi.topCompanies.map((company, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* Medalla */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black flex-shrink-0"
                        style={{ background: company.medal }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{company.name}</p>
                        <div className="h-1.5 bg-white/8 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: visible ? `${company.score}%` : "0%",
                              background: `linear-gradient(90deg, ${accentColor}, #b300ff)`,
                              boxShadow: `0 0 6px ${accentColor}66`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-black flex-shrink-0" style={{ color: accentColor }}>
                        {company.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Especialidad */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}11, rgba(130,0,255,0.08))`,
                  borderColor: `${accentColor}33`,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                  Especialidad
                </p>
                <p className="text-white font-bold text-lg">{efi.speciality}</p>
              </div>
            </div>
          </div>

          {/* ── Otros Efis ── */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-white mb-6">
              Conoce al resto del{" "}
              <span style={{ color: accentColor }}>equipo</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {EFIS.filter((e) => e.slug !== efi.slug).map((other) => (
                <Link key={other.slug} href={`/efis/${other.slug}`}>
                  <div className="group relative rounded-xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer">
                    <img
                      src={other.image}
                      alt={other.name}
                      className="w-full aspect-square object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 30%, transparent)" }}
                    />
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <p className="text-xs font-black text-white">{other.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes para animaciones */}
      <style>{`
        @keyframes efzFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes efzPulse { 0%,100%{opacity:.55} 50%{opacity:.9} }
        @keyframes efzSpin { to{transform:rotate(360deg)} }
      `}</style>
      <Footer />

      {/* Chat Modal */}
      <ChatModal
        efiName={efi.name}
        efiColor={accentColor}
        efiImage={efi.image}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}

// ── KpiCardcomponentes ──────────────────────────────────────────
function KpiCard({ value, label, color, active }: { value: string; label: string; color: string; active: boolean }) {
  const isNum = /^\d+/.test(value);
  const numPart = isNum ? parseInt(value.replace(/[^\d]/g, "")) : 0;
  const suffix = isNum ? value.replace(/^\d+/, "") : value;
  const count = useCountUp(numPart, 1200, active);

  return (
    <div
      className="rounded-xl p-4 border border-white/8"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="text-xl font-black" style={{ color }}>
        {isNum ? `${count}${suffix}` : value}
      </div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
    </div>
  );
}

function SkillBar({
  label, pct, color, active, delay,
}: {
  label: string; pct: number; color: string; active: boolean; delay: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [active, pct, delay]);

  return (
    <div>
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}, #b300ff)`,
            boxShadow: `0 0 8px ${color}66`,
            transition: "width 900ms ease",
          }}
        />
      </div>
    </div>
  );
}
