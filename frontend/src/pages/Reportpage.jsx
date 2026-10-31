import { useState } from "react";

const INCIDENT_TYPES = [
  {
    id: "harassment",
    label: "Harassment",
    icon: "⚠️",
    desc: "Verbal or physical intimidation",
  },
  {
    id: "stalking",
    label: "Stalking / Following",
    icon: "👁️",
    desc: "Being followed or surveilled",
  },
  {
    id: "unsafe_area",
    label: "Unsafe Area",
    icon: "📍",
    desc: "Poorly lit or dangerous zone",
  },
  {
    id: "assault",
    label: "Physical Assault",
    icon: "🚨",
    desc: "Physical attack or attempt",
  },
  {
    id: "suspicious",
    label: "Suspicious Activity",
    icon: "🔍",
    desc: "Concerning behaviour nearby",
  },
  { id: "other", label: "Other", icon: "📝", desc: "Any other safety concern" },
];

const RECENT_REPORTS = [
  {
    type: "Unsafe Area",
    location: "Sector 18, Noida",
    time: "12 min ago",
    severity: "medium",
  },
  {
    type: "Harassment",
    location: "Connaught Place, Delhi",
    time: "34 min ago",
    severity: "high",
  },
  {
    type: "Suspicious Activity",
    location: "Rajouri Garden Metro",
    time: "1 hr ago",
    severity: "low",
  },
  {
    type: "Stalking / Following",
    location: "Lajpat Nagar Market",
    time: "2 hrs ago",
    severity: "high",
  },
];

const SEVERITY_COLORS = {
  high: { dot: "#FF4D8D", label: "High Risk", bg: "rgba(255,77,141,0.12)" },
  medium: { dot: "#FFB74D", label: "Moderate", bg: "rgba(255,183,77,0.10)" },
  low: { dot: "#4CAF50", label: "Low Risk", bg: "rgba(76,175,80,0.10)" },
};

