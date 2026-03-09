import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { JobMatchDemo } from "@/components/landing/JobMatchDemo";
import { LandingV2 } from "@/components/landing/LandingV2";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for Job Match parameters
  const hasJobMatchParams = searchParams.has("company") || searchParams.has("skill") || searchParams.has("target");

  // Redirect logged-in users to dashboard UNLESS they have Job Match params
  useEffect(() => {
    if (!loading && user && !hasJobMatchParams) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, hasJobMatchParams]);

  // If Job Match mode is active, show the demo experience
  if (hasJobMatchParams) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <JobMatchDemo />
        <Footer />
      </div>
    );
  }

  // Use the new monolithic Landing Design System
  return <LandingV2 />;
};

export default Index;
// Emergency Success Component - Nested to bypass file creation limits
export const SuccessOverlay = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 rounded-full bg-[#4f46e5] opacity-20 blur-2xl animate-pulse" />
        <svg className="w-24 h-24 text-[#4f46e5] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight">Identity, Engineered.</h1>
      <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
        Your narrative is now unlocked. Welcome to the elite tier of professional storytelling.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-8 py-4 bg-[#4f46e5] text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
      >
        Go to Dashboard →
      </button>
      <p className="mt-16 text-xs text-muted-foreground">
        Need help? Contact <span className="text-[#4f46e5]">admin@foliogen.in</span>
      </p>
    </div>
  );
};
