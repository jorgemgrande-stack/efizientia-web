/**
 * Efizientia SaaS · Panel Asesor — Layout
 * Sidebar fijo en desktop, hamburger en mobile.
 * Design dark tech coherente: fondo #0a0a0a, sidebar #111111, magenta #e91e8c.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { User, LayoutDashboard, Menu, LogOut, ExternalLink, ShieldCheck, Users, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PanelLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const panelNav = [
  { label: "Inicio", href: "/panel", icon: LayoutDashboard, exact: true },
  { label: "Mi Ficha", href: "/panel/mi-ficha", icon: User, exact: false },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Comerciales", href: "/admin/comerciales", icon: Users, exact: false },
  { label: "Usuarios", href: "/admin/usuarios", icon: UserCog, exact: false },
];

export default function PanelLayout({ children, title }: PanelLayoutProps) {
  const [sideOpen, setSideOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }} className="flex">
      {/* Overlay mobile */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300
          ${sideOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/">
            <img
              src="/images/efizientia-logo-dark_f1c2a2ee.png"
              alt="Efizientia"
              style={{ height: 32, objectFit: "contain" }}
            />
          </a>
          <div className="mt-3 text-xs text-white/30 font-semibold uppercase tracking-widest">
            Panel Asesor
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)", color: "#fff" }}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">{user?.name}</div>
              <div className="text-white/40 text-xs truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4">
          {panelNav.map(({ label, href, icon: Icon, exact }) => {
            const active = exact ? location === href : location.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold mb-1 transition-all"
                style={{
                  background: active ? "rgba(233,30,140,0.12)" : "transparent",
                  color: active ? "#e91e8c" : "rgba(255,255,255,0.6)",
                  border: active ? "1px solid rgba(233,30,140,0.2)" : "1px solid transparent",
                }}
                onClick={() => setSideOpen(false)}
              >
                <Icon size={16} />
                {label}
              </a>
            );
          })}

          {/* Sección admin — solo visible para administradores */}
          {user?.role === "admin" && (
            <div className="mt-4">
              <div
                className="flex items-center gap-1.5 px-3 mb-2"
              >
                <ShieldCheck size={11} style={{ color: "#e91e8c" }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#e91e8c" }}
                >
                  Administración
                </span>
              </div>
              {adminNav.map(({ label, href, icon: Icon, exact }) => {
                const active = exact ? location === href : location.startsWith(href);
                return (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold mb-1 transition-all"
                    style={{
                      background: active ? "rgba(233,30,140,0.12)" : "transparent",
                      color: active ? "#e91e8c" : "rgba(255,255,255,0.6)",
                      border: active ? "1px solid rgba(233,30,140,0.2)" : "1px solid transparent",
                    }}
                    onClick={() => setSideOpen(false)}
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer links */}
        <div className="px-4 py-4 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            <ExternalLink size={16} />
            Ver web pública
          </a>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile header */}
        <div
          className="md:hidden flex items-center justify-between px-4 h-14 flex-shrink-0"
          style={{ background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button onClick={() => setSideOpen(!sideOpen)} className="text-white p-1">
            <Menu size={22} />
          </button>
          {title && <span className="text-white font-bold text-sm">{title}</span>}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #e91e8c, #c2166e)", color: "#fff" }}
          >
            {initial}
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
