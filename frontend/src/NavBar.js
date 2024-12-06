import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Optional: Add styles here

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CalendarMedia
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/create-event">Create Event</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
