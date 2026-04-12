/**
 * Efizientia SaaS · PrivateRoute + AdminRoute
 * Guards de ruta compatibles con Wouter.
 * Redirigen a /login si no hay sesión, o muestran spinner mientras carga.
 */

import { Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

function SpinnerPage() {
  return (
    <div
      style={{ background: "#0a0a0a", minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <div
        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(233,30,140,0.3)", borderTopColor: "#e91e8c" }}
      />
    </div>
  );
}

interface RouteGuardProps {
  component: React.ComponentType;
}

/** Ruta privada: requiere sesión activa (cualquier rol) */
export function PrivateRoute({ component: Component }: RouteGuardProps) {
  const { user, loading } = useAuth();
  if (loading) return <SpinnerPage />;
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

/** Ruta de admin: requiere role === 'admin' */
export function AdminRoute({ component: Component }: RouteGuardProps) {
  const { user, loading } = useAuth();
  if (loading) return <SpinnerPage />;
  if (!user) return <Redirect to="/login" />;
  if (user.role !== "admin") return <Redirect to="/panel" />;
  return <Component />;
}
