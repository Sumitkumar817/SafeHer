import React, { useState, useEffect, useRef } from "react";
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
import {
  AlertTriangle,
  Phone,
  PhoneCall,
  Share2,
  Copy,
  Check,
  MapPin,
  Navigation,
  UserPlus,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldAlert,
  Send,
  MessageSquare,
  RefreshCw,
  Compass,
  BellOff,
} from "lucide-react";

// ── Leaflet Icon setup ────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userPulsingIcon = L.divIcon({
  className: "custom-sos-marker",
  html: `
    <div style="position: relative; width: 32px; height: 32px;">
      <div style="position: absolute; inset: -8px; border-radius: 50%; background: rgba(255, 77, 141, 0.4); animation: pulseSosBeacon 1.8s ease-out infinite;"></div>
      <div style="position: absolute; inset: 0; border-radius: 50%; background: #FF4D8D; border: 3px solid #FFFFFF; box-shadow: 0 0 16px rgba(255, 77, 141, 0.8); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
        📍
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 16, { animate: true });
    }
  }, [coords, map]);
  return null;
}

const DEFAULT_COORDS = [28.6139, 77.209]; // Default coordinates (New Delhi)

const INITIAL_CONTACTS = [
  { id: "c1", name: "Police Emergency", phone: "112", relation: "Helpline", isSystem: true, color: "#4FC3F7" },
  { id: "c2", name: "Women Helpline", phone: "1091", relation: "Helpline", isSystem: true, color: "#FF80AB" },
  { id: "c3", name: "National Emergency", phone: "100", relation: "Helpline", isSystem: true, color: "#FFB74D" },
  { id: "c4", name: "Mom (Primary Contact)", phone: "+91 98765 43210", relation: "Family", isSystem: false, color: "#81C784" },
  { id: "c5", name: "Priya (Sister)", phone: "+91 91234 56789", relation: "Family", isSystem: false, color: "#BA68C8" },
];

export default function Sos() {
  // ── Coordinates & Geolocation State ─────────────────────────────────────────
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [locLoading, setLocLoading] = useState(true);
  const [locError, setLocError] = useState("");
  const [address, setAddress] = useState("Detecting your exact address...");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── SOS Alarm & Trigger State ───────────────────────────────────────────────
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // ── Contacts State ──────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("safeher_sos_contacts") || localStorage.getItem("dhruvtara_sos_contacts");
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "Family" });

  // Web Audio Context for Emergency Siren
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Save contacts
  useEffect(() => {
    try {
      localStorage.setItem("safeher_sos_contacts", JSON.stringify(contacts));
    } catch (e) {
      console.error("Failed to save contacts:", e);
    }
  }, [contacts]);

  // ── Watch Geolocation ───────────────────────────────────────────────────────
  const fetchLocation = () => {
    setLocLoading(true);
    setLocError("");

    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      setCoords(DEFAULT_COORDS);
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
        setAccuracy(pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null);
        setLastUpdated(new Date().toLocaleTimeString());
        setLocLoading(false);
        reverseGeocode(lat, lng);
      },
      (err) => {
        console.warn("Location error:", err.message);
        setLocError("Location access unavailable or denied. Showing fallback coordinates.");
        setCoords(DEFAULT_COORDS);
        setAccuracy(50);
        setLastUpdated(new Date().toLocaleTimeString());
        setLocLoading(false);
        reverseGeocode(DEFAULT_COORDS[0], DEFAULT_COORDS[1]);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchLocation();

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
          setAccuracy(pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null);
          setLastUpdated(new Date().toLocaleTimeString());
        },
        null,
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ── Reverse Geocode using OpenStreetMap Nominatim ───────────────────────────
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
          return;
        }
      }
      setAddress(`Latitude ${lat.toFixed(5)}, Longitude ${lon.toFixed(5)}`);
    } catch {
      setAddress(`Near coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`);
    }
  };

  // ── Siren Synthesizer using Web Audio API ───────────────────────────────────
  const startSiren = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {}
      }
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
      setSirenPlaying(true);

      let high = false;
      sirenIntervalRef.current = setInterval(() => {
        if (!oscillatorRef.current) return;
        const targetFreq = high ? 650 : 950;
        osc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
        high = !high;
      }, 350);
    } catch (e) {
      console.warn("Could not start siren audio:", e);
    }
  };

  const stopSiren = () => {
    setSirenPlaying(false);
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopSiren();
  }, []);

  // ── SOS Button Trigger Handling ─────────────────────────────────────────────
  const handleSosPress = () => {
    if (sosActive) {
      setSosActive(false);
      setCountdown(null);
      stopSiren();
      return;
    }

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          clearInterval(interval);
          return null;
        }
        if (prev <= 1) {
          clearInterval(interval);
          setSosActive(true);
          startSiren();
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  const cancelCountdown = () => {
    setCountdown(null);
    setSosActive(false);
    stopSiren();
  };

  // ── Distress URL & Message Helpers ──────────────────────────────────────────
  const currentLat = coords ? coords[0] : DEFAULT_COORDS[0];
  const currentLng = coords ? coords[1] : DEFAULT_COORDS[1];
  const mapsUrl = `https://maps.google.com/?q=${currentLat},${currentLng}`;
  const distressMessage = `🚨 EMERGENCY SOS ALERT! I am in distress and need immediate help. My current live GPS location is: ${mapsUrl} (Near: ${address})`;

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(distressMessage)}`;
    window.open(url, "_blank");
  };

  const shareViaSms = (phone = "") => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const smsUrl = cleanPhone
      ? `sms:${cleanPhone}?body=${encodeURIComponent(distressMessage)}`
      : `sms:?body=${encodeURIComponent(distressMessage)}`;
    window.open(smsUrl, "_self");
  };

  const copyGpsLink = () => {
    navigator.clipboard.writeText(mapsUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyFullMessage = () => {
    navigator.clipboard.writeText(distressMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "🚨 EMERGENCY SOS - SAFEHER",
          text: distressMessage,
          url: mapsUrl,
        });
      } catch (err) {
        console.warn("Share cancelled or failed:", err);
      }
    } else {
      copyFullMessage();
    }
  };

  const addContact = (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.phone.trim()) return;

    const colors = ["#81C784", "#BA68C8", "#4FC3F7", "#FFB74D", "#FF80AB"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created = {
      id: "c_" + Date.now(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      relation: newContact.relation || "Friend",
      isSystem: false,
      color: randomColor,
    };

    setContacts([...contacts, created]);
    setNewContact({ name: "", phone: "", relation: "Family" });
    setShowAddContact(false);
  };

  const removeContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="sos-page">
      {/* ── Active SOS Flashing Banner ── */}
      {sosActive && (
        <div className="emergency-flashing-banner">
          <div className="banner-content">
            <div className="banner-left">
              <ShieldAlert size={26} className="banner-icon" />
              <div>
                <strong>🚨 EMERGENCY SOS BROADCAST ACTIVE!</strong>
                <p>Distress alert triggered. Live GPS coordinates are ready to broadcast.</p>
              </div>
            </div>

            <div className="banner-actions">
              {/* Separate Stop Siren button in banner */}
              {sirenPlaying && (
                <button
                  className="banner-stop-siren-btn"
                  onClick={stopSiren}
                  title="Silence the siren alarm"
                >
                  <VolumeX size={16} />
                  <span>STOP SIREN</span>
                </button>
              )}
              <button className="cancel-alert-btn" onClick={cancelCountdown}>
                I AM SAFE (CANCEL ALERT)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sos-container">
        {/* ── Page Header ── */}
        <header className="sos-header">
          <div className="status-badge">
            <span className="live-dot" />
            24/7 RAPID EMERGENCY DISPATCH & LIVE TRACKING
          </div>
          <h1 className="sos-title">Emergency SOS Hub</h1>
          <p className="sos-subtitle">
            One-touch high-priority distress trigger, emergency contact relay, and live satellite GPS location broadcast.
          </p>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
            EMERGENCY TRIGGER: SQUARE SHAPE BUTTON - "PRESS SOS IN TROUBLE"
        ══════════════════════════════════════════════════════════════════ */}
        <section className="sos-section section-one">
          <div className="sos-button-wrapper">
            {/* Background pulsating aura rings */}
            <div className={`sos-aura ${sosActive ? "aura-active" : ""}`} />
            <div className={`sos-aura aura-2 ${sosActive ? "aura-active" : ""}`} />

            {/* THE SQUARE SOS BUTTON */}
            <button
              id="sos-trouble-button"
              className={`square-sos-button ${sosActive ? "btn-active" : ""} ${countdown !== null ? "btn-countdown" : ""}`}
              onClick={handleSosPress}
              aria-label="Press SOS in trouble"
            >
              <div className="button-inner-border">
                {countdown !== null ? (
                  <div className="countdown-view">
                    <span className="countdown-number">{countdown}</span>
                    <span className="countdown-label">STARTING SOS ALARM</span>
                    <span className="countdown-sub">Click to abort</span>
                  </div>
                ) : sosActive ? (
                  <div className="active-view">
                    <ShieldAlert size={54} className="spin-icon" />
                    <span className="button-main-text">SOS ACTIVE</span>
                    <span className="button-sub-text">CLICK TO DEACTIVATE</span>
                  </div>
                ) : (
                  <div className="idle-view">
                    <AlertTriangle size={58} className="trouble-icon" />
                    <span className="button-main-text">PRESS SOS IN TROUBLE</span>
                    <span className="button-sub-text">TAP TO TRIGGER IMMEDIATE HELP</span>
                  </div>
                )}
              </div>
            </button>

            {/* Controls Bar with Separate STOP SIREN Button */}
            <div className="sos-controls-row">
              {/* SEPARATE BUTTON TO STOP SIREN */}
              <button
                id="stop-siren-btn"
                className={`control-pill stop-siren-pill ${sirenPlaying ? "siren-active-pulse" : ""}`}
                onClick={stopSiren}
                title="Immediately silence and stop the emergency siren"
              >
                <VolumeX size={17} />
                <span>{sirenPlaying ? "🚨 STOP SIREN (RINGING)" : "Stop Siren"}</span>
              </button>

              <button
                className={`control-pill ${soundEnabled ? "sound-on" : "sound-off"}`}
                onClick={() => {
                  const nextState = !soundEnabled;
                  setSoundEnabled(nextState);
                  if (!nextState && sirenPlaying) stopSiren();
                  else if (nextState && sosActive) startSiren();
                }}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>Siren: {soundEnabled ? "Enabled" : "Muted"}</span>
              </button>

              <button
                className="control-pill dial-direct"
                onClick={() => window.open("tel:112", "_self")}
              >
                <PhoneCall size={16} />
                <span>Call Police (112) Direct</span>
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CONTACTS (LEFT) & SHARE THE GPS (RIGHT)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="sos-section section-two">
          <div className="two-column-grid">
            {/* ── LEFT COLUMN: LIST OF CONTACTS ── */}
            <div className="contacts-panel">
              <div className="panel-title-bar">
                <div className="panel-heading">
                  <Phone size={20} className="panel-icon hot" />
                  <div>
                    <h2 className="panel-title">Emergency Contacts</h2>
                    <span className="panel-subtitle">Instant dial or transmit live SOS to verified guardians</span>
                  </div>
                </div>
                <button
                  className="add-contact-btn"
                  onClick={() => setShowAddContact(!showAddContact)}
                >
                  <UserPlus size={16} />
                  <span>{showAddContact ? "Close" : "Add Contact"}</span>
                </button>
              </div>

              {/* Add Contact Form */}
              {showAddContact && (
                <form onSubmit={addContact} className="add-contact-form">
                  <h3 className="form-title">Add Trusted Emergency Contact</h3>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Contact Name (e.g. Dad, Doctor)"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g. +91 98765 43210)"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-bottom-row">
                    <select
                      value={newContact.relation}
                      onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                    >
                      <option value="Family">Family</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Friend">Friend</option>
                      <option value="Neighbor">Neighbor</option>
                      <option value="Doctor">Doctor</option>
                    </select>
                    <button type="submit" className="save-contact-btn">
                      Save Contact
                    </button>
                  </div>
                </form>
              )}

              {/* Contacts List */}
              <div className="contacts-list">
                {contacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-left">
                      <div
                        className="contact-avatar"
                        style={{
                          backgroundColor: `${contact.color || "#C2185B"}20`,
                          borderColor: contact.color || "#C2185B",
                          color: contact.color || "#FF80AB",
                        }}
                      >
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="contact-details">
                        <div className="contact-name-row">
                          <span className="contact-name">{contact.name}</span>
                          <span
                            className="relation-pill"
                            style={{
                              backgroundColor: `${contact.color || "#C2185B"}18`,
                              color: contact.color || "#FF80AB",
                              borderColor: `${contact.color || "#C2185B"}40`,
                            }}
                          >
                            {contact.relation}
                          </span>
                        </div>
                        <span className="contact-phone">{contact.phone}</span>
                      </div>
                    </div>

                    <div className="contact-actions">
                      <button
                        className="action-btn call-action"
                        title={`Call ${contact.name}`}
                        onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                      >
                        <Phone size={15} />
                        <span>Call</span>
                      </button>

                      <button
                        className="action-btn sms-action"
                        title={`Send SOS to ${contact.name}`}
                        onClick={() => shareViaSms(contact.phone)}
                      >
                        <MessageSquare size={15} />
                        <span>SOS SMS</span>
                      </button>

                      {!contact.isSystem && (
                        <button
                          className="delete-contact-btn"
                          title="Remove contact"
                          onClick={() => removeContact(contact.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: SHARE THE GPS ── */}
            <div className="gps-share-panel">
              <div className="panel-title-bar">
                <div className="panel-heading">
                  <Share2 size={20} className="panel-icon accent" />
                  <div>
                    <h2 className="panel-title">Share the GPS</h2>
                    <span className="panel-subtitle">Transmit live coordinates to emergency responders instantly</span>
                  </div>
                </div>
                <div className="gps-status-pill">
                  <span className="live-dot" />
                  GPS ACTIVE
                </div>
              </div>

              {/* Coordinates Preview Card */}
              <div className="coords-card">
                <div className="coords-header">
                  <div className="coords-label">
                    <Navigation size={15} className="spin-slow" />
                    <span>Live Satellite Telemetry</span>
                  </div>
                  {lastUpdated && <span className="sync-time">Synced {lastUpdated}</span>}
                </div>

                <div className="coords-values">
                  <div className="coord-box">
                    <span className="coord-dim">LATITUDE</span>
                    <span className="coord-num">{currentLat.toFixed(6)}° N</span>
                  </div>
                  <div className="coord-divider" />
                  <div className="coord-box">
                    <span className="coord-dim">LONGITUDE</span>
                    <span className="coord-num">{currentLng.toFixed(6)}° E</span>
                  </div>
                  <div className="coord-divider" />
                  <div className="coord-box">
                    <span className="coord-dim">PRECISION</span>
                    <span className="coord-num">{accuracy ? `±${accuracy}m` : "High"}</span>
                  </div>
                </div>

                <div className="address-snippet">
                  <MapPin size={16} className="pin-icon" />
                  <span className="address-text">{address}</span>
                </div>
              </div>

              {/* Formatted Message Box */}
              <div className="distress-preview-box">
                <div className="preview-label-row">
                  <span className="preview-label">PRE-COMPOSED DISTRESS MESSAGE</span>
                  <button className="copy-btn" onClick={copyFullMessage}>
                    {copiedMessage ? <Check size={14} color="#69F0AE" /> : <Copy size={14} />}
                    <span>{copiedMessage ? "Copied Message!" : "Copy Text"}</span>
                  </button>
                </div>
                <div className="message-content">
                  {distressMessage}
                </div>
              </div>

              {/* Rapid Action Buttons */}
              <div className="share-actions-grid">
                <button className="share-tile whatsapp" onClick={shareViaWhatsApp}>
                  <Send size={18} />
                  <div>
                    <strong>Share on WhatsApp</strong>
                    <span>Broadcast to family groups</span>
                  </div>
                </button>

                <button className="share-tile sms" onClick={() => shareViaSms()}>
                  <MessageSquare size={18} />
                  <div>
                    <strong>Send via SMS</strong>
                    <span>Works without internet</span>
                  </div>
                </button>

                <button className="share-tile link" onClick={copyGpsLink}>
                  {copiedLink ? <Check size={18} color="#69F0AE" /> : <Copy size={18} />}
                  <div>
                    <strong>{copiedLink ? "Link Copied!" : "Copy Map Link"}</strong>
                    <span>Google Maps URL</span>
                  </div>
                </button>

                <button className="share-tile native" onClick={handleNativeShare}>
                  <Share2 size={18} />
                  <div>
                    <strong>Share with Apps</strong>
                    <span>Telegram, Signal, Email</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            REAL-TIME LOCATION DISPLAY & MAP
        ══════════════════════════════════════════════════════════════════ */}
        <section className="sos-section section-three">
          <div className="location-panel">
            <div className="location-top-bar">
              <div className="location-info">
                <div className="location-title-row">
                  <MapPin size={22} className="hot-pin" />
                  <h2 className="location-title">Your Current Location</h2>
                </div>
                <p className="location-address-full">{address}</p>
              </div>

              <div className="location-tools">
                <button
                  className="tool-btn"
                  onClick={fetchLocation}
                  disabled={locLoading}
                  title="Refresh GPS Signal"
                >
                  <RefreshCw size={16} className={locLoading ? "spin-icon" : ""} />
                  <span>{locLoading ? "Locking GPS..." : "Refresh Location"}</span>
                </button>

                <button
                  className="tool-btn highlight"
                  onClick={() => window.open(mapsUrl, "_blank")}
                  title="Open in Google Maps"
                >
                  <ExternalLink size={16} />
                  <span>Open in Google Maps</span>
                </button>
              </div>
            </div>

            {locError && (
              <div className="location-warning-banner">
                <AlertTriangle size={18} />
                <span>{locError}</span>
              </div>
            )}

            {/* Interactive Leaflet Map Container */}
            <div className="interactive-map-wrapper">
              {coords ? (
                <MapContainer
                  center={coords}
                  zoom={16}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", borderRadius: "16px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
                  />
                  <MapRecenter coords={coords} />

                  {/* Pulsing Beacon Marker on User's Location */}
                  <Marker position={coords} icon={userPulsingIcon}>
                    <Popup>
                      <div className="map-popup">
                        <strong>📍 YOU ARE HERE</strong>
                        <p>{address}</p>
                        <span>Coordinates: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Accuracy Radius Circle */}
                  <Circle
                    center={coords}
                    radius={accuracy || 80}
                    pathOptions={{
                      color: "#FF4D8D",
                      fillColor: "#FF4D8D",
                      fillOpacity: 0.15,
                      weight: 2,
                    }}
                  />
                </MapContainer>
              ) : (
                <div className="map-loading-placeholder">
                  <Compass size={42} className="spin-slow" />
                  <span>Acquiring satellite lock for current coordinates...</span>
                </div>
              )}

              {/* Map floating telemetry badge */}
              <div className="map-floating-pill">
                <span className="live-dot" />
                <span>Live Satellite Beacon • {coords ? `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` : "Acquiring..."}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Custom Theme CSS ── */}
      <style>{`
        .sos-page {
          min-height: 100vh;
          background: #0F0A14;
          color: #FCE4EC;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-bottom: 80px;
          position: relative;
        }

        .sos-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
        }

        /* ── Emergency Flashing Banner ── */
        .emergency-flashing-banner {
          position: sticky;
          top: 80px;
          z-index: 999;
          background: linear-gradient(90deg, #D50000, #C2185B, #D50000);
          background-size: 200% 200%;
          animation: bannerGlow 2s ease infinite;
          padding: 14px 24px;
          box-shadow: 0 4px 25px rgba(213, 0, 0, 0.6);
        }

        .banner-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .banner-content strong {
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          color: #FFFFFF;
        }

        .banner-content p {
          font-size: 0.86rem;
          opacity: 0.95;
          margin: 2px 0 0 0;
          color: #FFCDD2;
        }

        .banner-icon {
          animation: shake 0.6s ease-in-out infinite alternate;
          color: #FFF;
          flex-shrink: 0;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .banner-stop-siren-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFD54F;
          color: #000;
          font-weight: 800;
          padding: 8px 16px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.84rem;
          box-shadow: 0 0 12px rgba(255, 213, 79, 0.5);
        }

        .banner-stop-siren-btn:hover {
          background: #FFE082;
          transform: scale(1.05);
        }

        .cancel-alert-btn {
          background: #FFFFFF;
          color: #D50000;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.88rem;
        }

        .cancel-alert-btn:hover {
          background: #FFEBEE;
          transform: scale(1.04);
        }

        /* ── Header ── */
        .sos-header {
          text-align: center;
          margin-bottom: 36px;
          padding-top: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(194, 24, 91, 0.15);
          border: 1px solid rgba(255, 77, 141, 0.3);
          color: #FF80AB;
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00E676;
          box-shadow: 0 0 10px #00E676;
          animation: pulseDot 1.5s infinite;
        }

        .sos-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FFFFFF, #FCE4EC, #FF80AB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 12px 0;
        }

        .sos-subtitle {
          color: #F8BBD0;
          font-size: 1.05rem;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
          opacity: 0.9;
        }

        /* ── Section Structure ── */
        .sos-section {
          background: rgba(26, 18, 36, 0.75);
          border: 1px solid rgba(194, 24, 91, 0.25);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          transition: border-color 0.3s;
        }

        .sos-section:hover {
          border-color: rgba(255, 77, 141, 0.4);
        }

        /* ── Square SOS Button ── */
        .sos-button-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 0 10px 0;
          position: relative;
        }

        .sos-aura {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 36px;
          background: radial-gradient(circle, rgba(255, 77, 141, 0.18) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .aura-2 {
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(194, 24, 91, 0.12) 0%, transparent 75%);
        }

        .aura-active {
          animation: pulseAura 1.4s infinite ease-out;
        }

        .square-sos-button {
          position: relative;
          z-index: 1;
          width: 280px;
          height: 280px;
          aspect-ratio: 1 / 1;
          border-radius: 32px;
          background: linear-gradient(135deg, #880E4F 0%, #C2185B 45%, #E91E63 80%, #FF1744 100%);
          border: 4px solid rgba(255, 255, 255, 0.25);
          box-shadow: 
            0 0 0 10px rgba(194, 24, 91, 0.25),
            0 15px 45px rgba(194, 24, 91, 0.6),
            inset 0 4px 15px rgba(255, 255, 255, 0.3);
          cursor: pointer;
          padding: 16px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .square-sos-button:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 
            0 0 0 14px rgba(255, 77, 141, 0.35),
            0 20px 60px rgba(255, 23, 68, 0.8),
            inset 0 4px 20px rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .square-sos-button:active {
          transform: translateY(2px) scale(0.97);
        }

        .button-inner-border {
          width: 100%;
          height: 100%;
          border: 2px dashed rgba(255, 255, 255, 0.4);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 16px;
        }

        .idle-view, .active-view, .countdown-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .trouble-icon {
          color: #FFF;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
          animation: heartbeat 2s infinite ease-in-out;
        }

        .button-main-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.2;
        }

        .button-sub-text {
          font-size: 0.72rem;
          color: #FFCDD2;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .btn-countdown {
          background: linear-gradient(135deg, #E65100, #FF6D00) !important;
          animation: jitter 0.2s infinite;
        }

        .countdown-number {
          font-size: 4rem;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1;
        }

        .countdown-label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #FFE082;
          letter-spacing: 1px;
        }

        .countdown-sub {
          font-size: 0.75rem;
          color: #FFF;
          opacity: 0.8;
        }

        .btn-active {
          background: linear-gradient(135deg, #B71C1C, #D50000, #FF1744) !important;
          animation: pulseRedButton 1s infinite alternate;
        }

        .sos-controls-row {
          display: flex;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .control-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 99px;
          border: 1px solid rgba(194, 24, 91, 0.3);
          background: rgba(15, 10, 20, 0.6);
          color: #F8BBD0;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-pill:hover {
          background: rgba(194, 24, 91, 0.2);
          border-color: #FF4D8D;
          color: #FFF;
        }

        /* Dedicated Stop Siren Button Styling */
        .stop-siren-pill {
          background: rgba(239, 83, 80, 0.16) !important;
          border-color: rgba(239, 83, 80, 0.45) !important;
          color: #FF8A80 !important;
          font-weight: 700 !important;
        }

        .stop-siren-pill:hover {
          background: rgba(239, 83, 80, 0.35) !important;
          border-color: #FF5252 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 82, 82, 0.35);
        }

        .siren-active-pulse {
          background: linear-gradient(135deg, #D50000, #FF1744) !important;
          color: #FFFFFF !important;
          border-color: #FF8A80 !important;
          box-shadow: 0 0 20px rgba(255, 23, 68, 0.85) !important;
          animation: pulseRedButton 0.7s infinite alternate !important;
        }

        .dial-direct {
          background: rgba(0, 230, 118, 0.12);
          border-color: rgba(0, 230, 118, 0.3);
          color: #B9F6CA;
        }

        .dial-direct:hover {
          background: rgba(0, 230, 118, 0.22);
          border-color: #00E676;
          color: #FFF;
        }

        /* ── Contacts & GPS Two-Column Grid ── */
        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        @media (max-width: 900px) {
          .two-column-grid {
            grid-template-columns: 1fr;
          }
        }

        .contacts-panel, .gps-share-panel {
          background: rgba(15, 10, 20, 0.55);
          border: 1px solid rgba(194, 24, 91, 0.2);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .panel-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(194, 24, 91, 0.18);
        }

        .panel-heading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .panel-icon.hot {
          color: #FF4D8D;
        }

        .panel-icon.accent {
          color: #FF80AB;
        }

        .panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #FCE4EC;
          margin: 0;
        }

        .panel-subtitle {
          font-size: 0.78rem;
          color: #F8BBD0;
          opacity: 0.8;
        }

        .add-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(194, 24, 91, 0.2);
          border: 1px solid rgba(255, 77, 141, 0.35);
          color: #FF80AB;
          padding: 7px 14px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .add-contact-btn:hover {
          background: #C2185B;
          color: #FFF;
        }

        .add-contact-form {
          background: rgba(26, 18, 36, 0.9);
          border: 1px solid rgba(255, 77, 141, 0.3);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 18px;
        }

        .form-title {
          font-size: 0.88rem;
          color: #FCE4EC;
          margin-bottom: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }

        .form-grid input, .form-bottom-row select {
          background: #0F0A14;
          border: 1px solid rgba(194, 24, 91, 0.3);
          border-radius: 8px;
          color: #FCE4EC;
          padding: 8px 12px;
          font-size: 0.85rem;
          outline: none;
        }

        .form-grid input:focus, .form-bottom-row select:focus {
          border-color: #FF4D8D;
        }

        .form-bottom-row {
          display: flex;
          gap: 10px;
        }

        .save-contact-btn {
          flex: 1;
          background: linear-gradient(135deg, #C2185B, #FF4D8D);
          color: #FFF;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .contact-card {
          background: rgba(26, 18, 36, 0.65);
          border: 1px solid rgba(194, 24, 91, 0.2);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
        }

        .contact-card:hover {
          background: rgba(26, 18, 36, 0.95);
          border-color: rgba(255, 77, 141, 0.4);
          transform: translateY(-1px);
        }

        .contact-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-name {
          font-weight: 600;
          font-size: 0.92rem;
          color: #FCE4EC;
        }

        .relation-pill {
          font-size: 0.68rem;
          padding: 2px 7px;
          border-radius: 99px;
          border: 1px solid;
          font-weight: 600;
        }

        .contact-phone {
          font-size: 0.82rem;
          color: #F8BBD0;
          opacity: 0.85;
          letter-spacing: 0.3px;
        }

        .contact-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: 0.2s;
        }

        .call-action {
          background: rgba(0, 230, 118, 0.15);
          color: #B9F6CA;
          border: 1px solid rgba(0, 230, 118, 0.3);
        }

        .call-action:hover {
          background: #00E676;
          color: #000;
        }

        .sms-action {
          background: rgba(255, 77, 141, 0.15);
          color: #FF80AB;
          border: 1px solid rgba(255, 77, 141, 0.3);
        }

        .sms-action:hover {
          background: #FF4D8D;
          color: #FFF;
        }

        .delete-contact-btn {
          background: transparent;
          border: none;
          color: #EF9A9A;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
        }

        .delete-contact-btn:hover {
          background: rgba(239, 154, 154, 0.15);
          color: #FF5252;
        }

        /* ── Right Column: Share the GPS ── */
        .gps-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 230, 118, 0.12);
          border: 1px solid rgba(0, 230, 118, 0.3);
          color: #00E676;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: 0.8px;
        }

        .coords-card {
          background: rgba(26, 18, 36, 0.8);
          border: 1px solid rgba(194, 24, 91, 0.25);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .coords-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .coords-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #FF80AB;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .sync-time {
          font-size: 0.72rem;
          color: #F8BBD0;
          opacity: 0.7;
        }

        .coords-values {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(15, 10, 20, 0.7);
          border-radius: 10px;
          padding: 10px 8px;
          margin-bottom: 12px;
        }

        .coord-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .coord-dim {
          font-size: 0.65rem;
          font-weight: 700;
          color: #F8BBD0;
          opacity: 0.7;
          letter-spacing: 0.5px;
        }

        .coord-num {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          font-family: monospace;
        }

        .coord-divider {
          width: 1px;
          height: 28px;
          background: rgba(194, 24, 91, 0.2);
        }

        .address-snippet {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.8rem;
          color: #FCE4EC;
          opacity: 0.9;
          line-height: 1.4;
        }

        .pin-icon {
          color: #FF4D8D;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .distress-preview-box {
          background: rgba(26, 18, 36, 0.85);
          border: 1px solid rgba(194, 24, 91, 0.2);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 18px;
        }

        .preview-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .preview-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #FF80AB;
          letter-spacing: 0.6px;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: #FF80AB;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 600;
        }

        .copy-btn:hover {
          color: #FFFFFF;
        }

        .message-content {
          font-size: 0.82rem;
          line-height: 1.45;
          color: #FCE4EC;
          background: rgba(15, 10, 20, 0.7);
          border-left: 3px solid #FF4D8D;
          padding: 8px 12px;
          border-radius: 0 8px 8px 0;
          word-break: break-word;
        }

        .share-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .share-tile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .share-tile strong {
          display: block;
          font-size: 0.85rem;
        }

        .share-tile span {
          display: block;
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .share-tile.whatsapp {
          background: rgba(37, 211, 102, 0.12);
          border-color: rgba(37, 211, 102, 0.3);
          color: #A7F3D0;
        }
        .share-tile.whatsapp:hover {
          background: #25D366;
          color: #000;
        }

        .share-tile.sms {
          background: rgba(255, 77, 141, 0.12);
          border-color: rgba(255, 77, 141, 0.3);
          color: #FF80AB;
        }
        .share-tile.sms:hover {
          background: #FF4D8D;
          color: #FFF;
        }

        .share-tile.link {
          background: rgba(129, 140, 248, 0.12);
          border-color: rgba(129, 140, 248, 0.3);
          color: #C7D2FE;
        }
        .share-tile.link:hover {
          background: #6366F1;
          color: #FFF;
        }

        .share-tile.native {
          background: rgba(255, 183, 77, 0.12);
          border-color: rgba(255, 183, 77, 0.3);
          color: #FFE082;
        }
        .share-tile.native:hover {
          background: #FFB74D;
          color: #000;
        }

        /* ── Location Display & Map ── */
        .location-panel {
          background: rgba(15, 10, 20, 0.6);
          border: 1px solid rgba(194, 24, 91, 0.2);
          border-radius: 18px;
          padding: 24px;
        }

        .location-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .location-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .hot-pin {
          color: #FF4D8D;
        }

        .location-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: #FCE4EC;
          margin: 0;
        }

        .location-address-full {
          color: #F8BBD0;
          font-size: 0.92rem;
          line-height: 1.4;
          max-width: 650px;
          margin: 0;
        }

        .location-tools {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(194, 24, 91, 0.15);
          border: 1px solid rgba(255, 77, 141, 0.3);
          color: #FF80AB;
          padding: 9px 16px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .tool-btn:hover {
          background: #C2185B;
          color: #FFFFFF;
        }

        .tool-btn.highlight {
          background: linear-gradient(135deg, #C2185B, #FF4D8D);
          color: #FFFFFF;
          border: none;
        }

        .tool-btn.highlight:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 77, 141, 0.4);
        }

        .location-warning-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 152, 0, 0.15);
          border: 1px solid rgba(255, 152, 0, 0.3);
          color: #FFE082;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .interactive-map-wrapper {
          position: relative;
          height: 420px;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(194, 24, 91, 0.3);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        }

        .map-floating-pill {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 500;
          background: rgba(15, 10, 20, 0.88);
          border: 1px solid rgba(255, 77, 141, 0.35);
          backdrop-filter: blur(8px);
          padding: 7px 14px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #FCE4EC;
        }

        .map-loading-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(15, 10, 20, 0.95);
          color: #FF80AB;
          font-size: 0.95rem;
        }

        .map-popup {
          font-family: 'DM Sans', sans-serif;
          color: #212121;
        }

        .map-popup strong {
          color: #C2185B;
          font-size: 0.9rem;
        }

        .map-popup p {
          font-size: 0.8rem;
          margin: 4px 0;
        }

        .map-popup span {
          font-size: 0.72rem;
          color: #616161;
        }

        /* ── Keyframe Animations ── */
        @keyframes pulseAura {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 0.4; }
        }

        @keyframes pulseRedButton {
          from {
            box-shadow: 
              0 0 0 8px rgba(213, 0, 0, 0.4),
              0 15px 40px rgba(213, 0, 0, 0.8);
          }
          to {
            box-shadow: 
              0 0 0 18px rgba(255, 23, 68, 0.65),
              0 22px 65px rgba(255, 23, 68, 1);
          }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        @keyframes pulseSosBeacon {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes shake {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(8deg); }
        }

        @keyframes jitter {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          50% { transform: translate(-1px, -2px) rotate(-1deg); }
          100% { transform: translate(-1px, 1px) rotate(1deg); }
        }

        @keyframes bannerGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
