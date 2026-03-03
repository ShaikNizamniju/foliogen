import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { lovable } from '@/integrations/lovable';
import { cn } from '@/lib/utils';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string()
  .min(6, 'Password must be 6–16 characters')
  .max(16, 'Password must be 6–16 characters')
  .regex(/[A-Z]/, 'Password needs at least 1 uppercase letter')
  .regex(/\d/, 'Password needs at least 1 number')
  .regex(/[^A-Za-z0-9]/, 'Password needs at least 1 symbol');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; fullName?: boolean }>({});
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated (handles OAuth callback return)
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin + '/dashboard',
      });
      if (result?.error) throw result.error;
      // OAuth typically redirects — if session is set inline, navigate
      if (!result?.redirected) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Google login failed');
      setGoogleLoading(false);
    }
    // Don't reset googleLoading in finally — if redirecting, component unmounts
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    try { emailSchema.parse(email); } catch { newErrors.email = true; }
    try { passwordSchema.parse(password); } catch { newErrors.password = true; }
    if (!isLogin && !fullName.trim()) newErrors.fullName = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErr = newErrors.email ? 'Please enter a valid email' : newErrors.password ? 'Password must be at least 6 characters' : 'Please enter your full name';
      toast.error(firstErr);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = error.message?.toLowerCase() || '';
          if (msg.includes('invalid') || msg.includes('credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else if (msg.includes('not confirmed') || msg.includes('email not confirmed')) {
            toast.error('Please confirm your email address before signing in.');
          } else {
            toast.error(error.message || 'Failed to sign in');
          }
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message?.includes('already registered') ? 'This email is already registered. Please sign in instead.' : error.message || 'Failed to create account');
        } else {
          toast.success('Account created! Welcome to Foliogen.');
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { toast.error('Please enter your email first.'); return; }
    try { emailSchema.parse(email); } catch { toast.error('Please enter a valid email.'); return; }
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message);
    else toast.success('Password reset email sent! Check your inbox.');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Foliogen</span>
          </Link>
          <Button variant="outline" size="sm" onClick={switchMode}>
            {isLogin ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className={cn("w-full max-w-[400px] mx-4 transition-all duration-300 animate-fade-in")}>
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>

          {/* Social Auth */}
          <div className="space-y-3 mb-6">
            <Button type="button" variant="outline" className="w-full h-12 text-base font-medium gap-3 rounded-md border-border" onClick={handleGoogleLogin} disabled={googleLoading || loading}>
              {googleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </Button>


          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Or, sign in with your email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">Full Name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: false })); }} className={cn("h-12", errors.fullName && "border-destructive animate-shake")} required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: false })); }} className={cn("h-12", errors.email && "border-destructive animate-shake")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: false })); }} className={cn("h-12 pr-10", errors.password && "border-destructive animate-shake")} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-md mt-2 bg-[hsl(358,100%,67%)] hover:bg-[hsl(358,100%,60%)] text-white" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLogin ? 'Sign in' : 'Create Account'}
            </Button>
          </form>

          {/* Security Badge — centered below form */}
          <div className="flex justify-center mt-6">
            <SecurityBadge />
          </div>

          {/* Footer */}
          <div className="mt-5 space-y-3">
            {isLogin && (
              <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">Forgot password?</button>
            )}
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={switchMode} className="text-primary hover:underline font-medium">
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              By signing up, you agree to our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Terms Of Use</Link>{' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-xs text-center text-muted-foreground pt-1">
              <a href="/#contact" className="text-primary/80 hover:text-primary hover:underline transition-colors">
                Found a bug? Help us improve.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
