import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function LandingEditorial() {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Counter animation — deferred until browser idle so it never blocks first paint
  useEffect(() => {
    const targets = [12400, 3.2, 89];
    const duration = 1600;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        setC1(Math.floor(targets[0] * ease));
        setC2(Number((targets[1] * ease).toFixed(1)));
        setC3(Math.floor(targets[2] * ease));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const ric: any = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
    const id = ric(run);
    return () => {
      cancelAnimationFrame(raf);
      const cic: any = (window as any).cancelIdleCallback;
      if (cic) cic(id); else clearTimeout(id);
    };
  }, []);

  // Custom cursor (desktop only) — deferred to idle, respects reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0, started = false;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx - 4}px`;
        cursorRef.current.style.top = `${my - 4}px`;
      }
      if (!started) {
        started = true;
        const anim = () => {
          rx += (mx - rx - 14) * 0.12;
          ry += (my - ry - 14) * 0.12;
          if (ringRef.current) {
            ringRef.current.style.left = `${rx}px`;
            ringRef.current.style.top = `${ry}px`;
          }
          raf = requestAnimationFrame(anim);
        };
        raf = requestAnimationFrame(anim);
      }
    };
    const ric: any = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 400));
    const id = ric(() => document.addEventListener('mousemove', move, { passive: true }));
    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      const cic: any = (window as any).cancelIdleCallback;
      if (cic) cic(id); else clearTimeout(id);
    };
  }, []);

  // Scroll reveal — fade/slide once on entry, respects reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.fl-reveal').forEach((el) => el.classList.add('fl-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fl-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fl-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);




  const features = [
    { n: '01', t: 'AI Resume Parser', d: 'Drop your PDF. Our AI extracts every role, skill, and metric into a structured story.' },
    { n: '02', t: '19+ Premium Templates', d: 'From editorial Noir to brutalist Swiss — every template free, forever.' },
    { n: '03', t: 'Recruiter Chatbot', d: 'A senior recruiter persona screens visitors and pitches you in your voice.' },
    { n: '04', t: 'Job-Match Agent', d: 'Paste a JD. Get a tailored fit analysis and a personalized pitch in seconds.' },
    { n: '05', t: 'Analytics Radar', d: 'See who viewed your portfolio, how long they stayed, what they zoomed in on.' },
    { n: '06', t: 'ATS-Ready Export', d: 'Native print flow produces clean A4 PDFs that pass every applicant tracker.' },
  ];

  const steps = [
    { n: 'I', t: 'Upload', d: 'Resume PDF or LinkedIn import — 60 seconds.' },
    { n: 'II', t: 'Shape', d: 'AI drafts your story. You edit with one-click rewrites.' },
    { n: 'III', t: 'Publish', d: 'Choose a template. Claim your URL. Share with the world.' },
  ];

  return (
    <div className="foliogen-landing-v2">
      <div ref={cursorRef} className="fg-cursor" aria-hidden="true" />
      <div ref={ringRef} className="fg-cursor-ring" aria-hidden="true" />

      {/* NAV */}
      <header className="fl-nav">
        <Link to="/" className="fl-logo">
          <div className="fl-logo-box">F</div>
          <div className="fl-logo-text">Foliogen</div>
        </Link>
        <nav className="fl-nav-links">
          <a href="#features">Features</a>
          <a href="#process">Process</a>
          <a href="#templates">Templates</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="fl-nav-cta">
          <Link to="/auth" className="fl-nav-signin">Sign In</Link>
          <Link to="/auth?provider=google" className="fl-nav-start">Start Free →</Link>
        </div>
      </header>

      {/* HERO */}
      <main>
      <section className="fl-hero">
        <div className="fl-hero-deco">Folio</div>

        <div className="fl-hero-inner">
          <div className="fl-issue-line">AI-Powered Portfolios · Est. 2026</div>

          <h1 className="fl-h1 fl-hero-anim fl-hero-anim-1">
            <span className="fl-word"><span>Your</span></span>{' '}
            <span className="fl-word fl-italic fl-red"><span>Work,</span></span>
            <br />
            <span className="fl-word"><span>Beautifully</span></span>{' '}
            <span className="fl-word fl-italic"><span>Told.</span></span>
          </h1>

          <p className="fl-sub fl-hero-anim fl-hero-anim-2">
            Upload your resume. Our AI engineers a portfolio that makes recruiters
            stop scrolling and start calling. No code. No templates that scream
            template. No compromise.
          </p>


          <div className="fl-cta-row">
            <Link to="/auth?provider=google" className="fl-cta-primary">
              Build My Portfolio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#process" className="fl-cta-secondary">See the Process</a>
          </div>

          <div className="fl-stats">
            <div className="fl-stat">
              <div className="fl-stat-n">{c1.toLocaleString()}<em>+</em></div>
              <div className="fl-stat-l">Portfolios Built</div>
            </div>
            <div className="fl-stat">
              <div className="fl-stat-n">{c2}<em>×</em></div>
              <div className="fl-stat-l">Recruiter Views</div>
            </div>
            <div className="fl-stat">
              <div className="fl-stat-n">{c3}<em>%</em></div>
              <div className="fl-stat-l">Interview Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="fl-section fl-reveal">
        <div className="fl-section-head">
          <div className="fl-eyebrow">— Chapter One · The Toolkit</div>
          <h2 className="fl-h2">Every <em>feature</em>.<br />Unlocked. <em>Free.</em></h2>
        </div>
        <div className="fl-grid">
          {features.map((f) => (
            <div key={f.n} className="fl-card">
              <div className="fl-card-n">{f.n}</div>
              <div className="fl-card-t">{f.t}</div>
              <div className="fl-card-d">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="fl-process fl-reveal">
        <div className="fl-process-deco">Process</div>
        <div className="fl-section-head">
          <div className="fl-eyebrow fl-eyebrow-light">— Chapter Two · How It Works</div>
          <h2 className="fl-h2 fl-h2-light">Three <em>chapters</em>.<br />Sixty <em>seconds.</em></h2>
        </div>
        <div className="fl-steps">
          {steps.map((s, i) => (
            <div key={s.n} className="fl-step">
              <div className="fl-step-n">{s.n}</div>
              <div className="fl-step-t">{s.t}</div>
              <div className="fl-step-d">{s.d}</div>
              {i < steps.length - 1 && <div className="fl-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="fl-section fl-reveal">
        <div className="fl-section-head">
          <div className="fl-eyebrow">— Chapter Three · The Library</div>
          <h2 className="fl-h2">Nineteen <em>templates</em>.<br />Zero <em>paywalls.</em></h2>
        </div>
        <div className="fl-template-grid">
          {[
            { name: 'Noir', variant: 'noir' },
            { name: 'Swiss', variant: 'swiss' },
            { name: 'Brutalist', variant: 'brutalist' },
            { name: 'Studio', variant: 'studio' },
            { name: 'Executive', variant: 'executive' },
            { name: 'Dev', variant: 'dev' },
            { name: 'Creative', variant: 'creative' },
            { name: 'Academic', variant: 'academic' },
          ].map((t, i) => (
            <div key={t.name} className="fl-template" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`fl-tpl fl-tpl-${t.variant}`}>
                {t.variant === 'noir' && (
                  <>
                    <div className="fl-noir-left">
                      <div className="fl-noir-mono">N° 01</div>
                      <div className="fl-noir-title">NOIR</div>
                      <div className="fl-noir-rule" />
                      <div className="fl-noir-line" />
                      <div className="fl-noir-line short" />
                    </div>
                    <div className="fl-noir-right">
                      <div className="fl-noir-dot" />
                    </div>
                  </>
                )}
                {t.variant === 'swiss' && (
                  <div className="fl-swiss">
                    <div className="fl-swiss-num">01</div>
                    <div className="fl-swiss-bar" />
                    <div className="fl-swiss-grid">
                      <div className="fl-swiss-h">Form / Function</div>
                      <div className="fl-swiss-l" />
                      <div className="fl-swiss-l short" />
                      <div className="fl-swiss-l" />
                    </div>
                    <div className="fl-swiss-foot">
                      <span>EST. 2026</span><span>—</span><span>CH</span>
                    </div>
                  </div>
                )}
                {t.variant === 'brutalist' && (
                  <div className="fl-brut">
                    <div className="fl-brut-tag">PORTFOLIO//RAW</div>
                    <div className="fl-brut-stack">
                      <div className="fl-brut-box fl-brut-yellow" />
                      <div className="fl-brut-box fl-brut-black">PROJECTS</div>
                    </div>
                    <div className="fl-brut-grid">
                      <div className="fl-brut-cell">01</div>
                      <div className="fl-brut-cell solid">02</div>
                      <div className="fl-brut-cell">03</div>
                    </div>
                  </div>
                )}
                {t.variant === 'studio' && (
                  <div className="fl-studio">
                    <div className="fl-studio-meta"><span>STUDIO</span><span>↗</span></div>
                    <div className="fl-studio-frame">
                      <div className="fl-studio-mark">S</div>
                    </div>
                    <div className="fl-studio-caption">
                      <div className="fl-studio-cap-t">Untitled, 2026</div>
                      <div className="fl-studio-cap-s">Selected Works</div>
                    </div>
                  </div>
                )}
                {t.variant === 'executive' && (
                  <div className="fl-exec">
                    <div className="fl-exec-crest" />
                    <div className="fl-exec-name">EXECUTIVE</div>
                    <div className="fl-exec-sub">Curriculum Vitæ</div>
                    <div className="fl-exec-rule" />
                    <div className="fl-exec-row"><span>2024</span><span>—</span><span>Present</span></div>
                    <div className="fl-exec-row"><span>2020</span><span>—</span><span>2024</span></div>
                  </div>
                )}
                {t.variant === 'dev' && (
                  <div className="fl-dev">
                    <div className="fl-dev-bar">
                      <span /><span /><span /><b>~/portfolio</b>
                    </div>
                    <div className="fl-dev-body">
                      <div><span className="fl-dev-p">$</span> whoami</div>
                      <div className="fl-dev-out">→ engineer</div>
                      <div><span className="fl-dev-p">$</span> ls projects/</div>
                      <div className="fl-dev-out">api/ web/ ml/</div>
                      <div><span className="fl-dev-p">$</span> <span className="fl-dev-cursor">█</span></div>
                    </div>
                  </div>
                )}
                {t.variant === 'creative' && (
                  <div className="fl-creative">
                    <div className="fl-creative-blob fl-cb1" />
                    <div className="fl-creative-blob fl-cb2" />
                    <div className="fl-creative-blob fl-cb3" />
                    <div className="fl-creative-text">make<br /><em>stuff.</em></div>
                  </div>
                )}
                {t.variant === 'academic' && (
                  <div className="fl-acad">
                    <div className="fl-acad-h">A Treatise on Design</div>
                    <div className="fl-acad-byline">— by the Author</div>
                    <div className="fl-acad-col">
                      <div className="fl-acad-l" /><div className="fl-acad-l" /><div className="fl-acad-l short" />
                    </div>
                    <div className="fl-acad-col">
                      <div className="fl-acad-l" /><div className="fl-acad-l short" /><div className="fl-acad-l" />
                    </div>
                  </div>
                )}
              </div>
              <div className="fl-template-name">{t.name}</div>
              <div className="fl-template-tag">FREE</div>
            </div>
          ))}
        </div>

      </section>

      {/* PRICING */}
      <section id="pricing" className="fl-pricing fl-reveal">
        <div className="fl-pricing-inner">
          <div className="fl-eyebrow fl-eyebrow-light">— The Pricing</div>
          <h2 className="fl-pricing-h">Free.<br /><em>Forever.</em></h2>
          <p className="fl-pricing-sub">
            Every template. Every AI feature. Every analytic. No subscriptions, no
            credit card, no hidden tier. We mean it.
          </p>
          <div className="fl-pricing-pills">
            <div className="fl-pill">All Templates</div>
            <div className="fl-pill">AI Recruiter</div>
            <div className="fl-pill">Job Match</div>
            <div className="fl-pill">Analytics</div>
            <div className="fl-pill">Custom Domain</div>
            <div className="fl-pill">ATS Export</div>
          </div>
          <Link to="/auth?provider=google" className="fl-cta-primary fl-cta-large">
            Claim Your Portfolio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="fl-footer">
        <div className="fl-footer-row">
          <div className="fl-logo">
            <div className="fl-logo-box">F</div>
            <div className="fl-logo-text">Foliogen</div>
          </div>
          <div className="fl-footer-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/refunds">Refunds</Link>
          </div>
        </div>
        <div className="fl-footer-base">
          <span>© 2026 Foliogen · Built for ambitious professionals</span>
          <span>www.foliogen.in</span>
        </div>
      </footer>

      <style>{`
        /* Fonts loaded via index.html with display=swap for instant paint */



        .foliogen-landing-v2 {
          --bg:#f0ede6; --ink:#111010; --accent:#e8401a; --muted:#7a7670; --border:#c8c3b8;
          background:var(--bg); color:var(--ink);
          font-family:'Syne','Inter',system-ui,sans-serif;
          min-height:100vh; position:relative; overflow-x:hidden;
        }
        .foliogen-landing-v2::before {
          content:''; position:fixed; inset:0;
          background-image: radial-gradient(circle, #c0bbb2 1px, transparent 1px);
          background-size: 28px 28px; opacity:0.45; z-index:0; pointer-events:none;
        }
        .foliogen-landing-v2 > * { position:relative; z-index:1; }

        /* NAV */
        .fl-nav { display:flex; align-items:center; justify-content:space-between; padding:22px 52px; border-bottom:1px solid var(--border); background:rgba(240,237,230,0.85); backdrop-filter:blur(10px); position:sticky; top:0; z-index:50; }
        .fl-logo { display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--ink); }
        .fl-logo-box { width:34px; height:34px; background:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-weight:900; font-size:16px; color:var(--bg); }
        .fl-logo-text { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; letter-spacing:-0.01em; }
        .fl-nav-links { display:flex; gap:32px; }
        .fl-nav-links a { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); text-decoration:none; transition:color 0.2s; }
        .fl-nav-links a:hover { color:var(--accent); }
        .fl-nav-cta { display:flex; align-items:center; gap:16px; }
        .fl-nav-signin { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); text-decoration:none; }
        .fl-nav-start { font-family:'Syne',sans-serif; font-weight:600; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; padding:10px 18px; background:var(--ink); color:var(--bg); text-decoration:none; transition:background 0.2s; }
        .fl-nav-start:hover { background:var(--accent); }
        @media (max-width: 860px) { .fl-nav { padding:18px 24px; } .fl-nav-links { display:none; } .fl-nav-signin { display:none; } }

        /* HERO */
        .fl-hero { padding:80px 52px 100px; position:relative; overflow:hidden; min-height:78vh; display:flex; align-items:center; justify-content:center; text-align:center; }
        .fl-hero-deco { position:absolute; bottom:-30px; left:50%; transform:translateX(-50%); font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:clamp(160px,22vw,320px); line-height:1; color:transparent; -webkit-text-stroke:1px var(--border); pointer-events:none; user-select:none; white-space:nowrap; opacity:0; animation:fl-fadeIn 1.2s 0.6s ease forwards, fl-hero-drift 14s 1.8s ease-in-out infinite; }
        @keyframes fl-hero-drift { 0%,100% { transform:translate(-50%,0); } 50% { transform:translate(-50%,-12px); } }
        .fl-hero-inner { max-width:1000px; position:relative; z-index:2; margin:0 auto; display:flex; flex-direction:column; align-items:center; }
        .fl-issue-line { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); margin-bottom:24px; display:inline-flex; align-items:center; gap:10px; opacity:0; animation:fl-fadeUp 0.6s 0.25s ease forwards; }
        .fl-issue-line::before, .fl-issue-line::after { content:''; width:24px; height:2px; background:var(--accent); flex-shrink:0; }
        .fl-h1 { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(56px,9vw,140px); line-height:0.92; letter-spacing:-0.025em; margin-bottom:32px; }
        @media (max-width: 639px) { .fl-h1 { font-size:clamp(2.25rem, 9vw, 3rem); line-height:1; } }
        .fl-h1 .fl-word { display:inline-block; overflow:hidden; vertical-align:bottom; }
        .fl-h1 .fl-word > span { display:inline-block; transform:translateY(105%); animation:fl-word-up 0.9s cubic-bezier(0.2,0.7,0.1,1) forwards; }
        .fl-h1 .fl-word:nth-of-type(1) > span { animation-delay:0.3s; }
        .fl-h1 .fl-word:nth-of-type(2) > span { animation-delay:0.42s; }
        .fl-h1 .fl-word:nth-of-type(3) > span { animation-delay:0.6s; }
        .fl-h1 .fl-word:nth-of-type(4) > span { animation-delay:0.72s; }
        @keyframes fl-word-up { to { transform:translateY(0); } }
        .fl-italic { font-style:italic; }
        .fl-red > span { color:var(--accent); }
        .fl-sub { font-size:16px; line-height:1.75; color:var(--muted); max-width:600px; margin:0 auto 40px; opacity:0; animation:fl-fadeUp 0.6s 0.8s ease forwards; }
        .fl-cta-row { display:flex; gap:20px; align-items:center; justify-content:center; margin-bottom:60px; opacity:0; animation:fl-fadeUp 0.6s 0.95s ease forwards; flex-wrap:wrap; }

        .fl-cta-primary { display:inline-flex; align-items:center; gap:12px; padding:16px 28px; background:var(--accent); color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none; position:relative; overflow:hidden; transition:background 0.2s; }
        .fl-cta-primary::after { content:''; position:absolute; top:0; left:-100%; width:40%; height:100%; background:rgba(255,255,255,0.18); transform:skewX(-20deg); transition:left 0.45s ease; }
        .fl-cta-primary:hover { background:#cf3214; }
        .fl-cta-primary:hover::after { left:160%; }
        .fl-cta-primary:hover svg { transform:translateX(4px); }
        .fl-cta-primary svg { transition:transform 0.3s; }
        .fl-cta-secondary { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); text-decoration:underline; text-underline-offset:6px; text-decoration-thickness:1px; }
        .fl-cta-secondary:hover { color:var(--accent); }
        .fl-cta-large { padding:20px 36px; font-size:14px; }

        .fl-stats { display:flex; border-top:1.5px solid var(--ink); border-bottom:1.5px solid var(--ink); max-width:640px; width:100%; margin:0 auto; opacity:0; animation:fl-fadeUp 0.6s 1.1s ease forwards; }

        .fl-stat { flex:1; padding:22px 0; }
        .fl-stat + .fl-stat { border-left:1.5px solid var(--ink); padding-left:24px; }
        .fl-stat-n { font-family:'Playfair Display',serif; font-weight:700; font-size:40px; line-height:1; letter-spacing:-0.02em; color:var(--ink); }
        .fl-stat-n em { font-style:normal; color:var(--accent); font-size:0.7em; }
        .fl-stat-l { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); font-family:'JetBrains Mono',monospace; margin-top:6px; }

        /* SECTION */
        .fl-section { padding:120px 52px; border-top:1px solid var(--border); }
        .fl-section-head { max-width:1100px; margin:0 auto 60px; }
        .fl-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--accent); margin-bottom:20px; }
        .fl-eyebrow-light { color:var(--accent); }
        .fl-h2 { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(40px,6vw,80px); line-height:0.98; letter-spacing:-0.02em; color:var(--ink); }
        .fl-h2 em { font-style:italic; color:var(--accent); }
        .fl-h2-light { color:#f0ede6; }

        .fl-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-top:1px solid var(--ink); border-left:1px solid var(--ink); }
        @media (max-width: 860px) { .fl-grid { grid-template-columns:1fr; } .fl-section { padding:80px 24px; } .fl-hero { padding:60px 24px 80px; } }
        @media (max-width: 1100px) and (min-width:861px) { .fl-grid { grid-template-columns:repeat(2,1fr); } }
        .fl-card { padding:40px 32px; border-right:1px solid var(--ink); border-bottom:1px solid var(--ink); background:var(--bg); transition:background 0.3s; }
        .fl-card:hover { background:#e6e1d4; }
        .fl-card-n { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.16em; color:var(--accent); margin-bottom:20px; }
        .fl-card-t { font-family:'Playfair Display',serif; font-weight:700; font-size:24px; letter-spacing:-0.01em; margin-bottom:12px; }
        .fl-card-d { font-size:13px; line-height:1.7; color:var(--muted); }

        /* PROCESS */
        .fl-process { background:var(--ink); color:#f0ede6; padding:120px 52px; position:relative; overflow:hidden; }
        .fl-process-deco { position:absolute; top:-20px; right:-20px; font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:clamp(140px,18vw,260px); line-height:1; color:transparent; -webkit-text-stroke:1px rgba(240,237,230,0.1); pointer-events:none; user-select:none; }
        .fl-process .fl-section-head { position:relative; z-index:2; }
        .fl-steps { max-width:1100px; margin:0 auto; display:flex; gap:0; align-items:stretch; position:relative; z-index:2; flex-wrap:wrap; }
        .fl-step { flex:1; min-width:240px; padding:36px 28px; border:1px solid rgba(240,237,230,0.1); position:relative; }
        .fl-step + .fl-step { border-left:none; }
        .fl-step-n { font-family:'Playfair Display',serif; font-style:italic; font-weight:900; font-size:64px; color:var(--accent); line-height:0.9; margin-bottom:20px; }
        .fl-step-t { font-family:'Playfair Display',serif; font-weight:700; font-size:28px; margin-bottom:10px; }
        .fl-step-d { font-size:13px; line-height:1.7; color:rgba(240,237,230,0.5); }
        .fl-step-arrow { position:absolute; right:-12px; top:50%; transform:translateY(-50%); width:24px; height:24px; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; z-index:3; }
        @media (max-width: 860px) { .fl-process { padding:80px 24px; } .fl-step + .fl-step { border-left:1px solid rgba(240,237,230,0.1); border-top:none; } .fl-step-arrow { display:none; } }

        /* TEMPLATES */
        .fl-template-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        @media (max-width: 1000px) { .fl-template-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width: 500px) { .fl-template-grid { grid-template-columns:1fr; } }
        .fl-template { background:#fff; border:1px solid var(--border); padding:18px; position:relative; opacity:0; animation:fl-fadeUp 0.5s ease forwards; transition:transform 0.3s, border-color 0.3s; }
        .fl-template:hover { transform:translateY(-6px); border-color:var(--ink); }
        .fl-tpl { aspect-ratio:3/4; margin-bottom:14px; overflow:hidden; position:relative; }

        /* NOIR — split black/white, cinematic */
        .fl-tpl-noir { display:flex; background:#0a0a0a; color:#f4f1ea; }
        .fl-noir-left { flex:1.2; padding:14px; display:flex; flex-direction:column; gap:8px; background:#0a0a0a; }
        .fl-noir-right { flex:1; background:#f4f1ea; position:relative; border-left:1px solid #f4f1ea; }
        .fl-noir-mono { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.2em; opacity:0.6; }
        .fl-noir-title { font-family:'Playfair Display',serif; font-style:italic; font-size:22px; line-height:1; margin-top:auto; }
        .fl-noir-rule { height:1px; background:#f4f1ea; opacity:0.4; margin:6px 0; }
        .fl-noir-line { height:3px; background:#f4f1ea; width:70%; opacity:0.85; }
        .fl-noir-line.short { width:40%; opacity:0.5; }
        .fl-noir-dot { position:absolute; bottom:14px; right:14px; width:10px; height:10px; background:#0a0a0a; border-radius:50%; }

        /* SWISS — cream, grid, asymmetric typographic */
        .fl-tpl-swiss { background:#f1ede2; padding:14px; display:flex; flex-direction:column; gap:10px; color:#111; }
        .fl-swiss-num { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.2em; }
        .fl-swiss-bar { height:6px; background:#d8453a; width:45%; }
        .fl-swiss-grid { display:flex; flex-direction:column; gap:6px; margin-top:auto; }
        .fl-swiss-h { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; letter-spacing:-0.01em; line-height:1.05; }
        .fl-swiss-l { height:2px; background:#111; width:80%; opacity:0.85; }
        .fl-swiss-l.short { width:45%; opacity:0.5; }
        .fl-swiss-foot { display:flex; gap:6px; font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.18em; border-top:1px solid #111; padding-top:8px; }

        /* BRUTALIST — raw, thick borders, harsh */
        .fl-tpl-brut { background:#f4f1ea; padding:10px; display:flex; flex-direction:column; gap:8px; border:3px solid #000; }
        .fl-brut-tag { font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:700; letter-spacing:0.1em; background:#000; color:#f4f1ea; padding:3px 6px; align-self:flex-start; }
        .fl-brut-stack { display:flex; flex-direction:column; gap:6px; }
        .fl-brut-box { height:30px; border:3px solid #000; }
        .fl-brut-yellow { background:#fde047; }
        .fl-brut-black { background:#000; color:#fde047; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; display:flex; align-items:center; padding:0 8px; letter-spacing:0.14em; }
        .fl-brut-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; flex:1; }
        .fl-brut-cell { border:3px solid #000; background:#f4f1ea; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }
        .fl-brut-cell.solid { background:#e8401a; color:#fff; }

        /* STUDIO — gallery, generous whitespace, thin lines */
        .fl-tpl-studio { background:#fff; padding:16px; display:flex; flex-direction:column; gap:12px; border:1px solid #e5e2db; }
        .fl-studio-meta { display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.2em; color:#777; }
        .fl-studio-frame { flex:1; border:1px solid #d8d4ca; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f7f4ee,#ece8df); }
        .fl-studio-mark { font-family:'Playfair Display',serif; font-style:italic; font-size:48px; color:#bcb6a8; }
        .fl-studio-caption { border-top:1px solid #e5e2db; padding-top:8px; }
        .fl-studio-cap-t { font-family:'Playfair Display',serif; font-style:italic; font-size:12px; color:#222; }
        .fl-studio-cap-s { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.18em; color:#999; margin-top:2px; }

        /* EXECUTIVE — formal CV, crest, ruled */
        .fl-tpl-exec { background:#fbf9f3; padding:14px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; color:#1a1a1a; border:1px solid #d8d4ca; }
        .fl-exec-crest { width:24px; height:24px; border:1.5px solid #1a1a1a; transform:rotate(45deg); margin-top:4px; position:relative; }
        .fl-exec-crest::after { content:''; position:absolute; inset:4px; border:1px solid #1a1a1a; }
        .fl-exec-name { font-family:'Playfair Display',serif; font-weight:700; font-size:14px; letter-spacing:0.18em; margin-top:6px; }
        .fl-exec-sub { font-family:'Playfair Display',serif; font-style:italic; font-size:10px; color:#666; }
        .fl-exec-rule { width:60%; height:1px; background:#1a1a1a; margin:6px 0; }
        .fl-exec-row { display:flex; gap:6px; font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.1em; color:#333; }

        /* DEV — terminal */
        .fl-tpl-dev { background:#0d1117; color:#7ee787; font-family:'JetBrains Mono',monospace; font-size:9px; display:flex; flex-direction:column; }
        .fl-dev-bar { background:#161b22; padding:6px 8px; display:flex; align-items:center; gap:4px; color:#8b949e; font-size:8px; }
        .fl-dev-bar span { width:7px; height:7px; border-radius:50%; background:#30363d; }
        .fl-dev-bar span:nth-child(1) { background:#ff5f57; }
        .fl-dev-bar span:nth-child(2) { background:#febc2e; }
        .fl-dev-bar span:nth-child(3) { background:#28c840; }
        .fl-dev-bar b { margin-left:auto; font-weight:500; }
        .fl-dev-body { padding:10px; display:flex; flex-direction:column; gap:4px; flex:1; }
        .fl-dev-p { color:#e8401a; margin-right:4px; }
        .fl-dev-out { color:#8b949e; padding-left:10px; }
        .fl-dev-cursor { animation:fl-blink 1s infinite; color:#7ee787; }
        @keyframes fl-blink { 50% { opacity:0; } }

        /* CREATIVE — playful blobs */
        .fl-tpl-creative { background:#fff4e6; padding:14px; position:relative; overflow:hidden; }
        .fl-creative-blob { position:absolute; border-radius:50%; filter:blur(1px); }
        .fl-cb1 { width:70px; height:70px; background:#e8401a; top:-10px; right:-10px; }
        .fl-cb2 { width:50px; height:50px; background:#fde047; bottom:30px; left:-12px; }
        .fl-cb3 { width:40px; height:40px; background:#7c3aed; bottom:-10px; right:30px; }
        .fl-creative-text { position:relative; font-family:'Playfair Display',serif; font-weight:900; font-size:32px; line-height:0.95; color:#1a1a1a; margin-top:auto; padding-top:60%; }
        .fl-creative-text em { font-style:italic; color:#e8401a; }

        /* ACADEMIC — journal columns */
        .fl-tpl-acad { background:#fbfaf5; padding:14px; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto 1fr; gap:6px 10px; color:#1a1a1a; border:1px solid #e0ddd2; }
        .fl-acad-h { grid-column:1/-1; font-family:'Playfair Display',serif; font-style:italic; font-size:13px; line-height:1.1; border-bottom:1px solid #1a1a1a; padding-bottom:4px; }
        .fl-acad-byline { grid-column:1/-1; font-family:'Playfair Display',serif; font-size:8px; color:#666; }
        .fl-acad-col { display:flex; flex-direction:column; gap:4px; }
        .fl-acad-l { height:2px; background:#1a1a1a; opacity:0.7; }
        .fl-acad-l.short { width:60%; opacity:0.4; }

        .fl-template-name { font-family:'Playfair Display',serif; font-weight:700; font-size:18px; }
        .fl-template-tag { position:absolute; top:14px; right:14px; font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.16em; color:var(--accent); background:var(--bg); padding:4px 8px; }

        /* PRICING */
        .fl-pricing { background:var(--ink); color:#f0ede6; padding:140px 52px; text-align:center; }
        .fl-pricing-inner { max-width:720px; margin:0 auto; }
        .fl-pricing-h { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(72px,12vw,160px); line-height:0.9; letter-spacing:-0.03em; margin:24px 0 28px; }
        .fl-pricing-h em { font-style:italic; color:var(--accent); }
        .fl-pricing-sub { font-size:16px; line-height:1.7; color:rgba(240,237,230,0.55); margin-bottom:36px; max-width:480px; margin-left:auto; margin-right:auto; }
        .fl-pricing-pills { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:48px; }
        .fl-pill { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(240,237,230,0.6); padding:8px 14px; border:1px solid rgba(240,237,230,0.15); }
        @media (max-width: 860px) { .fl-pricing { padding:90px 24px; } }

        /* FOOTER */
        .fl-footer { padding:48px 52px; border-top:1px solid var(--border); }
        .fl-footer-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; flex-wrap:wrap; gap:20px; }
        .fl-footer-links { display:flex; gap:24px; }
        .fl-footer-links a { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); text-decoration:none; }
        .fl-footer-links a:hover { color:var(--accent); }
        .fl-footer-base { display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; color:var(--muted); padding-top:24px; border-top:1px solid var(--border); flex-wrap:wrap; gap:12px; }
        @media (max-width: 860px) { .fl-footer { padding:36px 24px; } }

        /* CURSOR */
        .fg-cursor { position:fixed; width:8px; height:8px; background:var(--accent); border-radius:50%; pointer-events:none; z-index:9999; mix-blend-mode:difference; transition:transform 0.2s ease; }
        .fg-cursor-ring { position:fixed; width:28px; height:28px; border:1px solid var(--accent); border-radius:50%; pointer-events:none; z-index:9998; opacity:0.6; }
        @media (pointer: coarse) { .fg-cursor, .fg-cursor-ring { display:none; } }

        @keyframes fl-fadeUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fl-fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes fl-slideUp { from{transform:translateY(110%);} to{transform:translateY(0);} }

        /* Scroll reveal */
        .fl-reveal { opacity:0; transform:translateY(20px); transition:opacity 400ms ease-out, transform 400ms ease-out; will-change:opacity, transform; }
        .fl-reveal.fl-in { opacity:1; transform:translateY(0); }

        /* Hero on-load */
        .fl-hero-anim { opacity:0; transform:translateY(16px); animation:fl-heroIn 450ms ease-out forwards; }
        .fl-hero-anim-1 { animation-delay:80ms; }
        .fl-hero-anim-2 { animation-delay:200ms; }
        @keyframes fl-heroIn { to { opacity:1; transform:translateY(0); } }

        /* Hover polish */
        .fl-card { transition:transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out; }
        .fl-card:hover { transform:translateY(-3px); box-shadow:0 10px 30px -12px rgba(17,16,16,0.18); }
        .fl-template { transition:transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out, opacity 0.5s ease; }
        .fl-template:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 12px 30px -14px rgba(17,16,16,0.22); }
        .fl-cta-primary, .fl-cta-secondary { transition:transform 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out; }
        .fl-cta-primary:hover, .fl-cta-secondary:hover { transform:translateY(-2px); box-shadow:0 8px 22px -10px rgba(17,16,16,0.35); }
        .fl-pill { transition:transform 200ms ease-out, background-color 200ms ease-out, color 200ms ease-out; }
        .fl-pill:hover { transform:translateY(-2px); }

        @media (prefers-reduced-motion: reduce) {
          .fl-reveal, .fl-hero-anim, .fl-stats, .fl-template { opacity:1 !important; transform:none !important; animation:none !important; transition:none !important; }
          .fl-card:hover, .fl-template:hover, .fl-cta-primary:hover, .fl-cta-secondary:hover, .fl-pill:hover { transform:none !important; box-shadow:none !important; }
        }
      `}</style>
    </div>
  );
}
