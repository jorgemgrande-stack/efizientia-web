/**
 * Efizientia SaaS · Panel Asesor — Inicio
 * Dashboard de bienvenida del comercial.
 * Muestra el estado de su ficha, acceso rápido a Kiwatio y contacto con administración.
 */

import { useEffect, useState } from "react";
import { User, ExternalLink, ChevronRight, MessageCircle, Mail, X, LogIn } from "lucide-react";
import PanelLayout from "./PanelLayout";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  slug?: string;
  display_name?: string;
  phone?: string;
  whatsapp?: string;
  public_email?: string;
  photo_url?: string;
  about_text?: string;
  invoice_cta_url?: string;
}

// ── Modal base ────────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-7"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Modal Kiwatio ─────────────────────────────────────────────────────────────
function ModalKiwatio({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      {/* Logo Kiwatio */}
      <div className="flex justify-center mb-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ background: "#000", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <img
            src="https://efizientia.kiwatio.net/favicon.ico"
            alt="Kiwatio"
            className="w-14 h-14 object-contain"
            onError={(e) => {
              // Fallback: texto estilizado si la imagen no carga
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.nextElementSibling as HTMLElement;
              if (fb) fb.style.display = "flex";
            }}
          />
          <div
            className="w-14 h-14 hidden items-center justify-center text-2xl font-black"
            style={{ color: "#a3e635", display: "none" }}
          >
            K
          </div>
        </div>
      </div>

      <h2
        className="text-xl font-black text-white text-center mb-2"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Kiwatio
      </h2>
      <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">
        Plataforma de análisis y gestión de facturas energéticas. Accede con tus credenciales de asesor.
      </p>

      <a
        href="https://efizientia.kiwatio.net/admin/login"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
        style={{ background: "linear-gradient(135deg, #65a30d, #4d7c0f)", boxShadow: "0 0 20px rgba(101,163,13,0.25)" }}
      >
        <LogIn size={16} />
        Acceder a Kiwatio
      </a>

      <p className="text-white/25 text-xs text-center mt-3">
        Se abrirá en una nueva pestaña
      </p>
    </Modal>
  );
}

