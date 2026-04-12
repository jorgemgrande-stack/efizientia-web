/**
 * Efizientia Ranking Section
 * Design: Fondo negro, aura neon rosa en Top3, barras animadas, movimiento de posiciones en últimos 3
 * Logos reales de efizientia.es, animación de respiración neon, ranking en vivo simulado
 */
import { useEffect, useRef, useState } from "react";

const BASE_LOGO = "/images/";

const INITIAL_RANKING = [
  { id: 8,  pos: 8,  name: "Repsol",         savings: 16, logo: BASE_LOGO + "repsol_png.png",         mover: true  },
  { id: 9,  pos: 9,  name: "Acciona",         savings: 15, logo: BASE_LOGO + "acciona_transp-1.png",   mover: true  },
  { id: 10, pos: 10, name: "Energía Galega",  savings: 14, logo: BASE_LOGO + "energia_galega.jpg",     mover: true  },
  { id: 4,  pos: 4,  name: "Holaluz",         savings: 21, logo: BASE_LOGO + "hola.png",               mover: false },
  { id: 5,  pos: 5,  name: "Feníe Energía",   savings: 20, logo: BASE_LOGO + "fenie_energia.png",      mover: false },
  { id: 6,  pos: 6,  name: "Fox Energía",     savings: 18, logo: BASE_LOGO + "fox_energia.png",        mover: false },
  { id: 7,  pos: 7,  name: "Iberdrola",       savings: 17, logo: BASE_LOGO + "iberdrola_transp.png",   mover: false },
];

const TOP3 = [
  { id: 1, pos: 1, name: "Audax",      savings: 36, logo: BASE_LOGO + "audax.png"        },
  { id: 2, pos: 2, name: "VM Energía", savings: 32, logo: BASE_LOGO + "vm_energia.png"   },
  { id: 3, pos: 3, name: "Aldro",      savings: 24, logo: BASE_LOGO + "aldro_energia.png"},
];

/* ── Tarjeta normal (pos 4-10) ── */
function RestCard({ item, animated }: { item: typeof INITIAL_RANKING[0]; animated: boolean }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setFilled(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="efz-rest-card"
      style={{
        position: "relative",
        background: "linear-gradient(180deg,#14151b 0%,#0f1015 100%)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "16px",
        padding: "16px",
        minHeight: "100px",
        overflow: "hidden",
        transition: animated ? "transform .4s ease, box-shadow .4s ease" : "transform .25s ease",
        transform: animated ? "translateY(-8px) scale(1.03)" : "none",
      }}
    >
      {/* Número posición */}
      <div style={{
        position: "absolute", top: 10, left: 10,
        width: 28, height: 28, borderRadius: "50%",
        display: "grid", placeItems: "center",
        font: "800 11px/1 system-ui", color: "#0b0b0f",
        background: "radial-gradient(100% 100% at 30% 30%, #ffe3f9 0%, #ff9ef0 100%)",
        boxShadow: "0 0 0 2px #111217, 0 0 16px rgba(255,43,214,.3)",
      }}>
        {item.pos}
      </div>

      {/* Fila logo + nombre + % */}
      <div style={{ display: "grid", gridTemplateColumns: "52px 1fr auto", alignItems: "center", gap: 10, paddingLeft: 36 }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, background: "#0b0b0f", border: "1px solid rgba(255,255,255,.06)", display: "grid", placeItems: "center", overflow: "hidden" }}>
          <img src={item.logo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, fontFamily: "'Montserrat', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </span>
        <span style={{ color: "#e91e8c", fontWeight: 800, fontSize: 14, padding: "5px 9px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", fontFamily: "'Montserrat', sans-serif" }}>
          {item.savings}%
        </span>
      </div>

      {/* Barra */}
      <div style={{ marginTop: 10, height: 10, background: "#191920", border: "1px solid rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: filled ? `${item.savings}%` : "0%",
          background: "linear-gradient(90deg, #ff2bd6 0%, #b300ff 100%)",
          boxShadow: "0 0 14px rgba(255,43,214,.45), 0 0 22px rgba(179,0,255,.35) inset",
          borderRadius: 999,
          transition: "width 1.1s cubic-bezier(.2,.8,.2,1)",
        }} />
      </div>
    </div>
  );
}

