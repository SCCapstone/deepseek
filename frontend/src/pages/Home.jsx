// this is the home page component
// it displays the calendar and the sidebar

import { useState, useEffect } from 'react';

import Calendar from '../components/calendar/Calendar';
import Sidebar from '../components/utility/Sidebar';
import EventList from '../components/calendar/sidebar/EventList';
import EventFeed from '../components/calendar/sidebar/EventFeed';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';
import NavBar from '../components/navbar/NavBar';

import api from '../lib/api';
import { useAppContext } from '../lib/context';


export default function Home() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('selected-date');
    const context = useAppContext();

    async function getData() {
        // getData is called on each time a day is selected
        // however do not show the refresh
        setError(null); // Clear previous errors
        try {
            // Fetch user's events and friends' events concurrently
            const [userEventsResponse, friendEventsResponse] = await Promise.all([
                api.get('/get-events'),
                api.get('/get-friends-events')
            ]);

            // Check for errors in user events response
            if (userEventsResponse.error) {
                throw new Error(`Failed to load your events: ${userEventsResponse.error}`);
            }
            // Check for errors in friend events response
            if (friendEventsResponse.error) {
                throw new Error(`Failed to load friends' events: ${friendEventsResponse.error}`);
            }

            // Add flag to distinguish user's events
            const userEvents = (userEventsResponse.data || []).map(event => ({ 
                ...event, 
                isOwnEvent: true 
            }));
            
            // Add flag to distinguish friends' events
            const friendEvents = (friendEventsResponse.data || []).map(event => ({ 
                ...event, 
                isOwnEvent: false 
            }));

            // Combine events, maybe filter duplicates if necessary (e.g., if an event could appear in both lists)
            // Simple concatenation for now
            const allEvents = [...userEvents, ...friendEvents];
            
            setEvents(allEvents);

        } catch (err) {
            console.error("Error fetching events:", err);
            setError(err.message || 'Could not load all event data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [selectedDate]);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }
    
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setTab('selected-date');
    }

    // something is off with the date
    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        d1.setDate(d1.getDate() + 1);
        
        const d2 = new Date(date2);
        
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };
  
    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <>
            <NavBar onEventCreated={getData} />
            <div className='w-100 flex-grow-1 flex-shrink-1 d-flex flex-row' style={{overflowY: 'hidden', backgroundColor: context.colorScheme.backgroundColor, color: context.colorScheme.textColor}}>
                <div className='w-100 h-100'>
                    <Calendar
                        onChange={handleDateChange}
                        selectedDate={selectedDate}
                        events={events}
                        onEventSelect={handleEventSelect}
                    />
                </div>
                <Sidebar>
                    <div className='d-flex flex-row justify-content-between w-100 border-bottom' style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}>
                        <div
                            className={'p-2 w-100 text-center '+(tab === 'selected-date' ? 'text-white' : '')}
                            onClick={() => setTab('selected-date')}
                            style={{backgroundColor: tab === 'selected-date' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground, 
                                color: context.colorScheme.textColor, 
                                cursor: 'pointer'}}
                            onMouseOver={(e) => {
                                if (tab === 'selected-date') {
                                    e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}dd`;
                                } else {
                                    e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.05)';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = tab === 'selected-date' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground;
                            }}
                        >
                            {selectedDate.toDateString()}
                        </div>
                        <div
                            className={'p-2 w-100 text-center '+(tab === 'event-feed' ? 'text-white' : '')}
                            onClick={() => setTab('event-feed')}
                            style={{backgroundColor: tab === 'event-feed' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground, 
                                color: context.colorScheme.textColor, 
                                cursor: 'pointer'}}
                            onMouseOver={(e) => {
                                if (tab === 'event-feed') {
                                    e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}dd`;
                                } else {
                                    e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.05)';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = tab === 'event-feed' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground;
                            }}
                        >
                            Event feed
                        </div>
                    </div>
                    {tab === 'selected-date' ?
                        <EventList
                            events={events.filter(event => {
                                const eventDate = new Date(event.date);
                                return isSameDay(eventDate, selectedDate);
                            })}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={setSelectedEvent}
                        />
                    : <EventFeed/>}
                </Sidebar>
            </div>
        </>
    );
}