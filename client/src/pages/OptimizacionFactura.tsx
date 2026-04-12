/**
 * Efizientia · Landing /optimizacion_factura_energetica
 * Página minimalista enviada por la IA telefónica a los clientes.
 * Header: logo real (imagen CDN) + badge "Estudio gratuito · Sin compromiso"
 * Mobile: logo y badge en columna para evitar solapamiento
 * Iframe: ocupa toda la altura restante sin límite
 */

const WIDGET_URL =
  "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597";

const LOGO_URL = "/images/efizientia-logo-dark_f1c2a2ee.png";

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
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 50,
          gap: "12px",
          flexWrap: "wrap",          /* en móvil muy estrecho puede bajar el badge */
        }}
      >
        {/* Logo real del Navbar */}
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none" }}
        >
          <img
            src={LOGO_URL}
            alt="Efizientia"
            style={{
              height: "44px",
              width: "auto",
              maxWidth: "140px",
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </a>

        {/* Badge de contexto — se mantiene a la derecha en desktop, debajo en móvil muy estrecho */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(233,30,140,0.10)",
            border: "1px solid rgba(233,30,140,0.25)",
            borderRadius: "20px",
            padding: "5px 13px",
            flexShrink: 0,
            whiteSpace: "nowrap",
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
        flex:1 + minHeight garantizan que el iframe ocupe siempre al menos
        el espacio visible restante. Si el widget interno crece, el scroll
        es del documento, no del iframe.
      */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <iframe
          src={WIDGET_URL}
          title="Estudio de factura energética — Efizientia"
          allow="camera; microphone; clipboard-write; payment"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "calc(100vh - 65px)",
            border: "none",
            display: "block",
            background: "#ffffff",
          }}
        />
      </div>
    </div>
  );
}
