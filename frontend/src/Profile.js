import React,{ useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "./ThemeContext";
import './App.css';



export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useTheme();

  

  // Update the body class when the theme changes
  useEffect(() => {
    document.body.className = theme; // Add the theme class to the body
  }, [theme]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/myprofile', {
          credentials: 'include',  // Include cookies for session-based authentication
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();  // Parse the JSON response
        console.log('Fetched user data:', data);
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array to run only on component mount

  useEffect(() => {
    console.log('User data state updated:', userData);  // Log when userData changes
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="app-container">
      <h1>User Profile</h1>
      {userData ? <ProfileCard userData={userData} /> : <p>Loading user data...</p>}
      <footer>
        <button onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </footer>
    </div>

  );
}

