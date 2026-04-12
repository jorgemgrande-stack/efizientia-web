/**
 * Efizientia SaaS · Panel Asesor — Inicio
 * Dashboard de bienvenida del comercial. Muestra el estado de su ficha
 * y accesos rápidos a las secciones del panel.
 */

import { useEffect, useState } from "react";
import { User, ExternalLink, ChevronRight, Zap } from "lucide-react";
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

export default function PanelIndex() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [noProfile, setNoProfile] = useState(false);

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

      {noProfile ? (
        /* Sin ficha asociada */
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <User size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#e91e8c" }} />
          <h2 className="text-lg font-bold text-white mb-2">Aún no tienes ficha pública</h2>
          <p className="text-white/50 text-sm">
            El administrador tiene que asociarte un perfil. Contacta con{" "}
            <a href="mailto:hola@efizientia.es" style={{ color: "#e91e8c" }}>
              hola@efizientia.es
            </a>
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
            <div className="space-y-3">
              {[
                {
                  label: "Editar mi ficha pública",
                  desc: "Foto, teléfono, WhatsApp, descripción",
                  href: "/panel/mi-ficha",
                  icon: User,
                },
                {
                  label: "Ver mi ficha en la web",
                  desc: profile?.slug ? `/humanos/${profile.slug}` : "Perfil público",
                  href: profile?.slug ? `/humanos/${profile.slug}` : "#",
                  icon: ExternalLink,
                  external: true,
                },
                {
                  label: "Subir factura de cliente",
                  desc: "Herramienta de análisis Kiwatio",
                  href: "https://efizientia.kiwatio.net/widget/estudio-factura?token=6%7CgupGAGbFslNaPLq9Oo7v7dYpmzCTOssQ9YLDooxV44583597",
                  icon: Zap,
                  external: true,
                },
              ].map(({ label, desc, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(233,30,140,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(233,30,140,0.12)" }}
                  >
                    <Icon size={15} style={{ color: "#e91e8c" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">{label}</div>
                    <div className="text-white/40 text-xs truncate">{desc}</div>
                  </div>
                  <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
