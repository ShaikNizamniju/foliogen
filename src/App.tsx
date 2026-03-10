import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProProvider } from "@/contexts/ProContext";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { AuthLoadingOverlay } from "@/components/AuthLoadingOverlay";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PublicPortfolio = lazy(() => import("./pages/PublicPortfolio"));
const Privacy = lazy(() => import("./pages/Privacy"));
const SocialKit = lazy(() => import("./pages/SocialKit"));
const TemplatesGallery = lazy(() => import("./pages/TemplatesGallery"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terms = lazy(() => import("./pages/Terms"));
const Refunds = lazy(() => import("./pages/Refunds"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Success = lazy(() => import("./pages/Success"));

const queryClient = new QueryClient();

function AppRoutes() {
  const { initializing } = useAuth();
  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith('/p/') || location.pathname.startsWith('/u/');

  return (
    <>
      {!isPublicRoute && <AuthLoadingOverlay show={initializing} />}
      <Suspense fallback={<AuthLoadingOverlay show={true} />}>
        <Routes>
          <Route path="/p/:id" element={<PublicPortfolio />} />
          <Route path="/u/:id" element={<PublicPortfolio />} />
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/social-kit" element={<SocialKit />} />
          <Route path="/templates" element={<TemplatesGallery />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/success" element={<Success />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FloatingThemeToggle />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <div style={{ background: '#4f46e5', color: 'white', padding: '10px', textAlign: 'center', zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0 }}>DEPLOYMENT V1.0.3 ACTIVE</div>
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
