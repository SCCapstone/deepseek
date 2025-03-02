import React, { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import api from '../lib/api';
import { useAppContext } from '../lib/context';

const EventFeed = () => {
    const { colorScheme, user } = useAppContext();  // Get theme colors and user info from context

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: colorScheme.backgroundColor,
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
            color: colorScheme.textColor,
            position: 'relative', // For positioning the creator's pfp
            transition: 'none', // Remove transition for hover effect
        },
        eventTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
        },
        eventDetails: {
            fontSize: '16px',
            color: colorScheme.textColor,
        },
        creatorInfo: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
        },
        creatorPfp: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px',
        },
    };

    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventType, setEventType] = useState('user');  // 'user' or 'friend'

    async function getCreatorData(creatorId) {
        const { data, error } = await api.get(`/get-user/${creatorId}`); // Fetch user details by creator ID
        if (error) {
            console.error('Error fetching creator data:', error);
            return null; // Return null if there's an error
        }
        return data; // Return the user data
    }

    async function getData() {
        let data;
        let error;

        if (eventType === 'user') {
            // Fetch user's events
            ({ data, error } = await api.get('/get-events'));
        } else {
            // Fetch friends' events
            ({ data, error } = await api.get('/get-friends-events'));
        }

        if (error) {
            console.error('Error fetching events:', error);
            setError(error);
        } else {
            const eventsWithCreators = await Promise.all(data.map(async (event) => {
                const creatorData = await getCreatorData(event.user_id); 
                return {
                    ...event,
                    creator: creatorData || { 
                        name: 'Unknown Creator',
                        username: 'No Username',
                        profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' 
                    },
                };
            }));
            setEvents(eventsWithCreators); 
            setLoading(false); 
        }
    }

    useEffect(() => {
        getData(); // Fetch events based on the initial eventType
    }, [eventType]); // Fetch data whenever eventType changes

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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    className={`btn ${eventType === 'user' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                        setEventType('user');
                        getData(); // Fetch user events when clicked
                    }}
                    style={{ marginRight: '10px' }}
                >
                    My Events
                </button>
                <button
                    className={`btn ${eventType === 'friend' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                        setEventType('friend');
                        getData(); // Fetch friends' events when clicked
                    }}
                >
                    Friends' Events
                </button>
            </div>
            {loading ? (
                <p style={{ color: colorScheme.textColor }}>Loading...</p>
            ) : (
                <div className='container'>
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <h1 className='h1' style={styles.sectionTitle}>Upcoming Events</h1>
                        {events.length > 0 ? (
                            events.map(event => (
                                <div 
                                    key={event.id} 
                                    className='p-3 shadow rounded-lg' 
                                    style={styles.eventCard}
                                >
                                    <div style={styles.creatorInfo}>
                                        <img
                                            src={event.creator?.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                                            alt='Creator'
                                            style={styles.creatorPfp}
                                        />
                                    </div>
                                    <h2 style={styles.eventTitle}>{event.title}</h2>
                                    <p style={styles.eventDetails}>{formatDate(event.start_time)}</p>
                                    <p style={styles.eventDetails}><strong>Location:</strong> {event.location || 'Not specified'}</p>
                                    <p style={styles.eventDetails}><strong>Username:</strong> {event.creator?.username || 'No Username'}</p>
                                    <p>{event.description}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: colorScheme.textColor }}>No events available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventFeed;