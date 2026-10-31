import { useState, useEffect, useRef } from "react";
import LiveMap from "../components/LiveMap";


const COLORS = {
  primary: "#C2185B",
  secondary: "#FF4D8D",
  accent: "#FF80AB",
  bg: "#0F0A14",
  card: "#1A1224",
  textPrimary: "#FCE4EC",
  textSecondary: "#F8BBD0",
};


const mockRoutes = [
  {
    id: 1,
    name: "Safest Route",
    distance: "3.2 km",
    time: "14 min",
    safetyScore: 92,
    badge: "safe",
    via: "Via MG Road & Sector 7",
    highlights: ["Well-lit streets", "CCTV coverage", "Busy commercial zone"],
    aiInsight:
      "This route passes through well-monitored commercial areas with dense foot traffic and consistent street lighting — ideal for late-night travel.",
  },
  {
    id: 2,
    name: "Balanced Route",
    distance: "2.7 km",
    time: "11 min",
    safetyScore: 74,
    badge: "moderate",
    via: "Via NH-48 Bypass",
    highlights: ["Moderate lighting", "Patrol zone", "Minor blind spots"],
    aiInsight:
      "Slightly faster, but passes through 2 low-visibility stretches. Recommended only during peak daytime hours.",
  },
  {
    id: 3,
    name: "Fastest Route",
    distance: "2.1 km",
    time: "8 min",
    safetyScore: 41,
    badge: "risky",
    via: "Via Old Industrial Lane",
    highlights: ["Poor lighting", "Isolated stretch", "High incident zone"],
    aiInsight:
      "Shortest path but traverses an underlit industrial corridor with reported incidents in the past 30 days. Avoid after sunset.",
  },
];


const alerts = [
  {
    icon: "⚠️",
    color: "#FF4D8D",
    label: "Low-lit area ahead (200m)",
    type: "warn",
  },
  {
    icon: "🔴",
    color: "#FF1744",
    label: "High incident zone detected",
    type: "danger",
  },
  {
    icon: "✅",
    color: "#00E676",
    label: "Safer alternative route available",
    type: "safe",
  },
  {
    icon: "📡",
    color: "#FF80AB",
    label: "CCTV surveillance active on Route 1",
    type: "info",
  },
];


const badgeConfig = {
  safe: {
    bg: "rgba(0,230,118,0.15)",
    border: "rgba(0,230,118,0.5)",
    text: "#00E676",
    label: "SAFE",
  },
  moderate: {
    bg: "rgba(255,193,7,0.15)",
    border: "rgba(255,193,7,0.5)",
    text: "#FFC107",
    label: "MODERATE",
  },
  risky: {
    bg: "rgba(255,23,68,0.15)",
    border: "rgba(255,23,68,0.5)",
    text: "#FF1744",
    label: "RISKY",
  },
};


function ScoreArc({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 80 ? "#00E676" : score >= 60 ? "#FFC107" : "#FF1744";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="5"
      />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{
          filter: `drop-shadow(0 0 6px ${color})`,
          transition: "stroke-dasharray 0.6s ease",
        }}
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={color}
        fontFamily="'Rajdhani', sans-serif"
      >
        {score}%
      </text>
    </svg>
  );
}


