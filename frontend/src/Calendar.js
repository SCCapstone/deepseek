import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "./ThemeContext";
import Calendar from 'react-calendar';
import './App.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece,ValuePiece];

export default function Calendar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme; // Theme class added to body
  }, [theme]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/calendar', {
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
    console.log('User data state updated:', userData);
  }, [userData]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <Calendar onChange={onChange} value={userData.events.start_time} />
    <div>
  );

}
