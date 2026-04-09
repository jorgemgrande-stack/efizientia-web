/**
 * Efizientia · Landing /optimizacion_factura_energetica
 * Página minimalista enviada por la IA telefónica a los clientes.
 * Solo: header pequeño con logo + iframe sin fin de altura (100vh mínimo, crece con el contenido).
 * Sin Navbar completo, sin Footer, sin distracciones.
 */

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

// Logo inline idéntico al del Navbar
function MiniLogo() {
  return (
    <a
      href="/"
      className="flex items-center gap-2 select-none"
      style={{ textDecoration: "none" }}
    >
      {/* Icono hoja */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #39d353, #1a7a2e)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"
            fill="white"
          />
          <path
            d="M17 8c0-2.76-2.24-5-5-5S7 5.24 7 8c0 1.85 1.01 3.47 2.5 4.33V20h5v-7.67C16 11.47 17 9.85 17 8z"
            fill="white"
          />
        </svg>
      </div>
      {/* Texto */}
      <span
        className="text-xl font-black tracking-tight leading-none"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <span className="text-white">EFI</span>
        <span style={{ color: "#e91e8c" }}>ZIENTIA</span>
      </span>
    </a>
  );
}

export default function OptimizacionFactura() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER MÍNIMO ──────────────────────────────────────────── */}
      <header
        style={{
          background: "rgba(10,10,10,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <MiniLogo />

        {/* Pequeña etiqueta de contexto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(233,30,140,0.1)",
            border: "1px solid rgba(233,30,140,0.25)",
            borderRadius: "20px",
            padding: "5px 12px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#39d353",
              boxShadow: "0 0 6px #39d353",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#e91e8c",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Estudio gratuito · Sin compromiso
          </span>
        </div>
      </header>

      {/* ── IFRAME SIN FIN DE ALTURA ────────────────────────────────── */}
      {/*
        El iframe crece con su contenido gracias a:
        - flex: 1 en el contenedor → ocupa todo el espacio restante
        - min-height: calc(100vh - 57px) → nunca más pequeño que la pantalla
        - height: 100% + overflow: hidden en el wrapper
        - El propio iframe tiene height: 100% y min-height heredado
        Si el widget interno es más alto, el scroll es del documento, no del iframe.
      */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 57px)",
        }}
      >
        <iframe
          src={WIDGET_URL}
          title="Estudio de factura energética — Efizientia"
          allow="camera; microphone; clipboard-write; payment"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "calc(100vh - 57px)",
            border: "none",
            display: "block",
            background: "#0a0a0a",
          }}
          // scrolling="no" eliminado para que el widget pueda hacer scroll interno si lo necesita
        />
      </div>
    </div>
  );
}