function MockMap({ selectedRoute }) {
  const canvasRef = useRef(null);


  const routePaths = {
    1: [
      [80, 340],
      [140, 290],
      [210, 250],
      [290, 220],
      [370, 200],
      [450, 185],
      [530, 190],
      [600, 210],
      [660, 240],
      [720, 280],
    ],
    2: [
      [80, 340],
      [150, 310],
      [230, 300],
      [320, 280],
      [400, 240],
      [480, 200],
      [560, 185],
      [640, 200],
      [720, 280],
    ],
    3: [
      [80, 340],
      [170, 340],
      [260, 330],
      [350, 310],
      [440, 300],
      [530, 290],
      [620, 285],
      [720, 280],
    ],
  };


  const routeColors = { 1: "#00E676", 2: "#FFC107", 3: "#FF1744" };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;


    ctx.clearRect(0, 0, W, H);


    // Background
    ctx.fillStyle = "#100818";
    ctx.fillRect(0, 0, W, H);


    // Grid
    ctx.strokeStyle = "rgba(194,24,91,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }


    // Safe zone glow
    const safeGrad = ctx.createRadialGradient(360, 200, 0, 360, 200, 120);
    safeGrad.addColorStop(0, "rgba(0,230,118,0.12)");
    safeGrad.addColorStop(1, "rgba(0,230,118,0)");
    ctx.fillStyle = safeGrad;
    ctx.fillRect(0, 0, W, H);


    // Unsafe zone glow
    const dangerGrad = ctx.createRadialGradient(520, 300, 0, 520, 300, 90);
    dangerGrad.addColorStop(0, "rgba(255,23,68,0.18)");
    dangerGrad.addColorStop(1, "rgba(255,23,68,0)");
    ctx.fillStyle = dangerGrad;
    ctx.fillRect(0, 0, W, H);


    // Heatmap blobs
    [
      [200, 150, 60, "rgba(255,77,141,0.1)"],
      [500, 260, 80, "rgba(255,23,68,0.08)"],
      [650, 180, 50, "rgba(0,230,118,0.07)"],
    ].forEach(([cx, cy, r, color]) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });


    // Street lines (background roads)
    const streets = [
      [
        [0, 180],
        [W, 180],
      ],
      [
        [0, 300],
        [W, 300],
      ],
      [
        [200, 0],
        [200, H],
      ],
      [
        [480, 0],
        [480, H],
      ],
    ];
    streets.forEach(([[x1, y1], [x2, y2]]) => {
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });


    // All dim routes first
    Object.entries(routePaths).forEach(([id, pts]) => {
      if (parseInt(id) === selectedRoute) return;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });


    // Active route
    const pts = routePaths[selectedRoute];
    const activeColor = routeColors[selectedRoute];


    // Glow layer
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 12;
    ctx.globalAlpha = 0.15;
    ctx.stroke();
    ctx.globalAlpha = 1;


    // Main path
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
    const grad = ctx.createLinearGradient(
      pts[0][0],
      pts[0][1],
      pts[pts.length - 1][0],
      pts[pts.length - 1][1],
    );
    grad.addColorStop(0, activeColor);
    grad.addColorStop(1, "#FF80AB");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.stroke();


    // Moving dots along path
    const now = Date.now() / 600;
    pts.forEach((pt, i) => {
      if (i === 0 || i === pts.length - 1) return;
      const pulse = (Math.sin(now + i) + 1) / 2;
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 3 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,128,171,${0.3 + pulse * 0.5})`;
      ctx.fill();
    });


    // Start marker
    ctx.beginPath();
    ctx.arc(pts[0][0], pts[0][1], 12, 0, Math.PI * 2);
    ctx.fillStyle = "#C2185B";
    ctx.fill();
    ctx.strokeStyle = "#FF80AB";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", pts[0][0], pts[0][1]);


    // End marker
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last[0], last[1], 12, 0, Math.PI * 2);
    ctx.fillStyle = activeColor;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#0F0A14";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", last[0], last[1]);


    // Legend dots
    [
      ["Safe Zone", 30, H - 24, "#00E676"],
      ["Incident Zone", 130, H - 24, "#FF1744"],
      ["Active Route", 250, H - 24, activeColor],
    ].forEach(([label, x, y, c]) => {
      ctx.beginPath();
      ctx.arc(x - 10, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.fillStyle = "rgba(252,228,236,0.5)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    });
  });


  useEffect(() => {
    let raf;
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#100818";
      ctx.fillRect(0, 0, W, H);


      ctx.strokeStyle = "rgba(194,24,91,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }


      const safeGrad = ctx.createRadialGradient(360, 200, 0, 360, 200, 120);
      safeGrad.addColorStop(0, "rgba(0,230,118,0.12)");
      safeGrad.addColorStop(1, "rgba(0,230,118,0)");
      ctx.fillStyle = safeGrad;
      ctx.fillRect(0, 0, W, H);


      const dangerGrad = ctx.createRadialGradient(520, 300, 0, 520, 300, 90);
      dangerGrad.addColorStop(0, "rgba(255,23,68,0.18)");
      dangerGrad.addColorStop(1, "rgba(255,23,68,0)");
      ctx.fillStyle = dangerGrad;
      ctx.fillRect(0, 0, W, H);


      [
        [200, 150, 60, "rgba(255,77,141,0.1)"],
        [500, 260, 80, "rgba(255,23,68,0.08)"],
        [650, 180, 50, "rgba(0,230,118,0.07)"],
      ].forEach(([cx, cy, r, color]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });


      [
        [0, 180],
        [0, 300],
      ].forEach(([x, y]) => {
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      });
      [
        [200, 0],
        [480, 0],
      ].forEach(([x, y]) => {
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, H);
        ctx.stroke();
      });


      const routePaths2 = {
        1: [
          [80, 340],
          [140, 290],
          [210, 250],
          [290, 220],
          [370, 200],
          [450, 185],
          [530, 190],
          [600, 210],
          [660, 240],
          [720, 280],
        ],
        2: [
          [80, 340],
          [150, 310],
          [230, 300],
          [320, 280],
          [400, 240],
          [480, 200],
          [560, 185],
          [640, 200],
          [720, 280],
        ],
        3: [
          [80, 340],
          [170, 340],
          [260, 330],
          [350, 310],
          [440, 300],
          [530, 290],
          [620, 285],
          [720, 280],
        ],
      };
      const routeColors2 = { 1: "#00E676", 2: "#FFC107", 3: "#FF1744" };


      Object.entries(routePaths2).forEach(([id, pts]) => {
        if (parseInt(id) === selectedRoute) return;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });


      const pts = routePaths2[selectedRoute];
      const activeColor = routeColors2[selectedRoute];


      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.12;
      ctx.stroke();
      ctx.globalAlpha = 1;


      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      const g2 = ctx.createLinearGradient(
        pts[0][0],
        pts[0][1],
        pts[pts.length - 1][0],
        pts[pts.length - 1][1],
      );
      g2.addColorStop(0, activeColor);
      g2.addColorStop(1, "#FF80AB");
      ctx.strokeStyle = g2;
      ctx.lineWidth = 4;
      ctx.stroke();


      const now = Date.now() / 600;
      pts.forEach((pt, i) => {
        if (i === 0 || i === pts.length - 1) return;
        const pulse = (Math.sin(now + i) + 1) / 2;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,128,171,${0.3 + pulse * 0.5})`;
        ctx.fill();
      });


      ctx.beginPath();
      ctx.arc(pts[0][0], pts[0][1], 12, 0, Math.PI * 2);
      ctx.fillStyle = "#C2185B";
      ctx.fill();
      ctx.strokeStyle = "#FF80AB";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("A", pts[0][0], pts[0][1]);


      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last[0], last[1], 12, 0, Math.PI * 2);
      ctx.fillStyle = activeColor;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#0F0A14";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("B", last[0], last[1]);


      const H2 = canvas.height;
      [
        ["Safe Zone", 30, H2 - 24, "#00E676"],
        ["Incident Zone", 130, H2 - 24, "#FF1744"],
        ["Active Route", 250, H2 - 24, activeColor],
      ].forEach(([label, x, y, c]) => {
        ctx.beginPath();
        ctx.arc(x - 10, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.fillStyle = "rgba(252,228,236,0.5)";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
      });


      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [selectedRoute]);


  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={420}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "12px",
      }}
    />
  );
}


