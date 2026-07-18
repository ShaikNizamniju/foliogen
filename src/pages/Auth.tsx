import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/lib/supabase_v2';
import { useWelcomeEmail } from '@/hooks/use-welcome-email';
import { SEO } from '@/components/SEO';
import { track } from '@vercel/analytics';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z
  .string()
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
  const [honeypot, setHoneypot] = useState('');
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { triggerWelcomeEmail } = useWelcomeEmail();

  // Animated counters
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);

  // Cursor refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const searchParams = new URLSearchParams(window.location.search);
      const section = searchParams.get('section') || 'overview';
      navigate(`/dashboard?section=${section}`, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Funnel: fire once on auth screen mount for unauthenticated visitors.
  // Note: this screen serves both login and signup (toggled via `isLogin`).
  const signupScreenTracked = useRef(false);
  useEffect(() => {
    if (signupScreenTracked.current) return;
    if (authLoading) return;
    if (user) return;
    signupScreenTracked.current = true;
    track('signup_screen_reached');
  }, [authLoading, user]);

  // Counter animation
  useEffect(() => {
    const targets = [12400, 3.2, 89];
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setC1(Math.floor(targets[0] * ease));
      setC2(Number((targets[1] * ease).toFixed(1)));
      setC3(Math.floor(targets[2] * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Custom cursor (desktop only)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx - 4}px`;
        cursorRef.current.style.top = `${my - 4}px`;
      }
    };
    const anim = () => {
      rx += (mx - rx - 14) * 0.12;
      ry += (my - ry - 14) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(anim);
    };
    document.addEventListener('mousemove', move);
    raf = requestAnimationFrame(anim);
    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true);
    import('./Dashboard');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard?section=overview',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      const isNetworkError = error?.message?.toLowerCase().includes('fetch') || error?.message?.toLowerCase().includes('network error');
      toast.error(isNetworkError ? 'Network Error: Cannot connect. Please disable your adblocker and try again.' : (error?.message || 'Google login failed'));
      setGoogleLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) { toast.error('Automated behavior detected. Request blocked.'); return; }
    try { emailSchema.parse(email); } catch { toast.error('Please enter a valid email'); return; }
    try { passwordSchema.parse(password); } catch { toast.error('Password needs uppercase + number + symbol'); return; }
    if (!isLogin && !fullName.trim()) { toast.error('Please enter your full name'); return; }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = error.message?.toLowerCase() || '';
          if (msg.includes('invalid') || msg.includes('credentials')) toast.error('Invalid email or password. Please try again.');
          else if (msg.includes('not confirmed')) toast.error('Please confirm your email address before signing in.');
          else toast.error(error.message || 'Failed to sign in');
        } else {
          toast.success('Welcome back!');
          triggerWelcomeEmail(email.split('@')[0], 'email');
          navigate('/dashboard?section=overview');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message?.includes('already registered')
            ? 'This email is already registered. Please sign in instead.'
            : error.message || 'Failed to create account');
        } else {
          toast.success('Account created! Welcome to Foliogen.');
          track('signup_completed', { method: 'email' });
          triggerWelcomeEmail(fullName, 'email');
          navigate('/dashboard?section=overview');
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
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/callback?next=/reset-password',
      });
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="foliogen-auth-v2">
      <SEO
        title="Sign in or create your Foliogen account"
        description="Sign in to Foliogen with email or Google to build, customize, and share your AI-powered professional portfolio."
        path="/auth"
      />

      <div ref={cursorRef} className="fg-cursor" aria-hidden="true" />
      <div ref={ringRef} className="fg-cursor-ring" aria-hidden="true" />

      <div className="fg-layout">
        {/* LEFT */}
        <div className="fg-left">
          <div className="fg-left-deco">Folio</div>

          <div className="fg-header">
            <Link to="/" className="fg-logo">
              <div className="fg-logo-box">F</div>
              <div className="fg-logo-text">Foliogen</div>
            </Link>
            <div className="fg-nav-tag">www.foliogen.in</div>
          </div>

          <div className="fg-hero">
            <div className="fg-issue-line">AI-Powered Portfolios · Est. 2026</div>

            <h1 className="fg-h1">
              <span className="fg-word"><span>Your</span></span>{' '}
              <span className="fg-word fg-italic fg-red"><span>Work,</span></span>
              <br />
              <span className="fg-word"><span>Beautifully</span></span>{' '}
              <span className="fg-word fg-italic"><span>Told.</span></span>
            </h1>

            <p className="fg-sub">
              Turn your career into a compelling story that makes recruiters stop scrolling and start calling.
            </p>

            <div className="fg-stats">
              <div className="fg-stat">
                <div className="fg-stat-n">20<em>+</em></div>
                <div className="fg-stat-l">Templates</div>
              </div>
              <div className="fg-stat">
                <div className="fg-stat-n">AI</div>
                <div className="fg-stat-l">Powered</div>
              </div>
              <div className="fg-stat">
                <div className="fg-stat-n">Free</div>
                <div className="fg-stat-l">Forever</div>
              </div>
            </div>
          </div>

          <div className="fg-left-footer">© 2026 Foliogen · Built for ambitious professionals</div>
        </div>

        {/* RIGHT */}
        <div className="fg-right">
          <div className="fg-scan-line" />
          <div className="fg-corner-tl" />
          <div className="fg-corner-br" />

          <div className="fg-right-inner">
            <div className="fg-r-eyebrow"><span /> AI-Powered Portfolios</div>

            <div className="fg-r-title">
              {isLogin ? <>Welcome<br /><em>Back.</em></> : <>Create<br /><em>Account.</em></>}
            </div>
            <div className="fg-r-sub">
              {isLogin ? 'Sign in to continue building your portfolio.' : 'Create your free account and start telling your story.'}
            </div>

            <button className="fg-btn-g" type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading} onMouseEnter={() => import('./Dashboard')}>
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <svg className="fg-g-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="fg-divider"><span>or with email</span></div>

            <form onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text" name="b_firstname" tabIndex={-1} autoComplete="off"
                style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }}
                value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
              />

              {!isLogin && (
                <div className="fg-field">
                  <div className="fg-field-top"><div className="fg-f-label">Full Name</div></div>
                  <div className="fg-inp-wrap">
                    <input type="text" placeholder="Shaik Nizamuddin" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                </div>
              )}

              <div className="fg-field">
                <div className="fg-field-top"><div className="fg-f-label">Email address</div></div>
                <div className="fg-inp-wrap">
                  <input type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="fg-field">
                <div className="fg-field-top">
                  <div className="fg-f-label">Password</div>
                  {isLogin && (
                    <button type="button" className="fg-f-link" onClick={handleForgotPassword}>Forgot?</button>
                  )}
                </div>
                <div className="fg-inp-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? 'Min. 6 characters' : '6–16 chars, A1!'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="fg-eye" aria-label="Toggle password" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-10-8-10-8a18.45 18.45 0 014.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-3.17 4.19M1 1l22 22" />
                        <path d="M14.12 14.12A3 3 0 119.88 9.88" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="fg-btn-cta" disabled={loading || googleLoading} onMouseEnter={() => import('./Dashboard')}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="fg-r-footer">
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setIsLogin((v) => !v)}>
                  {isLogin ? 'Create one →' : 'Sign in →'}
                </button>
              </p>
              <div className="fg-r-legal">
                By continuing you agree to our <Link to="/terms">Terms</Link> &amp; <Link to="/privacy">Privacy Policy</Link>.<br />
                <a href="/contact">Found a bug? Help us improve →</a>
              </div>
            </div>

            <div className="fg-pill-row">
              <div className="fg-pill">Free Forever</div>
              <div className="fg-pill">No Subscriptions</div>
              <div className="fg-pill">AI-Powered</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .foliogen-auth-v2 { --bg:#f0ede6; --ink:#111010; --accent:#e8401a; --muted:#7a7670; --border:#c8c3b8;
          min-height:100vh; background:var(--bg); color:var(--ink);
          font-family:'Syne','Inter',system-ui,sans-serif; position:relative; overflow:hidden; }
        .foliogen-auth-v2::before {
          content:''; position:fixed; inset:0;
          background-image: radial-gradient(circle, #c0bbb2 1px, transparent 1px);
          background-size: 28px 28px; opacity:0.55; z-index:0; pointer-events:none;
        }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');

        .fg-layout { position:relative; z-index:1; display:grid; grid-template-columns: 1fr 440px; min-height:100vh; }
        @media (max-width: 960px) { .fg-layout { grid-template-columns: 1fr; } .fg-left { padding:32px 24px !important; } .fg-left-deco { display:none; } }

        /* LEFT */
        .fg-left { display:flex; flex-direction:column; padding:40px 52px; position:relative; overflow:hidden; }
        .fg-left-deco { position:absolute; bottom:-40px; left:-10px; font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:clamp(120px,18vw,240px); line-height:1; color:transparent; -webkit-text-stroke:1px var(--border); pointer-events:none; user-select:none; white-space:nowrap; opacity:0; animation:fg-fadeIn 1.2s 0.8s ease forwards; }
        .fg-header { display:flex; align-items:center; justify-content:space-between; opacity:0; animation:fg-fadeDown 0.6s 0.1s ease forwards; }
        .fg-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .fg-logo-box { width:34px; height:34px; background:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-weight:900; font-size:16px; color:var(--bg); }
        .fg-logo-text { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; color:var(--ink); letter-spacing:-0.01em; }
        .fg-nav-tag { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); font-family:'JetBrains Mono',monospace; font-weight:300; }
        .fg-hero { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 0; }
        .fg-issue-line { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); margin-bottom:20px; display:flex; align-items:center; gap:10px; opacity:0; animation:fg-fadeUp 0.6s 0.35s ease forwards; }
        .fg-issue-line::before { content:''; width:20px; height:2px; background:var(--accent); flex-shrink:0; }
        .fg-h1 { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(44px,6vw,86px); line-height:0.95; letter-spacing:-0.02em; color:var(--ink); max-width:600px; margin-bottom:28px; }
        .fg-word { display:inline-block; overflow:hidden; vertical-align:top; }
        .fg-word > span { display:inline-block; transform:translateY(110%); animation:fg-slideUp 0.85s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fg-word:nth-child(1) > span { animation-delay:0.4s; }
        .fg-word:nth-child(2) > span { animation-delay:0.5s; }
        .fg-word:nth-child(3) > span { animation-delay:0.6s; }
        .fg-word:nth-child(4) > span { animation-delay:0.7s; }
        .fg-italic > span { font-style:italic; }
        .fg-red > span { color:var(--accent); }
        .fg-sub { font-size:14px; line-height:1.75; color:var(--muted); max-width:400px; margin-bottom:44px; opacity:0; animation:fg-fadeUp 0.6s 0.9s ease forwards; }
        .fg-stats { display:flex; border-top:1.5px solid var(--ink); border-bottom:1.5px solid var(--ink); opacity:0; animation:fg-fadeUp 0.6s 1.05s ease forwards; }
        .fg-stat { flex:1; padding:18px 0; }
        .fg-stat + .fg-stat { border-left:1.5px solid var(--ink); padding-left:20px; }
        .fg-stat-n { font-family:'Playfair Display',serif; font-weight:700; font-size:32px; line-height:1; letter-spacing:-0.02em; color:var(--ink); }
        .fg-stat-n em { font-style:normal; color:var(--accent); font-size:0.7em; }
        .fg-stat-l { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); font-family:'JetBrains Mono',monospace; margin-top:4px; }
        .fg-quote-block { margin-top:32px; display:flex; gap:16px; align-items:flex-start; opacity:0; animation:fg-fadeUp 0.6s 1.2s ease forwards; }
        .fg-quote-mark { font-family:'Playfair Display',serif; font-size:56px; font-weight:900; line-height:0.7; color:var(--accent); flex-shrink:0; margin-top:4px; }
        .fg-quote-text { font-size:13px; font-style:italic; line-height:1.65; color:var(--ink); margin-bottom:8px; font-family:'Playfair Display',serif; }
        .fg-quote-attr { font-size:10px; font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); }
        .fg-left-footer { font-size:10px; font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; color:var(--muted); opacity:0; animation:fg-fadeIn 0.5s 1.5s ease forwards; }

        /* RIGHT */
        .fg-right { background:var(--ink); display:flex; flex-direction:column; position:relative; overflow:hidden; }
        .fg-scan-line { position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(232,64,26,0.5), transparent); animation:fg-scan 3.5s ease-in-out infinite; z-index:0; pointer-events:none; }
        @keyframes fg-scan { 0%{top:-2px;opacity:0;} 5%{opacity:1;} 95%{opacity:1;} 100%{top:101%;opacity:0;} }
        .fg-corner-tl, .fg-corner-br { position:absolute; width:28px; height:28px; z-index:2; }
        .fg-corner-tl { top:20px; left:20px; border-top:1.5px solid var(--accent); border-left:1.5px solid var(--accent); }
        .fg-corner-br { bottom:20px; right:20px; border-bottom:1.5px solid var(--accent); border-right:1.5px solid var(--accent); }
        .fg-right-inner { position:relative; z-index:1; flex:1; display:flex; flex-direction:column; justify-content:center; padding:48px 44px; opacity:0; transform:translateX(20px); animation:fg-slideLeft 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fg-r-eyebrow { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .fg-r-eyebrow span { width:16px; height:1px; background:var(--accent); display:block; }
        .fg-r-title { font-family:'Playfair Display',serif; font-weight:900; font-size:40px; line-height:1; letter-spacing:-0.02em; color:#f0ede6; margin-bottom:6px; }
        .fg-r-title em { font-style:italic; color:var(--accent); }
        .fg-r-sub { font-size:12px; color:rgba(240,237,230,0.4); margin-bottom:32px; }
        .fg-btn-g { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:13px 18px; background:transparent; border:1px solid rgba(240,237,230,0.15); color:rgba(240,237,230,0.9); font-family:'Syne',sans-serif; font-size:13px; font-weight:500; cursor:pointer; letter-spacing:0.02em; transition:background 0.2s, border-color 0.2s; margin-bottom:24px; }
        .fg-btn-g:hover:not(:disabled) { border-color:rgba(240,237,230,0.3); background:rgba(240,237,230,0.04); }
        .fg-btn-g:disabled { opacity:0.6; cursor:not-allowed; }
        .fg-g-icon { width:16px; height:16px; flex-shrink:0; }
        .fg-divider { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
        .fg-divider::before, .fg-divider::after { content:''; flex:1; height:1px; background:rgba(240,237,230,0.08); }
        .fg-divider span { font-size:9px; letter-spacing:0.16em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; color:rgba(240,237,230,0.25); }
        .fg-field { margin-bottom:14px; }
        .fg-field-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
        .fg-f-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(240,237,230,0.35); }
        .fg-f-link { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); background:none; border:none; cursor:pointer; opacity:0.8; transition:opacity 0.2s; padding:0; }
        .fg-f-link:hover { opacity:1; }
        .fg-inp-wrap { position:relative; }
        .fg-inp-wrap input { width:100%; padding:12px 14px; background:rgba(240,237,230,0.04); border:1px solid rgba(240,237,230,0.1); color:#f0ede6; font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:300; outline:none; transition:border-color 0.2s, background 0.2s; border-radius:0; -webkit-appearance:none; }
        .fg-inp-wrap input::placeholder { color:rgba(240,237,230,0.18); }
        .fg-inp-wrap input:focus { border-color:var(--accent); background:rgba(232,64,26,0.04); }
        .fg-eye { position:absolute; right:13px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(240,237,230,0.3); display:flex; align-items:center; padding:0; transition:color 0.2s; }
        .fg-eye:hover { color:rgba(240,237,230,0.8); }
        .fg-btn-cta { width:100%; padding:15px 20px; background:var(--accent); border:none; color:#fff; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:10px; transition:background 0.2s; border-radius:0; margin-top:6px; }
        .fg-btn-cta::after { content:''; position:absolute; top:0; left:-100%; width:40%; height:100%; background:rgba(255,255,255,0.15); transform:skewX(-20deg); transition:left 0.45s ease; }
        .fg-btn-cta:hover:not(:disabled) { background:#cf3214; }
        .fg-btn-cta:hover:not(:disabled)::after { left:160%; }
        .fg-btn-cta:disabled { opacity:0.7; cursor:not-allowed; }
        .fg-btn-cta svg { transition:transform 0.3s; }
        .fg-btn-cta:hover:not(:disabled) svg { transform:translateX(4px); }
        .fg-r-footer { margin-top:22px; text-align:center; }
        .fg-r-footer p { font-size:11px; color:rgba(240,237,230,0.3); margin-bottom:4px; font-family:'Syne',sans-serif; }
        .fg-r-footer button { color:#f0ede6; background:none; border:none; cursor:pointer; font-weight:600; transition:color 0.2s; font-family:'Syne',sans-serif; font-size:11px; padding:0; }
        .fg-r-footer button:hover { color:var(--accent); }
        .fg-r-legal { font-size:9px; font-family:'JetBrains Mono',monospace; color:rgba(240,237,230,0.2); margin-top:14px; letter-spacing:0.06em; line-height:1.8; }
        .fg-r-legal a { color:rgba(240,237,230,0.35); text-decoration:underline; text-underline-offset:2px; }
        .fg-pill-row { display:flex; gap:5px; flex-wrap:wrap; justify-content:center; margin-top:18px; padding-top:16px; border-top:1px solid rgba(240,237,230,0.06); }
        .fg-pill { font-size:8px; letter-spacing:0.14em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; color:rgba(240,237,230,0.3); padding:3px 8px; border:1px solid rgba(240,237,230,0.08); }

        /* Cursor */
        .fg-cursor { position:fixed; width:8px; height:8px; background:var(--accent); border-radius:50%; pointer-events:none; z-index:9999; mix-blend-mode:difference; transition:transform 0.2s ease; }
        .fg-cursor-ring { position:fixed; width:28px; height:28px; border:1px solid var(--accent); border-radius:50%; pointer-events:none; z-index:9998; opacity:0.6; }
        @media (pointer: coarse) { .fg-cursor, .fg-cursor-ring { display:none; } }

        @keyframes fg-fadeDown { from{opacity:0;transform:translateY(-10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fg-fadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fg-fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes fg-slideUp { from{transform:translateY(110%);} to{transform:translateY(0);} }
        @keyframes fg-slideLeft { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
      `}</style>
    </div>
  );
}
