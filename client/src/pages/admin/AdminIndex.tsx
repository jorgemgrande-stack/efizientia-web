/**
 * Efizientia SaaS · Panel Admin — Dashboard
 * Resumen del sistema: nº de perfiles, cuentas activadas,
 * pendientes de invitación, último acceso.
 */

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, ChevronRight, X, CheckCircle, AlertCircle, Loader2, DatabaseZap } from "lucide-react";
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
  created_at: string;
}

interface ImportLog {
  rowsProcessed: number; profilesCreated: number; profilesUpdated: number;
  usersCreated: number; usersReused: number; usersSetInactive: number;
  noEmail: number; invitesSent: number; invitesSkipped: number;
  errors: string[]; details: string[];
}

export default function AdminIndex() {
  const [comerciales, setComerciales] = useState<ComercialRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Import modal
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportLog | null>(null);
  const [importError, setImportError] = useState("");

  const handleRunImport = async () => {
    setImporting(true);
    setImportError("");
    setImportResult(null);
    try {
      const res = await api.admin.users.runImport();
      setImportResult(res.log as unknown as ImportLog);
      api.admin.comerciales.list().then((data) => setComerciales(data as ComercialRow[]));
    } catch (err) {
      setImportError(err instanceof ApiError ? err.message : "Error al ejecutar la importación");
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    api.admin.comerciales.list()
      .then((data) => setComerciales(data as ComercialRow[]))
      .finally(() => setLoading(false));
  }, []);

  const total = comerciales.length;
  const conCuenta = comerciales.filter((c) => c.user_id !== null).length;
  const sinCuenta = total - conCuenta;
  const activos = comerciales.filter((c) => c.is_active).length;

  const stats = [
    { label: "Perfiles totales", value: total, icon: Users, color: "#e91e8c" },
    { label: "Con cuenta activa", value: conCuenta, icon: UserCheck, color: "#39d353" },
    { label: "Sin cuenta / pendientes", value: sinCuenta, icon: UserX, color: "#f59e0b" },
    { label: "Perfiles activos", value: activos, icon: Users, color: "#3b82f6" },
  ];

  return (
    <AdminLayout title="Dashboard">

      {/* ── Modal importación ── */}
      {showImport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          onClick={() => !importing && setShowImport(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl p-6"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {!importing && (
              <button
                onClick={() => setShowImport(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X size={15} />
              </button>
            )}

            <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
              style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)" }}>
              <DatabaseZap size={22} style={{ color: "#e91e8c" }} />
            </div>

            <h3 className="text-lg font-black text-white text-center mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Importar comerciales
            </h3>

            {!importResult && !importing && (
              <>
                <p className="text-white/50 text-sm text-center mb-6">
                  Cargará el CSV del servidor (<code className="text-white/70">comerciales.csv</code>) y creará fichas + usuarios con estado <strong className="text-white/70">inactivo</strong>.
                  El proceso es idempotente: re-ejecutar actualiza sin duplicar.
                </p>
                {importError && (
                  <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mb-4"
                    style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                    <AlertCircle size={14} className="flex-shrink-0" />{importError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleRunImport}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                  >
                    <DatabaseZap size={15} />
                    Ejecutar importación
                  </button>
                  <button
                    onClick={() => setShowImport(false)}
                    className="px-4 py-3 rounded-xl font-bold text-sm text-white/40"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {importing && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 size={32} className="animate-spin" style={{ color: "#e91e8c" }} />
                <p className="text-white/50 text-sm">Procesando CSV… puede tardar unos segundos</p>
              </div>
            )}

            {importResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ background: importResult.errors.length > 0 ? "rgba(248,113,113,0.1)" : "rgba(57,211,83,0.1)", border: `1px solid ${importResult.errors.length > 0 ? "rgba(248,113,113,0.3)" : "rgba(57,211,83,0.3)"}`, color: importResult.errors.length > 0 ? "#f87171" : "#39d353" }}>
                  {importResult.errors.length > 0
                    ? <AlertCircle size={14} className="flex-shrink-0" />
                    : <CheckCircle size={14} className="flex-shrink-0" />}
                  {importResult.errors.length > 0
                    ? `Completado con ${importResult.errors.length} error(es)`
                    : "Importación completada sin errores"}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["Filas procesadas", importResult.rowsProcessed],
                    ["Fichas creadas", importResult.profilesCreated],
                    ["Fichas actualizadas", importResult.profilesUpdated],
                    ["Usuarios creados", importResult.usersCreated],
                    ["Usuarios reutilizados", importResult.usersReused],
                    ["→ inactive", importResult.usersSetInactive],
                    ["Sin email", importResult.noEmail],
                    ["Invitaciones enviadas", importResult.invitesSent],
                    ["Invitaciones omitidas", importResult.invitesSkipped],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="flex justify-between px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="text-white/50">{label}</span>
                      <span className="font-bold text-white">{val}</span>
                    </div>
                  ))}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="rounded-xl p-3 text-xs space-y-1"
                    style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    {importResult.errors.map((e, i) => (
                      <div key={i} className="text-red-400">• {e}</div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { setShowImport(false); setImportResult(null); }}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)" }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-white/50 mt-1 text-sm">Vista general del sistema de asesores.</p>
        </div>
        <button
          onClick={() => { setShowImport(true); setImportResult(null); setImportError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
          style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.25)", color: "#e91e8c" }}
        >
          <DatabaseZap size={15} />
          Importar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="text-2xl font-black text-white">{loading ? "…" : value}</div>
            <div className="text-white/40 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Lista reciente */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
            Últimos perfiles
          </h2>
          <a href="/admin/comerciales"
            className="flex items-center gap-1 text-xs font-bold transition-colors"
            style={{ color: "#e91e8c" }}>
            Ver todos <ChevronRight size={12} />
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 animate-spin"
              style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }} />
          </div>
        ) : comerciales.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">
            No hay perfiles todavía.{" "}
            <a href="/admin/comerciales/nuevo" style={{ color: "#e91e8c" }}>Crear el primero</a>
          </div>
        ) : (
          <div>
            {comerciales.slice(0, 6).map((c) => (
              <div key={c.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: "rgba(233,30,140,0.15)", color: "#e91e8c" }}>
                  {c.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{c.display_name}</div>
                  <div className="text-white/40 text-xs">/humanos/{c.slug}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.user_id ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(57,211,83,0.1)", color: "#39d353" }}>Activo</span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>Sin cuenta</span>
                  )}
                  <a href={`/admin/comerciales/${c.id}`}
                    className="text-white/30 hover:text-white transition-colors p-1">
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
