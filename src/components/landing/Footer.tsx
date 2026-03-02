import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FolioGen" className="h-10 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link 
              to="/auth" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Login
            </Link>
            <Link 
              to="/auth" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign Up
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Foliogen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