/* ── Tarjeta Top 3 con aura neon ── */
function TopCard({ item }: { item: typeof TOP3[0] }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setFilled(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="efz-top-card" style={{
      position: "relative",
      background: "linear-gradient(180deg,#14151b 0%,#0f1015 100%)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 16,
      padding: 16,
      minHeight: 116,
      overflow: "hidden",
      transform: "scale(1.04)",
      boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset, 0 0 26px rgba(255,43,214,.30), 0 0 52px rgba(179,0,255,.20)",
      transition: "transform .25s ease, box-shadow .25s ease",
    }}>
      {/* Aura neon de fondo */}
      <div style={{
        position: "absolute", inset: "-55%",
        background: "radial-gradient(45% 45% at 30% 20%, rgba(255,43,214,.25) 0%, transparent 70%), radial-gradient(55% 55% at 70% 80%, rgba(179,0,255,.18) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0, opacity: 0.85,
        animation: "efzNeonBreath 3s ease-in-out infinite",
      }} />

      {/* Contenido sobre el aura */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Número posición */}
        <div style={{
          position: "absolute", top: -4, left: -4,
          width: 30, height: 30, borderRadius: "50%",
          display: "grid", placeItems: "center",
          font: "800 12px/1 system-ui", color: "#0b0b0f",
          background: "radial-gradient(100% 100% at 30% 30%, #ffe3f9 0%, #ff9ef0 100%)",
          boxShadow: "0 0 0 2px #111217, 0 0 22px rgba(255,43,214,.35)",
        }}>
          {item.pos}
        </div>

        {/* Fila logo + nombre + % */}
        <div style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 12, paddingLeft: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "#0b0b0f", border: "1px solid rgba(255,255,255,.06)", display: "grid", placeItems: "center", overflow: "hidden" }}>
            <img src={item.logo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, fontFamily: "'Montserrat', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.name}
          </span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, padding: "6px 10px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", fontFamily: "'Montserrat', sans-serif" }}>
            {item.savings}%
          </span>
        </div>

        {/* Barra */}
        <div style={{ marginTop: 10, height: 12, background: "#191920", border: "1px solid rgba(255,255,255,.06)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: filled ? `${item.savings}%` : "0%",
            background: "linear-gradient(90deg, #ff2bd6 0%, #b300ff 100%)",
            boxShadow: "0 0 18px rgba(255,43,214,.45), 0 0 28px rgba(179,0,255,.35) inset",
            borderRadius: 999,
            transition: "width 1.1s cubic-bezier(.2,.8,.2,1)",
          }} />
        </div>
      </div>
    </div>
  );
}

/* ── Sección principal ── */
export default function RankingSection() {
  const [restItems, setRestItems] = useState(INITIAL_RANKING);
  const [animatedId, setAnimatedId] = useState<number | null>(null);

  // Animación de movimiento de posiciones (últimos 3 movers)
  useEffect(() => {
    const movers = INITIAL_RANKING.filter(i => i.mover).map(i => i.id);

    function riseAndReturn(id: number, steps: number, totalMs: number) {
      const stepMs = totalMs / (steps * 2);
      let up = 0, down = 0;

      setAnimatedId(id);

      const upInt = setInterval(() => {
        setRestItems(prev => {
          const arr = [...prev];
          const i = arr.findIndex(x => x.id === id);
          if (i > 0 && up < steps) {
            [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
            up++;
            return arr;
          } else {
            clearInterval(upInt);
            const downInt = setInterval(() => {
              setRestItems(prev2 => {
                const arr2 = [...prev2];
                const j = arr2.findIndex(x => x.id === id);
                if (j < arr2.length - 1 && down < steps) {
                  [arr2[j], arr2[j + 1]] = [arr2[j + 1], arr2[j]];
                  down++;
                  return arr2;
                } else {
                  clearInterval(downInt);
                  setAnimatedId(null);
                  return arr2;
                }
              });
            }, stepMs);
            return arr;
          }
        });
      }, stepMs);
    }

    function loop() {
      const pick = movers[Math.floor(Math.random() * movers.length)];
      const steps = 1 + Math.floor(Math.random() * 2);
      riseAndReturn(pick, steps, 3600 + Math.floor(Math.random() * 1200));
    }

    const interval = setInterval(loop, 4200);
    const t1 = setTimeout(loop, 1200);
    const t2 = setTimeout(loop, 2400);
    const t3 = setTimeout(loop, 3600);

    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes efzNeonBreath {
          0%, 100% { transform: scale(1); opacity: .75; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .efz-top-card:hover {
          box-shadow: 0 0 0 1px rgba(255,255,255,.10) inset,
                      0 0 40px rgba(255,43,214,.65),
                      0 0 90px rgba(179,0,255,.55) !important;
          transform: scale(1.07) !important;
        }
        .efz-rest-card:hover {
          transform: translateY(-2px) !important;
          border-color: rgba(255,255,255,.12) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,.35) !important;
        }
      `}</style>

      <section className="section-dark py-20" id="ranking">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="label-tag mb-3">Comparativa actualizada</p>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <span style={{
                background: "linear-gradient(90deg, #e91e8c 0%, #b300ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Top 10 # Ranking Compañías Recomendadas
              </span>
            </h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Basado en el ahorro real conseguido para nuestros clientes este mes
            </p>
          </div>

          {/* Top 3 — escala mayor, aura neon */}
          <div style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginBottom: 56,
            padding: "0 8px",
          }}>
            {TOP3.map(item => <TopCard key={item.id} item={item} />)}
          </div>

          {/* Resto (4-10) — con movimiento animado */}
          <div style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}>
            {restItems.map(item => (
              <RestCard key={item.id} item={item} animated={animatedId === item.id} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