export default function SafeRoute() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("safe");
  const [selectedRoute, setSelectedRoute] = useState(1);
  const [status, setStatus] = useState("Safe route active");
  const [analyzing, setAnalyzing] = useState(false);


  const sourceCoords = {
  lat: 28.6139,
  lng: 77.2090,
};


const destinationCoords = {
  lat: 28.7041,
  lng: 77.1025,
};


const getRouteDistance = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;


  const response = await fetch(url);
  const data = await response.json();


  if (!data.routes || !data.routes.length) return null;


  const route = data.routes[0];


  return {
    distance: (route.distance / 1000).toFixed(2) + " km",
    time: Math.round(route.duration / 60) + " min",
  };
};


  const activeRoute = mockRoutes.find((r) => r.id === selectedRoute);
  const parseDistance = (distance) => {
  return parseFloat(distance.replace(" km", ""));
};


  const handleAnalyze = () => {
  setAnalyzing(true);
  setStatus("Analyzing routes…");


  setTimeout(() => {
    let bestRoute;


    if (mode === "fast") {
      // choose shortest distance
      bestRoute = mockRoutes.reduce((prev, current) =>
        parseDistance(current.distance) < parseDistance(prev.distance)
          ? current
          : prev
      );
    } else {
      // choose safest route
      bestRoute = mockRoutes.reduce((prev, current) =>
        current.safetyScore > prev.safetyScore
          ? current
          : prev
      );
    }


    setSelectedRoute(bestRoute.id);
    setAnalyzing(false);


    setStatus(
      mode === "fast"
        ? "Shortest route selected"
        : "Safest route selected"
    );
  }, 1800);
};


  const handleRouteSelect = (id) => {
    setSelectedRoute(id);
    setStatus("Recalculating…");
    setTimeout(() => setStatus("Safe route active"), 900);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
        color: COLORS.textPrimary,
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0A14; }


        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(194,24,91,0.3);
          border-radius: 10px;
          padding: 11px 14px;
          color: #FCE4EC;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: rgba(248,187,208,0.4); }
        .input-field:focus {
          border-color: #FF4D8D;
          box-shadow: 0 0 0 3px rgba(255,77,141,0.12);
        }


        .route-card {
          background: #1A1224;
          border: 1px solid rgba(194,24,91,0.2);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .route-card:hover {
          border-color: rgba(255,77,141,0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(255,77,141,0.12);
        }
        .route-card.selected {
          border-color: #FF4D8D;
          box-shadow: 0 0 0 1px #FF4D8D, 0 0 24px rgba(255,77,141,0.2);
        }


        .btn-primary {
          background: linear-gradient(135deg, #C2185B, #FF4D8D);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 20px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(194,24,91,0.4);
        }
        .btn-primary:active { transform: translateY(0); }


        .toggle-btn {
          flex: 1;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid rgba(194,24,91,0.25);
          background: transparent;
          color: rgba(248,187,208,0.6);
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toggle-btn.active {
          background: linear-gradient(135deg, rgba(194,24,91,0.3), rgba(255,77,141,0.3));
          border-color: #FF4D8D;
          color: #FF80AB;
          box-shadow: 0 0 12px rgba(255,77,141,0.2);
        }


        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0,230,118,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(0,230,118,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,230,118,0); }
        }
        .pulse-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #00E676;
          animation: pulse-ring 1.5s infinite;
          flex-shrink: 0;
        }
        .pulse-dot.analyzing {
          background: #FFC107;
          animation: pulse-ring 0.7s infinite;
        }


        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,77,141,0.4), transparent);
          animation: scanline 3s linear infinite;
          pointer-events: none;
        }


        .alert-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border-left: 3px solid;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
        }


        .section-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,77,141,0.7);
          margin-bottom: 10px;
        }


        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #FF80AB, #FF4D8D, #FF80AB);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>






















      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(194,24,91,0.2)",
          background: "rgba(26,18,36,0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #C2185B, #FF4D8D)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                boxShadow: "0 0 16px rgba(255,77,141,0.4)",
              }}
            >
              ⭐
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  letterSpacing: "0.5px",
                  color: "#FCE4EC",
                }}
              >
                SafeHer
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(248,187,208,0.5)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginTop: "-2px",
                }}
              >
                The Guiding Star
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className={`pulse-dot ${analyzing ? "analyzing" : ""}`} />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                color: analyzing ? "#FFC107" : "#00E676",
              }}
            >
              {status}
            </span>
          </div>
        </div>
      </header>


      {/* Main */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "32px 24px 60px",
        }}
      >
        {/* Page Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(28px, 5vw, 46px)",
              fontWeight: 700,
              letterSpacing: "1px",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            <span className="shimmer-text">Smart Safety Navigation</span>
          </h1>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "15px",
              color: "rgba(248,187,208,0.6)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            We don't just find the fastest path. We find the safest one.
          </p>
        </div>


        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* LEFT PANEL */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Input Card */}
            <div
              style={{
                background: COLORS.card,
                borderRadius: "16px",
                border: "1px solid rgba(194,24,91,0.2)",
                padding: "22px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="scanline" />
              <div className="section-label">Route Planner</div>


              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                    }}
                  >
                    📍
                  </span>
                  <input
                    className="input-field"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Enter source location"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                    }}
                  >
                    🏁
                  </span>
                  <input
                    className="input-field"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>


                {/* Toggle */}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    className={`toggle-btn ${mode === "safe" ? "active" : ""}`}
                    onClick={() => setMode("safe")}
                  >
                    🛡️ Safest Route
                  </button>
                  <button
                    className={`toggle-btn ${mode === "fast" ? "active" : ""}`}
                    onClick={() => setMode("fast")}
                  >
                    ⚡ Fastest Route
                  </button>
                </div>


                <button className="btn-primary" onClick={handleAnalyze}>
                  {analyzing ? "⏳ Analyzing…" : "🔍 Analyze Routes"}
                </button>
              </div>
            </div>


            {/* Route Cards */}
            <div>
              <div className="section-label">Available Routes</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {mockRoutes.map((route) => {
                  const bc = badgeConfig[route.badge];
                  const isSelected = selectedRoute === route.id;
                  return (
                    <div
                      key={route.id}
                      className={`route-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleRouteSelect(route.id)}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background:
                              "linear-gradient(90deg, #C2185B, #FF4D8D, #FF80AB)",
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: "'Rajdhani', sans-serif",
                              fontWeight: 700,
                              fontSize: "15px",
                              color: "#FCE4EC",
                            }}
                          >
                            {route.name}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: "12px",
                              color: "rgba(248,187,208,0.5)",
                              marginTop: "2px",
                            }}
                          >
                            {route.via}
                          </div>
                        </div>
                        <ScoreArc score={route.safetyScore} />
                      </div>


                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "13px",
                            color: "rgba(248,187,208,0.7)",
                          }}
                        >
                          📏 {route.distance}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "13px",
                            color: "rgba(248,187,208,0.7)",
                          }}
                        >
                          ⏱ {route.time}
                        </span>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontFamily: "'Rajdhani', sans-serif",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            background: bc.bg,
                            border: `1px solid ${bc.border}`,
                            color: bc.text,
                            marginLeft: "auto",
                          }}
                        >
                          {bc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* RIGHT PANEL */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Map */}
            <div
              style={{
                background: "#100818",
                borderRadius: "16px",
                border: "1px solid rgba(194,24,91,0.25)",
                overflow: "hidden",
                position: "relative",
                minHeight: "320px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 10,
                  background: "rgba(15,10,20,0.8)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,77,141,0.3)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#FF80AB",
                }}
              >
                Live Map View
              </div>


              <LiveMap />
            </div>


            {/* AI Insight */}
            {activeRoute && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(194,24,91,0.1), rgba(255,77,141,0.08))",
                  border: "1px solid rgba(255,77,141,0.3)",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <div className="section-label">AI Route Insight</div>


                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #FF4D8D, #FF80AB)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      boxShadow: "0 0 12px rgba(255,77,141,0.3)",
                    }}
                  >
                    🧠
                  </div>


                  <div>
                    <div
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "#FCE4EC",
                        marginBottom: "6px",
                      }}
                    >
                      {activeRoute.name}
                    </div>


                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px",
                        color: "rgba(248,187,208,0.75)",
                        lineHeight: 1.6,
                      }}
                    >
                      {activeRoute.aiInsight}
                    </p>


                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      {activeRoute.highlights.map((h, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontFamily: "'Outfit', sans-serif",
                            background: "rgba(255,128,171,0.1)",
                            border: "1px solid rgba(255,128,171,0.25)",
                            color: "#FF80AB",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Safety Alerts */}
            <div
              style={{
                background: COLORS.card,
                borderRadius: "14px",
                border: "1px solid rgba(194,24,91,0.2)",
                padding: "18px",
              }}
            >
              <div className="section-label">Safety Alerts</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className="alert-item"
                    style={{ borderLeftColor: a.color }}
                  >
                    <span style={{ fontSize: "16px" }}>{a.icon}</span>
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px",
                        color: "rgba(252,228,236,0.85)",
                      }}
                    >
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(194,24,91,0.15)",
          padding: "20px 24px",
          textAlign: "center",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "12px",
          color: "rgba(248,187,208,0.35)",
          letterSpacing: "0.5px",
        }}
      >
        SafeHer — The Guiding Light · Safety Navigation System · All routes
        simulated for demonstration
      </footer>
    </div>
  );
}



