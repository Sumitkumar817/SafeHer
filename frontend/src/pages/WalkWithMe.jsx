import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  bg: "#0F0A14",
  bgCard: "rgba(26, 18, 36, 0.82)",
  bgCardAlt: "rgba(20, 10, 30, 0.75)",
  border: "rgba(194, 24, 91, 0.18)",
  borderAccent: "rgba(255, 128, 171, 0.22)",
  primary: "#C2185B",
  primaryGlow: "rgba(194, 24, 91, 0.35)",
  secondary: "#FF4D8D",
  accent: "#FF80AB",
  accentSoft: "rgba(255, 128, 171, 0.12)",
  text: "#FCE4EC",
  textSoft: "#F8BBD0",
  textMuted: "rgba(248, 187, 208, 0.5)",
  success: "#4ADEAA",
  live: "#FF4D8D",
};

const CONTACTS = [
  { id: 1, name: "Priya Sharma", initials: "PS", status: "Watching", color: "#FF4D8D", statusColor: "#4ADEAA" },
  { id: 2, name: "Ananya Iyer", initials: "AI", status: "Notified", color: "#FF80AB", statusColor: "#FBBF24" },
  { id: 3, name: "Ritu Malhotra", initials: "RM", status: "Offline", color: "#C2185B", statusColor: "rgba(248,187,208,0.35)" },
  { id: 4, name: "Kavya Nair", initials: "KN", status: "Watching", color: "#FF4D8D", statusColor: "#4ADEAA" },
];

const COMPANION_REPLIES = [
  "I'm right here with you. Stay calm and keep moving. 💗",
  "You're doing great! I'm watching your route in real time.",
  "Your contacts have been alerted. You're not alone. 🌟",
  "Take a deep breath. I'm here. Stay on the lit path.",
  "Checking on you — everything looks okay from my end. 💪",
];

const ROUTE_POINTS = [
  { x: 15, y: 75 }, { x: 25, y: 60 }, { x: 40, y: 55 },
  { x: 55, y: 40 }, { x: 70, y: 35 }, { x: 85, y: 20 },
];

