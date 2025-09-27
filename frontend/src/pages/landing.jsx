import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { PersonAdd, Login, Person } from "@mui/icons-material";

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="landingPageContainer">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navlist">
          <p
            className="navItem"
            onClick={() => {
              router("/aljk23");
            }}
          >
            <Person style={{ marginRight: "8px" }} /> Join as Guest
          </p>

          <p
            className="navItem"
            onClick={() => {
              router("/auth");
            }}
          >
            <PersonAdd style={{ marginRight: "8px" }} /> Register
          </p>

          <div
            className="navItem"
            onClick={() => {
              router("/auth");
            }}
            role="button"
          >
            <Login style={{ marginRight: "8px" }} /> <p>Login</p>
          </div>
        </div>
      </nav>

      {/* Main Landing Section */}
      <div className="landingMainContainer">
        <div className="landingContent">
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved
            Ones
          </h1>

          <p className="subText">Cover a distance by Apna Video Call</p>
           <p className="subText">Created By Somyadip</p>
          <div role="button" className="getStartedBtn">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div className="landingImage">
          
                <img src="/mobile.png" alt="A mobile device" />
      
        
        </div>
      </div>
    </div>
  );
}
