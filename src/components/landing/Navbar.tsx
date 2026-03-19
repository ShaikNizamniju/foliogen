import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'templates', label: 'Templates' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt="Foliogen" className="h-10 w-auto transition-transform group-hover:scale-105" />
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.1)]">
            Beta
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button asChild className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary hover:to-blue-400 border-0">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-neutral-400 hover:text-white hover:bg-white/5 font-outfit"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-cobalt hover:bg-cobalt/90 text-white font-outfit shadow-md border-0"
                >
                  <Link to="/auth?provider=google">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Using Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/5">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0a]/95 border-l border-white/10 backdrop-blur-xl p-0 w-[280px]">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-white/5 text-left">
                  <SheetTitle className="text-white font-outfit tracking-wider uppercase text-xs opacity-50">Navigation</SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="text-lg font-medium text-neutral-400 hover:text-indigo-400 transition-colors py-3 px-4 rounded-xl hover:bg-white/5 text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                  
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3 px-2">
                    {user ? (
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-blue-500 py-6 text-base font-bold rounded-2xl">
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-base font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                          <Link to="/auth?provider=google" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full text-neutral-400 hover:text-white py-6 text-sm">
                          <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>

                <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold text-center">
                    Foliogen Professional © 2024
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