export default function WalkWithMe() {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState([
    { id: 1, from: "companion", text: "Welcome to Walk With Me. I'm your safety companion tonight. Start your session whenever you're ready. 💗", time: "Now" },
  ]);
  const [inputText, setInputText] = useState("");
  const [sosActive, setSosActive] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      const routeInterval = setInterval(() => {
        setRouteProgress(prev => (prev < ROUTE_POINTS.length - 1 ? prev + 1 : prev));
      }, 5000);
      return () => {
        clearInterval(timerRef.current);
        clearInterval(routeInterval);
      };
    } else {
      setElapsed(0);
      setRouteProgress(0);
    }
  }, [sessionActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    const newMsg = { id: Date.now(), from: "user", text: text.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setTimeout(() => {
      const reply = COMPANION_REPLIES[Math.floor(Math.random() * COMPANION_REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "companion", text: reply }]);
    }, 1200);
  };

  const triggerSOS = () => {
    setSosActive(true);
    sendMessage("🆘 SOS TRIGGERED — Emergency help requested!");
    window.dispatchEvent(new CustomEvent('start-sos-capture'));
    setTimeout(() => {
      setSosActive(false);
      navigate("/capture");
    }, 800);
  };

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Starfield ── */
        .wwm-stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .wwm-stars::before, .wwm-stars::after {
          content: '';
          position: absolute; inset: 0;
          background-repeat: repeat;
          animation: twinkle-drift 80s linear infinite;
        }
        .wwm-stars::before {
          background-image:
            radial-gradient(1px 1px at 7% 9%, rgba(255,192,220,0.85) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 19% 4%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 31% 14%, rgba(255,210,230,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 44% 7%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 58% 11%, rgba(255,192,220,0.8) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 71% 5%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 84% 16%, rgba(255,210,230,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 93% 8%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 12% 28%, rgba(255,192,220,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 27% 33%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 48% 24%, rgba(255,210,230,0.7) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 63% 30%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 77% 26%, rgba(255,192,220,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 89% 38%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 4% 52%, rgba(255,210,230,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 48%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 38% 55%, rgba(255,192,220,0.75) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 54% 44%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 68% 58%, rgba(255,210,230,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 82% 50%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 70%, rgba(255,192,220,0.6) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 33% 76%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 51% 68%, rgba(255,210,230,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 74% 72%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 91% 65%, rgba(255,192,220,0.75) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 8% 88%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 28% 92%, rgba(255,210,230,0.65) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 47% 85%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 65% 91%, rgba(255,192,220,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 86% 94%, rgba(255,255,255,0.8) 0%, transparent 100%);
          animation-duration: 120s;
        }
        .wwm-stars::after {
          background-image:
            radial-gradient(1px 1px at 14% 17%, rgba(255,210,230,0.45) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 36% 22%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 59% 19%, rgba(255,192,220,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 79% 13%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 96% 27%, rgba(255,210,230,0.7) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 5% 42%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 61%, rgba(255,192,220,0.5) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 43% 79%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 57% 83%, rgba(255,210,230,0.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 72% 77%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 88% 80%, rgba(255,192,220,0.7) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 3% 95%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 18% 98%, rgba(255,210,230,0.5) 0%, transparent 100%),
            radial-gradient(0.8px 0.8px at 39% 96%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 61% 99%, rgba(255,192,220,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 83% 97%, rgba(255,255,255,0.7) 0%, transparent 100%);
          animation-duration: 160s;
          animation-direction: reverse;
          opacity: 0.7;
        }
        @keyframes twinkle-drift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        /* ── Nebula orbs ── */
        .wwm-orb {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .wwm-orb-1 {
          width: 700px; height: 700px; top: -250px; right: -200px;
          background: radial-gradient(circle, rgba(194,24,91,0.09) 0%, rgba(194,24,91,0.04) 40%, transparent 70%);
          filter: blur(80px);
          animation: orb-pulse 12s ease-in-out infinite;
        }
        .wwm-orb-2 {
          width: 500px; height: 500px; bottom: -150px; left: -120px;
          background: radial-gradient(circle, rgba(255,77,141,0.07) 0%, transparent 70%);
          filter: blur(60px);
          animation: orb-pulse 16s ease-in-out infinite reverse;
        }
        .wwm-orb-3 {
          width: 350px; height: 350px; top: 45%; left: 35%;
          background: radial-gradient(circle, rgba(255,128,171,0.05) 0%, transparent 70%);
          filter: blur(50px);
          animation: orb-pulse 20s ease-in-out infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }

        /* ── Glass Cards ── */
        .wwm-card {
          background: rgba(26, 18, 36, 0.78);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(194, 24, 91, 0.16);
          border-radius: 22px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          box-shadow: 0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,128,171,0.07);
        }
        .wwm-card:hover {
          border-color: rgba(194, 24, 91, 0.3);
          box-shadow: 0 8px 48px rgba(194,24,91,0.1), 0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,128,171,0.1);
          transform: translateY(-1px);
        }
        .wwm-card-alt {
          background: rgba(18, 8, 28, 0.72);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255, 128, 171, 0.14);
          border-radius: 22px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,128,171,0.06);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .wwm-card-alt:hover {
          border-color: rgba(255, 128, 171, 0.25);
          box-shadow: 0 8px 40px rgba(255,77,141,0.08), 0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,128,171,0.1);
          transform: translateY(-1px);
        }

        /* ── Tag Pill ── */
        .wwm-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(255, 128, 171, 0.8);
        }
        .wwm-tag-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* ── Live Pulse ── */
        .wwm-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ADEAA;
          animation: wwm-live 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes wwm-live {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 170, 0.55); }
          60% { box-shadow: 0 0 0 8px rgba(74, 222, 170, 0); }
        }

        /* ── Buttons ── */
        .wwm-btn-primary {
          background: linear-gradient(135deg, #8B0038 0%, #C2185B 45%, #FF4D8D 100%);
          border: none; border-radius: 100px;
          color: white; font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 600; font-size: 14px; letter-spacing: 0.4px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 4px 28px rgba(194,24,91,0.38), 0 1px 0 rgba(255,255,255,0.12) inset;
          position: relative; overflow: hidden;
        }
        .wwm-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 55%);
          border-radius: inherit;
          pointer-events: none;
        }
        .wwm-btn-primary:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 40px rgba(194,24,91,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .wwm-btn-primary:active { transform: translateY(0) scale(0.99); }

        .wwm-btn-ghost {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,128,171,0.18);
          border-radius: 16px;
          color: rgba(248,187,208,0.7);
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .wwm-btn-ghost:hover {
          background: rgba(194,24,91,0.1);
          border-color: rgba(255,77,141,0.35);
          color: #FCE4EC;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(194,24,91,0.15);
        }
        .wwm-btn-ghost:active { transform: translateY(0); }

        .wwm-btn-sos {
          background: linear-gradient(135deg, #7B0035 0%, #C2185B 50%, #FF4D8D 100%);
          border: none; border-radius: 18px;
          color: white;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 700; font-size: 15px; letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 6px 36px rgba(194,24,91,0.45);
          position: relative; overflow: hidden;
        }
        .wwm-btn-sos::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }
        .wwm-btn-sos:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 10px 50px rgba(194,24,91,0.65);
        }
        .wwm-btn-sos:active { transform: translateY(0) scale(0.99); }
        .wwm-sos-active {
          animation: sos-pulse 0.65s ease-in-out infinite alternate;
        }
        @keyframes sos-pulse {
          0% { box-shadow: 0 6px 36px rgba(194,24,91,0.45); }
          100% { box-shadow: 0 0 0 16px rgba(194,24,91,0.12), 0 6px 56px rgba(194,24,91,0.75); transform: scale(1.015); }
        }

        /* ── Session status bar ── */
        .wwm-status-bar {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(74, 222, 170, 0.07);
          border: 1px solid rgba(74, 222, 170, 0.22);
          border-radius: 100px;
          padding: 7px 18px;
        }

        /* ── Contact row ── */
        .wwm-contact-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,128,171,0.06);
          background: rgba(255,255,255,0.025);
          transition: all 0.22s ease;
          cursor: default;
        }
        .wwm-contact-row:hover {
          background: rgba(194,24,91,0.07);
          border-color: rgba(255,77,141,0.2);
          transform: translateX(2px);
        }

        /* ── Chat input ── */
        .wwm-chat-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,128,171,0.15);
          border-radius: 100px;
          padding: 11px 20px;
          color: #FCE4EC;
          font-size: 13.5px;
          font-family: 'DM Sans', system-ui, sans-serif;
          outline: none;
          transition: border-color 0.22s ease, box-shadow 0.22s ease;
        }
        .wwm-chat-input::placeholder { color: rgba(248,187,208,0.3); }
        .wwm-chat-input:focus {
          border-color: rgba(194,24,91,0.45);
          box-shadow: 0 0 0 3px rgba(194,24,91,0.1);
        }

        /* ── Radar ── */
        .wwm-radar-sweep { animation: wwm-radar 3.2s linear infinite; transform-origin: 50% 50%; }
        @keyframes wwm-radar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Status fade ── */
        .wwm-sf1 { animation: sf1 6s ease-in-out infinite; position: absolute; }
        .wwm-sf2 { animation: sf2 6s ease-in-out infinite; position: absolute; opacity: 0; }
        @keyframes sf1 { 0%,20%{opacity:1} 30%,100%{opacity:0} }
        @keyframes sf2 { 0%,25%{opacity:0} 35%,55%{opacity:1} 65%,100%{opacity:0} }

        /* ── Timer ── */
        .wwm-timer-active {
          color: #FF4D8D;
          text-shadow: 0 0 60px rgba(255,77,141,0.5), 0 0 120px rgba(194,24,91,0.25);
        }
        .wwm-timer-idle { color: rgba(252,228,236,0.1); }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(194,24,91,0.3); border-radius: 3px; }

        /* ── Fade-in animations ── */
        @keyframes wwm-fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .wwm-fadein-1 { animation: wwm-fadein 0.5s ease forwards; }
        .wwm-fadein-2 { animation: wwm-fadein 0.6s 0.08s ease both; }
        .wwm-fadein-3 { animation: wwm-fadein 0.6s 0.16s ease both; }
        .wwm-fadein-4 { animation: wwm-fadein 0.6s 0.24s ease both; }
        .wwm-fadein-5 { animation: wwm-fadein 0.6s 0.32s ease both; }

        /* ── Floating header accent ── */
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .wwm-float { animation: float-gentle 6s ease-in-out infinite; }

        /* ── LIVE badge ── */
        .wwm-live-badge {
          font-size: 9px; font-weight: 700; color: #4ADEAA;
          background: rgba(74,222,170,0.1);
          border: 1px solid rgba(74,222,170,0.28);
          border-radius: 6px;
          padding: 3px 9px;
          letter-spacing: 1.2px;
          animation: badge-glow 2s ease-in-out infinite;
        }
        @keyframes badge-glow {
          0%,100% { box-shadow: none; }
          50% { box-shadow: 0 0 12px rgba(74,222,170,0.25); }
        }

        /* ── Chat message ── */
        .wwm-msg-enter {
          animation: msg-slide 0.3s ease both;
        }
        @keyframes msg-slide {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 768px) {
          .wwm-main-grid { grid-template-columns: 1fr !important; }
          .wwm-action-grid { grid-template-columns: 1fr !important; }
          .wwm-heading { font-size: 36px !important; }
        }
      `}</style>

      {/* Background layers */}
      <div className="wwm-stars" />
      <div className="wwm-orb wwm-orb-1" />
      <div className="wwm-orb wwm-orb-2" />
      <div className="wwm-orb wwm-orb-3" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1160px", margin: "0 auto", padding: "52px 24px 72px" }}>

        {/* ── Header ── */}
        <header className="wwm-fadein-1" style={{ marginBottom: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}>
            <div className="wwm-live-dot" />
            <span style={{
              fontSize: "10px", fontWeight: 600, letterSpacing: "2.2px",
              color: COLORS.textMuted, textTransform: "uppercase",
            }}>
              Safety Companion Active
            </span>
          </div>

          <h1 className="wwm-heading" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "54px",
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: "-0.5px",
            color: COLORS.text,
            maxWidth: "520px",
          }}>
            You're never walking{" "}
            <em style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #C2185B 0%, #FF4D8D 50%, #FF80AB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
            }}>
              alone.
            </em>
          </h1>

          <p style={{
            marginTop: "14px",
            fontSize: "15px",
            color: COLORS.textSoft,
            fontWeight: 400,
            maxWidth: "400px",
            lineHeight: 1.65,
            opacity: 0.65,
          }}>
            Your trusted circle is watching in real time. Stay connected, stay safe.
          </p>
        </header>

        {/* ── Main Grid ── */}
        <div className="wwm-main-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Live Session Card */}
            <div className="wwm-card wwm-fadein-2" style={{ padding: "32px 28px" }}>
              <div className="wwm-tag" style={{ marginBottom: "22px" }}>
                <div className="wwm-live-dot" />
                Live Session
              </div>

              {/* Timer */}
              <div style={{
                fontSize: "84px",
                textAlign: "center",
                margin: "4px 0 20px",
                fontFamily: "'DM Sans', monospace",
                fontWeight: 300,
                letterSpacing: "-3px",
                lineHeight: 1,
                transition: "all 0.4s ease",
              }} className={sessionActive ? "wwm-timer-active" : "wwm-timer-idle"}>
                {formatTime(elapsed)}
              </div>

              {/* Status bar */}
              {sessionActive && (
                <div className="wwm-status-bar" style={{ marginBottom: "20px" }}>
                  <div className="wwm-live-dot" style={{ background: "#4ADEAA" }} />
                  <span style={{ fontSize: "11.5px", fontWeight: 500, color: "#4ADEAA", letterSpacing: "0.4px" }}>
                    GPS Locked · Contacts Notified
                  </span>
                </div>
              )}

              <button
                className="wwm-btn-primary"
                onClick={() => setSessionActive(!sessionActive)}
                style={{ width: "100%", padding: "16px 20px" }}
              >
                {sessionActive ? "⏹  End Walk Session" : "▶  Start New Walk"}
              </button>
            </div>

            {/* Trusted Circle Card */}
            <div className="wwm-card-alt wwm-fadein-3" style={{ padding: "28px 24px" }}>
              <div className="wwm-tag" style={{ marginBottom: "20px", color: "rgba(255,128,171,0.75)" }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="4" r="2.5" stroke="#FF80AB" strokeWidth="1.3"/>
                  <path d="M1 10.5C1 8.5 2.8 7 6 7s5 1.5 5 3.5" stroke="#FF80AB" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Trusted Circle
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {CONTACTS.map((c, idx) => (
                  <div key={c.id} className="wwm-contact-row" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "11px",
                      background: `linear-gradient(135deg, ${c.color}40, ${c.color}18)`,
                      border: `1px solid ${c.color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "11px", color: c.color,
                      flexShrink: 0,
                      boxShadow: `0 2px 12px ${c.color}25`,
                    }}>
                      {c.initials}
                    </div>
                    <span style={{ flex: 1, fontSize: "13.5px", fontWeight: 500, color: COLORS.text }}>{c.name}</span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      background: `${c.statusColor}12`,
                      border: `1px solid ${c.statusColor}28`,
                      borderRadius: "100px",
                      padding: "4px 11px",
                    }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: c.statusColor, flexShrink: 0 }} />
                      <span style={{ fontSize: "10.5px", fontWeight: 600, color: c.statusColor, letterSpacing: "0.3px" }}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Map / Satellite Card */}
            <div className="wwm-card wwm-fadein-4" style={{
              height: "296px",
              position: "relative",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Card header */}
              <div style={{
                position: "absolute", top: "20px", left: "22px", right: "22px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                zIndex: 2,
              }}>
                <div className="wwm-tag">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="5" cy="5" r="4" stroke="rgba(255,128,171,0.8)" strokeWidth="1.2"/>
                    <circle cx="5" cy="5" r="1.5" fill="rgba(255,128,171,0.8)"/>
                  </svg>
                  {sessionActive ? "Live Route" : "Satellite Status"}
                </div>
                {sessionActive && <div className="wwm-live-badge">LIVE</div>}
              </div>

              {/* Idle Radar */}
              {!sessionActive ? (
                <>
                  {[90, 68, 46, 24].map((r, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      width: `${r * 2}px`, height: `${r * 2}px`,
                      borderRadius: "50%",
                      border: `1px solid rgba(194,24,91,${0.06 + i * 0.035})`,
                    }} />
                  ))}
                  <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: "absolute" }}>
                    <defs>
                      <radialGradient id="sweepG" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(100,100) scale(90)">
                        <stop offset="0%" stopColor="#C2185B" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#C2185B" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(194,24,91,0.1)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(255,77,141,0.07)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(194,24,91,0.1)" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(194,24,91,0.07)" strokeWidth="1" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(194,24,91,0.07)" strokeWidth="1" />
                    <g className="wwm-radar-sweep">
                      <path d="M 100 100 L 100 10 A 90 90 0 0 1 163.6 36.4 Z"
                        fill="url(#sweepG)" opacity="0.6" />
                    </g>
                    <circle cx="100" cy="100" r="10" fill="rgba(194,24,91,0.2)" />
                    <circle cx="100" cy="100" r="5" fill="#C2185B" opacity="0.9" />
                    <circle cx="100" cy="100" r="2.5" fill="white" opacity="0.85" />
                  </svg>
                  <div style={{ position: "absolute", bottom: "22px", textAlign: "center", width: "100%" }}>
                    <div className="wwm-sf1" style={{ left: 0, right: 0 }}>
                      <span style={{ fontSize: "10.5px", color: COLORS.textMuted, letterSpacing: "1.2px" }}>Scanning satellite signals...</span>
                    </div>
                    <div className="wwm-sf2" style={{ left: 0, right: 0 }}>
                      <span style={{ fontSize: "10.5px", color: COLORS.textMuted, letterSpacing: "1.2px" }}>Calibrating location...</span>
                    </div>
                  </div>
                </>
              ) : (
                // Live route map
                <svg width="100%" height="100%" style={{ background: "transparent" }}>
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C2185B" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0.85" />
                    </linearGradient>
                    <filter id="dotGlow2">
                      <feGaussianBlur stdDeviation="4" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  {[20, 40, 60, 80].map(v => (
                    <React.Fragment key={v}>
                      <line x1={`${v}%`} y1="0%" x2={`${v}%`} y2="100%" stroke="rgba(194,24,91,0.05)" strokeWidth="1" />
                      <line x1="0%" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="rgba(194,24,91,0.05)" strokeWidth="1" />
                    </React.Fragment>
                  ))}
                  <path
                    d={`M ${ROUTE_POINTS.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
                    fill="none" stroke="url(#routeGrad)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="6 3" opacity="0.65"
                  />
                  {ROUTE_POINTS.slice(0, routeProgress).map((p, i) => (
                    <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="3"
                      fill="rgba(194,24,91,0.45)" />
                  ))}
                  <circle cx={`${ROUTE_POINTS[routeProgress].x}%`} cy={`${ROUTE_POINTS[routeProgress].y}%`}
                    r="16" fill="rgba(194,24,91,0.1)" />
                  <circle cx={`${ROUTE_POINTS[routeProgress].x}%`} cy={`${ROUTE_POINTS[routeProgress].y}%`}
                    r="8" fill="#C2185B" filter="url(#dotGlow2)" />
                  <circle cx={`${ROUTE_POINTS[routeProgress].x}%`} cy={`${ROUTE_POINTS[routeProgress].y}%`}
                    r="3.5" fill="white" />
                </svg>
              )}
            </div>

            {/* Chat Card */}
            <div className="wwm-card wwm-fadein-5" style={{
              flex: 1, display: "flex", flexDirection: "column",
              minHeight: "370px", padding: "22px",
            }}>
              {/* Chat header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "11px",
                marginBottom: "16px", paddingBottom: "14px",
                borderBottom: "1px solid rgba(255,128,171,0.09)",
              }}>
                <div className="wwm-float" style={{
                  width: "34px", height: "34px", borderRadius: "11px",
                  background: "linear-gradient(135deg, #7B0035, #C2185B 55%, #FF4D8D)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px",
                  boxShadow: "0 3px 16px rgba(194,24,91,0.4)",
                }}>💗</div>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: COLORS.text }}>Tara</div>
                  <div style={{ fontSize: "11px", color: COLORS.success, display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: COLORS.success }} />
                    Always online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "9px", paddingRight: "2px" }}>
                {messages.map(m => (
                  <div key={m.id} className="wwm-msg-enter" style={{
                    alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                    background: m.from === "user"
                      ? "linear-gradient(135deg, #8B0038, #C2185B 60%, #FF4D8D)"
                      : "rgba(255,255,255,0.045)",
                    border: m.from === "user"
                      ? "none"
                      : "1px solid rgba(255,128,171,0.1)",
                    padding: "10px 15px",
                    borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    maxWidth: "83%",
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    color: COLORS.text,
                    boxShadow: m.from === "user" ? "0 3px 20px rgba(194,24,91,0.3)" : "none",
                  }}>
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: "9px", marginTop: "14px" }}>
                <input
                  className="wwm-chat-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  placeholder="Talk to Tara..."
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  style={{
                    background: "linear-gradient(135deg, #8B0038, #C2185B 55%, #FF4D8D)",
                    border: "none",
                    color: "white",
                    borderRadius: "100px",
                    padding: "0 20px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    transition: "all 0.22s ease",
                    boxShadow: "0 3px 16px rgba(194,24,91,0.38)",
                    flexShrink: 0,
                    letterSpacing: "0.3px",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 22px rgba(194,24,91,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 3px 16px rgba(194,24,91,0.38)"; }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Row ── */}
        <div className="wwm-action-grid" style={{
          marginTop: "18px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "12px",
        }}>
          {/* SOS */}
          <button
            className={`wwm-btn-sos ${sosActive ? "wwm-sos-active" : ""}`}
            onClick={triggerSOS}
            style={{ padding: "20px 24px", textAlign: "left", display: "flex", alignItems: "center", gap: "16px" }}
          >
            <div style={{
              width: "42px", height: "42px", borderRadius: "13px",
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "19px", flexShrink: 0,
            }}>🆘</div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.6px" }}>TRIGGER SOS</div>
              <div style={{ fontSize: "11px", fontWeight: 400, opacity: 0.72, marginTop: "3px", letterSpacing: "0.2px" }}>Alert all contacts immediately</div>
            </div>
          </button>

          {/* Fake Call */}
          <button className="wwm-btn-ghost" style={{ padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "11px",
              background: "rgba(194,24,91,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>📞</div>
            <span style={{ fontSize: "11.5px", letterSpacing: "0.3px" }}>Fake Call</span>
          </button>

          {/* Share GPS */}
          <button className="wwm-btn-ghost" style={{ padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "11px",
              background: "rgba(194,24,91,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>📡</div>
            <span style={{ fontSize: "11.5px", letterSpacing: "0.3px" }}>Share Live GPS</span>
          </button>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "10.5px", color: COLORS.textMuted, letterSpacing: "0.6px" }}>
            End-to-end encrypted · Location shared only with your trusted circle
          </p>
        </div>
      </div>
    </div>
  );
}