// ── Modal Contacto Administración ─────────────────────────────────────────────
function ModalContacto({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)" }}
      >
        <MessageCircle size={22} style={{ color: "#e91e8c" }} />
      </div>

      <h2
        className="text-xl font-black text-white text-center mb-1"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Contactar con Admin
      </h2>
      <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">
        ¿Necesitas ayuda o tienes alguna consulta? Escríbenos por WhatsApp o email.
      </p>

      <div className="space-y-3">
        <a
          href="https://wa.me/34856280058"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={18} />
          <div className="flex-1 text-left">
            <div className="font-bold">WhatsApp</div>
            <div className="text-xs font-normal opacity-80">+34 856 28 00 58</div>
          </div>
          <ExternalLink size={14} className="opacity-70" />
        </a>

        <a
          href="mailto:comerciales@efizientia.es"
          className="flex items-center gap-3 w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm transition-all hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Mail size={18} style={{ color: "#e91e8c" }} />
          <div className="flex-1 text-left">
            <div className="font-bold">Email</div>
            <div className="text-xs font-normal text-white/60">comerciales@efizientia.es</div>
          </div>
          <ExternalLink size={14} className="opacity-40" />
        </a>
      </div>

      <p className="text-white/25 text-xs text-center mt-4">
        Horario de atención: L–V 08:00–20:00
      </p>
    </Modal>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function PanelIndex() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [noProfile, setNoProfile] = useState(false);
  const [showKiwatio, setShowKiwatio] = useState(false);
  const [showContacto, setShowContacto] = useState(false);

  useEffect(() => {
    api.panel.me()
      .then((data) => setProfile(data as ProfileData))
      .catch(() => setNoProfile(true));
  }, []);

  const completeness = profile ? [
    !!profile.phone,
    !!profile.whatsapp,
    !!profile.public_email,
    !!profile.about_text,
    !!profile.photo_url,
    !!profile.invoice_cta_url,
  ].filter(Boolean).length : 0;
  const completenessPercent = Math.round((completeness / 6) * 100);

  return (
    <PanelLayout title="Inicio">
      {/* Modales */}
      {showKiwatio  && <ModalKiwatio  onClose={() => setShowKiwatio(false)} />}
      {showContacto && <ModalContacto onClose={() => setShowContacto(false)} />}

      {/* Saludo */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-black text-white"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Hola, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-white/50 mt-1">Bienvenido a tu panel de asesor.</p>
      </div>

      <div className="space-y-6">
        {/* ── Ficha + Accesos ── */}
        {noProfile ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <User size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#e91e8c" }} />
            <h2 className="text-lg font-bold text-white mb-2">Aún no tienes ficha pública</h2>
            <p className="text-white/50 text-sm">
              El administrador tiene que asociarte un perfil. Contacta con{" "}
              <button
                onClick={() => setShowContacto(true)}
                className="underline font-semibold"
                style={{ color: "#e91e8c" }}
              >
                administración
              </button>
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card ficha */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #e91e8c40, #0a0a0a)" }}
                >
                  {profile?.photo_url ? (
                    <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={22} style={{ color: "#e91e8c" }} />
                  )}
                </div>
                <div>
                  <div className="text-white font-black">{profile?.display_name}</div>
                  <div className="text-white/40 text-sm">/humanos/{profile?.slug}</div>
                </div>
              </div>

              {/* Barra de completitud */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/50">Completitud del perfil</span>
                  <span className="font-bold" style={{ color: completenessPercent >= 80 ? "#39d353" : "#e91e8c" }}>
                    {completenessPercent}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completenessPercent}%`,
                      background: completenessPercent >= 80 ? "#39d353" : "linear-gradient(90deg, #e91e8c, #c2166e)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="/panel/mi-ficha"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white flex-1 justify-center transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  Editar ficha
                </a>
                {profile?.slug && (
                  <a
                    href={`/humanos/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
                  >
                    <ExternalLink size={14} />
                    Ver
                  </a>
                )}
              </div>
            </div>

            {/* Accesos rápidos */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
                Accesos rápidos
              </h2>
              <div className="space-y-2">
                <a
                  href="/panel/mi-ficha"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(233,30,140,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(233,30,140,0.12)" }}>
                    <User size={15} style={{ color: "#e91e8c" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">Editar mi ficha pública</div>
                    <div className="text-white/40 text-xs">Foto, contacto, descripción</div>
                  </div>
                  <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
                </a>
                {profile?.slug && (
                  <a
                    href={`/humanos/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(233,30,140,0.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(233,30,140,0.12)" }}>
                      <ExternalLink size={15} style={{ color: "#e91e8c" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">Ver mi ficha en la web</div>
                      <div className="text-white/40 text-xs truncate">/humanos/{profile.slug}</div>
                    </div>
                    <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Kiwatio + Contacto Admin — tarjetas grandes ── */}
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Kiwatio */}
          <button
            onClick={() => setShowKiwatio(true)}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 group"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(101,163,13,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(101,163,13,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Logo Kiwatio */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: "#000", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <img
                  src="https://efizientia.kiwatio.net/favicon.ico"
                  alt="Kiwatio"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div
                  className="w-10 h-10 hidden items-center justify-center font-black text-xl"
                  style={{ color: "#a3e635", display: "none" }}
                >
                  K
                </div>
              </div>
              <div>
                <div className="text-white font-black text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Kiwatio
                </div>
                <div className="text-white/40 text-xs">Plataforma de análisis</div>
              </div>
              <ChevronRight size={16} className="text-white/25 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              Accede al panel de Kiwatio para gestionar los estudios de factura de tus clientes.
            </p>
            <div
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: "rgba(101,163,13,0.12)", border: "1px solid rgba(101,163,13,0.25)", color: "#84cc16" }}
            >
              <LogIn size={11} />
              Acceder a Kiwatio
            </div>
          </button>

          {/* Contacto Admin */}
          <button
            onClick={() => setShowContacto(true)}
            className="w-full text-left rounded-2xl p-6 transition-all duration-200 group"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(233,30,140,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(233,30,140,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.2)" }}
              >
                <MessageCircle size={24} style={{ color: "#e91e8c" }} />
              </div>
              <div>
                <div className="text-white font-black text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Administración
                </div>
                <div className="text-white/40 text-xs">WhatsApp · Email</div>
              </div>
              <ChevronRight size={16} className="text-white/25 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              ¿Tienes alguna duda o necesitas soporte? Contacta directamente con el equipo de administración.
            </p>
            <div className="mt-4 flex gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366" }}
              >
                <MessageCircle size={11} />
                WhatsApp
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
              >
                <Mail size={11} />
                Email
              </div>
            </div>
          </button>
        </div>
      </div>
    </PanelLayout>
  );
}
