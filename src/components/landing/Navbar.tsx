import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

export function Navbar() {
  const { user } = useAuth();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="FolioGen" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a 
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white cursor-pointer"
          >
            Features
          </a>
          <a 
            href="#templates"
            onClick={(e) => scrollToSection(e, 'templates')}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white cursor-pointer"
          >
            Templates
          </a>
          <a 
            href="#pricing"
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white cursor-pointer"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary hover:to-blue-400 border-0">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button 
                asChild 
                variant="ghost" 
                className="hidden sm:inline-flex text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary hover:to-blue-400 border-0"
              >
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
