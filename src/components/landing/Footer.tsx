import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">FolioGen</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link 
              to="/auth" 
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link 
              to="/auth" 
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Sign Up
            </Link>
            <Link 
              to="#" 
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Privacy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FolioGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
