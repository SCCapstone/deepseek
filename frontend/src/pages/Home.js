import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  // for navigation
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CalendarMedia</h1>
        <p className="app-tagline">Look at what other people are doing!</p>
      </header>
      <div className="button-container">
        <button
          className="auth-button login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="auth-button register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
export default Home;