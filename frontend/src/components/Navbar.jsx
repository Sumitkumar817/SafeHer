import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for background transparency vs solid
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking anywhere else on the screen
  useEffect(() => {
    const closeMenu = () => setShowDropdown(false);
    if (showDropdown) {
      window.addEventListener("click", closeMenu);
    }
    return () => window.removeEventListener("click", closeMenu);
  }, [showDropdown]);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: scrolled ? "12px 0" : "20px 0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: scrolled ? "rgba(15, 10, 20, 0.95)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(194, 24, 91, 0.2)" : "none",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo Section */}
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ color: "#FF4D8D", fontSize: "22px", filter: "drop-shadow(0 0 8px rgba(255, 77, 141, 0.4))" }}>✦</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#FCE4EC", fontSize: "1.3rem", letterSpacing: "0.5px" }}>
            SafeHer
          </span>
        </NavLink>

        {/* Navigation Links & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "35px" }}>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          
          <NavLink to="/walkwithme" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>WalkWithMe</NavLink>
          
          <NavLink to="/safe-route" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>SmartMap</NavLink>
          
          <NavLink to="/report" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Report</NavLink>
          
          <NavLink to="/sos" className={({isActive}) => isActive ? "nav-link active sos-nav-link" : "nav-link sos-nav-link"}>
            <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#FF1744", marginRight: "3px", boxShadow: "0 0 8px #FF1744" }}></span>
            SOS
          </NavLink>
          
          {/* Circular Profile Icon with Dropdown */}
          <div 
            style={{ position: "relative" }} 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <div 
              className={showDropdown ? "profile-icon active-icon" : "profile-icon"}
              style={{ 
                width: "38px", 
                height: "38px", 
                borderRadius: "50%", 
                border: "2px solid #C2185B", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: "pointer",
                transition: "0.3s ease",
                color: "#FCE4EC",
                fontWeight: "700",
                fontSize: "1rem",
                background: "rgba(194, 24, 91, 0.1)"
              }}
            >
              P
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item">My Profile</NavLink>
                <NavLink to="/safespace" className="dropdown-item">SafeSpace</NavLink>
                
                {/* Visual Divider */}
                <div style={{ height: "1px", background: "rgba(194, 24, 91, 0.2)", margin: "8px 12px" }} />
                
                {/* Logout Option */}
                <button 
                  onClick={() => {
                    // Add your logout logic here (e.g., clearing tokens)
                    navigate('/signup');
                  }}
                  className="dropdown-item logout-item"
                  style={{ 
                    width: "100%", 
                    textAlign: "left", 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer",
                    color: "#EF9A9A" 
                  }}
                >
                  Logout 
                </button>
              </div>
            )}
          </div>
          
          {/* Login Button */}
          <button 
            onClick={() => navigate('/signup')}
            style={{
              background: "linear-gradient(135deg, #C2185B, #FF4D8D)",
              color: "white", 
              border: "none", 
              padding: "10px 24px",
              borderRadius: "99px", 
              fontWeight: "600", 
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(194, 24, 91, 0.3)",
              marginLeft: "5px",
              transition: "0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            Login
          </button>
        </div>
      </div>

      <style>{`
        .nav-link {
          text-decoration: none;
          color: #F8BBD0;
          font-size: 0.95rem;
          font-weight: 500;
          transition: 0.3s ease;
          opacity: 0.85;
        }

        .nav-link:hover, .nav-link.active {
          color: #FF80AB;
          opacity: 1;
        }

        .nav-link.active {
          font-weight: 700;
          text-shadow: 0 0 10px rgba(255, 128, 171, 0.4);
        }

        .sos-nav-link {
          display: inline-flex !important;
          align-items: center;
          gap: 6px;
          background: rgba(213, 0, 0, 0.15);
          border: 1px solid rgba(255, 23, 68, 0.4);
          padding: 5px 14px;
          border-radius: 99px;
          color: #FF8A80 !important;
          font-weight: 700 !important;
          letter-spacing: 0.8px;
          box-shadow: 0 0 10px rgba(255, 23, 68, 0.2);
          transition: all 0.3s ease;
        }

        .sos-nav-link:hover, .sos-nav-link.active {
          background: linear-gradient(135deg, #C2185B, #D50000) !important;
          color: #FFFFFF !important;
          border-color: #FF1744 !important;
          box-shadow: 0 0 15px rgba(255, 23, 68, 0.6) !important;
          transform: scale(1.05);
        }

        .profile-icon:hover {
          box-shadow: 0 0 15px rgba(194, 24, 91, 0.5);
          transform: scale(1.05);
          background: rgba(194, 24, 91, 0.2) !important;
        }

        .active-icon {
          background: #C2185B !important;
          color: white !important;
          box-shadow: 0 0 15px rgba(194, 24, 91, 0.6);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          background: #1A1224;
          border: 1px solid rgba(194, 24, 91, 0.3);
          border-radius: 16px;
          padding: 8px 0;
          min-width: 160px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          animation: dropIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(12px);
        }

        .dropdown-item {
          display: block;
          padding: 12px 20px;
          color: #FCE4EC;
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.2s;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: rgba(194, 24, 91, 0.15);
          color: #FF4D8D;
          padding-left: 24px;
        }

        .logout-item:hover {
          background: rgba(239, 154, 154, 0.1) !important;
          color: #ff5252 !important;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </nav>
  );
}