/**
 * Efizientia Hero Section
 * Design: Fondo negro con carrusel de imágenes a pantalla completa (sticky/fixed).
 * Las imágenes tienen un aura negra (gradiente radial + bordes) que las integra con el fondo.
 * El texto y el iframe flotan encima sobre el fondo oscuro.
 * Carrusel automático con transición crossfade cada 5s.
 * Botón de play en la imagen (decorativo, como en el original).
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Zap, CheckCircle2 } from "lucide-react";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

// Imágenes del carrusel subidas al CDN
const HERO_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero1_a3fbf53c.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero2_195ddc15.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero3_e3745729.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero4_fd46090f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663410228097/bNfkAWeepfmaxGPG4ffp7D/hero5_e07fdd4c.jpg",
];

const SLIDE_DURATION = 5000; // ms por imagen

// Widget iframe
// Altura medida del widget en paso 1: ~895px del contenedor + header 60px
// Se usa polling agresivo porque el widget es cross-origin y no envía postMessage
const WIDGET_STEP1_HEIGHT = 960;
const WIDGET_MIN_HEIGHT = 500;

export default function HeroSection() {
  // Carrusel
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Iframe — altura dinámica
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Empezamos con la altura medida del paso 1 (~895px contenido + 60px header)
  const [iframeHeight, setIframeHeight] = useState(WIDGET_STEP1_HEIGHT);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeightRef = useRef(WIDGET_STEP1_HEIGHT);

  // ── Carrusel automático ──
  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setPrev(current);
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 900);
  }, [current, transitioning]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % HERO_IMAGES.length;
        setPrev(c);
        setTransitioning(true);
        setTimeout(() => {
          setPrev(null);
          setTransitioning(false);
        }, 900);
        return next;
      });
    }, SLIDE_DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // ── Iframe autoajuste ──
  // Solo actualiza si la nueva altura es mayor que la actual o si ha bajado significativamente
  const updateHeight = useCallback((h: number) => {
    if (h < WIDGET_MIN_HEIGHT) return;
    const newH = h + 32; // padding extra
    // Siempre permitir crecer; solo reducir si la diferencia es >100px (cambio de paso)
    if (newH > lastHeightRef.current || lastHeightRef.current - newH > 100) {
      lastHeightRef.current = newH;
      setIframeHeight(newH);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("kiwatio") && !event.origin.includes("efizientia")) return;
      const data = event.data;
      if (!data) return;
      let h: number | null = null;
      if (typeof data === "number" && data > 100) h = data;
      else if (typeof data === "object") {
        h = data.height ?? data.iframeHeight ?? data.frameHeight ?? null;
      } else if (typeof data === "string") {
        const n = parseInt(data, 10);
        if (!isNaN(n) && n > 100) h = n;
        else { try { const o = JSON.parse(data); h = o?.height ?? null; } catch {} }
      }
      if (h !== null) updateHeight(h);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateHeight]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Intentar acceso same-origin primero
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        const measure = () => {
          const h = Math.max(
            doc.documentElement.scrollHeight,
            doc.body.scrollHeight,
            doc.documentElement.offsetHeight,
            doc.body.offsetHeight
          );
          updateHeight(h);
        };
        measure();
        // ResizeObserver para detectar cambios de contenido (resultados del paso 2+)
        const ro = new ResizeObserver(measure);
        ro.observe(doc.body);
        ro.observe(doc.documentElement);
        // También polling cada 500ms durante los primeros 30s por si hay animaciones
        let ticks = 0;
        pollingRef.current = setInterval(() => {
          measure();
          ticks++;
          if (ticks > 60) { // 30 segundos
            if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
          }
        }, 500);
        return;
      }
    } catch {
      // cross-origin: el widget bloquea acceso directo
    }

    // Fallback cross-origin: polling agresivo usando postMessage de solicitud
    // El widget no implementa iframeResizer, así que usamos un truco:
    // enviamos un mensaje al iframe pidiendo su altura (por si lo implementa en el futuro)
    const requestHeight = () => {
      try {
        iframe.contentWindow?.postMessage({ type: 'getHeight', action: 'resize' }, '*');
      } catch {}
    };

    pollingRef.current = setInterval(() => {
      requestHeight();
      // También intentar acceso directo por si cambia la política
      try {
        const doc2 = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc2 && doc2.body) {
          const nh = Math.max(
            doc2.documentElement.scrollHeight,
            doc2.body.scrollHeight
          );
          updateHeight(nh);
        }
      } catch {}
    }, 500);
  }, [updateHeight]);

  useEffect(() => () => { if (pollingRef.current) clearInterval(pollingRef.current); }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#000", minHeight: "100vh" }}
    >
      {/* ══════════════════════════════════════
          CARRUSEL DE FONDO — imágenes crossfade
      ══════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : i === prev ? 0 : 0,
              transition: i === current
                ? "opacity 0.9s ease-in-out"
                : i === prev
                ? "opacity 0.9s ease-in-out"
                : "none",
              zIndex: i === current ? 2 : i === prev ? 1 : 0,
            }}
          >
            {/* Imagen de fondo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Aura negra — gradiente radial desde los bordes hacia el centro */}
            {/* Borde izquierdo */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.4) 35%, transparent 55%)",
              zIndex: 1,
            }} />
            {/* Borde derecho */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to left, #000 0%, rgba(0,0,0,0.7) 15%, transparent 40%)",
              zIndex: 1,
            }} />
            {/* Borde superior */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.5) 8%, transparent 25%)",
              zIndex: 1,
            }} />
            {/* Borde inferior */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.8) 20%, transparent 45%)",
              zIndex: 1,
            }} />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          CONTENIDO — texto + iframe
      ══════════════════════════════════════ */}
      <div
        className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl"
        style={{ paddingTop: "100px", paddingBottom: "100px" }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Texto ── */}
          <div className="relative">
            {/* Botón play decorativo (como en el original, sobre la imagen) */}
            <div
              className="absolute"
              style={{ bottom: "40px", left: "20px", zIndex: 20 }}
            >
              <button
                className="flex items-center justify-center rounded-full border-2 border-white/80 text-white/90 hover:scale-110 transition-transform duration-200"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)",
                }}
                aria-label="Ver vídeo"
              >
                <Play size={26} fill="white" />
              </button>
            </div>

            <p
              className="text-sm font-bold tracking-widest uppercase mb-4"
              style={{ color: "#e91e8c", fontFamily: "'Nunito Sans', sans-serif" }}
            >
              !!aunque parezca mentira!!
            </p>
            <h1
              className="font-black text-white leading-none mb-5"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(3.2rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              }}
            >
              Sube tu factura.{" "}
              <br />
              Nosotros hackeamos tu precio de la luz.
            </h1>
            <p
              className="text-white/80 text-base leading-relaxed mb-6"
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                maxWidth: "520px",
              }}
            >
              Sube tu factura y olvídate de las tarifas abusivas. Hackeamos el mercado eléctrico,
              cazamos el mejor precio oculto y lo ponemos a tu nombre. Sin rodeos, sin tecnicismos,
              solo ahorro real.
            </p>

            {/* Beneficios */}
            <ul className="space-y-2 mb-8">
              {[
                "Sin permanencias ni letra pequeña",
                "Comparamos +175 compañías",
                "Ahorro medio del 32%",
                "Contratación en menos de 5 minutos",
                "Centralita 24h · Atención inmediata",
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} style={{ color: "#e91e8c", flexShrink: 0 }} />
                  <span
                    className="text-white/80 font-semibold text-sm"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pills de pasos */}
            <div className="flex flex-wrap gap-2">
              {["Sube tus facturas", "Comparamos por ti", "Contratación en 5 min", "SMS de confirmación", "Atención 24h"].map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(233,30,140,0.15)",
                    color: "#e91e8c",
                    border: "1px solid rgba(233,30,140,0.35)",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <Zap size={10} />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Iframe widget ── */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Header bar oscuro */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#0d0d0d" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#e91e8c" }}
              >
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <p
                  className="text-white font-black text-sm leading-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Optimiza tu factura ahora
                </p>
                <p className="text-white/40 text-xs" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Estudio gratuito · Sin compromiso
                </p>
              </div>
              <div className="ml-auto flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              </div>
            </div>

            {/* Iframe wrapper — altura dinámica, sin overflow hidden para que los resultados sean visibles */}
            <div
              style={{
                position: "relative",
                height: iframeHeight,
                minHeight: WIDGET_STEP1_HEIGHT,
                transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              {!iframeLoaded && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
                  style={{ backgroundColor: "#f9f9f9" }}
                >
                  <div
                    className="w-10 h-10 rounded-full border-4 border-gray-200"
                    style={{ borderTopColor: "#e91e8c", animation: "efispin 0.8s linear infinite" }}
                  />
                  <p className="text-gray-400 text-sm font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    Cargando...
                  </p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={WIDGET_URL}
                title="Estudio de factura Efizientia"
                width="100%"
                frameBorder="0"
                scrolling="no"
                allow="clipboard-write; camera"
                onLoad={handleIframeLoad}
                style={{
                  display: "block",
                  border: "none",
                  width: "100%",
                  // El iframe tiene altura fija igual al wrapper; el wrapper crece con los resultados
                  height: iframeHeight,
                  minHeight: WIDGET_STEP1_HEIGHT,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          INDICADORES del carrusel (dots)
      ══════════════════════════════════════ */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20"
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Imagen ${i + 1}`}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === current ? "#e91e8c" : "rgba(255,255,255,0.4)",
              transition: "all 0.3s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes efispin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
