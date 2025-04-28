// this is the event list component for the calendar sidebar
// it displays a list of events in a card format
// these are the events for the selected day

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventView from './EventView';

import { useAppContext } from '../../../lib/context';

import { formatDate, formatTimeRange } from '../../utility/componentUtils/dateUtils';

export default function EventList({ events, selectedEvent: propSelectedEvent, setSelectedEvent: propSetSelectedEvent }) {
    const navigate = useNavigate();
    const context = useAppContext();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [hoveredEventId, setHoveredEventId] = useState(null);

    // Update local state when prop changes
    useEffect(() => {
        if (propSelectedEvent) {
            setSelectedEvent(propSelectedEvent);
        }
    }, [propSelectedEvent]);

    // Navigate to event page when an event is clicked
    const handleEventClick = (event) => {
        const eventId = event._id || event.id;
        if (eventId) {
            navigate(`/events/${eventId}`);
        } else {
            // idk hopefully this never happens not sure what would cause this
            console.error('Event has no ID, cannot navigate');
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
        container: {
            backgroundColor: context.colorScheme.backgroundColor,
            color: context.colorScheme.textColor,
        },
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
            color: context.colorScheme.secondaryText,
            opacity: 0.7,
            textAlign: 'center',
            padding: '2rem',
        },
        eventDetail: {
            backgroundColor: context.colorScheme.secondaryBackground,
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        },
        eventItem: (isHovered) => ({
            transition: 'all 0.2s ease-in-out',
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
            cursor: 'pointer',
        })
    }
    
    const parseEventDateTime = (event) => {
        const date = new Date(event.date);
        if (event.start_time && event.start_time.length > 0) {
            const [hours, minutes] = event.start_time.split(':').map(Number);
            date.setHours(hours);
            date.setMinutes(minutes);
        } else {
            date.setHours(0);
            date.setMinutes(0);
        }
        return date;
    };

    const sortedEvents = events && events.length > 0 
        ? [...events].sort((a, b) => {
            const dateA = parseEventDateTime(a);
            const dateB = parseEventDateTime(b);
            return dateA - dateB;
        })
        : [];

    const renderEventDetails = () => {
        const formattedDate = formatDate(selectedEvent.date);
        
        return (
            <div style={styles.eventDetail}>
                <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
                    <h3 className='h3 m-0' style={styles.text}>{selectedEvent.title}</h3>
                    <button 
                        className='btn btn-sm btn-outline-secondary' 
                        onClick={handleClearSelection}
                    >
                        Back to list
                    </button>
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
                {sortedEvents.map((event, i) => {
                    const eventId = event._id || event.id || i;
                    const isHovered = hoveredEventId === eventId;
                    
                    return (
                        <div
                            key={eventId}
                            onMouseEnter={() => setHoveredEventId(eventId)}
                            onMouseLeave={() => setHoveredEventId(null)}
                            style={styles.eventItem(isHovered)}
                        >
                            <EventView 
                                onClick={() => handleEventClick(event)}
                                event={{
                                    ...event,
                                    formattedTime: formatTimeRange(event.start_time, event.end_time)
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className='p-3 d-flex flex-column w-100 h-100' style={styles.container}>
            {selectedEvent ? renderEventDetails() : renderEventList()}
        </div>
    );
}