export default function ReportIncident() {
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({
    location: "",
    description: "",
    anonymous: true,
    urgency: "normal",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("report");

  const handleSubmit = async () => {
    if (!selectedType || !form.location) return;

    setLoading(true);

    const payload = {
      incidentType: selectedType,
      location: form.location,
      description: form.description,
      anonymous: form.anonymous,
      urgency: form.urgency,
      createdAt: new Date().toLocaleString(),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxNree5EZOTKls3lcAmavpUmHEu7FeJ-JzZYeyVtWCViWncW8stIQW8Loq7Xy9h8iFWtQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving:", error);
      setLoading(false);
      alert("Failed to save report.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedType(null);
    setForm({
      location: "",
      description: "",
      anonymous: true,
      urgency: "normal",
    });
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successRing}>
            <span style={{ fontSize: 36 }}>✓</span>
          </div>
          <h2 style={styles.successTitle}>Report Submitted</h2>
          <p style={styles.successSubtitle}>
            Your report has been received. Our community safety team will review
            it shortly.
            {form.anonymous &&
              " You reported anonymously — your identity is protected."}
          </p>
          <div style={styles.successMeta}>
            <span style={styles.metaTag}>📍 {form.location}</span>
            <span style={styles.metaTag}>
              🔖 {INCIDENT_TYPES.find((t) => t.id === selectedType)?.label}
            </span>
          </div>
          <button style={styles.btnPrimary} onClick={handleReset}>
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerBadge}>🛡️ COMMUNITY SAFETY</div>
        <h1 style={styles.heading}>Report an Incident</h1>
        <p style={styles.subheading}>
          Help keep your community safer. Every report matters.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["report", "recent"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "report" ? "📋 Report Incident" : "🕒 Recent Reports"}
          </button>
        ))}
      </div>

      {activeTab === "report" ? (
        <div style={styles.formContainer}>
          {/* Step 1: Incident Type */}
          <div style={styles.section}>
            <div style={styles.stepLabel}>
              <span style={styles.stepNum}>01</span> Type of Incident
            </div>
            <div style={styles.typeGrid}>
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  style={{
                    ...styles.typeCard,
                    ...(selectedType === type.id ? styles.typeCardActive : {}),
                  }}
                  onClick={() => setSelectedType(type.id)}
                >
                  <span style={styles.typeIcon}>{type.icon}</span>
                  <span style={styles.typeLabel}>{type.label}</span>
                  <span style={styles.typeDesc}>{type.desc}</span>
                  {selectedType === type.id && (
                    <div style={styles.typeCheck}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Location */}
          <div style={styles.section}>
            <div style={styles.stepLabel}>
              <span style={styles.stepNum}>02</span> Location
            </div>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📍</span>
              <input
                style={styles.input}
                placeholder="Enter area, landmark, or address..."
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Step 3: Urgency */}
          <div style={styles.section}>
            <div style={styles.stepLabel}>
              <span style={styles.stepNum}>03</span> Urgency Level
            </div>
            <div style={styles.urgencyRow}>
              {[
                { val: "low", label: "Low", color: "#4CAF50" },
                { val: "normal", label: "Normal", color: "#FFB74D" },
                { val: "high", label: "Emergency", color: "#FF4D8D" },
              ].map((u) => (
                <button
                  key={u.val}
                  style={{
                    ...styles.urgencyBtn,
                    borderColor:
                      form.urgency === u.val ? u.color : "rgba(194,24,91,0.2)",
                    background:
                      form.urgency === u.val ? `${u.color}18` : "transparent",
                    color: form.urgency === u.val ? u.color : "#F8BBD0",
                  }}
                  onClick={() => setForm((f) => ({ ...f, urgency: u.val }))}
                >
                  <span style={{ ...styles.urgencyDot, background: u.color }} />
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Description */}
          <div style={styles.section}>
            <div style={styles.stepLabel}>
              <span style={styles.stepNum}>04</span> Description{" "}
              <span style={styles.optionalTag}>Optional</span>
            </div>
            <textarea
              style={styles.textarea}
              placeholder="Describe what happened — any details help our team respond better..."
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* Anonymous toggle */}
          <div style={styles.section}>
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleTitle}>🔒 Stay Anonymous</div>
                <div style={styles.toggleSub}>
                  Your identity will not be shared with anyone
                </div>
              </div>
              <div
                style={{
                  ...styles.toggle,
                  background: form.anonymous
                    ? "linear-gradient(135deg,#C2185B,#FF4D8D)"
                    : "rgba(194,24,91,0.2)",
                }}
                onClick={() =>
                  setForm((f) => ({ ...f, anonymous: !f.anonymous }))
                }
              >
                <div
                  style={{
                    ...styles.toggleThumb,
                    transform: form.anonymous
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            style={{
              ...styles.submitBtn,
              opacity: !selectedType || !form.location ? 0.5 : 1,
              cursor:
                !selectedType || !form.location ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            disabled={!selectedType || !form.location}
          >
            {loading ? <span style={styles.loader} /> : <>🚨 Submit Report</>}
          </button>

          {(!selectedType || !form.location) && (
            <p style={styles.hint}>
              Please select an incident type and enter a location to submit.
            </p>
          )}
        </div>
      ) : (
        /* Recent Reports Tab */
        <div style={styles.formContainer}>
          <div style={styles.recentHeader}>
            <span style={styles.liveDot} /> Live community reports near you
          </div>
          {RECENT_REPORTS.map((r, i) => {
            const s = SEVERITY_COLORS[r.severity];
            return (
              <div
                key={i}
                style={{
                  ...styles.recentCard,
                  background: s.bg,
                  borderColor: s.dot + "40",
                }}
              >
                <div style={styles.recentTop}>
                  <span
                    style={{
                      ...styles.severityBadge,
                      color: s.dot,
                      borderColor: s.dot + "60",
                    }}
                  >
                    <span
                      style={{ ...styles.severityDot, background: s.dot }}
                    />
                    {s.label}
                  </span>
                  <span style={styles.recentTime}>{r.time}</span>
                </div>
                <div style={styles.recentType}>{r.type}</div>
                <div style={styles.recentLocation}>📍 {r.location}</div>
              </div>
            );
          })}
          <p style={styles.recentNote}>
            Reports are anonymised and reviewed by our safety team before
            appearing here.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0F0A14",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "32px 16px 80px",
    color: "#FCE4EC",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  headerBadge: {
    display: "inline-block",
    background: "rgba(194,24,91,0.15)",
    border: "1px solid rgba(194,24,91,0.35)",
    color: "#FF80AB",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 700,
    marginBottom: 12,
  },
  heading: {
    fontSize: "clamp(26px,5vw,38px)",
    fontWeight: 800,
    background: "linear-gradient(135deg,#FF4D8D,#FF80AB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px",
  },
  subheading: {
    color: "#F8BBD0",
    fontSize: 14,
    opacity: 0.8,
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: 8,
    maxWidth: 600,
    margin: "0 auto 24px",
    background: "#1A1224",
    borderRadius: 12,
    padding: 4,
    border: "1px solid rgba(194,24,91,0.18)",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "#F8BBD0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .2s",
  },
  tabActive: {
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    color: "#fff",
    boxShadow: "0 2px 14px rgba(255,77,141,0.35)",
  },
  formContainer: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  section: {
    background: "#1A1224",
    borderRadius: 14,
    border: "1px solid rgba(194,24,91,0.18)",
    padding: "18px 20px",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#FF80AB",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  stepNum: {
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    color: "#fff",
    borderRadius: 6,
    padding: "2px 7px",
    fontSize: 11,
    fontWeight: 800,
  },
  optionalTag: {
    fontSize: 10,
    color: "#F8BBD0",
    opacity: 0.5,
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: 0,
    marginLeft: 6,
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
    gap: 10,
  },
  typeCard: {
    background: "rgba(255,77,141,0.04)",
    border: "1px solid rgba(194,24,91,0.2)",
    borderRadius: 12,
    padding: "14px 12px",
    cursor: "pointer",
    textAlign: "left",
    color: "#F8BBD0",
    position: "relative",
    transition: "all .2s",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  typeCardActive: {
    background: "rgba(194,24,91,0.18)",
    border: "1px solid #FF4D8D",
    boxShadow: "0 0 16px rgba(255,77,141,0.2)",
  },
  typeIcon: { fontSize: 22 },
  typeLabel: { fontSize: 13, fontWeight: 700, color: "#FCE4EC" },
  typeDesc: { fontSize: 11, opacity: 0.65 },
  typeCheck: {
    position: "absolute",
    top: 8,
    right: 10,
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    color: "#fff",
    borderRadius: "50%",
    width: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 800,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,77,141,0.06)",
    border: "1px solid rgba(194,24,91,0.25)",
    borderRadius: 10,
    paddingLeft: 12,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#FCE4EC",
    fontSize: 14,
    padding: "12px 12px 12px 0",
    fontFamily: "inherit",
  },
  urgencyRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  urgencyBtn: {
    flex: 1,
    minWidth: 90,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 7,
    transition: "all .2s",
    fontFamily: "inherit",
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
  },
  textarea: {
    width: "100%",
    background: "rgba(255,77,141,0.06)",
    border: "1px solid rgba(194,24,91,0.25)",
    borderRadius: 10,
    color: "#FCE4EC",
    fontSize: 13,
    padding: "12px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    lineHeight: 1.6,
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  toggleTitle: { fontSize: 14, fontWeight: 600, color: "#FCE4EC" },
  toggleSub: { fontSize: 11, color: "#F8BBD0", opacity: 0.65, marginTop: 2 },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    transition: "background .25s",
  },
  toggleThumb: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform .25s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.5,
    boxShadow: "0 4px 24px rgba(255,77,141,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all .2s",
    fontFamily: "inherit",
  },
  loader: {
    width: 20,
    height: 20,
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  hint: {
    textAlign: "center",
    fontSize: 11,
    color: "#F8BBD0",
    opacity: 0.5,
    margin: "-8px 0 0",
  },
  /* Success screen */
  successCard: {
    maxWidth: 480,
    margin: "60px auto",
    background: "#1A1224",
    border: "1px solid rgba(194,24,91,0.3)",
    borderRadius: 20,
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 0 60px rgba(194,24,91,0.15)",
  },
  successRing: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    margin: "0 auto 20px",
    boxShadow: "0 0 30px rgba(255,77,141,0.5)",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 800,
    background: "linear-gradient(135deg,#FF4D8D,#FF80AB)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#F8BBD0",
    lineHeight: 1.7,
    margin: "0 0 20px",
  },
  successMeta: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  metaTag: {
    background: "rgba(194,24,91,0.15)",
    border: "1px solid rgba(194,24,91,0.3)",
    color: "#FF80AB",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 600,
  },
  btnPrimary: {
    background: "linear-gradient(135deg,#C2185B,#FF4D8D)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "13px 32px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  /* Recent tab */
  recentHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#F8BBD0",
    padding: "10px 0",
    fontWeight: 600,
  },
  liveDot: {
    width: 8,
    height: 8,
    background: "#4CAF50",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 8px #4CAF50",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  recentCard: {
    borderRadius: 14,
    border: "1px solid",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  recentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  severityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  recentTime: { fontSize: 11, color: "#F8BBD0", opacity: 0.6 },
  recentType: { fontSize: 15, fontWeight: 700, color: "#FCE4EC" },
  recentLocation: { fontSize: 12, color: "#F8BBD0", opacity: 0.75 },
  recentNote: {
    fontSize: 11,
    color: "#F8BBD0",
    opacity: 0.45,
    textAlign: "center",
    padding: "8px 0 0",
  },
};

/* Inject keyframes */
const keyframes = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
`;
const styleEl = document.createElement("style");
styleEl.textContent = keyframes;
document.head.appendChild(styleEl);

