import React, { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import NavBar from '../components/NavBar.js';
import EventList from '../components/EventList.js';
import api from '../lib/api.js';


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getData() {
        const { data, error } = await api.get('/getevents');
        if (error) {
            setError(error);
        }
        else {
            setEvents(data.events);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [selectedDate]);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }
  
    if (error) return <div>Error: {error}</div>;
  
    return (
        <div style={{height: '100vh'}}>
            <NavBar/>
            {loading ? <div>Loading...</div> :
                <div style={{height: '100%'}} className='d-flex flex-row'>
                    <div className='w-100 h-100 d-flex flex-column'>
                    <Calendar
                        className='w-100 h-100'
                        onChange={handleDateChange}
                        value={selectedDate}
                        view='month'
                    />
                    </div>
                    <EventList events={events.filter(event => {
                        const eventDate = new Date(event.start_time).toDateString();
                        return eventDate === selectedDate.toDateString();
                    })} date={selectedDate}/>
                </div>
            }
        </div>
    );
}
