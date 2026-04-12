/**
 * Efizientia SaaS · Panel Admin — Comerciales
 * Lista completa de perfiles de asesores con acciones:
 * ver ficha, gestionar acceso (crear cuenta / invitar), editar, activar/desactivar, borrar.
 */

import { useEffect, useState } from "react";
import {
  Plus, Search, ExternalLink, KeyRound, Edit2,
  ToggleLeft, ToggleRight, AlertCircle, CheckCircle,
  Trash2, X, Mail, Eye, EyeOff, Copy
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api, ApiError } from "@/lib/api";

interface ComercialRow {
  id: number;
  slug: string;
  display_name: string;
  is_active: number;
  user_id: number | null;
  user_email: string | null;
  user_status: string | null;
  user_last_login: string | null;
  phone: string | null;
  photo_url: string | null;
}

const inputBase = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

// ── Modal de acceso: Crear cuenta o Enviar invitación ──────────────────────

function AccesoModal({
  comercial,
  onClose,
  onDone,
}: {
  comercial: ComercialRow;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const [tab, setTab] = useState<"cuenta" | "invitacion">("cuenta");

  // Crear cuenta
  const [accEmail, setAccEmail] = useState(comercial.user_email ?? "");
  const [accPass, setAccPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [accLoading, setAccLoading] = useState(false);
  const [accError, setAccError] = useState("");

  // Invitación
  const [invEmail, setInvEmail] = useState(comercial.user_email ?? "");
  const [invLoading, setInvLoading] = useState(false);
  const [invError, setInvError] = useState("");
  const [invLink, setInvLink] = useState("");

  const handleCrearCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccError("");
    setAccLoading(true);
    try {
      await api.admin.comerciales.createAccount(comercial.id, accEmail, accPass);
      onDone(`Cuenta creada para ${accEmail}`);
    } catch (err) {
      setAccError(err instanceof ApiError ? err.message : "Error al crear cuenta");
    } finally {
      setAccLoading(false);
    }
  };

  const handleInvitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvError("");
    setInvLoading(true);
    try {
      const res = await api.admin.comerciales.invite(comercial.id, invEmail);
      if (res.link) {
        setInvLink(res.link);
      } else {
        onDone(res.message ?? "Invitación enviada");
      }
    } catch (err) {
      setInvError(err instanceof ApiError ? err.message : "Error al invitar");
    } finally {
      setInvLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-md rounded-2xl" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="text-base font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Acceso de {comercial.display_name}
            </h3>
            {comercial.user_email && (
              <p className="text-white/40 text-xs mt-0.5">{comercial.user_email}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mb-5 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["cuenta", "invitacion"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all"
              style={{
                background: tab === t ? "rgba(233,30,140,0.15)" : "transparent",
                color: tab === t ? "#e91e8c" : "rgba(255,255,255,0.4)",
                borderRadius: 10,
              }}
            >
              {t === "cuenta" ? <KeyRound size={13} /> : <Mail size={13} />}
              {t === "cuenta" ? "Crear cuenta" : "Invitación email"}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          {tab === "cuenta" ? (
            <form onSubmit={handleCrearCuenta} className="space-y-4">
              <p className="text-white/45 text-xs leading-relaxed">
                Crea usuario y contraseña directamente. El comercial puede hacer login en el panel inmediatamente.
              </p>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  value={accEmail}
                  onChange={(e) => setAccEmail(e.target.value)}
                  required
                  placeholder="comercial@email.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Contraseña *</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={accPass}
                    onChange={(e) => setAccPass(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    className={inputBase}
                    style={{ ...inputStyle, paddingRight: "3rem" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {accError && (
                <div className="flex items-center gap-2 text-xs rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}>
                  <AlertCircle size={13} className="flex-shrink-0" />{accError}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={accLoading}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  {accLoading ? "Creando…" : "Crear cuenta"}
                </button>
                <button type="button" onClick={onClose}
                  className="px-4 py-3 rounded-xl text-white/40 text-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : invLink ? (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">No se pudo enviar el email. Comparte este enlace manualmente:</p>
              <div className="rounded-xl px-4 py-3 text-xs break-all"
                style={{ background: "rgba(233,30,140,0.08)", border: "1px solid rgba(233,30,140,0.2)", color: "#e91e8c" }}>
                {invLink}
              </div>
              <button onClick={() => navigator.clipboard.writeText(invLink)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ background: "rgba(255,255,255,0.08)" }}>
                <Copy size={14} /> Copiar enlace
              </button>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl text-white/40 text-sm">Cerrar</button>
            </div>
          ) : (
            <form onSubmit={handleInvitar} className="space-y-4">
              <p className="text-white/45 text-xs leading-relaxed">
                El comercial recibirá un email con un enlace para activar su cuenta y poner su propia contraseña. Válido 48h.
              </p>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  value={invEmail}
                  onChange={(e) => setInvEmail(e.target.value)}
                  required
                  placeholder="correo@ejemplo.com"
                  className={inputBase}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>
              {invError && (
                <div className="flex items-center gap-2 text-xs rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}>
                  <AlertCircle size={13} className="flex-shrink-0" />{invError}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={invLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  <Mail size={14} />
                  {invLoading ? "Enviando…" : "Enviar invitación"}
                </button>
                <button type="button" onClick={onClose}
                  className="px-4 py-3 rounded-xl text-white/40 text-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal de confirmación de borrado ───────────────────────────────────────

function DeleteModal({
  comercial,
  onClose,
  onDeleted,
}: {
  comercial: ComercialRow;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.admin.comerciales.delete(comercial.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al borrar");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 text-center"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(233,30,140,0.1)" }}>
          <Trash2 size={26} style={{ color: "#e91e8c" }} />
        </div>
        <h3 className="text-lg font-black text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          ¿Borrar perfil?
        </h3>
        <p className="text-white/50 text-sm mb-1">
          <span className="text-white font-semibold">{comercial.display_name}</span>
        </p>
        <p className="text-white/35 text-xs mb-6">
          Se eliminará el perfil y sus invitaciones. La cuenta de usuario NO se borra.
        </p>
        {error && (
          <p className="text-xs mb-4" style={{ color: "#e91e8c" }}>{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
          >
            {loading ? "Borrando…" : "Sí, borrar"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white/50"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────

export default function Comerciales() {
  const [comerciales, setComerciales] = useState<ComercialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [acceso, setAcceso] = useState<ComercialRow | null>(null);
  const [deleting, setDeleting] = useState<ComercialRow | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const load = () =>
    api.admin.comerciales.list().then((data) => setComerciales(data as ComercialRow[]));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (c: ComercialRow) => {
    try {
      await api.admin.comerciales.update(c.id, { is_active: c.is_active ? 0 : 1 });
      load();
      showToast(`${c.display_name} ${c.is_active ? "desactivado" : "activado"}`);
    } catch {
      showToast("Error al cambiar el estado");
    }
  };

  const filtered = comerciales.filter(
    (c) =>
      c.display_name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.user_email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Comerciales">
      {acceso && (
        <AccesoModal
          comercial={acceso}
          onClose={() => setAcceso(null)}
          onDone={(msg) => { setAcceso(null); load(); showToast(msg); }}
        />
      )}
      {deleting && (
        <DeleteModal
          comercial={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => { setDeleting(null); load(); showToast("Perfil eliminado"); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{ background: "#1a1a1a", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}>
          <CheckCircle size={16} />{toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Comerciales
          </h1>
          <p className="text-white/50 mt-1 text-sm">{comerciales.length} perfiles en el sistema</p>
        </div>
        <a
          href="/admin/comerciales/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nuevo</span>
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, slug o email…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 animate-spin"
              style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            {search ? "Sin resultados" : (
              <>No hay perfiles. <a href="/admin/comerciales/nuevo" style={{ color: "#e91e8c" }}>Crear el primero</a></>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-bold text-white/30 uppercase tracking-widest"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span>Asesor</span>
              <span>Cuenta</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            {filtered.map((c) => (
              <div
                key={c.id}
                className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 overflow-hidden"
                    style={{ background: "rgba(233,30,140,0.15)" }}>
                    {c.photo_url ? (
                      <img src={c.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: "#e91e8c" }}>{c.display_name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{c.display_name}</div>
                    <div className="text-white/40 text-xs truncate">/humanos/{c.slug}</div>
                  </div>
                </div>

                {/* Cuenta */}
                <div>
                  {c.user_email ? (
                    <div>
                      <div className="text-white/70 text-xs truncate">{c.user_email}</div>
                      <div className="text-xs font-semibold"
                        style={{ color: c.user_status === "active" ? "#39d353" : "#f59e0b" }}>
                        {c.user_status === "active" ? "Activa" : c.user_status}
                      </div>
                    </div>
                  ) : (
                    <span className="text-white/30 text-xs italic">Sin cuenta</span>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: c.is_active ? "rgba(57,211,83,0.1)" : "rgba(255,255,255,0.06)",
                      color: c.is_active ? "#39d353" : "rgba(255,255,255,0.35)",
                    }}>
                    {c.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                  <a href={`/humanos/${c.slug}`} target="_blank" rel="noopener noreferrer"
                    title="Ver ficha pública"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <ExternalLink size={14} />
                  </a>
                  <button title="Gestionar acceso" onClick={() => setAcceso(c)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <KeyRound size={14} />
                  </button>
                  <a href={`/admin/comerciales/${c.id}`} title="Editar"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Edit2 size={14} />
                  </a>
                  <button title={c.is_active ? "Desactivar" : "Activar"} onClick={() => handleToggleActive(c)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", color: c.is_active ? "#39d353" : "rgba(255,255,255,0.3)" }}>
                    {c.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button title="Borrar perfil" onClick={() => setDeleting(c)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
