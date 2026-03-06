import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProProvider } from "@/contexts/ProContext";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { AuthLoadingOverlay } from "@/components/AuthLoadingOverlay";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PublicPortfolio from "./pages/PublicPortfolio";
import Privacy from "./pages/Privacy";
import SocialKit from "./pages/SocialKit";
import TemplatesGallery from "./pages/TemplatesGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { initializing } = useAuth();

  return (
    <>
      <AuthLoadingOverlay show={initializing} />
      <Routes>
        <Route path="/p/:id" element={<PublicPortfolio />} />
        <Route path="/u/:id" element={<PublicPortfolio />} />
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/social-kit" element={<SocialKit />} />
        <Route path="/templates" element={<TemplatesGallery />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingThemeToggle />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="foliogen-ui-theme">
        <AuthProvider>
          <ProProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ProProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
