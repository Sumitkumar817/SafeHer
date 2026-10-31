import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ────────────────────────────────────────────────────────────────────

const StarIcon = ({ className = "", style = {} }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeLinecap="round" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeLinecap="round" />
  </svg>
);

const NavigationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Animated counter hook ─────────────────────────────────────────────────────

function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  magenta:  "#C2185B",
  hotPink:  "#FF4D8D",
  accent:   "#FF80AB",
  bg:       "#0F0A14",
  cardBg:   "#1A1224",
  footerBg: "#0D0818",
  textPri:  "#FCE4EC",
  textSec:  "#F8BBD0",
};

// ── Root component ────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.25 }
    );
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const routes  = useCountUp(10000, 2200, statsVisible);
  const reports = useCountUp(5000,  2000, statsVisible);
  const safer   = useCountUp(95,    1800, statsVisible);

  const NAV = ["Home", "Features", "About", "Contact"];

  const FEATURES = [
    { icon: <NavigationIcon />, title: "Safe Route Navigation",  desc: "AI-powered routing that prioritises well-lit, populated, and historically safe paths." },
    { icon: <BellIcon />,        title: "SOS Emergency Alert",    desc: "One-tap emergency broadcasts your location to trusted contacts and local authorities." },
    { icon: <ShareIcon />,       title: "Live Location Sharing",  desc: "Share your real-time journey with loved ones so someone always knows where you are." },
    { icon: <UsersIcon />,       title: "Community Reporting",    desc: "Crowd-sourced safety insights: report and view incidents in real-time." },
    { icon: <ActivityIcon />,    title: "Safety Heatmap",          desc: "Visual overlays reveal safe corridors and risk zones before you travel." },
    { icon: <ZapIcon />,         title: "Smart AI Alerts",         desc: "Proactive notifications about route deviations and unsafe zones." },
  ];

  const STEPS = [
    { icon: <MapPinIcon />,      step: "01", title: "Enter Destination",      desc: "Type where you're headed and let SafeHer analyse the safest options." },
    { icon: <NavigationIcon />,  step: "02", title: "Choose Safe Route",      desc: "Review AI-curated routes ranked by safety score and lighting." },
    { icon: <CheckCircleIcon />, step: "03", title: "Travel with Confidence", desc: "Go with real-time monitoring and instant SOS at your fingertips." },
  ];

  const TESTIMONIALS = [
    { initial: "P", name: "Priya S.",    city: "Delhi",     text: "SafeHer changed how I commute at night. I feel genuinely protected." },
    { initial: "A", name: "Ananya R.",   city: "Mumbai",    text: "The SOS feature gave my family peace of mind. Worth every second." },
    { initial: "M", name: "Meera K.",    city: "Bangalore", text: "Community reports kept me away from a blocked road — incredibly useful." },
  ];

  return (
    <div style={{ background: C.bg, color: C.textPri, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Global Styles ────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(194,24,91,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(194,24,91,.055) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .grad-text {
          background: linear-gradient(135deg, ${C.hotPink}, ${C.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Improved Card Hover Effects */
        .feature-card {
          background: ${C.cardBg};
          border: 1px solid rgba(255,77,141,0.1);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          border-color: ${C.hotPink};
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(194,24,91,0.2);
        }

        .testi-card {
          background: ${C.cardBg};
          border: 1px solid rgba(255,77,141,0.05);
          border-radius: 20px;
          transition: transform 0.3s ease;
        }
        .testi-card:hover { transform: scale(1.02); }

        .btn-glow {
          background: linear-gradient(135deg, ${C.magenta}, ${C.hotPink});
          border: none; color: white; border-radius: 99px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(194,24,91,0.3);
        }
        .btn-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 30px rgba(194,24,91,0.5);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid ${C.hotPink};
          color: ${C.hotPink};
          border-radius: 99px; cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-outline:hover { background: rgba(194,24,91,0.1); transform: translateY(-2px); }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fu  { animation: fadeUp .75s cubic-bezier(.22,1,.36,1) both; }
        .d1  { animation-delay: .1s;  }
        .d2  { animation-delay: .22s; }
        .d3  { animation-delay: .34s; }
        .d4  { animation-delay: .48s; }

        .float { animation: floatY 4.2s ease-in-out infinite; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-15px); }
        }

        .pulse { animation: pulseGlow 2.6s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { opacity: .55; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.1); }
        }

        .overline {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: ${C.accent};
          font-weight: 700;
        }

        @media (max-width: 767px) {
          .step-row { flex-direction: column !important; gap: 32px; }
          .step-connector { display: none !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="home" className="grid-bg" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(194,24,91,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 99, marginBottom: 24, background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.3)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.hotPink }} className="pulse"></span>
            <span className="overline" style={{ fontSize: "0.65rem" }}>India's Safety-First Navigation</span>
          </div>

          <h1 className="fu d1" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Navigate the World <br />With <span className="grad-text">Confidence</span>
          </h1>

          <p className="fu d2" style={{ fontSize: "1.1rem", color: C.textSec, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
            The AI-powered safety companion that guides you through well-lit paths and keeps your loved ones informed.
          </p>

          <div className="fu d3" style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60 }}>
            <button className="btn-glow" style={{ padding: "16px 32px" }} onClick={() => navigate('/signup')}>Get Started</button>
            <button className="btn-outline" style={{ padding: "16px 32px" }} onClick={() => navigate('/walkwithme')}>Walk With Me</button>
          </div>

          <div className="float fu d4" style={{ maxWidth: 320, margin: "0 auto" }}>
            <div style={{ background: C.cardBg, border: "1px solid rgba(255,77,141,0.3)", borderRadius: 24, padding: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ background: "#0F0A14", borderRadius: 16, height: 160, marginBottom: 16, overflow: "hidden", position: "relative" }}>
                 <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }}></div>
                 <svg viewBox="0 0 200 120" style={{ width: "100%", height: "100%" }}>
                    <path d="M20 100 Q60 40 140 20" stroke={C.hotPink} strokeWidth="3" fill="none" strokeDasharray="6 4" />
                    <circle cx="20" cy="100" r="6" fill={C.magenta} className="pulse" />
                    <circle cx="140" cy="20" r="6" fill={C.accent} />
                 </svg>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.7rem", color: C.textSec }}>CURRENT STATUS</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4CAF50" }}>Safe Corridor Active</p>
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: C.accent }}>98%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="overline">What We Offer</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Features Built for <span className="grad-text">You</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ padding: 32 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(194,24,91,0.1)", color: C.hotPink, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", color: C.textSec, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ padding: "80px 24px", background: "rgba(194,24,91,0.03)", borderTop: "1px solid rgba(194,24,91,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, textAlign: "center" }}>
          <div>
            <h2 className="grad-text" style={{ fontSize: "3rem", fontWeight: 900 }}>{routes.toLocaleString()}+</h2>
            <p className="overline">Safe Routes</p>
          </div>
          <div>
            <h2 className="grad-text" style={{ fontSize: "3rem", fontWeight: 900 }}>{reports.toLocaleString()}+</h2>
            <p className="overline">Reports</p>
          </div>
          <div>
            <h2 className="grad-text" style={{ fontSize: "3rem", fontWeight: 900 }}>{safer}%</h2>
            <p className="overline">Confidence</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="overline">Community Feedback</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Trusted by Thousands</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card" style={{ padding: 30 }}>
                <p style={{ fontSize: "0.95rem", fontStyle: "italic", color: C.textSec, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.magenta}, ${C.hotPink})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.initial}</div>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>{t.name}</p>
                    <p style={{ fontSize: "0.75rem", color: C.accent }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer id="contact" style={{ background: C.footerBg, padding: "80px 24px 40px", borderTop: "1px solid rgba(194,24,91,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 60 }}>
            <div style={{ maxWidth: 300 }}>
               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <StarIcon style={{ width: 24, height: 24, color: C.hotPink }} />
                <span style={{ fontSize: "1.3rem", fontWeight: 800 }}>SAFEHER</span>
              </div>
              <p style={{ color: C.textSec, fontSize: "0.9rem", lineHeight: 1.6 }}>
                The guiding light for every woman's journey. Empowering safety through community and technology.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: 20, fontSize: "0.9rem" }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {NAV.map(n => <a key={n} href={`#${n.toLowerCase()}`} style={{ color: C.textSec, textDecoration: "none", fontSize: "0.85rem" }}>{n}</a>)}
              </div>
            </div>
          </div>
          <div style={{ pt: 40, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
            © 2026 SafeHer Safety. Empowering safer journeys.
          </div>
        </div>
      </footer>
    </div>
  );
}