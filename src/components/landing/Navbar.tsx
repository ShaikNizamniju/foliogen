import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export function Navbar() {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">FolioGen</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            to="#features" 
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Templates
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            Pricing
          </Link>
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
