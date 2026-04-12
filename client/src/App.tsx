import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";

// Public pages
import Home from "./pages/Home";
import Efis from "./pages/Efis";
import EfiProfile from "./pages/EfiProfile";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import LegalNotice from "@/pages/LegalNotice";
import Luz from "@/pages/Luz";
import Gas from "@/pages/Gas";
import Humanos from "@/pages/Humanos";
import HumanoProfile from "@/pages/HumanoProfile";
import OptimizacionFactura from "@/pages/OptimizacionFactura";

// Auth pages
import Login from "@/pages/Login";
import InvitationAccept from "@/pages/InvitationAccept";

// Comercial panel
import PanelIndex from "@/pages/panel/PanelIndex";
import MiFicha from "@/pages/panel/MiFicha";

// Admin panel
import AdminIndex from "@/pages/admin/AdminIndex";
import Comerciales from "@/pages/admin/Comerciales";
import NuevoComercial from "@/pages/admin/NuevoComercial";
import EditarComercial from "@/pages/admin/EditarComercial";
import AdminUsuarios from "@/pages/admin/AdminUsuarios";

function Router() {
  return (
    <Switch>
      {/* ── Public ──────────────────────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/efis" component={Efis} />
      <Route path="/efis/:slug" component={EfiProfile} />
      <Route path="/luz" component={Luz} />
      <Route path="/gas" component={Gas} />
      <Route path="/humanos" component={Humanos} />
      <Route path="/humanos/:slug" component={HumanoProfile} />
      <Route path="/optimizacion_factura_energetica" component={OptimizacionFactura} />
      <Route path="/contacto" component={Contact} />
      <Route path="/privacidad" component={PrivacyPolicy} />
      <Route path="/cookies" component={CookiesPolicy} />
      <Route path="/aviso-legal" component={LegalNotice} />

      {/* ── Auth ────────────────────────────────────────────── */}
      <Route path="/login" component={Login} />
      <Route path="/invitation/accept/:token" component={InvitationAccept} />

      {/* ── Comercial panel ─────────────────────────────────── */}
      <Route path="/panel">
        {() => <PrivateRoute component={PanelIndex} />}
      </Route>
      <Route path="/panel/mi-ficha">
        {() => <PrivateRoute component={MiFicha} />}
      </Route>

      {/* ── Admin panel ─────────────────────────────────────── */}
      <Route path="/admin">
        {() => <AdminRoute component={AdminIndex} />}
      </Route>
      <Route path="/admin/comerciales">
        {() => <AdminRoute component={Comerciales} />}
      </Route>
      <Route path="/admin/comerciales/nuevo">
        {() => <AdminRoute component={NuevoComercial} />}
      </Route>
      <Route path="/admin/comerciales/:id">
        {() => <AdminRoute component={EditarComercial} />}
      </Route>
      <Route path="/admin/usuarios">
        {() => <AdminRoute component={AdminUsuarios} />}
      </Route>

      {/* ── 404 ─────────────────────────────────────────────── */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
