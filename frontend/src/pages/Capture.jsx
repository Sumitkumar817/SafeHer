import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Global CSS injected once into <head>
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&family=Orbitron:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow-x: hidden; }

  body {
    background: linear-gradient(135deg, #0B0613 0%, #1A0D2E 55%, #0B0613 100%);
    font-family: 'DM Sans', sans-serif;
    color: #F5EFFF;
    min-height: 100vh;
  }

  #dt-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

  .dt-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(88px); }
  .dt-orb-pink {
    width: 560px; height: 560px;
    background: radial-gradient(circle, rgba(255,46,136,.17) 0%, transparent 70%);
    top: -130px; right: -130px;
    animation: dtFloat 9s ease-in-out infinite;
  }
  .dt-orb-purple {
    width: 440px; height: 440px;
    background: radial-gradient(circle, rgba(155,92,255,.14) 0%, transparent 70%);
    bottom: -110px; left: -110px;
    animation: dtFloat 11s ease-in-out infinite reverse;
  }
  @keyframes dtFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-28px) scale(1.04); }
  }

  .dt-page { position: relative; z-index: 1; min-height: 100vh; }

  /* Hero */
  .dt-hero { padding: 58px 52px 40px; }
  .dt-hero-eyebrow {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(224,57,138,.85);
    font-style: italic; letter-spacing: .3px; margin-bottom: 20px;
  }
  .dt-hero h1 {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 300; line-height: 1.18; color: #F5EFFF;
    margin-bottom: 18px; letter-spacing: -1px;
  }
  .dt-hero h1 em {
    font-family: 'Playfair Display', serif;
    font-style: italic; color: #FF2E88; font-weight: 400;
  }
  .dt-hero-sub { font-size: 15px; color: rgba(220,210,240,.65); line-height: 1.7; max-width: 460px; }

  /* Card grid */
  .dt-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; padding: 0 52px 52px; }
  @media (max-width: 780px) {
    .dt-cards { grid-template-columns: 1fr; padding: 0 20px 40px; }
    .dt-hero { padding: 40px 20px 28px; }
  }

  /* Glass card */
  .dt-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 18px; padding: 24px;
    position: relative; overflow: hidden; backdrop-filter: blur(14px);
  }
  .dt-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,46,136,.4), rgba(155,92,255,.4), transparent);
  }

  /* Session top row */
  .dt-session-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .dt-session-label { font-size: 10px; letter-spacing: 2.5px; color: rgba(200,180,230,.55); font-weight: 500; text-transform: uppercase; }
  .dt-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px; padding: 5px 12px;
    font-size: 11px; letter-spacing: 1.5px; color: rgba(200,180,230,.7);
  }
  .dt-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #6a5a7a; display: inline-block; }
  .dt-badge-dot.live {
    background: #FF2E88; box-shadow: 0 0 6px #FF2E88;
    animation: dtPulse 1.4s ease-in-out infinite;
  }
  @keyframes dtPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: .5; transform: scale(.75); }
  }

  /* Video frame */
  .dt-video-wrap {
    position: relative; margin: 20px 0 16px; border-radius: 14px; padding: 2px;
    background: linear-gradient(135deg, #FF2E88, #9B5CFF, #FF2E88);
    background-size: 300% 300%;
    animation: dtBorder 3.5s linear infinite;
  }
  @keyframes dtBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .dt-video-inner { border-radius: 12px; overflow: hidden; background: #000; position: relative; }
  .dt-video-inner::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px,
      rgba(255,46,136,.015) 2px, rgba(255,46,136,.015) 4px);
  }
  .dt-video { display: block; width: 100%; border-radius: 12px; background: #000; }
  .dt-corner { position: absolute; width: 14px; height: 14px; z-index: 2; }
  .dt-corner-tl { top:-1px; left:-1px; border-top:2px solid #FF2E88; border-left:2px solid #FF2E88; border-radius:4px 0 0 0; }
  .dt-corner-tr { top:-1px; right:-1px; border-top:2px solid #FF2E88; border-right:2px solid #FF2E88; border-radius:0 4px 0 0; }
  .dt-corner-bl { bottom:-1px; left:-1px; border-bottom:2px solid #9B5CFF; border-left:2px solid #9B5CFF; border-radius:0 0 0 4px; }
  .dt-corner-br { bottom:-1px; right:-1px; border-bottom:2px solid #9B5CFF; border-right:2px solid #9B5CFF; border-radius:0 0 4px 0; }
  .dt-live-badge {
    position: absolute; top: 10px; left: 10px; z-index: 3;
    display: flex; align-items: center; gap: 6px;
    background: rgba(11,6,19,.8); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,46,136,.3); border-radius: 20px; padding: 3px 10px;
  }
  .dt-live-badge span { font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 1px; color: #FF2E88; }

  /* Buttons */
  .dt-btns { display: flex; gap: 12px; flex-wrap: wrap; }
  .dt-btn-start {
    flex: 1; background: linear-gradient(135deg, #FF2E88, #c4176a);
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    padding: 14px 20px; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    box-shadow: 0 0 24px rgba(255,46,136,.35);
    transition: box-shadow .25s, transform .2s;
  }
  .dt-btn-start:hover:not(:disabled) { box-shadow: 0 0 42px rgba(255,46,136,.7); transform: translateY(-2px); }
  .dt-btn-start:disabled { opacity: .38; cursor: not-allowed; transform: none; }
  .dt-btn-stop {
    flex: 1; background: transparent; border: 1px solid rgba(155,92,255,.6); color: #9B5CFF;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    padding: 14px 20px; border-radius: 10px; cursor: pointer;
    box-shadow: 0 0 14px rgba(155,92,255,.15); transition: all .25s;
  }
  .dt-btn-stop:hover:not(:disabled) {
    background: rgba(155,92,255,.1); box-shadow: 0 0 32px rgba(155,92,255,.5);
    transform: translateY(-2px); color: #F5EFFF; border-color: #9B5CFF;
  }
  .dt-btn-stop:disabled { opacity: .38; cursor: not-allowed; transform: none; }
  .dt-hint { margin-top: 10px; font-size: 12px; letter-spacing: .8px; color: rgba(200,180,230,.5); text-align: center; }
  .dt-hint em { color: #9B5CFF; font-style: normal; }

  /* Photos card */
  .dt-photos-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .dt-photos-title { font-size: 10px; letter-spacing: 2.5px; color: rgba(200,180,230,.55); font-weight: 500; text-transform: uppercase; }
  .dt-photos-count {
    background: linear-gradient(135deg, rgba(255,46,136,.2), rgba(155,92,255,.2));
    border: 1px solid rgba(255,46,136,.3); border-radius: 20px; padding: 3px 12px;
    font-family: 'Orbitron', monospace; font-size: 10px; color: #FF2E88; letter-spacing: 1px;
  }
  .dt-photos-grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .dt-photo {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 1px solid rgba(255,255,255,.08);
    animation: dtPhotoIn .4s cubic-bezier(.34,1.56,.64,1) both;
    transition: all .3s ease; cursor: pointer;
  }
  .dt-photo:hover { transform: translateY(-5px) scale(1.04); border-color: rgba(255,46,136,.45); box-shadow: 0 10px 28px rgba(255,46,136,.22); }
  @keyframes dtPhotoIn {
    from { opacity:0; transform: scale(.85) translateY(10px); }
    to { opacity:1; transform: scale(1) translateY(0); }
  }
  .dt-photo img { width: 130px; height: 98px; object-fit: cover; display: block; }
  .dt-photo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(11,6,19,.82) 0%, transparent 52%);
    opacity: 0; transition: opacity .3s;
    display: flex; align-items: flex-end; padding: 6px 8px;
  }
  .dt-photo:hover .dt-photo-overlay { opacity: 1; }
  .dt-photo-overlay span { font-family: 'Orbitron', monospace; font-size: 9px; color: rgba(200,180,230,.8); letter-spacing: 1px; }
  .dt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; gap: 10px; }
  .dt-empty-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
    display: flex; align-items: center; justify-content: center; font-size: 22px;
  }
  .dt-empty p { color: rgba(200,180,230,.55); font-size: 13px; letter-spacing: .8px; }
  .dt-empty small { color: #5a4c6a; font-size: 11px; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,.02); }
  ::-webkit-scrollbar-thumb { background: rgba(155,92,255,.4); border-radius: 4px; }
`;

/* ── StarField ── */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let stars = [], raf;
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 210 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.15,
        speed: Math.random() * 0.006 + 0.002,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const a = 0.2 + 0.7 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,239,255,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    init();
    window.addEventListener('resize', init);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
  }, []);
  return <canvas id="dt-stars" ref={ref} />;
}

/* ── Main Page Component ── */
const AutoCapturePage = () => {
  const location = useLocation(); // Hook to check for SOS trigger state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);

  /* Inject CSS once */
  useEffect(() => {
    if (document.getElementById('dt-global-css')) return;
    const tag = document.createElement('style');
    tag.id = 'dt-global-css';
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
  }, []);

  /* Webcam Initialization */
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        // AUTO-TRIGGER LOGIC: 
        // If we came from the SOS button, start capturing as soon as the camera is ready.
        if (location.state?.autoStart) {
          startCapture();
        }
      } catch {
        alert('Camera access denied! Please check your permissions.');
      }
    };
    startWebcam();
    return () => {
      stopCapture();
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    };
  }, [location.state]);

  const capturePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setPhotos(prev => [imageData, ...prev]);
    }
  };

  const startCapture = () => {
    if (!isCapturing) {
      setIsCapturing(true);
      intervalRef.current = setInterval(capturePhoto, 3000);
    }
  };

  const stopCapture = () => {
    setIsCapturing(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <>
      <StarField />
      <div className="dt-orb dt-orb-pink" />
      <div className="dt-orb dt-orb-purple" />

      <div className="dt-page">
        {/* Hero */}
        <section className="dt-hero">
          <div className="dt-hero-eyebrow">
            <span>✦</span>
            <span>SafeHer · The Guiding Light</span>
          </div>
          <h1>You deserve to feel <em>safe, always.</em></h1>
          <p className="dt-hero-sub">
            We're with you — every step, every second.
          </p>
        </section>

        {/* Dashboard */}
        <div className="dt-cards">
          {/* Session / Capture card */}
          <div className="dt-card">
            <div className="dt-session-top">
              <span className="dt-session-label">Live Session</span>
              <div className="dt-badge">
                <span className={`dt-badge-dot${isCapturing ? ' live' : ''}`} />
                {isCapturing ? 'CAPTURING' : 'STANDBY'}
              </div>
            </div>

            <div className="dt-video-wrap">
              <div className="dt-corner dt-corner-tl" />
              <div className="dt-corner dt-corner-tr" />
              <div className="dt-corner dt-corner-bl" />
              <div className="dt-corner dt-corner-br" />
              <div className="dt-video-inner">
                <video ref={videoRef} autoPlay playsInline className="dt-video" />
                {isCapturing && (
                  <div className="dt-live-badge">
                    <span className="dt-badge-dot live" style={{ width: 6, height: 6 }} />
                    <span>LIVE</span>
                  </div>
                )}
              </div>
            </div>

            <div className="dt-btns">
              <button className="dt-btn-start" onClick={startCapture} disabled={isCapturing}>
                <span style={{
                  display:'inline-block', width:0, height:0,
                  borderTop:'5px solid transparent', borderBottom:'5px solid transparent',
                  borderLeft:'9px solid #fff'
                }} />
                Start Capture
              </button>
              <button className="dt-btn-stop" onClick={stopCapture} disabled={!isCapturing}>
                ■ Stop Capture
              </button>
            </div>

            {isCapturing && (
              <p className="dt-hint">Auto-capturing every <em>3 seconds</em></p>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Photos dashboard card */}
          <div className="dt-card">
            <div className="dt-photos-header">
              <span className="dt-photos-title">📂 Captured Photos</span>
              {photos.length > 0 && (
                <span className="dt-photos-count">
                  {photos.length} FRAME{photos.length !== 1 ? 'S' : ''}
                </span>
              )}
            </div>

            {photos.length === 0 ? (
              <div className="dt-empty">
                <div className="dt-empty-icon">📷</div>
                <p>No frames captured yet</p>
                <small>Start capture to populate the dashboard</small>
              </div>
            ) : (
              <div className="dt-photos-grid">
                {photos.map((photo, index) => (
                  <div key={index} className="dt-photo">
                    <img src={photo} alt={`Capture ${index}`} />
                    <div className="dt-photo-overlay">
                      <span>#{String(photos.length - index).padStart(3, '0')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoCapturePage;