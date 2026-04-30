import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingV2.css';

export function LandingV2() {
    const [navScrolled, setNavScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [faqStates, setFaqStates] = useState<{ [key: number]: boolean }>({});

    // Toggle FAQ
    const toggleFaq = (index: number) => {
        setFaqStates((prev) => {
            const nextStates = { ...prev };
            nextStates[index] = !prev[index];
            return nextStates;
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setNavScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Scroll reveal
        const srEls = document.querySelectorAll('.fade-up');
        const srObserver = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    srObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        srEls.forEach(el => srObserver.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            srObserver.disconnect();
        };
    }, []);

    // Scroll drag for templates
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
        <div className="landing-luxury">
            {/* Navbar */}
            <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <Link to="/" className="nav-logo">FOLIOGEN</Link>
                    <div className="nav-links hidden md:flex">
                        <a href="#process">Process</a>
                        <a href="#features">Features</a>
                        <a href="#templates">Templates</a>
                        <a href="#faq">FAQ</a>
                    </div>
                    <div className="nav-actions">
                        <Link to="/auth" className="nav-link-sign hidden sm:block">SIGN IN</Link>
                        <Link to="/auth" className="btn-cta">Start Free Audit</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-glow"></div>
                <div className="hero-container">
                    <div className="hero-copy">
                        <div className="eyebrow fade-up" style={{ animationDelay: '0s' }}>
                            <div className="gold-line"></div>
                            THE PROFESSIONAL STANDARD
                        </div>
                        <h1 className="fade-up" style={{ animationDelay: '0.1s' }}>
                            Your portfolio.<br />
                            Built by AI.<br />
                            <em className="gold-italic">Loved by recruiters.</em>
                        </h1>
                        <p className="hero-sub fade-up" style={{ animationDelay: '0.2s' }}>
                            Drop your resume. Get a live portfolio, a recruiter gap analysis, and interview prep — in under 10 minutes.
                        </p>
                        <div className="hero-btns fade-up" style={{ animationDelay: '0.3s' }}>
                            <Link to="/auth" className="btn-primary">Build My Portfolio</Link>
                            <a href="#demo" className="btn-ghost">▶ Watch Demo</a>
                        </div>
                        <div className="hero-stats fade-up" style={{ animationDelay: '0.4s' }}>
                            <div className="stat-item">
                                <div className="stat-val">79+</div>
                                <div className="stat-label">INSIGHT SIGNALS</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-val">4min</div>
                                <div className="stat-label">AVG. BUILD TIME</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-val">19+</div>
                                <div className="stat-label">DESIGN SYSTEMS</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-mockup fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="mockup-frame">
                            <div className="mockup-header">
                                <div className="mock-avatar">SN</div>
                                <div className="mock-info">
                                    <div className="mock-name">Shaik Nizamuddin</div>
                                    <div className="mock-role">AI Product Manager</div>
                                </div>
                                <div className="mock-score">
                                    <div className="score-val">94</div>
                                    <div className="score-label">PORTFOLIO SCORE</div>
                                </div>
                            </div>
                            <div className="mockup-body">
                                <div className="mock-skills">
                                    <span>Product Strategy</span>
                                    <span>AI/ML</span>
                                    <span>Growth</span>
                                    <span>UX</span>
                                </div>
                                <div className="mock-fit">
                                    <div className="fit-label">RECRUITER FIT</div>
                                    <div className="fit-bar"><div className="fit-fill" style={{width: '94%'}}></div></div>
                                </div>
                                <div className="mock-projects">
                                    <div className="mock-proj"></div>
                                    <div className="mock-proj"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee */}
            <div className="marquee-strip">
                <div className="marquee-track">
                    {/* Items */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="marquee-group">
                            <span className="gold-dot">✦</span><span>GOOGLE</span>
                            <span className="gold-dot">✦</span><span>AMAZON</span>
                            <span className="gold-dot">✦</span><span>MICROSOFT</span>
                            <span className="gold-dot">✦</span><span>FLIPKART</span>
                            <span className="gold-dot">✦</span><span>RAZORPAY</span>
                            <span className="gold-dot">✦</span><span>SWIGGY</span>
                            <span className="gold-dot">✦</span><span>CRED</span>
                            <span className="gold-dot">✦</span><span>ATLASSIAN</span>
                            <span className="gold-dot">✦</span><span>STRIPE</span>
                            <span className="gold-dot">✦</span><span>META</span>
                            <span className="gold-dot">✦</span><span>NETFLIX</span>
                            <span className="gold-dot">✦</span><span>AIRBNB</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Process Section */}
            <section className="process-section" id="process">
                <div className="container">
                    <h2 className="section-title text-center fade-up">
                        From resume to portfolio in <em className="gold-italic">4 precise steps.</em>
                    </h2>
                    <div className="process-grid fade-up">
                        <div className="process-step">
                            <div className="step-num">01</div>
                            <div className="step-icon">⎔</div>
                            <h3 className="step-title">Scan</h3>
                            <p className="step-desc">Connect your LinkedIn PDF. Our "Auto-Sync" engine ensures your portfolio never goes stale.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-num">02</div>
                            <div className="step-icon">⚡</div>
                            <h3 className="step-title">Synthesise</h3>
                            <p className="step-desc">AI extracts skills, projects, and achievements — then rewrites them for maximum impact.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-num">03</div>
                            <div className="step-icon">◒</div>
                            <h3 className="step-title">Design</h3>
                            <p className="step-desc">Choose from 19+ professional design systems built for your industry and specific role.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-num">04</div>
                            <div className="step-icon">↗</div>
                            <h3 className="step-title">Publish</h3>
                            <p className="step-desc">Go live with one click. Custom domain, blazing-fast hosting, and built-in analytics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accelerator Section */}
            <section className="accelerator-section" id="features">
                <div className="container accel-grid">
                    <div className="accel-left fade-up">
                        <h2 className="section-title">
                            Not a resume tool.<br />A <em className="gold-italic">career accelerator.</em>
                        </h2>
                        <div className="accel-features">
                            <div className="accel-row">
                                <div className="accel-icon">⚲</div>
                                <div className="accel-text">
                                    <div className="accel-title">Narrative Transmutation</div>
                                    <p className="accel-desc">Flip your portfolio between Startup, Big Tech, and Fintech modes instantly.</p>
                                </div>
                            </div>
                            <div className="accel-row">
                                <div className="accel-icon">◎</div>
                                <div className="accel-text">
                                    <div className="accel-title">Recruiter Pulse Tracking</div>
                                    <p className="accel-desc">Real-time analytics. Know if a recruiter from Google is viewing your work right now.</p>
                                </div>
                            </div>
                            <div className="accel-row">
                                <div className="accel-icon">⇋</div>
                                <div className="accel-text">
                                    <div className="accel-title">LinkedIn Auto-Sync</div>
                                    <p className="accel-desc">Upload your latest export and our AI will "diff" your profile, adding new wins.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accel-right fade-up">
                        <div className="accel-card">
                            <div className="accel-card-header">AI Recruiter Analysis</div>
                            <div className="accel-skills">
                                <div className="accel-skill">
                                    <div className="skill-name">Product Strategy</div>
                                    <div className="skill-pct">94%</div>
                                    <div className="skill-bar"><div className="skill-fill" style={{width: '94%'}}></div></div>
                                </div>
                                <div className="accel-skill">
                                    <div className="skill-name">UX Research</div>
                                    <div className="skill-pct">88%</div>
                                    <div className="skill-bar"><div className="skill-fill" style={{width: '88%'}}></div></div>
                                </div>
                                <div className="accel-skill">
                                    <div className="skill-name">Data Analytics</div>
                                    <div className="skill-pct">82%</div>
                                    <div className="skill-bar"><div className="skill-fill" style={{width: '82%'}}></div></div>
                                </div>
                                <div className="accel-skill">
                                    <div className="skill-name">System Design</div>
                                    <div className="skill-pct">76%</div>
                                    <div className="skill-bar"><div className="skill-fill" style={{width: '76%'}}></div></div>
                                </div>
                                <div className="accel-skill">
                                    <div className="skill-name">Growth</div>
                                    <div className="skill-pct">71%</div>
                                    <div className="skill-bar"><div className="skill-fill" style={{width: '71%'}}></div></div>
                                </div>
                            </div>
                            <div className="accel-card-footer">
                                <div className="accel-match">87%</div>
                                <div className="accel-match-label">MATCH SCORE<br/>Top 7% of applicants</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-grid-section">
                <div className="container">
                    <div className="feat-grid fade-up">
                        <div className="feat-card">
                            <div className="feat-icon">⚡</div>
                            <h3 className="feat-title">Lightning Fast</h3>
                            <p className="feat-desc">Generate your entire professional portfolio in under 4 minutes flat.</p>
                            <span className="feat-tag">SPEED</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">✦</div>
                            <h3 className="feat-title">ATS Optimised</h3>
                            <p className="feat-desc">Download a perfectly formatted resume guaranteed to pass ATS filters.</p>
                            <span className="feat-tag">EXPORT</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">⚲</div>
                            <h3 className="feat-title">Custom Domains</h3>
                            <p className="feat-desc">Connect your own domain with automatic SSL encryption and global CDN.</p>
                            <span className="feat-tag">HOSTING</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">◎</div>
                            <h3 className="feat-title">Rich Analytics</h3>
                            <p className="feat-desc">Detailed visitor insights, engagement metrics, and geographic data.</p>
                            <span className="feat-tag">DATA</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">⎔</div>
                            <h3 className="feat-title">Auto Updates</h3>
                            <p className="feat-desc">Your portfolio stays fresh automatically via LinkedIn synchronization.</p>
                            <span className="feat-tag">SYNC</span>
                        </div>
                        <div className="feat-card feat-audit">
                            <div className="feat-icon gold-border">★</div>
                            <h3 className="feat-title">Recruiter Audit</h3>
                            <p className="feat-desc">Paste a job description and AI audits your portfolio, providing one-click fixes.</p>
                            <span className="feat-tag tag-gold">★ Differentiator</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="templates-section" id="templates">
                <div className="container">
                    <div className="eyebrow fade-up"><div className="gold-line"></div>DESIGN SYSTEMS</div>
                    <h2 className="section-title fade-up">
                        Curated for <em className="gold-italic">excellence.</em>
                    </h2>
                </div>
                <div className="templates-track fade-up" ref={scrollRef}>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#080808'}}>
                            <div className="temp-circle" style={{borderColor: '#C8A45A'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '60%', background: '#C8A45A'}}></div>
                                <div style={{width: '40%', background: '#C8A45A'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Obsidian</div>
                        <div className="temp-role">EXECUTIVE / LEADERSHIP</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#F2EDE4'}}>
                            <div className="temp-circle" style={{borderColor: '#111111'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '70%', background: '#111111'}}></div>
                                <div style={{width: '50%', background: '#111111'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Alabaster</div>
                        <div className="temp-role">CREATIVE / DESIGN</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#0B1320'}}>
                            <div className="temp-circle" style={{borderColor: '#4A6FA5'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '80%', background: '#4A6FA5'}}></div>
                                <div style={{width: '40%', background: '#4A6FA5'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Legacy PM</div>
                        <div className="temp-role">PRODUCT / STRATEGY</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#1A0E0B'}}>
                            <div className="temp-circle" style={{borderColor: '#D45D3A'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '50%', background: '#D45D3A'}}></div>
                                <div style={{width: '70%', background: '#D45D3A'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Ember</div>
                        <div className="temp-role">MARKETING / GROWTH</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#120B1A'}}>
                            <div className="temp-circle" style={{borderColor: '#9D65FF'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '90%', background: '#9D65FF'}}></div>
                                <div style={{width: '60%', background: '#9D65FF'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Nova</div>
                        <div className="temp-role">ENGINEERING / DEV</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup" style={{background: '#0D1A13'}}>
                            <div className="temp-circle" style={{borderColor: '#4EA670'}}></div>
                            <div className="temp-lines">
                                <div style={{width: '65%', background: '#4EA670'}}></div>
                                <div style={{width: '85%', background: '#4EA670'}}></div>
                            </div>
                        </div>
                        <div className="temp-name">Sage</div>
                        <div className="temp-role">RESEARCH / DATA</div>
                    </div>
                    <div className="template-card">
                        <div className="temp-mockup flex-center" style={{background: '#111'}}>
                            <div className="playfair" style={{fontSize: '2rem', color: '#7A7570'}}>+13</div>
                        </div>
                        <div className="temp-name">More Templates</div>
                        <div className="temp-role">ALL ROLES</div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title text-center fade-up">
                        Trusted by <em className="gold-italic">professionals.</em>
                    </h2>
                    <div className="testi-grid fade-up">
                        <div className="testi-card">
                            <div className="testi-quote">"</div>
                            <p className="testi-text">Foliogen completely transformed my job hunt. The recruiter audit highlighted gaps in my presentation I hadn't noticed in 5 years of PM work.</p>
                            <div className="testi-author">
                                <div className="testi-avatar">AJ</div>
                                <div className="testi-meta">
                                    <div className="testi-name">Alex J.</div>
                                    <div className="testi-company">SENIOR PM @ STRIPE</div>
                                </div>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-quote">"</div>
                            <p className="testi-text">The level of polish on the Alabaster template is unmatched. It feels like I hired a premium design agency to build my personal site.</p>
                            <div className="testi-author">
                                <div className="testi-avatar">SR</div>
                                <div className="testi-meta">
                                    <div className="testi-name">Sarah R.</div>
                                    <div className="testi-company">LEAD DESIGNER @ FIGMA</div>
                                </div>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-quote">"</div>
                            <p className="testi-text">As an engineer, I hate building portfolios. This gave me a beautiful, fast, ATS-friendly site in exactly 3 minutes. Incredible tool.</p>
                            <div className="testi-author">
                                <div className="testi-avatar">MK</div>
                                <div className="testi-meta">
                                    <div className="testi-name">Michael K.</div>
                                    <div className="testi-company">STAFF ENG @ GOOGLE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section" id="faq">
                <div className="container faq-grid">
                    <div className="faq-left fade-up">
                        <h2 className="section-title">
                            Frequently<br /><em className="gold-italic">asked questions.</em>
                        </h2>
                        <a href="mailto:admin@foliogen.in" className="faq-contact">Contact Support →</a>
                    </div>
                    <div className="faq-right fade-up">
                        {[
                            {q: "Does it work for my specific industry?", a: "Yes. Our AI models are trained on successful portfolios across Tech, Finance, Consulting, and Creative industries. We adapt the narrative tone to match your target role."},
                            {q: "Is my data safe?", a: "Absolutely. We don't train public models on your private data. Your resume and portfolio details remain entirely yours and can be deleted at any time."},
                            {q: "Which AI model powers the audit?", a: "We use a customized blend of GPT-4o and Claude 3.5 Sonnet, specifically fine-tuned for recruiter heuristics and ATS parsing logic."},
                            {q: "How fast is the build time?", a: "The average time from uploading your resume to a live, published portfolio is 4 minutes. The AI synthesis takes about 30 seconds."},
                            {q: "Can I customize the templates?", a: "Yes. While our design systems provide a perfect starting point, you have full control over colors, typography, layout blocks, and custom domains."}
                        ].map((faq, i) => (
                            <div key={i} className={`faq-item ${faqStates[i] ? 'open' : ''}`}>
                                <button className="faq-btn" onClick={() => toggleFaq(i)}>
                                    <span className="faq-q">{faq.q}</span>
                                    <span className="faq-icon">+</span>
                                </button>
                                <div className="faq-a">
                                    <div className="faq-a-inner">{faq.a}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="cta-glow"></div>
                <div className="container text-center fade-up">
                    <h2 className="cta-title">
                        Let's build something<br />
                        <em className="gold-italic">extraordinary.</em>
                    </h2>
                    <p className="cta-sub">Your professional identity deserves more than a PDF.</p>
                    <div className="cta-btns">
                        <Link to="/auth" className="btn-primary">Start Your Free Audit</Link>
                        <a href="#templates" className="btn-ghost">Explore Templates</a>
                    </div>
                    <p className="cta-caption">No credit card required · Portfolio live in 4 minutes</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-grid">
                    <div className="footer-logo">FOLIOGEN</div>
                    <div className="footer-links">
                        <a href="#process">Process</a>
                        <a href="#features">Features</a>
                        <a href="#templates">Templates</a>
                        <Link to="/auth">Sign In</Link>
                    </div>
                    <div className="footer-copy">© 2026 Foliogen</div>
                </div>
            </footer>
        </div>
    );
}
