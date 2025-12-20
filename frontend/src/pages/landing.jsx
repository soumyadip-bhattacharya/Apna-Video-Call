import React, { useState } from "react";
import "../App.css"; 
import { Link, useNavigate } from "react-router-dom";
import VoiceAssistant from '../components/VoiceAssistant';
import { 
  PersonAdd, 
  Login, 
  Videocam, 
  PlayCircleFilledWhite, 
  KeyboardArrowRight,
  Close,
  CheckCircle,
  Person // Added Person icon
} from "@mui/icons-material";

export default function LandingPage() {
  const router = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="landingContainer">
      
      {/* --- BACKGROUND PARTICLES --- */}
      <div className="ambient-light one"></div>
      <div className="ambient-light two"></div>

      {/* --- NAVBAR --- */}
      <nav className="glassNavbar">
        <div className="logoSection" onClick={() => router("/")}>
          <div className="iconBox">
            <Videocam style={{ color: "#fff" }} />
          </div>
          <h2>Connect_Stream</h2>
        </div>
        
        <div className="navLinks">
          <button className="navBtn" onClick={() => router("/auth")}>
            <Login fontSize="small" /> Login
          </button>
          <button className="navBtn registerBtn" onClick={() => router("/auth")}>
            <PersonAdd fontSize="small" /> Register
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="heroSection">
        
        {/* Left Content */}
        <div className="heroContent">
          <div className="badge">
            <span className="badge-dot"></span> 
            v2.0 Now Live
          </div>
          
          <h1 className="heroTitle">
            Connect with your <br />
            <span className="gradientText">Loved Ones.</span>
          </h1>
          
          <p className="heroSubtitle">
            Experience the next generation of video conferencing. 
            Crystal clear audio, HD video, and seamless screen sharing. 
            No lag, just pure connection.
          </p>

          <div className="featureTags">
            <span><CheckCircle fontSize="inherit" /> HD Video</span>
            <span><CheckCircle fontSize="inherit" /> Secure</span>
            <span><CheckCircle fontSize="inherit" /> Free</span>
          </div>

          <div className="ctaGroup">
            {/* 1. Get Started */}
            <Link to="/auth" className="primaryCta">
              Get Started <KeyboardArrowRight />
            </Link>

            {/* 2. Join as Guest (NEW) */}
            <button className="guestCta" onClick={() => router("/aljk23")}>
              <Person fontSize="small" /> Join as Guest
            </button>
            
            {/* 3. Watch Demo */}
            <button className="secondaryCta" onClick={() => setShowVideo(true)}>
              <div className="playIconBox">
                <PlayCircleFilledWhite />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="heroImageWrapper">
          <div className="imageGlow"></div>
          <img src="/mobile5.png" alt="App Interface" className="floatingImage" />
          
          <div className="floatingCard card1">
            <div className="cardIcon">📞</div>
            <div className="cardText">
              <strong>Incoming Call</strong>
              <span>Bristi is calling...</span>
            </div>
          </div>
        </div>
      </main>

      {/* --- VIDEO MODAL --- */}
      {showVideo && (
        <div className="modalOverlay" onClick={() => setShowVideo(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Platform Tour: Connect_Stream Beginner to Pro</h3>
              <button className="closeBtn" onClick={() => setShowVideo(false)}>
                <Close />
              </button>
            </div>
            
            <div className="videoFrame">
              {/* Replace src with your video link */}
              <iframe 
                width="100%" 
                height="100%" 
                src="https://go.screenpal.com/watch/cTlYFknYHkH" 
                title="Apna Video Call Walkthrough" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <VoiceAssistant/>
    </div>
  );
}


