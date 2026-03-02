import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { TemplateGallery } from '@/components/landing/TemplateGallery';
import { Pricing } from '@/components/landing/Pricing';
import { CompanyMarquee } from '@/components/landing/CompanyMarquee';
import { Footer } from '@/components/landing/Footer';
import { Testimonials } from '@/components/landing/Testimonials';
import { JobMatchDemo } from '@/components/landing/JobMatchDemo';

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <TemplateGallery />
      <Pricing />
      <Testimonials />
      <CompanyMarquee />
      <Footer />
    </div>
  );
};

export default Index;
