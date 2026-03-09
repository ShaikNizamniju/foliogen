import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingV2.css';

export function LandingV2() {
    const [navScrolled, setNavScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Nav scroll state
        const handleScroll = () => {
            setNavScrolled(window.scrollY > 16);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Scroll reveal observer
        const srEls = document.querySelectorAll('.sr');
        const srObserver = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    srObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        srEls.forEach((el) => srObserver.observe(el));

        // Skill bar animation on visibility
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('animated'), 200);
                    barObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        skillBars.forEach((b) => barObserver.observe(b));

        // Counter animation
        const animCounter = (el: Element, target: number, duration: number = 1800) => {
            let start: number | null = null;
            const step = (ts: number) => {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.innerHTML = String(Math.floor(eased * target));
                if (progress < 1) requestAnimationFrame(step);
                else el.innerHTML = String(target);
            };
            requestAnimationFrame(step);
        };

        const counterTargets = [
            { id: 'count1', val: 12 },
            { id: 'count2', val: 19 },
            { id: 'count3', val: 97 },
            { id: 'count4', val: 4 },
        ];

        const tickerObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                counterTargets.forEach((c) => {
                    const el = document.getElementById(c.id);
                    if (el) animCounter(el, c.val, 1600);
                });
                tickerObs.disconnect();
            }
        }, { threshold: 0.5 });

        const ticker = document.querySelector('.ticker');
        if (ticker) tickerObs.observe(ticker);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            srObserver.disconnect();
            barObserver.disconnect();
            tickerObs.disconnect();
        };
    }, []);

    const [faqStates, setFaqStates] = useState<{ [key: number]: boolean }>({});

    const toggleFaq = (index: number) => {
        setFaqStates((prev) => {
            // close all others, open clicked
            const nextStates = Object.keys(prev).reduce((acc, key) => {
                acc[Number(key)] = false;
                return acc;
            }, {} as { [key: number]: boolean });
            nextStates[index] = !prev[index];
            return nextStates;
        });
    };

    // Draggable template scroll logic
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const handleMouseDown = (e: MouseEvent) => {
            isDown = true;
            startX = e.pageX - scrollEl.offsetLeft;
            scrollLeft = scrollEl.scrollLeft;
        };

        const handleMouseLeave = () => { isDown = false; };
        const handleMouseUp = () => { isDown = false; };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollEl.offsetLeft;
            scrollEl.scrollLeft = scrollLeft - (x - startX);
        };

        scrollEl.addEventListener('mousedown', handleMouseDown as any);
        scrollEl.addEventListener('mouseleave', handleMouseLeave);
        scrollEl.addEventListener('mouseup', handleMouseUp);
        scrollEl.addEventListener('mousemove', handleMouseMove as any);

        return () => {
            scrollEl.removeEventListener('mousedown', handleMouseDown as any);
            scrollEl.removeEventListener('mouseleave', handleMouseLeave);
            scrollEl.removeEventListener('mouseup', handleMouseUp);
            scrollEl.removeEventListener('mousemove', handleMouseMove as any);
        };
    }, []);

    return (
        <div className="landing-v2 min-h-screen bg-canvas">

            {/* ─── NAV ─── */}
            <nav className={`nav ${navScrolled ? 'scrolled' : ''}`} id="nav" role="navigation" aria-label="Main navigation">
                <div className="container">
                    <div className="nav-inner">
                        <Link to="/" className="nav-logo" aria-label="Foliogen home">
                            <div className="nav-logo-mark" aria-hidden="true">F</div>
                            Foliogen
                        </Link>
                        <ul className="nav-links hidden md:flex" role="list">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#templates">Templates</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                        <div className="nav-actions">
                            <Link to="/auth" className="nav-signin hidden sm:block">Sign in</Link>
                            <Link to="/auth" className="btn btn-cobalt">Get started free</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="hero" aria-label="Hero">
                <div className="hero-left">
                    <div className="hero-badge">
                        <span className="badge">
                            <span className="badge-dot" aria-hidden="true"></span>
                            AI-powered · 12,000+ portfolios built
                        </span>
                    </div>
                    <h1 className="headline hero-headline">
                        Your professional<br />
                        identity,<br />
                        <em>engineered.</em>
                    </h1>
                    <p className="body-lg hero-sub">
                        Upload your resume. Our AI builds a world-class portfolio in minutes — no design skills, no code, no compromise.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth" className="btn btn-cobalt">
                            Build my portfolio
                            <span aria-hidden="true">→</span>
                        </Link>
                        <a href="#features" className="btn btn-ghost">
                            See how it works <span className="arrow" aria-hidden="true">→</span>
                        </a>
                    </div>
                    <div className="hero-social-proof">
                        <div className="avatar-stack" aria-hidden="true">
                            <div className="avatar-item" style={{ background: 'linear-gradient(135deg,#1A44C8,#7B61FF)' }}>R</div>
                            <div className="avatar-item" style={{ background: 'linear-gradient(135deg,#0E7A52,#3DFF9A)' }}>A</div>
                            <div className="avatar-item" style={{ background: 'linear-gradient(135deg,#9C2B2B,#FF6B6B)' }}>L</div>
                            <div className="avatar-item" style={{ background: 'linear-gradient(135deg,#6B4C00,#F5A623)' }}>M</div>
                        </div>
                        <p className="social-text">
                            <strong>340+</strong> professionals got hired this month
                        </p>
                    </div>
                </div>

                <div className="hero-right hidden lg:flex">
                    <div className="portfolio-mock" role="img" aria-label="Portfolio preview mockup">
                        <div className="mock-topbar">
                            <div className="mock-circle" style={{ background: '#FF5F57' }} aria-hidden="true"></div>
                            <div className="mock-circle" style={{ background: '#FEBC2E' }} aria-hidden="true"></div>
                            <div className="mock-circle" style={{ background: '#28C840' }} aria-hidden="true"></div>
                            <div className="mock-url-bar">foliogen.in/aryan-sharma</div>
                        </div>
                        <div className="mock-body">
                            <div className="mock-profile-row">
                                <div className="mock-avatar-lg" aria-hidden="true">A</div>
                                <div className="mock-profile-info">
                                    <div className="mock-name">Aryan Sharma</div>
                                    <div className="mock-title">Senior Product Designer</div>
                                    <div className="mock-location">📍 Bengaluru, India</div>
                                </div>
                            </div>
                            <div className="mock-skills">
                                <span className="mock-skill">Figma</span>
                                <span className="mock-skill">User Research</span>
                                <span className="mock-skill">Design Systems</span>
                                <span className="mock-skill">Prototyping</span>
                                <span className="mock-skill">A/B Testing</span>
                            </div>
                            <div className="mock-section-label">Featured Work</div>
                            <div className="mock-projects-list">
                                <div className="mock-proj">
                                    <div>
                                        <div className="mock-proj-name">Redesigned checkout — 34% CVR lift</div>
                                        <div className="mock-proj-meta">Razorpay · 2024</div>
                                    </div>
                                    <span className="mock-proj-tag">CASE STUDY</span>
                                </div>
                                <div className="mock-proj">
                                    <div>
                                        <div className="mock-proj-name">Design System at Scale</div>
                                        <div className="mock-proj-meta">Swiggy · 2023</div>
                                    </div>
                                    <span className="mock-proj-tag">SYSTEM</span>
                                </div>
                                <div className="mock-proj">
                                    <div>
                                        <div className="mock-proj-name">Mobile onboarding revamp</div>
                                        <div className="mock-proj-meta">CRED · 2023</div>
                                    </div>
                                    <span className="mock-proj-tag">UI/UX</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mock-float-card" aria-hidden="true">
                        <div className="float-label">This Week</div>
                        <div className="float-stat">1,248</div>
                        <div className="float-change">↑ 23% portfolio views</div>
                        <div className="float-sparkline">
                            <div className="sparkbar" style={{ height: '35%' }}></div>
                            <div className="sparkbar" style={{ height: '50%' }}></div>
                            <div className="sparkbar" style={{ height: '42%' }}></div>
                            <div className="sparkbar" style={{ height: '70%' }}></div>
                            <div className="sparkbar" style={{ height: '60%' }}></div>
                            <div className="sparkbar" style={{ height: '80%' }}></div>
                            <div className="sparkbar" style={{ height: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STATS TICKER ─── */}
            <div className="ticker" role="region" aria-label="Key statistics">
                <div className="ticker-inner">
                    <div className="ticker-item">
                        <div className="ticker-num"><span id="count1">0</span><span>k+</span></div>
                        <div className="ticker-text">
                            <div className="ticker-label">Portfolios generated</div>
                            <div className="ticker-sub">AND COUNTING</div>
                        </div>
                    </div>
                    <div className="ticker-item">
                        <div className="ticker-num"><span id="count2">0</span><span>+</span></div>
                        <div className="ticker-text">
                            <div className="ticker-label">Design systems</div>
                            <div className="ticker-sub">INDUSTRY-STANDARD</div>
                        </div>
                    </div>
                    <div className="ticker-item">
                        <div className="ticker-num"><span id="count3">0</span><span>%</span></div>
                        <div className="ticker-text">
                            <div className="ticker-label">User satisfaction</div>
                            <div className="ticker-sub">BASED ON 2024 SURVEY</div>
                        </div>
                    </div>
                    <div className="ticker-item">
                        <div className="ticker-num"><span id="count4">0</span><span>min</span></div>
                        <div className="ticker-text">
                            <div className="ticker-label">Avg. build time</div>
                            <div className="ticker-sub">RESUME TO LIVE</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── HOW IT WORKS ─── */}
            <section className="how-section" id="how" aria-labelledby="how-title">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <div className="label sr">Process</div>
                            <h2 className="section-title sr sr-d1" id="how-title">
                                From resume to portfolio<br />in <em>4 precise steps.</em>
                            </h2>
                        </div>
                        <p className="body-base sr sr-d2" style={{ maxWidth: '280px', textAlign: 'right' }}>
                            We handle every decision.<br />You take all the credit.
                        </p>
                    </div>
                    <div className="steps-layout" role="list">
                        <div className="step-item sr" role="listitem">
                            <div className="step-number-wrap">
                                <span className="step-icon" aria-hidden="true">📄</span>
                            </div>
                            <div className="step-name">Import</div>
                            <p className="step-desc">Upload your resume — PDF, DOCX, or paste a LinkedIn URL. We parse it all within seconds.</p>
                        </div>
                        <div className="step-item sr sr-d1" role="listitem">
                            <div className="step-number-wrap">
                                <span className="step-icon" aria-hidden="true">⚡</span>
                            </div>
                            <div className="step-name">Synthesize</div>
                            <p className="step-desc">AI extracts skills, projects, and achievements — then rewrites them in language that resonates with recruiters.</p>
                        </div>
                        <div className="step-item sr sr-d2" role="listitem">
                            <div className="step-number-wrap">
                                <span className="step-icon" aria-hidden="true">🎨</span>
                            </div>
                            <div className="step-name">Design</div>
                            <p className="step-desc">Choose from 19+ professional design systems built for your industry and role. Every layout is pixel-perfect.</p>
                        </div>
                        <div className="step-item sr sr-d3" role="listitem">
                            <div className="step-number-wrap">
                                <span className="step-icon" aria-hidden="true">🚀</span>
                            </div>
                            <div className="step-name">Publish</div>
                            <p className="step-desc">Go live with one click. Custom domain, blazing-fast hosting, built-in analytics, and an ATS-ready resume export.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY FOLIOGEN ─── */}
            <section className="why-section" aria-labelledby="why-title">
                <div className="container">
                    <div className="why-grid">
                        <div className="why-left">
                            <div className="label sr">Why Foliogen</div>
                            <h2 className="section-title sr sr-d1" id="why-title">
                                Not a resume tool.<br />
                                A <em>career accelerator.</em>
                            </h2>
                            <p className="body-base sr sr-d2" style={{ marginTop: 'var(--sp-3)' }}>
                                Foliogen is the only platform that understands how to present professionals — not just format them. Built by designers, for careers.
                            </p>
                            <div className="why-list">
                                <div className="why-item sr">
                                    <div className="why-item-icon" aria-hidden="true">🧠</div>
                                    <div className="why-item-text">
                                        <div className="why-item-title">Contextual AI Writing</div>
                                        <p className="why-item-desc">Rewrites your experience in the precise language of your industry. Not generic — specifically tailored to your field and seniority.</p>
                                    </div>
                                </div>
                                <div className="why-item sr sr-d1">
                                    <div className="why-item-icon" aria-hidden="true">📊</div>
                                    <div className="why-item-text">
                                        <div className="why-item-title">Deep Portfolio Analytics</div>
                                        <p className="why-item-desc">Track every view, click, and scroll. Know which companies visited, how long they stayed, and what they clicked on.</p>
                                    </div>
                                </div>
                                <div className="why-item sr sr-d2">
                                    <div className="why-item-icon" aria-hidden="true">🔒</div>
                                    <div className="why-item-text">
                                        <div className="why-item-title">Your Data, Always Yours</div>
                                        <p className="why-item-desc">Zero training on your content. End-to-end encryption. Full export anytime. GDPR compliant. Your data is never sold.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="why-right sr sr-d2 hidden md:block">
                            <div className="why-visual-main">
                                <div className="why-visual-header">
                                    <div>
                                        <div className="why-visual-title">AI Skill Analysis</div>
                                        <div className="why-visual-subtitle">Derived from your resume · Updated live</div>
                                    </div>
                                    <div className="badge"><span className="badge-dot"></span> Live</div>
                                </div>
                                <div className="why-visual-body">
                                    <div className="skills-chart" id="skillsChart">
                                        <div className="skill-row">
                                            <div className="skill-name">UI Design</div>
                                            <div className="skill-bar-track">
                                                <div className="skill-bar-fill" style={{ width: '94%' }}></div>
                                            </div>
                                            <div className="skill-pct">94%</div>
                                        </div>
                                        <div className="skill-row">
                                            <div className="skill-name">User Research</div>
                                            <div className="skill-bar-track">
                                                <div className="skill-bar-fill" style={{ width: '82%' }}></div>
                                            </div>
                                            <div className="skill-pct">82%</div>
                                        </div>
                                        <div className="skill-row">
                                            <div className="skill-name">Prototyping</div>
                                            <div className="skill-bar-track">
                                                <div className="skill-bar-fill" style={{ width: '88%' }}></div>
                                            </div>
                                            <div className="skill-pct">88%</div>
                                        </div>
                                        <div className="skill-row">
                                            <div className="skill-name">Design Systems</div>
                                            <div className="skill-bar-track">
                                                <div className="skill-bar-fill" style={{ width: '76%' }}></div>
                                            </div>
                                            <div className="skill-pct">76%</div>
                                        </div>
                                        <div className="skill-row">
                                            <div className="skill-name">Strategy</div>
                                            <div className="skill-bar-track">
                                                <div className="skill-bar-fill" style={{ width: '65%' }}></div>
                                            </div>
                                            <div className="skill-pct">65%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="why-float" aria-hidden="true">
                                <div className="why-float-label">Interviews This Month</div>
                                <div className="why-float-value">7 calls</div>
                                <div className="why-float-sub">↑ 3× increase post-portfolio</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="features-section" id="features" aria-labelledby="features-title">
                <div className="container">
                    <div className="label sr">Features</div>
                    <h2 className="section-title sr sr-d1" id="features-title">
                        Everything you need<br />to <em>stand out.</em>
                    </h2>
                    <div className="features-grid">
                        {/* Resume → Portfolio */}
                        <div className="feat-cell span2 sr">
                            <div className="feat-eyebrow">Core Engine</div>
                            <div className="feat-title">Resume to Portfolio,<br />in minutes.</div>
                            <p className="feat-desc">Upload any resume format. Our AI synthesizes your experience, projects, and achievements into a compelling professional narrative.</p>
                            <div className="feat-visual">
                                <div className="resume-viz">
                                    <div className="doc-mock">
                                        <div className="doc-line l"></div>
                                        <div className="doc-line m"></div>
                                        <div className="doc-line s"></div>
                                        <div className="doc-line l"></div>
                                        <div className="doc-line m"></div>
                                    </div>
                                    <div className="doc-arrow" aria-hidden="true">⟶</div>
                                    <div className="portfolio-mini">
                                        <div className="portfolio-mini-header">
                                            <div className="portfolio-mini-avatar" aria-hidden="true">A</div>
                                            <div className="portfolio-mini-name">Aryan Sharma</div>
                                        </div>
                                        <div className="portfolio-mini-tags">
                                            <span className="portfolio-mini-tag">UX</span>
                                            <span className="portfolio-mini-tag">FIGMA</span>
                                            <span className="portfolio-mini-tag">RESEARCH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Design Systems */}
                        <div className="feat-cell sr sr-d1">
                            <div className="feat-eyebrow">Templates</div>
                            <div className="feat-title">19+ Design<br />Systems</div>
                            <p className="feat-desc">Industry-crafted templates for tech, finance, creative, and consulting roles.</p>
                            <div className="feat-visual">
                                <div className="themes-mini">
                                    <div className="theme-swatch" style={{ background: 'linear-gradient(135deg,#0C0C0B,#1a1a2e)' }}>
                                        <div className="theme-swatch-label">Dev Dark</div>
                                    </div>
                                    <div className="theme-swatch" style={{ background: '#F8F6F0' }}>
                                        <div className="theme-swatch-label" style={{ background: 'rgba(0,0,0,0.15)', color: '#333' }}>Editorial</div>
                                    </div>
                                    <div className="theme-swatch" style={{ background: 'linear-gradient(135deg,#0f2027,#2c5364)' }}>
                                        <div className="theme-swatch-label">Corporate</div>
                                    </div>
                                    <div className="theme-swatch" style={{ background: '#fdf6ec' }}>
                                        <div className="theme-swatch-label" style={{ background: 'rgba(0,0,0,0.15)', color: '#333' }}>Warm</div>
                                    </div>
                                    <div className="theme-swatch" style={{ background: '#0a0a0a' }}>
                                        <div className="theme-swatch-label" style={{ color: 'rgba(61,255,154,0.9)' }}>Terminal</div>
                                    </div>
                                    <div className="theme-swatch" style={{ background: 'linear-gradient(135deg,#1A44C8,#7B61FF)' }}>
                                        <div className="theme-swatch-label">Cobalt</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Analytics */}
                        <div className="feat-cell sr">
                            <div className="feat-eyebrow">Insights</div>
                            <div className="feat-title">Portfolio<br />Analytics</div>
                            <p className="feat-desc">Know exactly who viewed your portfolio, where they came from, and what they engaged with.</p>
                            <div className="feat-visual analytics-mini">
                                <div className="analytics-bar-row">
                                    <div className="analytics-bar-label">LinkedIn</div>
                                    <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ width: '78%' }}></div></div>
                                    <div className="analytics-bar-val">78%</div>
                                </div>
                                <div className="analytics-bar-row">
                                    <div className="analytics-bar-label">Direct</div>
                                    <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ width: '54%' }}></div></div>
                                    <div className="analytics-bar-val">54%</div>
                                </div>
                                <div className="analytics-bar-row">
                                    <div className="analytics-bar-label">Email</div>
                                    <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ width: '32%' }}></div></div>
                                    <div className="analytics-bar-val">32%</div>
                                </div>
                                <div className="analytics-bar-row">
                                    <div className="analytics-bar-label">Twitter</div>
                                    <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ width: '18%' }}></div></div>
                                    <div className="analytics-bar-val">18%</div>
                                </div>
                            </div>
                        </div>
                        {/* Publishing */}
                        <div className="feat-cell sr sr-d1">
                            <div className="feat-eyebrow">Deployment</div>
                            <div className="feat-title">Instant<br />Publishing</div>
                            <p className="feat-desc">Custom domain support, global CDN, automatic HTTPS, and one-click resume PDF export — all included.</p>
                        </div>
                        {/* ATS Resume */}
                        <div className="feat-cell sr sr-d2">
                            <div className="feat-eyebrow">Resume</div>
                            <div className="feat-title">ATS-Optimised<br />Resume</div>
                            <p className="feat-desc">AI-generated resume formatted to pass modern applicant tracking systems. Download in one click, anytime.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TEMPLATES ─── */}
            <section className="templates-section" id="templates" aria-labelledby="templates-title">
                <div className="container">
                    <div className="label sr">Design Systems</div>
                    <h2 className="section-title sr sr-d1" id="templates-title">
                        19+ industry-standard<br /><em>design systems.</em>
                    </h2>
                    <p className="body-base sr sr-d2" style={{ marginTop: 'var(--sp-2)' }}>Drag to explore. Every template is built for a specific professional context — not generic, never generic.</p>
                </div>
                <div className="templates-scroll" id="templatesScroll" aria-label="Template carousel" role="region" ref={scrollRef}>
                    {/* Card 1 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: '#0C0C0B', padding: '16px' }}>
                            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: '9px', color: 'rgba(61,255,154,0.7)', marginBottom: '4px' }}>$ whoami</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#fff', fontStyle: 'italic' }}>Developer</div>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontFamily: '"Geist Mono", monospace' }}>Full-stack Engineer</div>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
                                <span style={{ border: '1px solid rgba(61,255,154,0.25)', padding: '2px 6px', fontSize: '8px', color: 'rgba(61,255,154,0.7)', fontFamily: '"Geist Mono", monospace', borderRadius: '2px' }}>React</span>
                                <span style={{ border: '1px solid rgba(61,255,154,0.25)', padding: '2px 6px', fontSize: '8px', color: 'rgba(61,255,154,0.7)', fontFamily: '"Geist Mono", monospace', borderRadius: '2px' }}>Node</span>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Terminal Dark</div>
                            <div className="template-type">ENGINEERING</div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: '#F8F6F0', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: '#999', letterSpacing: '0.1em', marginBottom: '6px' }}>PORTFOLIO</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '18px', color: '#0C0C0B', fontStyle: 'italic', lineHeight: 1.2 }}>Editorial<br />Light</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                                <div style={{ width: '20px', height: '20px', background: '#0C0C0B', borderRadius: '50%' }}></div>
                                <div style={{ width: '20px', height: '20px', background: '#d4c5a9', borderRadius: '50%' }}></div>
                                <div style={{ width: '20px', height: '20px', background: '#a08b6e', borderRadius: '50%' }}></div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Editorial Light</div>
                            <div className="template-type">CREATIVE / DESIGN</div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: 'linear-gradient(135deg,#0f2027 0%, #2c5364 100%)', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>CORPORATE</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#fff' }}>Finance<br />Executive</div>
                            <div style={{ marginTop: '10px', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', fontFamily: '"Geist Mono", monospace' }}>EXPERIENCE ──────</div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Corporate Pro</div>
                            <div className="template-type">FINANCE / BANKING</div>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: '#1A44C8', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>COBALT</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#fff', fontStyle: 'italic' }}>Product<br />Manager</div>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '4px' }}>
                                <div style={{ flex: 1, height: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}></div>
                                <div style={{ flex: 1, height: '16px', background: 'rgba(255,255,255,0.25)', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Cobalt PM</div>
                            <div className="template-type">PRODUCT / STRATEGY</div>
                        </div>
                    </div>
                    {/* Card 5 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: '#fdf6ec', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: '#c68642', marginBottom: '6px' }}>WARM STUDIO</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#2d1b00', lineHeight: 1.2 }}>Creative<br />Director</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '12px' }}>
                                <div style={{ height: '22px', background: 'rgba(198,134,66,0.2)', borderRadius: '2px' }}></div>
                                <div style={{ height: '22px', background: 'rgba(198,134,66,0.4)', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Warm Cream</div>
                            <div className="template-type">CREATIVE / ART</div>
                        </div>
                    </div>
                    {/* Card 6 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: '#7ec8e3', marginBottom: '4px' }}>DEEP OCEAN</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#fff', fontStyle: 'italic' }}>Data<br />Scientist</div>
                            <div style={{ marginTop: '10px', height: '24px', background: 'rgba(126,200,227,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '100%', width: '65%', background: 'rgba(126,200,227,0.3)' }}></div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Deep Ocean</div>
                            <div className="template-type">DATA / ANALYTICS</div>
                        </div>
                    </div>
                    {/* Card 7 */}
                    <div className="template-card">
                        <div className="template-preview" style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '16px' }}>
                            <div style={{ fontSize: '9px', fontFamily: '"Geist Mono", monospace', color: '#ccc', marginBottom: '4px' }}>MINIMAL</div>
                            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '16px', color: '#0C0C0B' }}>UX Researcher</div>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', width: '80%' }}></div>
                                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', width: '60%' }}></div>
                                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', width: '70%' }}></div>
                            </div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">Ultra Minimal</div>
                            <div className="template-type">RESEARCH / ACADEMIC</div>
                        </div>
                    </div>
                    {/* Repeat for marquee effect */}
                    <div className="template-card" aria-hidden="true">
                        <div className="template-preview" style={{ background: '#0C0C0B', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontFamily: '"Instrument Serif", serif', color: 'rgba(255,255,255,0.2)', fontSize: '40px', fontStyle: 'italic' }}>+12</div>
                        </div>
                        <div className="template-info">
                            <div className="template-name">12 more templates</div>
                            <div className="template-type">ALL PLANS</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─── */}
            <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
                <div className="container">
                    <div className="pricing-header">
                        <div className="label sr">Pricing</div>
                        <h2 className="section-title sr sr-d1" id="pricing-title">
                            Simple, <em>transparent</em> pricing.
                        </h2>
                        <p className="body-base sr sr-d2" style={{ marginTop: 'var(--sp-2)' }}>
                            Start free. No credit card required. Upgrade when you're ready.
                        </p>
                    </div>
                    <div className="pricing-grid">
                        {/* Free */}
                        <div className="price-card sr">
                            <div className="price-plan">Free</div>
                            <div className="price-amount">
                                <span className="price-currency">₹</span>
                                <span className="price-number">0</span>
                            </div>
                            <div className="price-period">Forever — no card needed</div>
                            <div className="price-divider"></div>
                            <ul className="price-feature-list">
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> 1 portfolio</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> 3 basic templates</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Foliogen subdomain</li>
                                <li className="price-feature"><span className="price-feature-check"><span className="check-no">✗</span></span> Custom domain</li>
                                <li className="price-feature"><span className="price-feature-check"><span className="check-no">✗</span></span> Analytics dashboard</li>
                                <li className="price-feature"><span className="price-feature-check"><span className="check-no">✗</span></span> AI content generation</li>
                            </ul>
                            <Link to="/auth" className="btn btn-outline price-cta">Get started free</Link>
                        </div>
                        {/* Basic / Recommended */}
                        <div className="price-card recommended sr sr-d1">
                            <div className="price-popular">Most Popular</div>
                            <div className="price-plan">Basic</div>
                            <div className="price-amount">
                                <span className="price-currency">₹</span>
                                <span className="price-number">199</span>
                            </div>
                            <div className="price-period">per month</div>
                            <div className="price-divider"></div>
                            <ul className="price-feature-list">
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> 3 portfolios</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> All 19+ templates</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Custom domain</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Analytics dashboard</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> AI content generation</li>
                                <li className="price-feature"><span className="price-feature-check"><span className="check-no">✗</span></span> White-label & API</li>
                            </ul>
                            <Link to="/auth" className="btn btn-cobalt price-cta" style={{ width: '100%', justifyContent: 'center' }}>Start building →</Link>
                        </div>
                        {/* Pro */}
                        <div className="price-card sr sr-d2">
                            <div className="price-plan">Pro</div>
                            <div className="price-amount">
                                <span className="price-currency">₹</span>
                                <span className="price-number">999</span>
                            </div>
                            <div className="price-period">per month, billed annually</div>
                            <div className="price-divider"></div>
                            <ul className="price-feature-list">
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Unlimited portfolios</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Priority AI generation</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> White-label & custom CSS</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Advanced analytics + heatmaps</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> Team collaboration</li>
                                <li className="price-feature has"><span className="price-feature-check"><span className="check-yes">✓</span></span> API access</li>
                            </ul>
                            <Link to="/auth" className="btn btn-outline price-cta" style={{ width: '100%', justifyContent: 'center' }}>Go Pro →</Link>
                        </div>
                    </div>
                    {/* Compare table */}
                    <div className="overflow-x-auto w-full">
                        <table className="compare-table sr" aria-label="Plan comparison">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Free</th>
                                    <th style={{ color: 'var(--cobalt)' }}>Basic</th>
                                    <th>Pro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="compare-feature-name">Portfolio slots</span>
                                    </td>
                                    <td><span className="compare-text">1</span></td>
                                    <td className="compare-highlight"><span className="compare-text">3</span></td>
                                    <td><span className="compare-text">Unlimited</span></td>
                                </tr>
                                <tr>
                                    <td><span className="compare-feature-name">Design templates</span><span className="compare-feature-note">Industry-standard layouts</span></td>
                                    <td><span className="compare-text">3 basic</span></td>
                                    <td className="compare-highlight"><span className="compare-yes">✓</span> <span className="compare-text">All 19+</span></td>
                                    <td><span className="compare-yes">✓</span> <span className="compare-text">All 19+</span></td>
                                </tr>
                                <tr>
                                    <td><span className="compare-feature-name">Custom domain</span></td>
                                    <td><span className="compare-no">✗</span></td>
                                    <td className="compare-highlight"><span className="compare-yes">✓</span></td>
                                    <td><span className="compare-yes">✓</span></td>
                                </tr>
                                <tr>
                                    <td><span className="compare-feature-name">AI content generation</span><span className="compare-feature-note">Rewrites your resume in recruiter language</span></td>
                                    <td><span className="compare-no">✗</span></td>
                                    <td className="compare-highlight"><span className="compare-yes">✓</span></td>
                                    <td><span className="compare-yes">✓</span></td>
                                </tr>
                                <tr>
                                    <td><span className="compare-feature-name">Analytics</span></td>
                                    <td><span className="compare-no">✗</span></td>
                                    <td className="compare-highlight"><span className="compare-text">Standard</span></td>
                                    <td><span className="compare-text">Advanced + heatmaps</span></td>
                                </tr>
                                <tr>
                                    <td><span className="compare-feature-name">White-label & API</span></td>
                                    <td><span className="compare-no">✗</span></td>
                                    <td className="compare-highlight"><span className="compare-no">✗</span></td>
                                    <td><span className="compare-yes">✓</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section className="testi-section" aria-labelledby="testi-title">
                <div className="container">
                    <div className="label sr">Testimonials</div>
                    <h2 className="section-title sr sr-d1" id="testi-title">
                        What professionals<br /><em>actually say.</em>
                    </h2>
                    <div className="testi-grid">
                        <div className="testi-card featured sr">
                            <div className="testi-stars light">★★★★★</div>
                            <blockquote className="testi-quote">
                                I went from a 3-page Word resume to a portfolio that got me 3 interview calls in 48 hours. The AI writing is genuinely better than anything I wrote myself.
                            </blockquote>
                            <div className="testi-author">
                                <div className="testi-av" style={{ background: 'rgba(255,255,255,0.2)' }}>R</div>
                                <div>
                                    <div className="testi-name">Riya Kapoor</div>
                                    <div className="testi-role">Product Manager · Swiggy</div>
                                </div>
                            </div>
                        </div>
                        <div className="testi-card sr sr-d1">
                            <div className="testi-stars colored">★★★★★</div>
                            <blockquote className="testi-quote">
                                I spent 12 minutes on Foliogen and had a portfolio I was actually proud to share. The design templates are miles ahead of anything I'd seen before.
                            </blockquote>
                            <div className="testi-author">
                                <div className="testi-av" style={{ background: 'linear-gradient(135deg,#1A44C8,#7B61FF)' }}>A</div>
                                <div>
                                    <div className="testi-name">Arjun Mehta</div>
                                    <div className="testi-role">Frontend Engineer · Razorpay</div>
                                </div>
                            </div>
                        </div>
                        <div className="testi-card sr sr-d2">
                            <div className="testi-stars colored">★★★★★</div>
                            <blockquote className="testi-quote">
                                My portfolio is my business as a freelancer. Foliogen's analytics showed me exactly which clients were looking — and I converted two of them that week.
                            </blockquote>
                            <div className="testi-author">
                                <div className="testi-av" style={{ background: 'linear-gradient(135deg,#0E7A52,#3DFF9A)' }}>L</div>
                                <div>
                                    <div className="testi-name">Leena Das</div>
                                    <div className="testi-role">Brand Designer · Freelance</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="faq-section" id="faq" aria-labelledby="faq-title">
                <div className="container">
                    <div className="faq-layout">
                        <div className="faq-sticky">
                            <div className="label sr">FAQ</div>
                            <h2 className="section-title sr sr-d1" id="faq-title">
                                Frequently<br />asked <em>questions.</em>
                            </h2>
                            <p className="body-base sr sr-d2" style={{ marginTop: 'var(--sp-4)' }}>
                                Can't find what you need?<br />
                                <a href="mailto:admin@foliogen.in" style={{ color: 'var(--cobalt)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>admin@foliogen.in</a>
                            </p>
                        </div>
                        <div className="faq-list sr sr-d1">
                            {[
                                {
                                    q: "What is the difference between Basic and Pro?",
                                    a: "Basic (₹199/mo) provides standard cinematic templates and essential analytics. Pro (₹999/yr, less than ₹84/mo) unlocks our entire 19+ exclusive template suite, full AI writing features, and advanced portfolio tracking analytics."
                                },
                                {
                                    q: "Is my payment secure?",
                                    a: "Yes. All transactions are securely processed via Stripe with 256-bit AES encryption. Foliogen never stores your credit card details directly."
                                },
                                {
                                    q: "Can I cancel anytime?",
                                    a: "Absolutely. You can flexibly cancel your monthly or yearly subscription at any time directly through your billing dashboard. Your portfolio will remain active for the remainder of your billing cycle."
                                }
                            ].map((faq, i) => (
                                <div key={i} className={`faq-item ${faqStates[i] ? 'open' : ''}`}>
                                    <button className="faq-q" onClick={() => toggleFaq(i)} aria-expanded={faqStates[i]}>
                                        <span>{faq.q}</span>
                                        <span className="faq-icon" aria-hidden="true">+</span>
                                    </button>
                                    <div className="faq-a" role="region">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── MARQUEE ─── */}
            <div className="marquee-section" aria-label="Companies represented">
                <div className="marquee-label">Professionals from world-class companies</div>
                <div className="marquee-track" id="marqueeTrack" aria-hidden="true">
                    <span className="marquee-logo">Google</span>
                    <span className="marquee-logo">Amazon</span>
                    <span className="marquee-logo">Microsoft</span>
                    <span className="marquee-logo">Flipkart</span>
                    <span className="marquee-logo">Razorpay</span>
                    <span className="marquee-logo">Swiggy</span>
                    <span className="marquee-logo">Zerodha</span>
                    <span className="marquee-logo">CRED</span>
                    <span className="marquee-logo">Figma</span>
                    <span className="marquee-logo">Atlassian</span>
                    <span className="marquee-logo">PhonePe</span>
                    <span className="marquee-logo">Meesho</span>
                    <span className="marquee-logo">Ola</span>
                    <span className="marquee-logo">Paytm</span>
                    {/* Duplicate for loop */}
                    <span className="marquee-logo">Google</span>
                    <span className="marquee-logo">Amazon</span>
                    <span className="marquee-logo">Microsoft</span>
                    <span className="marquee-logo">Flipkart</span>
                    <span className="marquee-logo">Razorpay</span>
                    <span className="marquee-logo">Swiggy</span>
                    <span className="marquee-logo">Zerodha</span>
                    <span className="marquee-logo">CRED</span>
                    <span className="marquee-logo">Figma</span>
                    <span className="marquee-logo">Atlassian</span>
                    <span className="marquee-logo">PhonePe</span>
                    <span className="marquee-logo">Meesho</span>
                    <span className="marquee-logo">Ola</span>
                    <span className="marquee-logo">Paytm</span>
                </div>
            </div>

            {/* ─── CTA ─── */}
            <section className="cta-section" aria-labelledby="cta-title">
                <div className="cta-grain" aria-hidden="true"></div>
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-label sr">Ready to begin?</div>
                        <h2 className="cta-headline sr sr-d1" id="cta-title">
                            Let's build something<br /><em>extraordinary.</em>
                        </h2>
                        <p className="cta-sub sr sr-d2">Your professional identity deserves more than a PDF. Start free — no credit card, no commitment, no compromise.</p>
                        <div className="cta-actions sr sr-d3">
                            <Link to="/auth" className="btn btn-white">Build my portfolio →</Link>
                            <a href="#templates" className="btn btn-dark-outline">Browse templates</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer role="contentinfo">
                <div className="container">
                    <div className="footer-inner">
                        <a href="/" className="footer-logo" aria-label="Foliogen home">
                            <div className="footer-logo-mark" aria-hidden="true">F</div>
                            Foliogen
                        </a>
                        <nav className="footer-nav" aria-label="Footer navigation">
                            <a href="#features">Features</a>
                            <a href="#templates">Templates</a>
                            <Link to="/contact">Contact</Link>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                            <Link to="/refunds">Refunds</Link>
                        </nav>
                        <div className="footer-copy">© 2026 Foliogen</div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
