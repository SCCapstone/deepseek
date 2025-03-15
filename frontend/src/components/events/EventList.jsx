import {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback,
 } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { useAppContext } from '../../lib/context';
import { formatDate, formatTimeRange } from '../utility/dateUtils';

// Debug code to check if this file exists
console.log('EventList in events folder exists');

export default function EventList({ events, selectedEvent: propSelectedEvent, setSelectedEvent: propSetSelectedEvent }) {
    const navigate = useNavigate();
    const context = useAppContext();
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Update local state when prop changes
    useEffect(() => {
        if (propSelectedEvent) {
            setSelectedEvent(propSelectedEvent);
        }
    }, [propSelectedEvent]);

    // Navigate to event page when an event is clicked
    const handleEventClick = (event) => {
        // Navigate to event page
        const eventId = event._id || event.id;
        if (eventId) {
            navigate(`/events/${eventId}`);
        } else {
            console.error('Event has no ID, cannot navigate');
            // Fall back to showing event details in the sidebar
            setSelectedEvent(event);
            if (propSetSelectedEvent) {
                propSetSelectedEvent(event);
            }
        }
    };

    const handleClearSelection = () => {
        setSelectedEvent(null);
        if (propSetSelectedEvent) {
            propSetSelectedEvent(null);
        }
    };

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        },
        border: {
            width: 4,
            backgroundColor: context.colorScheme.accentColor,
            cursor: 'ew-resize',
        },
        emptyState: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: context.colorScheme.textColor,
            opacity: 0.7,
            textAlign: 'center',
            padding: '2rem',
        },
        backButton: {
            color: context.colorScheme.textColor,
        },
        eventDetail: {
            backgroundColor: context.colorScheme.name === 'dark' ? '#2d2d2d' : '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }
    }
    
    const sortedEvents = events && events.length > 0 
        ? [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        : [];

    // Render event details when an event is selected
    const renderEventDetails = () => {
        // Use our centralized date formatter
        const formattedDate = formatDate(selectedEvent.date);
        
        return (
            <div style={styles.eventDetail}>
                <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
                    <button className='btn' onClick={handleClearSelection} style={styles.backButton}>&#x2190;</button>
                    <h3 className='h3 m-0' style={styles.text}>{selectedEvent.title}</h3>
                </div>
                {selectedEvent.description && (
                    <p style={styles.text}>{selectedEvent.description}</p>
                )}
                {selectedEvent.location && (
                    <p style={styles.text}><strong>Location:</strong> {selectedEvent.location}</p>
                )}
                <p style={styles.text}><strong>Date:</strong> {formattedDate}</p>
                {selectedEvent.start_time && selectedEvent.end_time && (
                    <p style={styles.text}><strong>Time:</strong> {formatTimeRange(selectedEvent.start_time, selectedEvent.end_time)}</p>
                )}
                {selectedEvent.set_reminder && (
                    <p style={styles.text}><strong>Reminder:</strong> Enabled</p>
                )}
            </div>
        );
    };

    // Render empty state when no events are available
    const renderEmptyState = () => {
        return (
            <div style={styles.emptyState}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📅</div>
                <h4 style={styles.text}>No events for this day</h4>
                <p style={styles.text}>Select a different day or create a new event</p>
            </div>
        );
    };

    // Render event list
    const renderEventList = () => {
        if (sortedEvents.length === 0) {
            return renderEmptyState();
        }

        return (
            <div>
                {sortedEvents.map((event, i) =>
                    <EventCard 
                        key={i}
                        onClick={() => handleEventClick(event)}
                        event={{
                            ...event,
                            formattedTime: formatTimeRange(event.start_time, event.end_time)
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <div className='p-3 d-flex flex-column w-100 h-100'>
            {selectedEvent ? renderEventDetails() : renderEventList()}
        </div>
    );
}