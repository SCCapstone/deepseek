// this is the home page component
// it displays the calendar and the sidebar

import { useState, useEffect, useRef } from 'react';

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
    const isMounted = useRef(false);

    async function getData(isInitialLoad = false) {
        if (isInitialLoad) {
            console.log("getData (Initial): Fetching events...");
        } else {
            console.log(`getData (Date Change): Fetching events for ${selectedDate.toDateString()}...`);
        }
        setError(null);
        setLoading(false);
        try {
            if (!context.authToken || !context.user) {
                throw new Error('Not authenticated');
            }

            console.log("getData: Fetching events...");
            const [userEventsResponse, friendEventsResponse] = await Promise.all([
                api.get('/get-events'),
                api.get('/get-friends-events')
            ]);

            if (userEventsResponse.error) {
                throw new Error(`Failed to load your events: ${userEventsResponse.error}`);
            }
            if (friendEventsResponse.error) {
                throw new Error(`Failed to load friends' events: ${friendEventsResponse.error}`);
            }

            const userEvents = (userEventsResponse.data || []).map(event => ({ 
                ...event, 
                isOwnEvent: true 
            }));
            
            const friendEvents = (friendEventsResponse.data || []).map(event => ({ 
                ...event, 
                isOwnEvent: false 
            }));

            const allEvents = [...userEvents, ...friendEvents];
            
            if (isInitialLoad) {
                console.log("getData (Initial): Events received, updating state.");
            } else {
                console.log(`getData (Date Change): Events received for ${selectedDate.toDateString()}, updating state.`);
            }
            setEvents(allEvents);

        } catch (err) {
            console.error("Error fetching events:", err);
            setError(err.message || 'Could not load all event data.');
            setEvents([]);
        } finally {
            if (isMounted.current) {
                setLoading(false);
                if (isInitialLoad) {
                     console.log("getData (Initial): Fetch complete.");
                } else {
                     console.log(`getData (Date Change): Fetch complete for ${selectedDate.toDateString()}.`);
                }
            }
        }
    }

    useEffect(() => {
        console.log(`useEffect [Auth]: Running. Context token: ${context.authToken ? context.authToken.substring(0,5)+'...' : 'None'}`);
        
        isMounted.current = true;

        if (context.authToken && context.user) {
            console.log(`useEffect [Auth]: Context token found. Running initial getData...`);
            getData(true);
        } else {
            console.log("useEffect [Auth]: No token in context. Clearing data.");
            setEvents([]);
            setLoading(false);
        }

        return () => {
            isMounted.current = false;
            console.log("useEffect [Auth]: Cleanup - component unmounting");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.authToken, context.user]);

    const handleDateChange = (date) => {
        console.log(`handleDateChange: Date selected - ${date.toDateString()}`);
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        
        setSelectedDate(newDate);
        setLoading(true);

        if (context.authToken && context.user) {
            console.log(`handleDateChange: Triggering getData for new date.`);
            getData(false);
        } else {
            console.log(`handleDateChange: User not authenticated, not fetching data.`);
            setLoading(false);
        }
    }
    
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setTab('selected-date');
    }

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
  
    return (
        <>
            <NavBar onEventCreated={getData} /> 
            <div className='w-100 flex-grow-1 flex-shrink-1 d-flex flex-row' style={{backgroundColor: context.colorScheme.backgroundColor, color: context.colorScheme.textColor}}>
                <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', height: 'calc(100vh - 56px)', width: '100%' }}>
                    {loading ? (
                        <Loading /> 
                    ) : error ? (
                        <Alert message={error} hideAlert={() => setError(null)}/>
                    ) : (
                        <Calendar
                            onChange={handleDateChange}
                            selectedDate={selectedDate}
                            events={events}
                            onEventSelect={handleEventSelect}
                        />
                    )}
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