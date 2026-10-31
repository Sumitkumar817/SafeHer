import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase"; // Verified path from sidebar
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";

// ─── Icon Components ───────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#shieldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4D8D" />
        <stop offset="100%" stopColor="#FF80AB" />
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" strokeWidth="1.8" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF80AB" opacity="0.5">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// ─── Floating Particles ────────────────────────────────────────────────────────
const FloatingParticles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#FF4D8D",
            opacity: p.opacity,
            animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out alternate`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Input Component ───────────────────────────────────────────────────────────
const Input = ({ label, type = "text", value, onChange, error, icon, rightSlot, placeholder }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#F8BBD0", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          border: `1px solid ${error ? "#FF4D8D" : focused ? "rgba(255,77,141,0.7)" : "rgba(194,24,91,0.28)"}`,
          background: focused ? "rgba(194,24,91,0.06)" : "rgba(15,10,20,0.6)",
          boxShadow: focused ? "0 0 0 3px rgba(255,77,141,0.12), inset 0 1px 0 rgba(255,255,255,0.04)" : error ? "0 0 0 3px rgba(255,77,141,0.18)" : "none",
          transition: "all 0.2s ease",
        }}
      >
        {icon && (
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "#FF4D8D" : "rgba(248,187,208,0.5)", transition: "color 0.2s" }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off" // Prevents the blue autofill background
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: icon ? "13px 44px 13px 44px" : rightSlot ? "13px 44px 13px 16px" : "13px 16px",
            color: "#FCE4EC",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            boxSizing: "border-box",
            caretColor: "#FF4D8D",
          }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ margin: "5px 0 0 4px", fontSize: 11.5, color: "#FF4D8D", display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ─── Main Auth Component ───────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [animating, setAnimating] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const switchMode = (next) => {
    if (next === mode || animating) return;
    setAnimating(true);
    setErrors({});
    setForm({ name: "", email: "", password: "" });
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
    }, 320);
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !anonymous && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length !== 0) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        if (!anonymous && form.name) {
          await updateProfile(userCredential.user, { displayName: form.name });
        }
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      let message = "An error occurred. Please try again.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") message = "Invalid email or password.";
      if (err.code === "auth/email-already-in-use") message = "This email is already registered.";
      setErrors({ auth: message });
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({ value: form[field], onChange: (ev) => setForm({ ...form, [field]: ev.target.value }), error: errors[field] });

  const isSignup = mode === "signup";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0F0A14; }
        
        /* Autofill Correction Hack */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #FCE4EC !important;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px rgba(15,10,20,1);
        }

        @keyframes float { from { transform: translateY(0px) scale(1); } to { transform: translateY(-24px) scale(1.15); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-14px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 28px rgba(194,24,91,0.22), 0 0 60px rgba(255,77,141,0.08); } 50% { box-shadow: 0 0 40px rgba(194,24,91,0.35), 0 0 80px rgba(255,77,141,0.14); } }
        @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        
        .auth-card { animation: pulse-glow 4s ease-in-out infinite; }
        .form-body { animation: fadeSlideIn 0.36s ease forwards; }
        .form-body.out { animation: fadeSlideOut 0.28s ease forwards; }
        
        .social-btn { transition: all 0.2s ease; cursor: pointer; background: rgba(255,255,255,0.03); border: 1px solid rgba(194,24,91,0.22); border-radius: 12px; padding: 11px 16px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #F8BBD0; font-size: 13.5px; font-family: 'DM Sans', sans-serif; font-weight: 500; flex: 1; }
        .social-btn:hover { background: rgba(255,77,141,0.08); border-color: rgba(255,77,141,0.4); color: #FCE4EC; box-shadow: 0 0 16px rgba(255,77,141,0.12); }
        
        .submit-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #C2185B, #FF4D8D); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; position: relative; overflow: hidden; transition: all 0.22s ease; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); background-size: 200% 100%; animation: shimmer 2.4s infinite; pointer-events: none; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(255,77,141,0.4), 0 2px 8px rgba(194,24,91,0.3); }
        
        .anon-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(194,24,91,0.2); background: rgba(194,24,91,0.04); transition: all 0.2s ease; margin-bottom: 16px; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: rgba(248,187,208,0.35); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(194,24,91,0.2); }
        .success-ring { width: 56px; height: 56px; border-radius: 50%; background: rgba(76,175,80,0.12); border: 2px solid #4CAF50; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; animation: fadeSlideIn 0.4s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0F0A14", backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 10%, rgba(194,24,91,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 90%, rgba(255,77,141,0.09) 0%, transparent 55%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative" }}>
        <FloatingParticles />

        <div className="auth-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, background: "rgba(26,18,36,0.92)", backdropFilter: "blur(24px)", borderRadius: 24, border: "1px solid rgba(194,24,91,0.28)", padding: "36px 36px 32px" }}>
          
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
              <ShieldIcon />
              <span style={{ fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg, #FF4D8D, #FF80AB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SafeHer</span>
              <StarIcon />
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(248,187,208,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Safety, Your Strength</p>
          </div>

          <div style={{ position: "relative", display: "flex", background: "rgba(15,10,20,0.8)", borderRadius: 14, border: "1px solid rgba(194,24,91,0.2)", padding: 4, marginBottom: 28 }}>
            <div className="toggle-pill" style={{ position: "absolute", top: 4, bottom: 4, left: mode === "signin" ? 4 : "50%", width: "calc(50% - 4px)", borderRadius: 10, background: "linear-gradient(135deg, #C2185B, #FF4D8D)", transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)" }} />
            {["signin", "signup"].map((m) => (
              <button key={m} className="toggle-tab" onClick={() => switchMode(m)} style={{ flex: 1, padding: "9px 0", border: "none", background: "transparent", color: mode === m ? "#fff" : "rgba(248,187,208,0.5)", fontSize: 13.5, fontWeight: mode === m ? 600 : 400, cursor: "pointer", position: "relative", zIndex: 1 }}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "24px 0 8px", animation: "fadeSlideIn 0.4s ease" }}>
              <div className="success-ring">✓</div>
              <h3 style={{ color: "#4CAF50", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{isSignup ? "Account Created!" : "Welcome Back!"}</h3>
              <p style={{ color: "rgba(248,187,208,0.6)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>Successfully authenticated. Stay safe.</p>
              <button className="submit-btn" onClick={() => navigate("/")}>Continue →</button>
            </div>
          ) : (
            <div key={mode} className={`form-body${animating ? " out" : ""}`}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="social-btn"><GoogleIcon /><span>Google</span></button>
                <button className="social-btn"><AppleIcon /><span>Apple</span></button>
              </div>
              <div className="divider">or continue with email</div>

              {errors.auth && <p style={{ color: "#FF4D8D", fontSize: 13, textAlign: "center", marginBottom: 15 }}>{errors.auth}</p>}

              {isSignup && !anonymous && (
                <Input label="Full Name" placeholder="Your name" {...f("name")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>} />
              )}
              <Input label="Email Address" type="email" placeholder="you@example.com" {...f("email")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>} />
              <Input label="Password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" {...f("password")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>} rightSlot={<button onClick={() => setShowPass(!showPass)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,187,208,0.5)" }}><EyeIcon open={showPass} /></button>} />

              {isSignup && (
                <div className="anon-toggle" onClick={() => setAnonymous(!anonymous)}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${anonymous ? "#FF4D8D" : "rgba(194,24,91,0.4)"}`, background: anonymous ? "linear-gradient(135deg,#C2185B,#FF4D8D)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {anonymous && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="2,6 5,9 10,3" /></svg>}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: anonymous ? "#FCE4EC" : "#F8BBD0", margin: 0 }}>Stay Anonymous</p>
                    <p style={{ fontSize: 11.5, color: "rgba(248,187,208,0.45)", margin: 0 }}>Skip name — join with email only</p>
                  </div>
                </div>
              )}

              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Authenticating..." : (isSignup ? "Create My Account" : "Sign In Securely")}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(248,187,208,0.45)", marginTop: 20 }}>
                {isSignup ? "Already have an account?" : "New to SafeHer?"}{" "}
                <button onClick={() => switchMode(isSignup ? "signin" : "signup")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg,#FF4D8D,#FF80AB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {isSignup ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}