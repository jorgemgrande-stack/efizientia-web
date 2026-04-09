import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/efis"} component={Efis} />
      <Route path={"/efis/:slug"} component={EfiProfile} />
      <Route path={"/luz"} component={Luz} />
      <Route path={"/gas"} component={Gas} />
      <Route path={"/humanos"} component={Humanos} />
      <Route path={"/humanos/:slug"} component={HumanoProfile} />
      <Route path={"/contacto"} component={Contact} />
      <Route path={"/privacidad"} component={PrivacyPolicy} />
      <Route path={"/cookies"} component={CookiesPolicy} />
      <Route path={"/aviso-legal"} component={LegalNotice} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
