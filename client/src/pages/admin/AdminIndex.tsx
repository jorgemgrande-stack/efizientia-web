/**
 * Efizientia SaaS · Panel Admin — Dashboard
 * Resumen del sistema: nº de perfiles, cuentas activadas,
 * pendientes de invitación, último acceso.
 */

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, ChevronRight } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";

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

export default function AdminIndex() {
  const [comerciales, setComerciales] = useState<ComercialRow[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-black text-white"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-white/50 mt-1 text-sm">Vista general del sistema de asesores.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div className="text-2xl font-black text-white">{loading ? "…" : value}</div>
            <div className="text-white/40 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Lista reciente */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
            Últimos perfiles
          </h2>
          <a
            href="/admin/comerciales"
            className="flex items-center gap-1 text-xs font-bold transition-colors"
            style={{ color: "#e91e8c" }}
          >
            Ver todos
            <ChevronRight size={12} />
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-8 h-8 rounded-full border-4 animate-spin"
              style={{ borderColor: "rgba(233,30,140,0.2)", borderTopColor: "#e91e8c" }}
            />
          </div>
        ) : comerciales.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">
            No hay perfiles todavía.{" "}
            <a href="/admin/comerciales/nuevo" style={{ color: "#e91e8c" }}>Crear el primero</a>
          </div>
        ) : (
          <div>
            {comerciales.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: "rgba(233,30,140,0.15)", color: "#e91e8c" }}
                >
                  {c.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{c.display_name}</div>
                  <div className="text-white/40 text-xs">/humanos/{c.slug}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.user_id ? (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(57,211,83,0.1)", color: "#39d353" }}
                    >
                      Activo
                    </span>
                  ) : (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
                    >
                      Sin cuenta
                    </span>
                  )}
                  <a
                    href={`/admin/comerciales/${c.id}`}
                    className="text-white/30 hover:text-white transition-colors p-1"
                  >
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
