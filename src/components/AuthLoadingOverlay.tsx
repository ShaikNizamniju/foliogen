import { useEffect, useState } from 'react';

const MESSAGES = [
  'Setting the stage',
  'Polishing the type',
  'Aligning the grid',
  'Almost ready',
];

export function AuthLoadingOverlay({ show }: { show: boolean }) {
  const [i, setI] = useState(0);
  const [mounted, setMounted] = useState(show);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
      setClosing(false);
      const id = setInterval(() => setI((p) => (p + 1) % MESSAGES.length), 1400);
      return () => clearInterval(id);
    } else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(t);
    }
  }, [show, mounted]);

  if (!mounted) return null;

  return (
    <div className={`fg-load ${closing ? 'fg-load-out' : ''}`} role="status" aria-live="polite">
      <div className="fg-load-bg" />
      <div className="fg-load-inner">
        <div className="fg-load-eyebrow">— Loading · Foliogen</div>
        <div className="fg-load-mark">
          <span>F</span>
          <em>o</em>
        </div>
        <div className="fg-load-title">
          One <em>moment.</em>
        </div>
        <div className="fg-load-rule">
          <div className="fg-load-rule-fill" />
        </div>
        <div className="fg-load-msg-wrap">
          {MESSAGES.map((m, idx) => (
            <div key={m} className={`fg-load-msg ${idx === i ? 'on' : ''}`}>{m}…</div>
          ))}
        </div>
      </div>
      <style>{`
        .fg-load { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; background:#f0ede6; color:#111010; font-family:'Syne',sans-serif; animation:fg-load-in 0.25s ease; }
        .fg-load-out { animation:fg-load-fade 0.32s ease forwards; }
        .fg-load-bg { position:absolute; inset:0; background-image:radial-gradient(circle, rgba(17,16,16,0.08) 1px, transparent 1px); background-size:22px 22px; opacity:0.6; pointer-events:none; }
        .fg-load-inner { position:relative; display:flex; flex-direction:column; align-items:center; text-align:center; padding:0 24px; }
        .fg-load-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#e8401a; margin-bottom:24px; }
        .fg-load-mark { width:56px; height:56px; background:#111010; color:#f0ede6; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-weight:900; font-size:28px; line-height:1; margin-bottom:22px; position:relative; }
        .fg-load-mark em { font-style:italic; color:#e8401a; margin-left:1px; }
        .fg-load-title { font-family:'Playfair Display',serif; font-weight:700; font-size:clamp(36px,6vw,56px); line-height:1; letter-spacing:-0.02em; margin-bottom:24px; }
        .fg-load-title em { font-style:italic; color:#e8401a; }
        .fg-load-rule { width:220px; height:2px; background:rgba(17,16,16,0.12); overflow:hidden; position:relative; margin-bottom:18px; }
        .fg-load-rule-fill { position:absolute; inset:0; width:40%; background:#e8401a; animation:fg-load-slide 1.1s ease-in-out infinite; }
        .fg-load-msg-wrap { position:relative; height:18px; min-width:260px; }
        .fg-load-msg { position:absolute; inset:0; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(17,16,16,0.55); opacity:0; transform:translateY(4px); transition:opacity 0.3s ease, transform 0.3s ease; }
        .fg-load-msg.on { opacity:1; transform:translateY(0); }
        @keyframes fg-load-in { from { opacity:0; } to { opacity:1; } }
        @keyframes fg-load-fade { to { opacity:0; } }
        @keyframes fg-load-slide { 0% { transform:translateX(-100%); } 100% { transform:translateX(250%); } }
      `}</style>
    </div>
  );
}
