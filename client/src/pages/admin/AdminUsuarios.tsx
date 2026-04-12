/**
 * Efizientia SaaS · Panel Admin — Gestión de Usuarios
 * Lista todos los usuarios del sistema.
 * Permite crear nuevos usuarios (admin o comercial) con invitación por email.
 * Permite activar/desactivar usuarios existentes.
 */

import { useEffect, useState } from "react";
import { UserPlus, Search, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Copy, X } from "lucide-react";
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
    active: { bg: "rgba(57,211,83,0.1)", color: "#39d353" },
    inactive: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" },
    pending: { bg: "rgba(233,30,140,0.1)", color: "#e91e8c" },
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
        color: role === "admin" ? "#e91e8c" : "rgba(255,255,255,0.5)",
        border: `1px solid ${role === "admin" ? "rgba(233,30,140,0.2)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {role}
    </span>
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
      setCreateEmail("");
      setCreateName("");
      setCreateRole("comercial");
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

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.role.includes(q);
  });

  return (
    <AdminLayout title="Usuarios">
      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Crear usuario
              </h3>
              <button
                onClick={() => { setShowCreate(false); setCreateError(""); setCreateResult(null); }}
                className="text-white/30 hover:text-white/70 transition-colors"
              >
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
                    <button
                      onClick={() => navigator.clipboard.writeText(createResult.link)}
                      className="p-2 rounded-lg text-white/40 hover:text-white transition-colors flex-shrink-0"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      title="Copiar enlace"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { setCreateResult(null); setShowCreate(false); }}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  Hecho
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    required
                    placeholder="usuario@ejemplo.com"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Nombre *</label>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    required
                    placeholder="Nombre completo"
                    className={inputBase}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#e91e8c")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Rol *</label>
                  <div className="flex gap-3">
                    {(["comercial", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCreateRole(r)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm transition-all capitalize"
                        style={{
                          background: createRole === r ? "rgba(233,30,140,0.15)" : "rgba(255,255,255,0.04)",
                          color: createRole === r ? "#e91e8c" : "rgba(255,255,255,0.4)",
                          border: `1px solid ${createRole === r ? "rgba(233,30,140,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
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
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                  >
                    {creating ? "Creando…" : "Crear y enviar invitación"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setCreateError(""); }}
                    className="px-4 py-3 rounded-xl font-bold text-sm text-white/40"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Usuarios
          </h1>
          <p className="text-white/40 text-sm mt-1">{users.length} usuarios en el sistema</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
        >
          <UserPlus size={15} />
          Nuevo usuario
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email, nombre o rol…"
          className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none"
          style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Table */}
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
                <th className="px-3 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
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
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString("es-ES")
                        : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => handleToggle(user)}
                      disabled={togglingId === user.id}
                      title={user.status === "active" ? "Desactivar" : "Activar"}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                      style={{ color: user.status === "active" ? "#39d353" : "rgba(255,255,255,0.25)" }}
                    >
                      {user.status === "active"
                        ? <ToggleRight size={20} />
                        : <ToggleLeft size={20} />}
                    </button>
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
