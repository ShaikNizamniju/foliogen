import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { JobMatchDemo } from "@/components/landing/JobMatchDemo";
import { LandingV2 } from "@/components/landing/LandingV2";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

// Emergency Success Overlay component defined outside the main Index
const SuccessOverlay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFromUrl = searchParams.get("plan") || "sprint_pass";

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4f46e5]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
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
        Welcome to the Open Beta — Pro Features Unlocked!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-4 bg-[#4f46e5] text-white rounded-full font-medium hover:bg-[#4f46e5]/90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          Start Building Your Story →
        </button>
        <button
          onClick={() => navigate("/dashboard?tab=templates")}
          className="text-muted-foreground hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          View Templates
        </button>
      </div>
      <p className="mt-16 text-sm text-muted-foreground font-light tracking-wide">
        Having trouble? Reach our engineering lead at <a href="mailto:admin@foliogen.in" className="text-white hover:text-[#4f46e5] transition-colors">admin@foliogen.in</a>
      </p>
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Logic checks
  const isSuccess = searchParams.has("success");
  const hasJobMatchParams = searchParams.has("company") || searchParams.has("skill") || searchParams.has("target");

  useEffect(() => {
    // Redirect logic
    if (!loading && user && !hasJobMatchParams) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, hasJobMatchParams]);

  if (hasJobMatchParams) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <JobMatchDemo />
        <Footer />
      </div>
    );
  }

  return (
    <>
      {isSuccess && <SuccessOverlay />}
      <LandingV2 />
    </>
  );
};

export default Index;
