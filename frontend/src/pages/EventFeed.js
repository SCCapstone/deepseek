import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../lib/api';
import { useAppContext } from '../lib/context';

const EventFeed = () => {
    const { colorScheme } = useAppContext();  // Get theme colors from context

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: colorScheme.backgroundColor,
            padding: '20px'
        },
        section: {
            backgroundColor: colorScheme.accentColor,
            padding: '20px',
            borderRadius: '10px',
        },
        sectionTitle: {
            color: colorScheme.textColor,
            fontSize: '24px',
            fontWeight: 'bold',
        },
        eventCard: {
            backgroundColor: colorScheme.backgroundColor,
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '15px',
            color: colorScheme.textColor
        },
        eventTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
        },
        eventDetails: {
            fontSize: '16px',
            color: colorScheme.textColor
        }
    };

    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const context = useAppContext();

   async function getData() {
           const { data, error } = await api.get('/getevents');
           if (error) {
               setError(error);
           }
           else {
               setEvents(data);
               setLoading(false);
           }
       }
    useEffect(() => {
        getData();
    }, []);
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',   // e.g., Saturday
            month: 'long',     // e.g., March
            day: 'numeric',    // e.g., 1
            year: 'numeric',   // e.g., 2025
            hour: '2-digit',   // e.g., 2 PM
            minute: '2-digit', // e.g., 00
            hour12: true       // Use AM/PM format
        }).format(date);
    };
    
    return (
        <div style={styles.page}>
            <NavBar />
            {loading ? <p style={{ color: colorScheme.textColor }}>Loading...</p> :
                <div className='container'>
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <h1 className='h1' style={styles.sectionTitle}>Upcoming Events</h1>
                        {events.length > 0 ? (
                            events.map(event => (
                                <div key={event.id} className='p-3 shadow rounded-lg' style={styles.eventCard}>
                                    <h2 style={styles.eventTitle}>{event.title}</h2>
                                    <p style={styles.eventDetails}>{formatDate(event.start_time)}</p>
                                    <p>{event.description}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: colorScheme.textColor }}>No events available.</p>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default EventFeed;
