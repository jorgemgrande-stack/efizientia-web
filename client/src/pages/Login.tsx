/**
 * Efizientia SaaS · /login
 * Pantalla de login con diseño dark tech coherente con el sitio público.
 * Tras autenticarse redirige al panel según rol (admin → /admin, comercial → /panel).
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, redirigir
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/panel");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const me = await login(email, password) as unknown as { role: string } | undefined;
      // Leer el role recién obtenido del contexto o del retorno del login
      const loggedUser = me ?? { role: "comercial" };
      navigate((loggedUser as { role: string }).role === "admin" ? "/admin" : "/panel");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <div
      style={{ background: "#0a0a0a", minHeight: "100vh" }}
      className="flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <img
              src="/images/efizientia-logo-dark_f1c2a2ee.png"
              alt="Efizientia"
              style={{ height: 40, objectFit: "contain" }}
            />
          </a>
          <h1
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Panel de asesores
          </h1>
          <p className="text-white/50 text-sm mt-2">Accede a tu área privada</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 40px rgba(233,30,140,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#e91e8c")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{
                background: loading
                  ? "rgba(233,30,140,0.5)"
                  : "linear-gradient(135deg, #e91e8c, #c2166e)",
                boxShadow: "0 0 20px rgba(233,30,140,0.25)",
              }}
            >
              <Zap size={16} />
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          ¿No tienes acceso?{" "}
          <a href="mailto:hola@efizientia.es" style={{ color: "#e91e8c" }}>
            Contacta con el administrador
          </a>
        </p>
      </div>
    </div>
  );
}
