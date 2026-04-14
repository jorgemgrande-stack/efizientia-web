/**
 * Efizientia SaaS · Panel Admin — Gestión de Usuarios
 * Lista todos los usuarios del sistema.
 * Permite crear nuevos usuarios (admin o comercial) con invitación por email.
 * Permite activar/desactivar, borrar, cambiar contraseña y reenviar invitación.
 */

import { useEffect, useRef, useState } from "react";
import {
  UserPlus, Search, CheckCircle, AlertCircle, ToggleLeft, ToggleRight,
  Copy, X, Trash2, KeyRound, Send, MoreVertical, Eye, EyeOff,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api, ApiError } from "@/lib/api";

interface UserRow {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  invited_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

const inputBase = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" };

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active:  { bg: "rgba(57,211,83,0.1)",   color: "#39d353" },
    inactive:{ bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" },
    pending: { bg: "rgba(233,30,140,0.1)",   color: "#e91e8c" },
  };
  const c = colors[status] ?? colors.inactive;
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
      style={{
        background: role === "admin" ? "rgba(233,30,140,0.12)" : "rgba(255,255,255,0.05)",
        color:      role === "admin" ? "#e91e8c" : "rgba(255,255,255,0.5)",
        border: `1px solid ${role === "admin" ? "rgba(233,30,140,0.2)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {role}
    </span>
  );
}

// ── Modal base ────────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Menú contextual por fila ──────────────────────────────────────────────────
function ActionsMenu({
  user,
  onDelete,
  onPassword,
  onReinvite,
}: {
  user: UserRow;
  onDelete: (u: UserRow) => void;
  onPassword: (u: UserRow) => void;
  onReinvite: (u: UserRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg transition-colors text-white/30 hover:text-white/70"
        style={{ background: open ? "rgba(255,255,255,0.06)" : "transparent" }}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 z-30 min-w-[180px] rounded-xl overflow-hidden py-1"
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          <button
            onClick={() => { setOpen(false); onReinvite(user); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/05 transition-colors text-left"
          >
            <Send size={13} style={{ color: "#e91e8c" }} />
            Reenviar invitación
          </button>
          <button
            onClick={() => { setOpen(false); onPassword(user); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/05 transition-colors text-left"
          >
            <KeyRound size={13} style={{ color: "#e91e8c" }} />
            Cambiar contraseña
          </button>
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />
          <button
            onClick={() => { setOpen(false); onDelete(user); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left"
            style={{ color: "#f87171" }}
          >
            <Trash2 size={13} />
            Eliminar usuario
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [createEmail, setCreateEmail] = useState("");
  const [createName, setCreateName] = useState("");
  const [createRole, setCreateRole] = useState<"admin" | "comercial">("comercial");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createResult, setCreateResult] = useState<{ link: string } | null>(null);

  // Toggle status
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Password modal
  const [pwTarget, setPwTarget] = useState<UserRow | null>(null);
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState(false);

  // Reinvite feedback
  const [reinviteResult, setReinviteResult] = useState<{ message: string; link?: string } | null>(null);

  const loadUsers = () => {
    setLoading(true);
    api.admin.users.list()
      .then((rows) => setUsers(rows as UserRow[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateResult(null);
    setCreating(true);
    try {
      const res = await api.admin.users.create({ email: createEmail, name: createName, role: createRole });
      setCreateResult({ link: res.link });
      setCreateEmail(""); setCreateName(""); setCreateRole("comercial");
      loadUsers();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "Error al crear usuario");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (user: UserRow) => {
    setTogglingId(user.id);
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await api.admin.users.setStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError("");
    setDeleting(true);
    try {
      await api.admin.users.delete(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwTarget) return;
    setPwError("");
    if (newPw.length < 8) { setPwError("Mínimo 8 caracteres"); return; }
    setPwSaving(true);
    try {
      await api.admin.users.setPassword(pwTarget.id, newPw);
      setPwOk(true);
      setNewPw("");
      setTimeout(() => { setPwOk(false); setPwTarget(null); }, 1500);
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : "Error al cambiar contraseña");
    } finally {
      setPwSaving(false);
    }
  };

  const handleReinvite = async (user: UserRow) => {
    try {
      const res = await api.admin.users.reinvite(user.id);
      setReinviteResult({ message: res.message, link: res.link });
    } catch (err) {
      setReinviteResult({ message: err instanceof ApiError ? err.message : "Error al reenviar" });
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.role.includes(q);
  });

  return (
    <AdminLayout title="Usuarios">

      {/* ── Modal crear usuario ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Crear usuario
              </h3>
              <button onClick={() => { setShowCreate(false); setCreateError(""); setCreateResult(null); }}
                className="text-white/30 hover:text-white/70 transition-colors">
                <X size={18} />
              </button>
            </div>

            {createResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}>
                  <CheckCircle size={14} className="flex-shrink-0" />
                  Usuario creado. Se ha enviado una invitación por email.
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-2">Enlace de activación (si el email falla):</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono break-all"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#e91e8c", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {createResult.link}
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(createResult.link)}
                      className="p-2 rounded-lg text-white/40 hover:text-white transition-colors flex-shrink-0"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }} title="Copiar enlace">
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                <button onClick={() => { setCreateResult(null); setShowCreate(false); }}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}>
                  Hecho
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
                  <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)}
                    required placeholder="usuario@ejemplo.com" className={inputBase} style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Nombre *</label>
                  <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)}
                    required placeholder="Nombre completo" className={inputBase} style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Rol *</label>
                  <div className="flex gap-3">
                    {(["comercial", "admin"] as const).map((r) => (
                      <button key={r} type="button" onClick={() => setCreateRole(r)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm transition-all capitalize"
                        style={{
                          background: createRole === r ? "rgba(233,30,140,0.15)" : "rgba(255,255,255,0.04)",
                          color:      createRole === r ? "#e91e8c" : "rgba(255,255,255,0.4)",
                          border: `1px solid ${createRole === r ? "rgba(233,30,140,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {createError && (
                  <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                    style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}>
                    <AlertCircle size={14} className="flex-shrink-0" />{createError}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={creating}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}>
                    {creating ? "Creando…" : "Crear y enviar invitación"}
                  </button>
                  <button type="button" onClick={() => { setShowCreate(false); setCreateError(""); }}
                    className="px-4 py-3 rounded-xl font-bold text-sm text-white/40"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal borrar usuario ── */}
      {deleteTarget && (
        <Modal onClose={() => { setDeleteTarget(null); setDeleteError(""); }}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
            style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)" }}>
            <Trash2 size={20} style={{ color: "#f87171" }} />
          </div>
          <h3 className="text-lg font-black text-white text-center mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Eliminar usuario
          </h3>
          <p className="text-white/50 text-sm text-center mb-1">
            ¿Seguro que quieres eliminar a <span className="text-white font-semibold">{deleteTarget.name}</span>?
          </p>
          <p className="text-white/30 text-xs text-center mb-6">
            Su ficha de asesor quedará desvinculada pero no se eliminará.
          </p>
          {deleteError && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mb-4"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
              <AlertCircle size={14} className="flex-shrink-0" />{deleteError}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
              {deleting ? "Eliminando…" : "Eliminar"}
            </button>
            <button onClick={() => { setDeleteTarget(null); setDeleteError(""); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white/50"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal cambiar contraseña ── */}
      {pwTarget && (
        <Modal onClose={() => { setPwTarget(null); setPwError(""); setPwOk(false); setNewPw(""); }}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
            style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)" }}>
            <KeyRound size={20} style={{ color: "#e91e8c" }} />
          </div>
          <h3 className="text-lg font-black text-white text-center mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Cambiar contraseña
          </h3>
          <p className="text-white/50 text-sm text-center mb-5">
            {pwTarget.name} · <span className="text-white/30">{pwTarget.email}</span>
          </p>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className={inputBase}
                  style={{ ...inputStyle, paddingRight: "48px" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {pwError && (
              <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", color: "#e91e8c" }}>
                <AlertCircle size={14} className="flex-shrink-0" />{pwError}
              </div>
            )}
            {pwOk && (
              <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.3)", color: "#39d353" }}>
                <CheckCircle size={14} className="flex-shrink-0" />Contraseña actualizada
              </div>
            )}
            <button type="submit" disabled={pwSaving}
              className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}>
              {pwSaving ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Modal resultado reinvite ── */}
      {reinviteResult && (
        <Modal onClose={() => setReinviteResult(null)}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
            style={{ background: "rgba(57,211,83,0.1)", border: "1px solid rgba(57,211,83,0.25)" }}>
            <Send size={20} style={{ color: "#39d353" }} />
          </div>
          <h3 className="text-lg font-black text-white text-center mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Invitación reenviada
          </h3>
          <p className="text-white/50 text-sm text-center mb-4">{reinviteResult.message}</p>
          {reinviteResult.link && (
            <div className="mb-4">
              <p className="text-white/40 text-xs mb-2">Enlace manual:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono break-all"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#e91e8c", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {reinviteResult.link}
                </div>
                <button onClick={() => navigator.clipboard.writeText(reinviteResult.link!)}
                  className="p-2 rounded-lg text-white/40 hover:text-white transition-colors flex-shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Copy size={13} />
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setReinviteResult(null)}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}>
            Cerrar
          </button>
        </Modal>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Usuarios
          </h1>
          <p className="text-white/40 text-sm mt-1">{users.length} usuarios en el sistema</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}>
          <UserPlus size={15} />
          Nuevo usuario
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email, nombre o rol…"
          className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }} />
      </div>

      {/* ── Tabla ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 animate-spin"
              style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-white/30 text-sm">
            {search ? "Sin resultados" : "No hay usuarios aún"}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-3">Usuario</th>
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Rol</th>
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-3">Estado</th>
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Último acceso</th>
                <th className="px-3 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-sm">{user.name}</div>
                    <div className="text-white/40 text-xs mt-0.5">{user.email}</div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <span className="text-white/30 text-xs">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString("es-ES") : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      {/* Toggle activo/inactivo */}
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={togglingId === user.id}
                        title={user.status === "active" ? "Desactivar" : "Activar"}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                        style={{ color: user.status === "active" ? "#39d353" : "rgba(255,255,255,0.25)" }}
                      >
                        {user.status === "active" ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      {/* Menú de acciones */}
                      <ActionsMenu
                        user={user}
                        onDelete={setDeleteTarget}
                        onPassword={(u) => { setPwTarget(u); setPwError(""); setPwOk(false); setNewPw(""); setShowPw(false); }}
                        onReinvite={handleReinvite}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
