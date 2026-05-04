import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ArrowRight, Users, Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/lib/supabase_v2';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.png';
import { useWelcomeEmail } from '@/hooks/use-welcome-email';

/* ── Validation Schemas ──────────────────────────────────────────────── */
const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z
  .string()
  .min(6, 'Password must be 6–16 characters')
  .max(16, 'Password must be 6–16 characters')
  .regex(/[A-Z]/, 'Password needs at least 1 uppercase letter')
  .regex(/\d/, 'Password needs at least 1 number')
  .regex(/[^A-Za-z0-9]/, 'Password needs at least 1 symbol');

/* ── Stat Counter data ───────────────────────────────────────────────── */
const STATS = [
  { value: '12,400+', label: 'Portfolios Generated', icon: Users },
  { value: '3.2×', label: 'More Recruiter Views', icon: Star },
  { value: '89%', label: 'Interview Rate Boost', icon: Briefcase },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean; fullName?: boolean }>({});
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { triggerWelcomeEmail } = useWelcomeEmail();

  useEffect(() => {
    if (!authLoading && user) {
      // If we already have a section intended, or just default to overview
      const searchParams = new URLSearchParams(window.location.search);
      const section = searchParams.get('section') || 'overview';
      navigate(`/dashboard?section=${section}`, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    // Pre-fetch intent
    import('./Dashboard');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard?section=overview',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Note: signInWithOAuth redirects the window, so no navigate is needed here on success
    } catch (error: any) {
      const isNetworkError = error?.message?.toLowerCase().includes('fetch') || error?.message?.toLowerCase().includes('network error');
      if (isNetworkError) {
        toast.error("Network Error: Cannot connect to the Identity Vault. Please ensure your adblocker is disabled and try again.");
      } else {
        toast.error(error?.message || 'Google login failed');
      }
      setGoogleLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      toast.error('Automated behavior detected. Request blocked.');
      return;
    }
    const newErrors: typeof errors = {};
    try { emailSchema.parse(email); } catch { newErrors.email = true; }
    try { passwordSchema.parse(password); } catch { newErrors.password = true; }
    if (!isLogin && !fullName.trim()) newErrors.fullName = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErr = newErrors.email
        ? 'Please enter a valid email'
        : newErrors.password
          ? 'Password needs uppercase + number + symbol'
          : 'Please enter your full name';
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
          triggerWelcomeEmail(email.split('@')[0], 'email');
          navigate('/dashboard?section=overview');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(
            error.message?.includes('already registered')
              ? 'This email is already registered. Please sign in instead.'
              : error.message || 'Failed to create account'
          );
        } else {
          toast.success('Account created! Welcome to Foliogen.');
          triggerWelcomeEmail(fullName, 'email');
          navigate('/dashboard?section=overview');
        }
      }
    } catch (err: any) {
      const isNetworkError = err?.message?.toLowerCase().includes('fetch') || err?.message?.toLowerCase().includes('network error');
      if (isNetworkError) {
        toast.error("Network Error: Cannot connect to the Identity Vault. Please ensure your adblocker is disabled and try again.");
      } else {
        toast.error(err?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { toast.error('Please enter your email first.'); return; }
    try { emailSchema.parse(email); } catch { toast.error('Please enter a valid email.'); return; }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/callback?next=/reset-password',
      });
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error('PASSWORD RESET FAILED', {
        description: error?.message || 'Failed to send reset email. Please verify your connection.',
        style: { background: '#7f1d1d', border: '1px solid #ef4444', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((v) => !v);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* ── LEFT PANEL ────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 xl:p-16">
        {/* Noise + gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--cobalt)) 40%, hsl(var(--sidebar-background)) 70%, hsl(var(--background)) 100%)',
          }}
        />
        {/* Decorative glow blobs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logoImg} alt="Foliogen" className="h-9 w-9 object-contain dark:invert" loading="eager" />
          <span className="text-foreground font-semibold text-xl tracking-tight">Foliogen</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm uppercase tracking-widest">
              AI-Powered Portfolios
            </p>
            <h1 className="text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Your work,<br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, hsl(var(--gold)) 0%, hsl(var(--gold-light)) 50%, hsl(var(--gold)) 100%)',
                }}
              >
                beautifully told.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
              Turn your career into a compelling story that makes recruiters stop scrolling and start calling.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl p-4 border border-border backdrop-blur-sm bg-background/40"
              >
                <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                <p className="text-foreground font-bold text-xl">{value}</p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* Floating testimonial card */}
          <div
            className="rounded-2xl p-5 border border-border max-w-sm bg-background/60 backdrop-blur-[16px]"
          >
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5" style={{ fill: 'hsl(var(--gold))', color: 'hsl(var(--gold))' }} />
              ))}
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed italic">
              "Landed 4 interviews in 2 weeks after switching to my Foliogen portfolio. The AI descriptions are next-level."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-bold">
                R
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Shaik N.</p>
                <p className="text-muted-foreground text-xs">AI Product Manager @ Foliogen</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[#4a5568] text-xs">
          © 2025 Foliogen · Built with ❤ for ambitious professionals
        </p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-between px-4 py-10 min-h-screen relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,91,214,0.08) 0%, transparent 60%), #080810',
        }}
      >

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-4 mx-auto w-full text-center relative z-10">
          <img src={logoImg} alt="Foliogen" className="h-8 w-8 object-contain invert" loading="eager" />
          <span className="text-white font-semibold text-lg">Foliogen</span>
        </div>

        <div
          className="w-full max-w-[420px] space-y-6 mx-auto my-auto relative z-10 p-6 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Heading */}
          <div className="space-y-3 text-center flex flex-col items-center">
            <span
              className="px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.18em] uppercase mb-1"
              style={{
                border: '1px solid #5B5BD6',
                background: 'rgba(91,91,214,0.10)',
                color: '#a78bfa',
              }}
            >
              AI-Powered Portfolios
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #a78bfa 100%)',
                letterSpacing: '-0.025em',
              }}
            >
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm max-w-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {isLogin
                ? 'Sign in to continue building your portfolio.'
                : 'Join 12,400+ narrative architects engineering their professional legacy.'}
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onMouseEnter={() => import('./Dashboard')}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className={cn(
              'w-full flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-semibold transition-all duration-200',
              (googleLoading || loading) && 'opacity-60 cursor-not-allowed'
            )}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
            }}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs shrink-0">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="b_firstname"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-muted-foreground text-sm font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Shaik Nizamuddin"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: false })); }}
                  className={cn(
                    'h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-indigo-500/20',
                    errors.fullName && 'border-red-500'
                  )}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@foliogen.in"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: false })); }}
                className={cn(
                  'h-12 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-indigo-500/20',
                  errors.email && 'border-red-500'
                )}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-muted-foreground text-sm font-medium">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative h-11">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: false })); }}
                  className={cn(
                    'h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-indigo-500/20 pr-10',
                    errors.password && 'border-red-500'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground hover:text-foreground transition-all duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-muted-foreground text-xs">Must be 6–16 chars with uppercase, number & symbol.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              onMouseEnter={() => import('./Dashboard')}
              disabled={loading || googleLoading}
              className={cn(
                'w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200',
                'text-white shadow-lg shadow-indigo-900/30',
                loading || googleLoading ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
              )}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={switchMode}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-indigo-400/70 hover:text-indigo-400 transition-colors">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-indigo-400/70 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>.
            </p>
            <p className="text-xs">
              <a
                href="https://forms.gle/foliogen_feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-indigo-400 transition-colors"
              >
                Found a bug? Help us improve. →
              </a>
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium pt-4 border-t border-border/50">
              Join 500+ pros using the 90-day Sprint Pass. No subscriptions. Just results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
