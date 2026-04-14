/**
 * Efizientia SaaS · /invitation/accept/:token
 * Página para que un comercial invitado active su cuenta y defina contraseña.
 * Pre-valida el token al montar para detectar enlaces inválidos/expirados antes de mostrar el form.
 */

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Eye, EyeOff, CheckCircle, AlertCircle, Zap, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function InvitationAccept() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();

  // Estado de la pre-validación
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const [tokenError, setTokenError] = useState("");
  const [profileName, setProfileName] = useState("");

  // Estado del formulario
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-validar token al montar
  useEffect(() => {
    fetch(`/api/auth/invitation/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setProfileName(data.profile_name ?? "");
          setTokenStatus("valid");
        } else {
          setTokenError(data.error ?? "Enlace inválido");
          setTokenStatus("invalid");
        }
      })
      .catch(() => {
        setTokenError("Error de conexión. Inténtalo de nuevo.");
        setTokenStatus("invalid");
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (password !== confirm) return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      await api.admin.invitation.accept(token, password);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

  return (
    <div
      style={{ background: "linear-gradient(160deg,#0a0a0a 0%,#0f0520 55%,#0a0a0a 100%)", minHeight: "100vh" }}
      className="flex items-center justify-center px-4"
    >
      {/* Glow de fondo */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(233,30,140,0.07) 0%, transparent 60%)" }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/efizientia-logo-dark_f1c2a2ee.png"
            alt="Efizientia"
            style={{ height: 40, objectFit: "contain", margin: "0 auto 20px" }}
          />
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
          >
            Panel de Asesores
          </div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {tokenStatus === "checking" ? "Verificando enlace…" : tokenStatus === "invalid" ? "Enlace no válido" : "Activa tu cuenta"}
          </h1>
          {tokenStatus === "valid" && profileName && (
            <p className="text-white/50 text-sm mt-2">Bienvenido/a, <span className="text-white font-semibold">{profileName}</span></p>
          )}
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(233,30,140,0.08)" }}
        >
          {/* Cargando */}
          {tokenStatus === "checking" && (
            <div className="flex flex-col items-center py-8 gap-4">
              <Loader2 size={36} className="animate-spin" style={{ color: "#e91e8c" }} />
              <p className="text-white/40 text-sm">Verificando tu invitación…</p>
            </div>
          )}

          {/* Token inválido */}
          {tokenStatus === "invalid" && (
            <div className="text-center py-4">
              <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "#f87171" }} />
              <h2 className="text-lg font-bold text-white mb-2">Enlace no válido</h2>
              <p className="text-white/50 text-sm mb-6">{tokenError}</p>
              <p className="text-white/30 text-xs">Contacta con el administrador para recibir una nueva invitación.</p>
            </div>
          )}

          {/* Éxito */}
          {tokenStatus === "valid" && success && (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#39d353" }} />
              <h2 className="text-xl font-bold text-white mb-2">¡Cuenta activada!</h2>
              <p className="text-white/60 text-sm mb-6">Ya puedes acceder a tu panel de asesor.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
              >
                Ir al panel
              </button>
            </div>
          )}

          {/* Formulario */}
          {tokenStatus === "valid" && !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-white/40 text-xs text-center mb-2">Define tu contraseña para acceder al panel</p>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className={inputClass}
                    style={{ ...inputStyle, paddingRight: "48px" }}
                    onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                  Confirmar contraseña
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {loading ? "Activando…" : "Activar cuenta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
