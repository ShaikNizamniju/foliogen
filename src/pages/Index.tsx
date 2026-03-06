import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { JobMatchDemo } from '@/components/landing/JobMatchDemo';
import { LandingV2 } from '@/components/landing/LandingV2';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for Job Match parameters
  const hasJobMatchParams = searchParams.has('company') || searchParams.has('skill') || searchParams.has('target');

  // Redirect logged-in users to dashboard UNLESS they have Job Match params
  useEffect(() => {
    if (!loading && user && !hasJobMatchParams) {
      navigate('/dashboard');
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
