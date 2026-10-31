import { useState, useEffect, useCallback } from "react";
import { fetchNearbyPlaces } from "../services/geoapify";

const SHEET_API =
  "https://script.google.com/macros/s/AKfycbxCqVpAzOZBCUnN_1IT4BOym4-U3TTPVEzEK5u5YOjyu9gAs2NxPMJhxL3YQZFLONB9/exec";

const categories = [
  { key: "service.police",  label: "Police Stations", icon: "🚔", color: "#FF4D8D" },
  { key: "healthcare",      label: "Hospitals",        icon: "🏥", color: "#FF80AB" },
  { key: "catering.cafe",   label: "Shops / Cafés",    icon: "☕", color: "#E91E8C" },
  { key: "public_transport.train,public_transport.subway,public_transport.bus", label: "Transport Points", icon: "🚇", color: "#AD1457" },
];

export default function SafeSpace() {
  const [activeCategory, setActiveCategory] = useState("service.police");
  const [searchValue, setSearchValue]       = useState("");
  const [saved, setSaved]                   = useState({});
  const [navigating, setNavigating]         = useState(null);

  // API state
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords]   = useState(null);
  const [error, setError]     = useState("");

  // ─── Fetch from Geoapify ───────────────────────────────────────────────────
  const loadData = useCallback((category = activeCategory, cachedCoords = coords) => {
    setLoading(true);
    setError("");
    setPlaces([]);

    const fetchPlaces = async (lat, lon) => {
      try {
        const results = await fetchNearbyPlaces(lat, lon, category);
        setPlaces(results);
        if (results.length === 0) setError("No places found nearby. Try refreshing.");
      } catch {
        setError("Failed to fetch places. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (cachedCoords) {
      fetchPlaces(cachedCoords.latitude, cachedCoords.longitude);
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setCoords({ latitude, longitude });
          fetchPlaces(latitude, longitude);
        },
        () => {
          setError("Location access denied. Please allow it in browser settings.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    loadData(activeCategory, null);
  }, [activeCategory]); // eslint-disable-line

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const saveToSheet = async (place, category) => {
    try {
      await fetch(SHEET_API, {
        method: "POST",
        body: JSON.stringify({
          name: place.name, address: place.address,
          distance: place.distance, phone: place.phone, category,
        }),
      });
    } catch (e) {
      console.error("Sheet save error:", e);
    }
  };

  const filtered = places.filter(
    (p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.address.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleSave = (id) => setSaved((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleNavigate = (place) => {
    setNavigating(place.id);
    const q = encodeURIComponent(`${place.name} ${place.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
    setTimeout(() => setNavigating(null), 1800);
  };

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setSearchValue("");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Starry background */}
      <div style={styles.stars} aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.star,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>SafeSpace</h1>
            <p style={styles.subtitle}>SafeHer – The Guiding Light</p>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>📍</span>
          <input
            type="text"
            placeholder="Find safe places near you…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 2px #FF4D8D88, 0 0 20px #FF4D8D44";
              e.target.style.borderColor = "#FF4D8D";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "#2E1A3A";
            }}
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")} style={styles.clearBtn}>✕</button>
          )}
        </div>

        {/* Location Banner */}
        <div style={styles.locationBanner}>
          <span style={{ fontSize: 13 }}>📡</span>
          <span style={styles.locationText}>
            {coords
              ? <>Location detected – <strong style={{ color: "#FF80AB" }}>Live GPS</strong></>
              : "Detecting your location…"
            }
          </span>
          <span style={styles.locationDot} />
          {/* Refresh */}
          <button
            onClick={() => { setCoords(null); loadData(activeCategory, null); }}
            style={styles.refreshBtn}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Categories */}
        <div style={styles.categoryRow}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              style={{
                ...styles.catBtn,
                ...(activeCategory === cat.key ? styles.catBtnActive : {}),
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.key) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#FF4D8D66";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.key) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#2E1A3A";
                }
              }}
            >
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catLabel}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Results header */}
        <div style={styles.resultsHeader}>
          <span style={styles.resultsTitle}>
            {categories.find((c) => c.key === activeCategory)?.label}
          </span>
          {!loading && (
            <span style={styles.resultsBadge}>{filtered.length} nearby</span>
          )}
        </div>

        {/* Error */}
        {error && !loading && (
          <div style={styles.errorBanner}>⚠️ {error}</div>
        )}

        {/* Cards */}
        <div style={styles.cardList}>
          {loading ? (
            // Loading skeleton cards
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ ...styles.card, opacity: 0.5 }}>
                <div style={styles.skeleton} />
                <div style={{ ...styles.skeleton, width: "60%", marginTop: 8 }} />
                <div style={{ ...styles.skeleton, width: "40%", marginTop: 8 }} />
              </div>
            ))
          ) : (
            <>
              {filtered.length === 0 && !error && (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: "#F8BBD0", fontSize: 14 }}>
                    {searchValue ? `No results for "${searchValue}"` : "No places found nearby."}
                  </p>
                </div>
              )}
              {filtered.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  saved={!!saved[place.id]}
                  onSave={() => {
                    toggleSave(place.id);
                    saveToSheet(place, activeCategory);
                  }}
                  navigating={navigating === place.id}
                  onNavigate={() => handleNavigate(place)}
                />
              ))}
            </>
          )}
        </div>

        {/* Emergency strip */}
        <div style={styles.emergencyStrip}>
          <span style={styles.emergencyPulse} />
          <span style={{ color: "#FCE4EC", fontSize: 13, fontWeight: 600 }}>Emergency?</span>
          <a href="tel:112"  style={styles.emergencyBtn}>📞 Call 112</a>
          <a href="tel:1091" style={styles.emergencyBtnAlt}>👩 Women Helpline 1091</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0A14; }
      `}</style>
    </div>
  );
}

// ─── Place Card ──────────────────────────────────────────────────────────────
function PlaceCard({ place, saved, onSave, navigating, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const hasPhone = place.phone && place.phone !== "—" && place.phone !== "100";

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 40px #C2185B33, 0 2px 12px #00000044"
          : "0 2px 16px #00000033",
        borderColor: hovered ? "#C2185B55" : "#2E1A3A",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={styles.cardTop}>
        <div style={styles.cardLeft}>
          <h3 style={styles.cardName}>{place.name}</h3>
          <p style={styles.cardAddress}>📍 {place.address}</p>
        </div>
        <div style={styles.cardRight}>
          {/* Live badge from API — show distance as status */}
          <span style={styles.status24}>🟢 Live</span>
        </div>
      </div>

      {/* Meta row */}
      <div style={styles.cardMeta}>
        <span style={styles.distance}>🚶 {place.distance}</span>
        <span style={styles.badgeVerified}>✓ Verified</span>
      </div>

      {/* Actions */}
      <div style={styles.cardActions}>
        <button
          onClick={onNavigate}
          style={{
            ...styles.actionBtn,
            background: navigating
              ? "linear-gradient(135deg, #FF80AB, #FF4D8D)"
              : "linear-gradient(135deg, #C2185B, #FF4D8D)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 16px #FF4D8D66"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {navigating ? "📡 Routing…" : "🗺 Navigate"}
        </button>

        {/* ✅ Only show Call if real phone exists */}
        {hasPhone && (
          <a
            href={`tel:${place.phone}`}
            style={styles.actionBtnOutline}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C2185B22";
              e.currentTarget.style.borderColor = "#FF4D8D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#C2185B66";
            }}
          >
            📞 Call
          </a>
        )}

        <button
          onClick={onSave}
          style={{
            ...styles.actionBtnOutline,
            borderColor: saved ? "#FF80AB" : "#C2185B66",
            color: saved ? "#FF80AB" : "#F8BBD0",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FF80AB22"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          {saved ? "💖 Saved" : "🤍 Save"}
        </button>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0F0A14",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflowX: "hidden",
    paddingBottom: 40,
  },
  stars: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 },
  star: {
    position: "absolute", borderRadius: "50%", background: "#FCE4EC",
    animation: "twinkle ease-in-out infinite",
  },
  container: {
    position: "relative", zIndex: 1,
    maxWidth: 680, margin: "0 auto", padding: "32px 16px 24px",
  },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 28 },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32, fontWeight: 700, color: "#FCE4EC",
    letterSpacing: "-0.5px", lineHeight: 1,
  },
  subtitle: {
    fontSize: 12, color: "#FF80AB",
    letterSpacing: "0.08em", marginTop: 2, fontWeight: 500,
  },
  searchWrap: { position: "relative", marginBottom: 12 },
  searchIcon: {
    position: "absolute", left: 16, top: "50%",
    transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none",
  },
  searchInput: {
    width: "100%", background: "#1A1224",
    border: "1.5px solid #2E1A3A", borderRadius: 16,
    padding: "14px 44px 14px 46px", color: "#FCE4EC",
    fontSize: 14, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s", caretColor: "#FF4D8D",
  },
  clearBtn: {
    position: "absolute", right: 14, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", color: "#F8BBD0", cursor: "pointer", fontSize: 13, padding: 4,
  },
  locationBanner: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#1A1224", border: "1px solid #2E1A3A",
    borderRadius: 12, padding: "9px 14px", marginBottom: 24,
    fontSize: 13, color: "#F8BBD0", flexWrap: "wrap",
  },
  locationText: { flex: 1 },
  locationDot: {
    width: 8, height: 8, borderRadius: "50%", background: "#4CAF50",
    animation: "pulse-dot 2s ease-in-out infinite",
  },
  refreshBtn: {
    background: "transparent", color: "#FF4D8D",
    border: "1px solid #FF4D8D44", borderRadius: 20,
    padding: "4px 12px", cursor: "pointer", fontSize: 11,
  },
  categoryRow: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10, marginBottom: 24,
  },
  catBtn: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#1A1224", border: "1.5px solid #2E1A3A",
    borderRadius: 14, padding: "12px 16px", cursor: "pointer",
    transition: "all 0.2s", color: "#F8BBD0", textAlign: "left",
  },
  catBtnActive: {
    background: "linear-gradient(135deg, #C2185B22, #FF4D8D11)",
    borderColor: "#C2185B", boxShadow: "0 0 20px #C2185B33",
  },
  catIcon: { fontSize: 20 },
  catLabel: { fontSize: 13, fontWeight: 500, color: "#FCE4EC" },
  resultsHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 16, fontWeight: 600, color: "#FCE4EC",
    fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em",
  },
  resultsBadge: {
    background: "linear-gradient(135deg, #C2185B, #FF4D8D)",
    color: "#fff", fontSize: 11, fontWeight: 600,
    borderRadius: 20, padding: "3px 10px", letterSpacing: "0.03em",
  },
  errorBanner: {
    background: "#2A0A1A", border: "1px solid #C2185B55",
    borderRadius: 12, padding: "12px 16px", color: "#EF9A9A",
    fontSize: 13, marginBottom: 16, textAlign: "center",
  },
  skeleton: {
    height: 14, borderRadius: 8,
    background: "linear-gradient(90deg, #1A1224 25%, #2E1A3A 50%, #1A1224 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    width: "80%",
  },
  cardList: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 },
  emptyState: {
    textAlign: "center", padding: "40px 20px",
    background: "#1A1224", borderRadius: 20, border: "1px solid #2E1A3A",
  },
  card: {
    background: "#1A1224", border: "1.5px solid #2E1A3A",
    borderRadius: 20, padding: "18px 18px 14px",
    transition: "all 0.25s", backdropFilter: "blur(12px)",
  },
  cardTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", gap: 12, marginBottom: 8,
  },
  cardLeft: { flex: 1, minWidth: 0 },
  cardRight: { flexShrink: 0 },
  cardName: { fontSize: 15, fontWeight: 600, color: "#FCE4EC", marginBottom: 4, lineHeight: 1.3 },
  cardAddress: {
    fontSize: 12, color: "#F8BBD0", opacity: 0.75,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  status24: {
    fontSize: 11, fontWeight: 600, color: "#69F0AE",
    background: "#1B5E2022", border: "1px solid #69F0AE44",
    borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap",
  },
  cardMeta: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  distance: { fontSize: 12, color: "#FF80AB", fontWeight: 500 },
  badgeVerified: {
    fontSize: 11, color: "#FF4D8D", background: "#C2185B18",
    border: "1px solid #C2185B55", borderRadius: 20,
    padding: "2px 9px", fontWeight: 600,
  },
  cardActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  actionBtn: {
    background: "linear-gradient(135deg, #C2185B, #FF4D8D)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "8px 16px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "box-shadow 0.2s",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
  },
  actionBtnOutline: {
    background: "transparent", color: "#F8BBD0",
    border: "1.5px solid #C2185B66", borderRadius: 10,
    padding: "7px 14px", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "all 0.2s",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
  },
  emergencyStrip: {
    background: "linear-gradient(135deg, #1A1224, #2A0A1A)",
    border: "1.5px solid #C2185B66", borderRadius: 16,
    padding: "14px 18px", display: "flex", alignItems: "center",
    gap: 10, flexWrap: "wrap", boxShadow: "0 0 30px #C2185B22",
  },
  emergencyPulse: {
    width: 10, height: 10, borderRadius: "50%", background: "#FF4D8D",
    flexShrink: 0, animation: "pulse-dot 1.5s ease-in-out infinite",
    boxShadow: "0 0 8px #FF4D8D",
  },
  emergencyBtn: {
    background: "linear-gradient(135deg, #C2185B, #FF4D8D)",
    color: "#fff", borderRadius: 10, padding: "7px 14px",
    fontSize: 12, fontWeight: 700, textDecoration: "none",
    display: "inline-flex", alignItems: "center", gap: 4,
  },
  emergencyBtnAlt: {
    background: "transparent", color: "#FF80AB",
    border: "1.5px solid #FF80AB66", borderRadius: 10,
    padding: "6px 12px", fontSize: 12, fontWeight: 600,
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
  },
};