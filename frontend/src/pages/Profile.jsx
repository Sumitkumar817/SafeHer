import { useState } from "react";

/* ─────────────────────────────────────────────
   SafeHer – The Guiding Light
   Profile Page  |  Dark Premium Magenta Theme
───────────────────────────────────────────── */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #0F0A14;
    --card: #1A1224;
    --card-hover: #1F1530;
    --primary: #C2185B;
    --hot: #FF4D8D;
    --accent: #FF80AB;
    --text: #FCE4EC;
    --text-soft: #F8BBD0;
    --text-muted: #C994B0;
    --border: rgba(194,24,91,0.18);
    --glow: rgba(255,77,141,0.25);
    --glow-strong: rgba(255,77,141,0.45);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dt-page {
    min-height: 100vh;
    background-color: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Starfield ── */
  .dt-stars {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(1px 1px at 10% 15%, rgba(255,128,171,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 22% 40%, rgba(255,77,141,0.5) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 35% 7%, rgba(252,228,236,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 48% 25%, rgba(255,128,171,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 55%, rgba(255,77,141,0.6) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 72% 12%, rgba(252,228,236,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 35%, rgba(255,128,171,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 92% 60%, rgba(255,77,141,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 5% 70%, rgba(252,228,236,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 18% 85%, rgba(255,128,171,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 92%, rgba(255,77,141,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 78%, rgba(252,228,236,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 68% 88%, rgba(255,128,171,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 78% 72%, rgba(255,77,141,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 90%, rgba(252,228,236,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 42% 62%, rgba(255,128,171,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 15% 50%, rgba(255,77,141,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 95% 20%, rgba(252,228,236,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 38% 48%, rgba(255,128,171,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 62% 30%, rgba(255,77,141,0.5) 0%, transparent 100%);
  }

  .dt-stars::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(1px 1px at 7% 28%, rgba(255,128,171,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 65%, rgba(252,228,236,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 44% 82%, rgba(255,77,141,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 58% 14%, rgba(255,128,171,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 74% 45%, rgba(252,228,236,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 76%, rgba(255,77,141,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 3% 95%, rgba(255,128,171,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 50% 50%, rgba(252,228,236,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 33% 33%, rgba(255,77,141,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 8%, rgba(255,128,171,0.5) 0%, transparent 100%);
    animation: twinkle 8s ease-in-out infinite alternate;
  }

  @keyframes twinkle {
    0%   { opacity: 0.6; }
    50%  { opacity: 1; }
    100% { opacity: 0.4; }
  }

  /* ── Ambient glow orbs ── */
  .dt-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
    opacity: 0.12;
  }
  .dt-orb-1 { width: 400px; height: 400px; background: #C2185B; top: -100px; right: -80px; }
  .dt-orb-2 { width: 300px; height: 300px; background: #FF4D8D; bottom: 10%; left: -60px; }
  .dt-orb-3 { width: 200px; height: 200px; background: #FF80AB; top: 40%; right: 5%; opacity: 0.07; }

  /* ── Layout ── */
  .dt-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px 60px;
  }

  /* ── Nav bar ── */
  .dt-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    position: relative;
    z-index: 10;
    border-bottom: 1px solid var(--border);
    background: rgba(15,10,20,0.7);
    backdrop-filter: blur(16px);
  }
  .dt-nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 600;
    background: linear-gradient(135deg, #FF4D8D, #FF80AB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .dt-nav-star {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #C2185B, #FF4D8D);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    box-shadow: 0 0 12px var(--glow);
    flex-shrink: 0;
  }
  .dt-nav-links {
    display: flex; gap: 6px;
    list-style: none;
  }
  .dt-nav-links li a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.82rem;
    padding: 6px 14px;
    border-radius: 20px;
    transition: all 0.2s;
    font-weight: 500;
  }
  .dt-nav-links li a:hover,
  .dt-nav-links li a.active {
    color: var(--accent);
    background: rgba(194,24,91,0.12);
  }

  /* ── Cards ── */
  .dt-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    backdrop-filter: blur(20px);
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  }
  .dt-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(194,24,91,0.15);
    border-color: rgba(255,77,141,0.3);
  }

  /* ── Profile Header ── */
  .dt-header-card {
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .dt-header-banner {
    height: 130px;
    background: linear-gradient(135deg, #1A0A2E 0%, #2D0A2E 40%, #1A0A1A 100%);
    position: relative;
  }
  .dt-header-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(194,24,91,0.3), rgba(255,77,141,0.2), rgba(255,128,171,0.1));
  }
  .dt-header-banner::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to top, var(--card), transparent);
  }
  .dt-header-body {
    padding: 0 32px 28px;
    display: flex;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
  }
  .dt-avatar-wrap {
    position: relative;
    margin-top: -52px;
    flex-shrink: 0;
  }
  .dt-avatar {
    width: 100px; height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #C2185B, #FF4D8D, #FF80AB);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #fff;
    border: 3px solid var(--card);
    box-shadow: 0 0 0 2px rgba(255,77,141,0.4), 0 0 24px rgba(255,77,141,0.3);
  }
  .dt-online-dot {
    position: absolute;
    bottom: 5px; right: 5px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #4CAF50;
    border: 2px solid var(--card);
    box-shadow: 0 0 8px rgba(76,175,80,0.6);
  }
  .dt-header-info {
    flex: 1;
    min-width: 200px;
    padding-top: 12px;
  }
  .dt-user-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.1;
  }
  .dt-user-handle {
    font-size: 0.82rem;
    color: var(--accent);
    margin: 3px 0 8px;
    font-weight: 500;
  }
  .dt-meta-row {
    display: flex; flex-wrap: wrap; gap: 14px;
  }
  .dt-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; color: var(--text-muted);
  }
  .dt-meta-icon {
    width: 18px; height: 18px;
    background: rgba(194,24,91,0.18);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
  }
  .dt-header-actions {
    display: flex; gap: 10px; align-items: center;
    flex-wrap: wrap;
    padding-top: 16px;
    margin-left: auto;
  }

  /* ── Buttons ── */
  .dt-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 20px;
    border-radius: 30px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    text-decoration: none;
    white-space: nowrap;
  }
  .dt-btn-primary {
    background: linear-gradient(135deg, #C2185B, #FF4D8D);
    color: #fff;
    box-shadow: 0 4px 18px rgba(194,24,91,0.4);
  }
  .dt-btn-primary:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 28px rgba(255,77,141,0.55);
  }
  .dt-btn-ghost {
    background: transparent;
    color: var(--text-soft);
    border: 1px solid var(--border);
  }
  .dt-btn-ghost:hover {
    border-color: rgba(255,77,141,0.5);
    color: var(--accent);
    background: rgba(194,24,91,0.08);
    transform: translateY(-1px);
  }
  .dt-btn-danger {
    background: rgba(211,47,47,0.15);
    color: #EF9A9A;
    border: 1px solid rgba(211,47,47,0.3);
  }
  .dt-btn-danger:hover {
    background: rgba(211,47,47,0.25);
    transform: translateY(-1px);
  }
  .dt-btn-outline-accent {
    background: rgba(255,128,171,0.08);
    color: var(--accent);
    border: 1px solid rgba(255,128,171,0.3);
  }
  .dt-btn-outline-accent:hover {
    background: rgba(255,128,171,0.16);
    box-shadow: 0 0 14px rgba(255,128,171,0.2);
    transform: translateY(-1px);
  }

  /* ── Grid layout ── */
  .dt-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .dt-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  .dt-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  /* ── Section header ── */
  .dt-section-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .dt-section-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(194,24,91,0.3), rgba(255,77,141,0.15));
    border: 1px solid rgba(255,77,141,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .dt-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text);
  }
  .dt-section-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 1px;
  }
  .dt-section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
  }

  /* ── Safety Card ── */
  .dt-safety-card { padding: 28px; }
  .dt-info-row {
    display: flex; align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(194,24,91,0.1);
  }
  .dt-info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .dt-info-row:first-child { padding-top: 0; }
  .dt-info-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(194,24,91,0.2), rgba(255,77,141,0.1));
    border: 1px solid rgba(255,77,141,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .dt-info-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
  .dt-info-value {
    font-size: 0.88rem;
    color: var(--text);
    font-weight: 500;
  }
  .dt-info-value.accent { color: var(--accent); }
  .dt-sos-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(76,175,80,0.12);
    border: 1px solid rgba(76,175,80,0.3);
    color: #81C784;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .dt-sos-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4CAF50;
    animation: pulse-green 2s ease-in-out infinite;
  }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0.5); }
    50% { box-shadow: 0 0 0 5px rgba(76,175,80,0); }
  }

  /* ── Activity Card ── */
  .dt-activity-card { padding: 28px; }
  .dt-activity-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(194,24,91,0.08);
  }
  .dt-activity-item:last-child { border-bottom: none; }
  .dt-activity-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dt-activity-dot.pink { background: var(--hot); box-shadow: 0 0 8px rgba(255,77,141,0.5); }
  .dt-activity-dot.amber { background: #FFB300; box-shadow: 0 0 8px rgba(255,179,0,0.5); }
  .dt-activity-dot.green { background: #4CAF50; box-shadow: 0 0 8px rgba(76,175,80,0.5); }
  .dt-activity-dot.blue  { background: #42A5F5; box-shadow: 0 0 8px rgba(66,165,245,0.5); }
  .dt-activity-text { flex: 1; }
  .dt-activity-title { font-size: 0.84rem; color: var(--text); font-weight: 500; }
  .dt-activity-time  { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
  .dt-activity-tag {
    font-size: 0.7rem;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 600;
  }
  .dt-tag-pink   { background: rgba(255,77,141,0.12); color: var(--hot); border: 1px solid rgba(255,77,141,0.2); }
  .dt-tag-amber  { background: rgba(255,179,0,0.1);   color: #FFB300;   border: 1px solid rgba(255,179,0,0.2); }
  .dt-tag-green  { background: rgba(76,175,80,0.1);   color: #81C784;   border: 1px solid rgba(76,175,80,0.2); }
  .dt-tag-blue   { background: rgba(66,165,245,0.1);  color: #90CAF9;   border: 1px solid rgba(66,165,245,0.2); }

  /* Safety Score */
  .dt-score-wrap {
    margin-top: 20px;
    padding: 18px;
    border-radius: 14px;
    background: rgba(194,24,91,0.07);
    border: 1px solid rgba(194,24,91,0.15);
  }
  .dt-score-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .dt-score-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .dt-score-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 700;
    background: linear-gradient(135deg, #FF4D8D, #FF80AB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .dt-progress-bg {
    height: 8px; border-radius: 8px;
    background: rgba(255,255,255,0.07);
    overflow: hidden;
  }
  .dt-progress-fill {
    height: 100%; border-radius: 8px;
    background: linear-gradient(90deg, #C2185B, #FF4D8D, #FF80AB);
    box-shadow: 0 0 12px rgba(255,77,141,0.5);
    transition: width 1s ease;
  }
  .dt-score-sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; }

  /* ── Quick Actions ── */
  .dt-actions-card { padding: 28px; }
  .dt-actions-grid {
    display: flex; flex-direction: column; gap: 10px;
  }
  .dt-action-item {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px;
    border-radius: 13px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.22s;
    text-decoration: none;
    background: rgba(255,255,255,0.02);
  }
  .dt-action-item:hover {
    background: rgba(194,24,91,0.08);
    border-color: rgba(255,77,141,0.2);
    transform: translateX(4px);
  }
  .dt-action-item.danger:hover {
    background: rgba(211,47,47,0.1);
    border-color: rgba(211,47,47,0.25);
  }
  .dt-action-icon {
    width: 38px; height: 38px; flex-shrink: 0;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .dt-action-icon.pink-icon {
    background: linear-gradient(135deg, rgba(194,24,91,0.3), rgba(255,77,141,0.15));
    border: 1px solid rgba(255,77,141,0.2);
  }
  .dt-action-icon.amber-icon {
    background: rgba(255,179,0,0.1);
    border: 1px solid rgba(255,179,0,0.2);
  }
  .dt-action-icon.blue-icon {
    background: rgba(66,165,245,0.1);
    border: 1px solid rgba(66,165,245,0.2);
  }
  .dt-action-icon.teal-icon {
    background: rgba(38,166,154,0.1);
    border: 1px solid rgba(38,166,154,0.2);
  }
  .dt-action-icon.red-icon {
    background: rgba(211,47,47,0.12);
    border: 1px solid rgba(211,47,47,0.2);
  }
  .dt-action-text { flex: 1; }
  .dt-action-label { font-size: 0.87rem; font-weight: 500; color: var(--text); }
  .dt-action-desc  { font-size: 0.72rem; color: var(--text-muted); margin-top: 1px; }
  .dt-action-arrow { font-size: 12px; color: var(--text-muted); }

  /* ── Stats ── */
  .dt-stat-card {
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: default;
  }
  .dt-stat-top {
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .dt-stat-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .dt-stat-trend {
    font-size: 0.7rem; padding: 3px 8px; border-radius: 10px; font-weight: 600;
  }
  .dt-trend-up   { background: rgba(76,175,80,0.12); color: #81C784; }
  .dt-trend-down { background: rgba(255,82,82,0.12); color: #FF8A80; }
  .dt-trend-neu  { background: rgba(255,179,0,0.1);  color: #FFD54F; }
  .dt-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    background: linear-gradient(135deg, var(--text), var(--text-soft));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .dt-stat-label { font-size: 0.76rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
  .dt-stat-sub   { font-size: 0.7rem; color: var(--text-muted); }

  /* ── Dividers / spacing ── */
  .dt-mb { margin-bottom: 20px; }
  .dt-mb-s { margin-bottom: 14px; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .dt-grid-4 { grid-template-columns: 1fr 1fr; }
    .dt-grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 620px) {
    .dt-grid-4 { grid-template-columns: 1fr 1fr; }
    .dt-grid-3 { grid-template-columns: 1fr 1fr; }
    .dt-nav-links { display: none; }
    .dt-header-body { padding: 0 20px 24px; flex-direction: column; align-items: center; text-align: center; }
    .dt-header-info { padding-top: 0; }
    .dt-meta-row { justify-content: center; }
    .dt-header-actions { justify-content: center; margin-left: 0; }
    .dt-content { padding: 20px 14px 50px; }
    .dt-safety-card, .dt-activity-card, .dt-actions-card { padding: 20px; }
    .dt-user-name { font-size: 1.5rem; }
  }
  @media (max-width: 400px) {
    .dt-grid-4, .dt-grid-3 { grid-template-columns: 1fr; }
  }
`;

const ICON = {
  star:    "✦",
  edit:    "✏",
  phone:   "📞",
  email:   "✉",
  id:      "🔑",
  shield:  "🛡",
  loc:     "📍",
  blood:   "🩸",
  guardian:"👤",
  sos:     "🚨",
  clock:   "🕐",
  report:  "📋",
  ride:    "🚗",
  contrib: "💝",
  lock:    "🔒",
  privacy: "👁",
  logout:  "🚪",
  contact: "📱",
  alert:   "⚠",
  check:   "✓",
  arrow:   "→",
  up:      "↑",
  down:    "↓",
  safe:    "🌟",
};

export default function ProfilePage() {
const [activeTab, setActiveTab] = useState("overview");
  const stats = [
    { icon: "📋", label: "Total Reports", num: "24",  sub: "Last report: 2d ago",  trend: "+3",  trendType: "up",   iconBg: "linear-gradient(135deg,rgba(194,24,91,0.3),rgba(255,77,141,0.15))", iconBorder: "rgba(255,77,141,0.25)" },
    { icon: "🚨", label: "SOS Alerts",   num: "3",   sub: "All resolved safely",  trend: "-1",  trendType: "down", iconBg: "linear-gradient(135deg,rgba(255,82,82,0.2),rgba(255,82,82,0.08))",  iconBorder: "rgba(255,82,82,0.25)"  },
    { icon: "🚗", label: "Safe Rides",   num: "58",  sub: "5 this month",         trend: "+5",  trendType: "up",   iconBg: "linear-gradient(135deg,rgba(66,165,245,0.2),rgba(66,165,245,0.08))", iconBorder: "rgba(66,165,245,0.25)"  },
    { icon: "💝", label: "Contributions",num: "12",  sub: "Community helper",     trend: "→",   trendType: "neu",  iconBg: "linear-gradient(135deg,rgba(255,128,171,0.2),rgba(194,24,91,0.1))",  iconBorder: "rgba(255,128,171,0.3)" },
  ];

  const activities = [
    { dot: "pink",  title: "SOS Alert Triggered",    time: "Today, 09:14 AM",     tag: "SOS",     tagClass: "dt-tag-pink"  },
    { dot: "green", title: "Safe Ride Completed",     time: "Yesterday, 7:32 PM",  tag: "Safe",    tagClass: "dt-tag-green" },
    { dot: "amber", title: "Unsafe Area Reported",    time: "Apr 3, 2026 11:05 AM",tag: "Report",  tagClass: "dt-tag-amber" },
    { dot: "blue",  title: "Guardian Check-in Sent",  time: "Apr 2, 2026 8:00 AM", tag: "Check-in",tagClass: "dt-tag-blue"  },
    { dot: "green", title: "Profile Updated",         time: "Mar 30, 2026",        tag: "Profile", tagClass: "dt-tag-green" },
  ];

  const actions = [
    { icon: "✏", iconClass: "pink-icon",  label: "Edit Profile",        desc: "Update your personal information",   cls: "" },
    { icon: "🔒", iconClass: "amber-icon", label: "Change Password",     desc: "Secure your account credentials",    cls: "" },
    { icon: "📱", iconClass: "blue-icon",  label: "Emergency Contacts",  desc: "Manage your trusted contacts list",   cls: "" },
    { icon: "👁", iconClass: "teal-icon",  label: "Privacy Settings",    desc: "Control your data & visibility",     cls: "" },
    { icon: "🚪", iconClass: "red-icon",   label: "Logout",              desc: "Sign out from your account",         cls: "danger" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="dt-page">
        {/* Stars & orbs */}
        <div className="dt-stars" aria-hidden="true" />
        <div className="dt-orb dt-orb-1" aria-hidden="true" />
        <div className="dt-orb dt-orb-2" aria-hidden="true" />
        <div className="dt-orb dt-orb-3" aria-hidden="true" />

        {/* ── Nav ── */}
        <nav className="dt-nav">
          <div className="dt-nav-brand">
            <div className="dt-nav-star">✦</div>
            SafeHer
          </div>
          <ul className="dt-nav-links">
            {["Dashboard","Map","Reports","Alerts","Profile"].map(l => (
              <li key={l}>
                <a href="#" className={l === "Profile" ? "active" : ""} onClick={e => e.preventDefault()}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="dt-btn dt-btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.78rem" }}
          >
            🚨 SOS
          </button>
        </nav>

        {/* ── Content ── */}
        <main className="dt-content">

          {/* ── Profile Header ── */}
          <div className="dt-card dt-header-card dt-mb">
            <div className="dt-header-banner" />
            <div className="dt-header-body">
              <div className="dt-avatar-wrap">
                <div className="dt-avatar">P</div>
                <div className="dt-online-dot" title="Online" />
              </div>
              <div className="dt-header-info">
                <div className="dt-user-name">Priya Sharma</div>
                <div className="dt-user-handle">@priya_safeher · Member since Jan 2025</div>
                <div className="dt-meta-row">
                  <div className="dt-meta-item">
                    <div className="dt-meta-icon">✉</div>
                    priya.sharma@gmail.com
                  </div>
                  <div className="dt-meta-item">
                    <div className="dt-meta-icon">📞</div>
                    +91 98765 43210
                  </div>
                  <div className="dt-meta-item">
                    <div className="dt-meta-icon">🔑</div>
                    ID: DT-2025-04782
                  </div>
                </div>
              </div>
              <div className="dt-header-actions">
                <button className="dt-btn dt-btn-primary">✏ Edit Profile</button>
                <button className="dt-btn dt-btn-ghost">⚙ Settings</button>
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="dt-grid-4 dt-mb">
            {stats.map((s, i) => (
              <div key={i} className="dt-card dt-stat-card">
                <div className="dt-stat-top">
                  <div className="dt-stat-icon" style={{ background: s.iconBg, border: `1px solid ${s.iconBorder}` }}>
                    {s.icon}
                  </div>
                  <span className={`dt-stat-trend ${s.trendType === "up" ? "dt-trend-up" : s.trendType === "down" ? "dt-trend-down" : "dt-trend-neu"}`}>
                    {s.trend}
                  </span>
                </div>
                <div className="dt-stat-num">{s.num}</div>
                <div className="dt-stat-label">{s.label}</div>
                <div className="dt-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Safety + Activity ── */}
          <div className="dt-grid-2 dt-mb">
            {/* Safety Information */}
            <div className="dt-card dt-safety-card">
              <div className="dt-section-header">
                <div className="dt-section-icon">🛡</div>
                <div>
                  <div className="dt-section-title">Safety Information</div>
                  <div className="dt-section-sub">Emergency & guardian details</div>
                </div>
                <div className="dt-section-line" />
              </div>

              <div className="dt-info-row">
                <div className="dt-info-icon">🚨</div>
                <div>
                  <div className="dt-info-label">Emergency Contact</div>
                  <div className="dt-info-value">Meena Sharma (Mother)</div>
                  <div className="dt-info-value" style={{ fontSize: "0.78rem", color: "var(--accent)" }}>+91 91234 56789</div>
                </div>
              </div>
              <div className="dt-info-row">
                <div className="dt-info-icon">👤</div>
                <div>
                  <div className="dt-info-label">Trusted Guardian</div>
                  <div className="dt-info-value">Rohan Sharma (Brother)</div>
                  <div className="dt-info-value" style={{ fontSize: "0.78rem", color: "var(--accent)" }}>+91 98712 34567 · Verified ✓</div>
                </div>
              </div>
              <div className="dt-info-row">
                <div className="dt-info-icon">🩸</div>
                <div>
                  <div className="dt-info-label">Blood Group</div>
                  <div className="dt-info-value accent">B+ (Positive)</div>
                </div>
              </div>
              <div className="dt-info-row">
                <div className="dt-info-icon">📍</div>
                <div>
                  <div className="dt-info-label">Location Sharing</div>
                  <div className="dt-info-value" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span className="dt-sos-badge" style={{ background: "rgba(66,165,245,0.1)", borderColor: "rgba(66,165,245,0.3)", color: "#90CAF9" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#42A5F5", display: "inline-block", boxShadow: "0 0 8px rgba(66,165,245,0.6)" }} />
                      Active – Guardian only
                    </span>
                  </div>
                </div>
              </div>
              <div className="dt-info-row">
                <div className="dt-info-icon">🚨</div>
                <div>
                  <div className="dt-info-label">SOS Status</div>
                  <div className="dt-sos-badge" style={{ marginTop: 5 }}>
                    <span className="dt-sos-dot" />
                    System Active & Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="dt-card dt-activity-card">
              <div className="dt-section-header">
                <div className="dt-section-icon">🕐</div>
                <div>
                  <div className="dt-section-title">Recent Activity</div>
                  <div className="dt-section-sub">Your safety timeline</div>
                </div>
                <div className="dt-section-line" />
              </div>

              {activities.map((a, i) => (
                <div key={i} className="dt-activity-item">
                  <div className={`dt-activity-dot ${a.dot}`} />
                  <div className="dt-activity-text">
                    <div className="dt-activity-title">{a.title}</div>
                    <div className="dt-activity-time">{a.time}</div>
                  </div>
                  <span className={`dt-activity-tag ${a.tagClass}`}>{a.tag}</span>
                </div>
              ))}

              {/* Safety Score */}
              <div className="dt-score-wrap">
                <div className="dt-score-header">
                  <span className="dt-score-label">🌟 Safety Score</span>
                  <span className="dt-score-value">87 / 100</span>
                </div>
                <div className="dt-progress-bg">
                  <div className="dt-progress-fill" style={{ width: "87%" }} />
                </div>
                <div className="dt-score-sub">Excellent! Last active: Today 09:20 AM</div>
              </div>
            </div>
          </div>

          {/* ── Quick Actions + Engagement ── */}
          <div className="dt-grid-2 dt-mb">
            {/* Quick Actions */}
            <div className="dt-card dt-actions-card">
              <div className="dt-section-header">
                <div className="dt-section-icon">⚡</div>
                <div>
                  <div className="dt-section-title">Quick Actions</div>
                  <div className="dt-section-sub">Manage your account</div>
                </div>
                <div className="dt-section-line" />
              </div>
              <div className="dt-actions-grid">
                {actions.map((a, i) => (
                  <div key={i} className={`dt-action-item ${a.cls}`}>
                    <div className={`dt-action-icon ${a.iconClass}`}>{a.icon}</div>
                    <div className="dt-action-text">
                      <div className="dt-action-label">{a.label}</div>
                      <div className="dt-action-desc">{a.desc}</div>
                    </div>
                    <span className="dt-action-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* App engagement & tips */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* SOS Quick Test */}
              <div className="dt-card" style={{ padding: "22px", background: "linear-gradient(135deg, rgba(194,24,91,0.18), rgba(255,77,141,0.08))", borderColor: "rgba(255,77,141,0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div className="dt-section-icon" style={{ background: "linear-gradient(135deg,rgba(255,77,141,0.35),rgba(194,24,91,0.2))", borderColor: "rgba(255,77,141,0.4)" }}>🚨</div>
                  <div>
                    <div className="dt-section-title">SOS Quick Panel</div>
                    <div className="dt-section-sub">Trigger an alert instantly</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                  Your SOS is configured and ready. In an emergency, your guardian and emergency contacts will be notified with your real-time location.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="dt-btn dt-btn-primary">🚨 Trigger SOS</button>
                  <button className="dt-btn dt-btn-ghost" style={{ fontSize: "0.78rem" }}>Test Alert</button>
                </div>
              </div>

              {/* Safety tips */}
              <div className="dt-card" style={{ padding: "22px", flex: 1 }}>
                <div className="dt-section-header dt-mb-s">
                  <div className="dt-section-icon">💡</div>
                  <div>
                    <div className="dt-section-title">Safety Tips</div>
                    <div className="dt-section-sub">Personalised for you</div>
                  </div>
                </div>
                {[
                  { icon: "✓", tip: "Keep your guardian list updated monthly", color: "#81C784" },
                  { icon: "✓", tip: "Enable background location for faster SOS", color: "#81C784" },
                  { icon: "⚠", tip: "3 unsafe zones flagged near your route",   color: "#FFB300" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: i < 2 ? "1px solid rgba(194,24,91,0.08)" : "none" }}>
                    <span style={{ color: t.color, fontSize: "0.85rem", fontWeight: 700, flexShrink: 0 }}>{t.icon}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-soft)", lineHeight: 1.5 }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              background: "linear-gradient(135deg, #FF4D8D, #FF80AB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 4
            }}>
              ✦ SafeHer – The Guiding Light ✦
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              Your safety is our mission · © 2026 SafeHer
            </div>
          </div>

        </main>
      </div>
    </>
  );
}