/**
 * ChatModal — Popup de chat con iframe de Chatbase
 * Design: Dark Tech, modal centrado con overlay oscuro, aura magenta, botón de cierre
 */
import { useEffect, useRef } from "react";

interface ChatModalProps {
  efiName: string;
  efiColor: string;
  efiImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ efiName, efiColor, efiImage, isOpen, onClose }: ChatModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="relative w-full flex flex-col rounded-2xl overflow-hidden"
        style={{
          maxWidth: "480px",
          height: "min(680px, 90vh)",
          backgroundColor: "#111",
          border: `1px solid ${efiColor}44`,
          boxShadow: `0 0 40px ${efiColor}33, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ backgroundColor: "#0a0a0a", borderBottom: `1px solid ${efiColor}22` }}
        >
          {/* Efi avatar */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: "#1a1a1a", border: `2px solid ${efiColor}` }}
          >
            <img
              src={efiImage}
              alt={efiName}
              className="w-full h-full object-cover object-top"
              style={{ transform: "scale(1.1)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-white font-black text-sm leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {efiName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
              />
              <span
                className="text-white/40 text-xs"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                En línea · Asesor Efizientia
              </span>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ backgroundColor: "#1a1a1a", color: "white/50" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#e91e8c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#1a1a1a";
            }}
            aria-label="Cerrar chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-white">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Chatbase iframe */}
        <div className="flex-1 relative overflow-hidden">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/uFei5WgxiUCTOUxYCj9nz"
            width="100%"
            height="100%"
            frameBorder={0}
            title={`Chat con ${efiName}`}
            allow="microphone"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: "400px",
              border: "none",
              backgroundColor: "#111",
            }}
          />
        </div>
      </div>
    </div>
  );
}
