/**
 * Efizientia Hero Section
 * Design: Fondo degradado claro con iframe del widget externo de estudio de factura
 * - Supertítulo: "!!aunque parezca mentira!!"
 * - Título: "Sube tu factura. Nosotros hackeamos tu precio de la luz."
 * - Iframe: widget externo con autoajuste de altura via postMessage
 *
 * NOTA: El widget tiene CSP frame-ancestors restringido a efizientia.es.
 * En producción (dominio efizientia.es) cargará correctamente.
 * El autoajuste de altura funciona mediante:
 *   1. postMessage del widget (si lo emite)
 *   2. ResizeObserver sobre el iframe (si es same-origin)
 *   3. Polling del scrollHeight del iframe (fallback cross-origin)
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Zap, CheckCircle2 } from "lucide-react";

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

const steps = [
  { id: 1, label: "Sube tus facturas" },
  { id: 2, label: "Comparamos por ti" },
  { id: 3, label: "Contratación segura" },
  { id: 4, label: "SMS de confirmación" },
];

const benefits = [
  "Sin permanencias ni letra pequeña",
  "Comparamos +175 compañías",
  "Ahorro medio del 32%",
];

// Alturas conocidas por paso del wizard (fallback si no hay postMessage)
const STEP_HEIGHTS: Record<number, number> = {
  1: 620,  // Paso 1: subir factura
  2: 900,  // Paso 2: ver ofertas (más contenido)
  3: 700,  // Paso 3: datos personales
  4: 500,  // Paso 4: confirmación
};

export default function HeroSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(620);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Función para actualizar la altura de forma segura
  const updateHeight = useCallback((h: number) => {
    if (h > 200) {
      setIframeHeight(h + 24); // padding extra para evitar scrollbar
    }
  }, []);

  // 1. Escuchar postMessage del widget
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Solo aceptar mensajes del dominio del widget
      if (!event.origin.includes("kiwatio.net") && !event.origin.includes("efizientia")) return;

      const data = event.data;
      if (!data) return;

      let newHeight: number | null = null;

      if (typeof data === "number" && data > 100) {
        newHeight = data;
      } else if (typeof data === "object") {
        // Formatos comunes de widgets: { height }, { iframeHeight }, { type: "resize", height }
        const h =
          data.height ??
          data.iframeHeight ??
          data.frameHeight ??
          data.scrollHeight ??
          (data.type === "resize" ? data.value : null) ??
          (data.type === "setHeight" ? data.value : null);
        if (typeof h === "number" && h > 100) newHeight = h;
      } else if (typeof data === "string") {
        const num = parseInt(data, 10);
        if (!isNaN(num) && num > 100) {
          newHeight = num;
        } else {
          try {
            const obj = JSON.parse(data);
            const h = obj?.height ?? obj?.iframeHeight ?? obj?.frameHeight;
            if (typeof h === "number" && h > 100) newHeight = h;
          } catch {
            // no es JSON
          }
        }
      }

      if (newHeight !== null) {
        updateHeight(newHeight);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateHeight]);

  // 2. Al cargar el iframe, intentar leer el alto (same-origin) o iniciar polling
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    setIframeError(false);

    const iframe = iframeRef.current;
    if (!iframe) return;

    // Intentar acceso same-origin
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
        if (h > 200) updateHeight(h);

        // ResizeObserver sobre el body del iframe
        const ro = new ResizeObserver(() => {
          try {
            const newH = doc.documentElement.scrollHeight || doc.body.scrollHeight;
            if (newH > 200) updateHeight(newH);
          } catch {
            // cross-origin
          }
        });
        ro.observe(doc.body);
        return () => ro.disconnect();
      }
    } catch {
      // cross-origin: usar polling como fallback
      startPolling();
    }
  }, [updateHeight]);

  // 3. Polling fallback para cross-origin (intenta leer scrollHeight periódicamente)
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
          if (h > 200) {
            updateHeight(h);
          }
        }
      } catch {
        // cross-origin: no podemos leer, detenemos el polling
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    }, 800);
  }, [updateHeight]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Detectar error de carga (iframe bloqueado por CSP)
  const handleIframeError = useCallback(() => {
    setIframeError(true);
    setIframeLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="pt-20 pb-16"
      style={{ background: "linear-gradient(135deg, #fff 0%, #fdf0f7 60%, #fff 100%)" }}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── LEFT: Text content ── */}
          <div className="pt-4 lg:pt-8">
            <p
              className="text-sm font-bold tracking-widest uppercase mb-3"
              style={{ color: "#e91e8c", fontFamily: "'Nunito Sans', sans-serif" }}
            >
              !!aunque parezca mentira!!
            </p>
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Sube tu factura.{" "}
              <span style={{ color: "#e91e8c" }}>Nosotros hackeamos</span> tu precio de la luz.
            </h1>
            <p
              className="text-gray-600 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Sube tu factura y olvídate de las tarifas abusivas. Hackeamos el mercado eléctrico,
              cazamos el mejor precio oculto y lo ponemos a tu nombre. Sin rodeos, sin tecnicismos,
              solo ahorro real.
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 mb-8">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} style={{ color: "#e91e8c", flexShrink: 0 }} />
                  <span
                    className="text-gray-800 font-semibold"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Steps pills */}
            <div className="flex flex-wrap gap-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "#fdf0f7",
                    color: "#e91e8c",
                    border: "1px solid #e91e8c30",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <Zap size={11} />
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Widget iframe container ── */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "#111111",
              border: "1px solid #222",
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid #222", backgroundColor: "#0d0d0d" }}
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
              {/* Traffic lights decorativos */}
              <div className="ml-auto flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              </div>
            </div>

            {/* Iframe wrapper con altura dinámica */}
            <div
              style={{
                position: "relative",
                height: iframeHeight,
                transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Loading overlay */}
              {!iframeLoaded && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
                  style={{ backgroundColor: "#111111" }}
                >
                  <div
                    className="w-12 h-12 rounded-full border-4 border-white/10"
                    style={{ borderTopColor: "#e91e8c", animation: "efispin 0.8s linear infinite" }}
                  />
                  <p
                    className="text-white/40 text-sm font-semibold"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    Cargando el estudio de factura...
                  </p>
                </div>
              )}

              {/* The iframe */}
              <iframe
                ref={iframeRef}
                src={WIDGET_URL}
                title="Estudio de factura Efizientia"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allow="clipboard-write; camera"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  display: "block",
                  border: "none",
                  backgroundColor: "transparent",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes efispin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
