import {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback,
 } from 'react';
import EventCard from './EventCard';
import { useAppContext } from '../../lib/context';

function formatTimeRange(startTime, endTime) {
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export default function EventList({ events, selectedEvent: propSelectedEvent, setSelectedEvent: propSetSelectedEvent }) {

    const context = useAppContext();
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Update local state when prop changes
    useEffect(() => {
        if (propSelectedEvent) {
            setSelectedEvent(propSelectedEvent);
        }
    }, [propSelectedEvent]);

    // Sync local state with parent state if parent state setter is provided
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        if (propSetSelectedEvent) {
            propSetSelectedEvent(event);
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
        }
    }
    
    const sortedEvents = events && events.length > 0 
        ? [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        : [];

    // Render event details when an event is selected
    const renderEventDetails = () => {
        return (
            <div>
                <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
                    <button className='btn' onClick={handleClearSelection} style={styles.backButton}>&#x2190;</button>
                    <h3 className='h3 m-0' style={styles.text}>{selectedEvent.title}</h3>
                </div>
                <p style={styles.text}>{selectedEvent.description}</p>
                <p style={styles.text}>Location: {selectedEvent.location || 'No location specified'}</p>
                <p style={styles.text}>{formatTimeRange(selectedEvent.start_time, selectedEvent.end_time)}</p>
                <p style={styles.text}>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
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
                        onClick={() => handleSelectEvent(event)}
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