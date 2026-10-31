import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import WalkWithMe from "./pages/WalkWithMe";
import SafeRoute from "./pages/SafeRoute";
import ReportPage from "./pages/Reportpage";
import Signup from "./pages/Signup";
import Safespace from "./pages/Safespace";
import Profile from "./pages/Profile";


// 1. ADD THIS IMPORT
import Capture from "./pages/Capture";
import Sos from "./pages/Sos";


export default function App() {
  return (
    <div style={{ background: "#0F0A14", minHeight: "100vh" }}>
      <Navbar />
     
      {/* The 90px padding ensures Capture page isn't hidden by Navbar */}
      <div style={{ paddingTop: "90px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/walkwithme" element={<WalkWithMe />} />
          <Route path="/safe-route" element={<SafeRoute />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/signup" element={<Signup />} />
      
          <Route path="/safespace" element={<Safespace />} />
          <Route path="/profile" element={<Profile />} />

          {/* 2. ADD THIS NEW ROUTE */}
          <Route path="/capture" element={<Capture />} />
          <Route path="/sos" element={<Sos />} />
         
        </Routes>
      </div>
    </div>
  );
}

