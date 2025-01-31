import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
export default function Register() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const nav = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { password, username };
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/register', {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status === 200) {
        nav('/login')
      } else {
        return alert("Error registering user, user may already exist");
      }
    } catch (error) {
      return alert("Error registering user" + error.message);
    }
};
  return (
    <div className="app-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-button-register" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};