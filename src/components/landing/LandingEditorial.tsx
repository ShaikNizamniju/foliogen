import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function LandingEditorial() {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

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
      <section className="fl-hero">
        <div className="fl-hero-deco">Folio</div>

        <div className="fl-hero-inner">
          <div className="fl-issue-line">AI-Powered Portfolios · Issue Nº 01 · Est. 2024</div>

          <h1 className="fl-h1">
            <span className="fl-word"><span>Your</span></span>{' '}
            <span className="fl-word fl-italic fl-red"><span>Work,</span></span>
            <br />
            <span className="fl-word"><span>Beautifully</span></span>{' '}
            <span className="fl-word fl-italic"><span>Told.</span></span>
          </h1>

          <p className="fl-sub">
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
      <section id="features" className="fl-section">
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
      <section id="process" className="fl-process">
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
      <section id="templates" className="fl-section">
        <div className="fl-section-head">
          <div className="fl-eyebrow">— Chapter Three · The Library</div>
          <h2 className="fl-h2">Nineteen <em>templates</em>.<br />Zero <em>paywalls.</em></h2>
        </div>
        <div className="fl-template-grid">
          {['Noir', 'Swiss', 'Brutalist', 'Studio', 'Executive', 'Dev', 'Creative', 'Academic'].map((t, i) => (
            <div key={t} className="fl-template" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="fl-template-frame">
                <div className="fl-template-bar" />
                <div className="fl-template-bar fl-template-bar-short" />
                <div className="fl-template-block" />
                <div className="fl-template-row">
                  <div className="fl-template-square" />
                  <div className="fl-template-square" />
                </div>
              </div>
              <div className="fl-template-name">{t}</div>
              <div className="fl-template-tag">FREE</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="fl-pricing">
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
          <span>© 2025 Foliogen · Built for ambitious professionals</span>
          <span>www.foliogen.in</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');

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
        .fl-hero { padding:80px 52px 100px; position:relative; overflow:hidden; min-height:78vh; display:flex; align-items:center; }
        .fl-hero-deco { position:absolute; bottom:-30px; left:-12px; font-family:'Playfair Display',serif; font-weight:900; font-style:italic; font-size:clamp(160px,22vw,320px); line-height:1; color:transparent; -webkit-text-stroke:1px var(--border); pointer-events:none; user-select:none; white-space:nowrap; opacity:0; animation:fl-fadeIn 1.2s 0.6s ease forwards; }
        .fl-hero-inner { max-width:900px; position:relative; z-index:2; }
        .fl-issue-line { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--accent); margin-bottom:24px; display:flex; align-items:center; gap:10px; opacity:0; animation:fl-fadeUp 0.6s 0.25s ease forwards; }
        .fl-issue-line::before { content:''; width:24px; height:2px; background:var(--accent); flex-shrink:0; }
        .fl-h1 { font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(56px,9vw,140px); line-height:0.92; letter-spacing:-0.025em; margin-bottom:32px; }
        .fl-word { display:inline-block; overflow:hidden; vertical-align:top; }
        .fl-word > span { display:inline-block; transform:translateY(110%); animation:fl-slideUp 0.85s cubic-bezier(0.16,1,0.3,1) forwards; }
        .fl-word:nth-child(1) > span { animation-delay:0.3s; }
        .fl-word:nth-child(2) > span { animation-delay:0.4s; }
        .fl-word:nth-child(3) > span { animation-delay:0.5s; }
        .fl-word:nth-child(4) > span { animation-delay:0.6s; }
        .fl-italic > span { font-style:italic; }
        .fl-red > span { color:var(--accent); }
        .fl-sub { font-size:16px; line-height:1.75; color:var(--muted); max-width:540px; margin-bottom:40px; opacity:0; animation:fl-fadeUp 0.6s 0.8s ease forwards; }
        .fl-cta-row { display:flex; gap:20px; align-items:center; margin-bottom:60px; opacity:0; animation:fl-fadeUp 0.6s 0.95s ease forwards; flex-wrap:wrap; }
        .fl-cta-primary { display:inline-flex; align-items:center; gap:12px; padding:16px 28px; background:var(--accent); color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none; position:relative; overflow:hidden; transition:background 0.2s; }
        .fl-cta-primary::after { content:''; position:absolute; top:0; left:-100%; width:40%; height:100%; background:rgba(255,255,255,0.18); transform:skewX(-20deg); transition:left 0.45s ease; }
        .fl-cta-primary:hover { background:#cf3214; }
        .fl-cta-primary:hover::after { left:160%; }
        .fl-cta-primary:hover svg { transform:translateX(4px); }
        .fl-cta-primary svg { transition:transform 0.3s; }
        .fl-cta-secondary { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); text-decoration:underline; text-underline-offset:6px; text-decoration-thickness:1px; }
        .fl-cta-secondary:hover { color:var(--accent); }
        .fl-cta-large { padding:20px 36px; font-size:14px; }

        .fl-stats { display:flex; border-top:1.5px solid var(--ink); border-bottom:1.5px solid var(--ink); max-width:640px; opacity:0; animation:fl-fadeUp 0.6s 1.1s ease forwards; }
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
        .fl-template-frame { aspect-ratio:3/4; background:#faf8f3; padding:16px; display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
        .fl-template-bar { height:8px; background:var(--ink); width:60%; }
        .fl-template-bar-short { width:35%; opacity:0.5; }
        .fl-template-block { height:80px; background:var(--accent); margin-top:6px; opacity:0.85; }
        .fl-template-row { display:flex; gap:8px; flex:1; margin-top:6px; }
        .fl-template-square { flex:1; background:var(--border); }
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
      `}</style>
    </div>
  );
}
