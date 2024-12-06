import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "./ThemeContext";
import Calendar from 'react-calendar';
import NavBar from "./NavBar";
import './App.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece,ValuePiece];

const CalendarPage = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme; // Theme class added to body
  }, [theme]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/events?user_id=${userId}&date=${selectedDate.toISOString().split('T')[0]}`, {
          credentials: 'include',  // Include cookies for session-based authentication
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();  // Parse the JSON response
        console.log('Fetched events', data);
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedDate, userId]);
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  
  useEffect(() => {
    console.log('Events state updated:', events);
  }, [events]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <NavBar/>
      <h1>Your Calendar</h1>
      <Calendar 
        onChange={handleDateChange}
        value={selectedDate}
        view="month"
      />
      <h2>Events for {selectedDate.toDateString()}</h2>
      <ul>
        {events.length === 0 ? (
          <li>No events for this day.</li>
        ) : (
          events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                {new Date(event.start_time).toLocaleTimeString()} -{' '}
                {new Date(event.end_time).toLocaleTimeString()}
              </p>
              //<p>Visibility: {event.visibility}</p>
              <p>Comments: {event.comments.join(', ')}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );

}

export default CalendarPage;
