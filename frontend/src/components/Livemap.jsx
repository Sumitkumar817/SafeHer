import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchNearbyPlaces } from "../services/geoapify";

// ─── Fix Leaflet icons in Vite ────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── User position icon ───────────────────────────────────────────────────────
const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ─── Emoji markers per category ───────────────────────────────────────────────
const makeIcon = (emoji) =>
  L.divIcon({
    className: "",
    html: `<div style="font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

// ─── Each category has its own key, icon, color ───────────────────────────────
const CATEGORIES = [
  { key: "service.police",   label: "Police",    icon: "🚔", color: "#4FC3F7" },
  { key: "healthcare",       label: "Hospital",  icon: "🏥", color: "#69F0AE" },
  { key: "catering.cafe",    label: "Café",      icon: "☕", color: "#FFD54F" },
  {
    key: "public_transport.train,public_transport.subway,public_transport.bus",
    label: "Transport", icon: "🚇", color: "#FF80AB",
  },
];

// ─── Auto-recenter map ────────────────────────────────────────────────────────
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveMap() {
  const [position, setPosition]             = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [places, setPlaces]                 = useState([]);
  const [loading, setLoading]               = useState(false);
  const [locError, setLocError]             = useState("");

  // ── 1. Watch live GPS ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setLocError("Location access denied. Please allow it."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // ── 2. Fetch places — runs when category OR position changes ──────────────
  const loadPlaces = useCallback(async (pos, cat) => {
    if (!pos) return;
    setLoading(true);
    setPlaces([]); // ✅ Clear old markers immediately on category switch
    try {
      const results = await fetchNearbyPlaces(pos[0], pos[1], cat.key);
      setPlaces(results);
    } catch {
      console.error("Failed to fetch places");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ This is the key — activeCategory in deps means new fetch on every switch
  useEffect(() => {
    if (position) loadPlaces(position, activeCategory);
  }, [activeCategory, position]); // eslint-disable-line

  // ─── Category button click ────────────────────────────────────────────────
  const handleCategoryClick = (cat) => {
    if (cat.key === activeCategory.key) return; // already active, skip
    setActiveCategory(cat);
    setPlaces([]); // clear markers instantly before fetch completes
  };

  // ─── States ───────────────────────────────────────────────────────────────
  if (locError)  return <div style={styles.status}>⚠️ {locError}</div>;
  if (!position) return <div style={styles.status}>📡 Getting your live location…</div>;

  const catIcon = makeIcon(activeCategory.icon);

  return (
    <div style={styles.wrapper}>

      {/* ── Category Tabs ── */}
      <div style={styles.tabs}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory.key === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat)}
              style={{
                ...styles.tab,
                background:  isActive ? cat.color + "33" : "transparent",
                borderColor: isActive ? cat.color : "#2E1A3A",
                color:       isActive ? cat.color : "#F8BBD0",
                fontWeight:  isActive ? 700 : 400,
              }}
            >
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Status Bar ── */}
      <div style={styles.statusBar}>
        <span style={{ color: "#69F0AE", fontSize: 12 }}>🟢 Live GPS</span>
        <span style={{ color: "#F8BBD0", fontSize: 12 }}>
          {loading
            ? `📡 Loading ${activeCategory.label}s…`
            : `${places.length} ${activeCategory.label}s nearby`}
        </span>
      </div>

      {/* ── Map ── */}
      <div style={styles.mapWrap}>
        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <RecenterMap position={position} />

          {/* Your live marker */}
          <Marker position={position} icon={userIcon}>
            <Popup>
              <strong>📍 You are here</strong><br />
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </Popup>
          </Marker>

          {/* Accuracy ring */}
          <Circle
            center={position}
            radius={60}
            pathOptions={{ color: "#FF4D8D", fillColor: "#FF4D8D", fillOpacity: 0.1 }}
          />

          {/* ✅ Only active category markers — clears on switch */}
          {places.map((place) =>
            place.lat && place.lon ? (
              <Marker
                key={place.id}
                position={[place.lat, place.lon]}
                icon={catIcon}
              >
                <Popup>
                  <div style={{ minWidth: 170, fontFamily: "sans-serif" }}>
                    <strong style={{ fontSize: 13 }}>
                      {activeCategory.icon} {place.name}
                    </strong><br />
                    <span style={{ fontSize: 11, color: "#666" }}>{place.address}</span><br />
                    <span style={{ fontSize: 12, color: "#C2185B", fontWeight: 600 }}>
                      📍 {place.distance}
                    </span><br /><br />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {place.phone && place.phone !== "—" && (
                        <a href={`tel:${place.phone}`} style={popupBtn("#C2185B")}>
                          📞 Call
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={popupBtn("#1565C0")}
                      >
                        🗺 Directions
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      <div style={styles.legend}>
        <span style={{ ...styles.legendItem, color: "#aaa", fontSize: 11 }}>
          📍 You &nbsp;|
        </span>
        {CATEGORIES.map((cat) => (
          <span
            key={cat.key}
            style={{
              ...styles.legendItem,
              opacity:    activeCategory.key === cat.key ? 1 : 0.35,
              fontWeight: activeCategory.key === cat.key ? 700 : 400,
              color:      activeCategory.key === cat.key ? cat.color : "#F8BBD0",
            }}
          >
            {cat.icon} {cat.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const popupBtn = (color) => ({
  background: color, color: "white",
  padding: "4px 10px", borderRadius: 6,
  fontSize: 11, fontWeight: 600, textDecoration: "none",
});

const styles = {
  wrapper: {
    background: "#0F0A14", borderRadius: 16,
    overflow: "hidden", border: "1px solid #2E1A3A",
  },
  status: {
    color: "#F8BBD0", padding: "40px 20px",
    textAlign: "center", background: "#0F0A14", fontSize: 14,
  },
  tabs: {
    display: "flex", gap: 8,
    padding: "12px 12px 8px", flexWrap: "wrap", background: "#0F0A14",
  },
  tab: {
    padding: "8px 16px", borderRadius: 20, border: "1.5px solid",
    cursor: "pointer", fontSize: 12, transition: "all 0.2s", fontFamily: "inherit",
  },
  statusBar: {
    display: "flex", justifyContent: "space-between",
    padding: "6px 16px 8px", background: "#0F0A14",
  },
  mapWrap: { height: 420, width: "100%" },
  legend: {
    display: "flex", gap: 14, padding: "10px 16px",
    flexWrap: "wrap", borderTop: "1px solid #2E1A3A", background: "#0F0A14",
  },
  legendItem: {
    display: "flex", alignItems: "center",
    gap: 4, fontSize: 11, transition: "all 0.2s",
  },
};