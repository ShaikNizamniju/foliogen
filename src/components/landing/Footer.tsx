import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">FolioGen</span>
          </div>

          <nav className="flex gap-6">
            <Link to="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link to="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link to="/auth" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Sign In
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2024 FolioGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
