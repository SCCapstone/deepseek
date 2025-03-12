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

export default function EventList({ events, date }) {

    const context = useAppContext();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        },
        border: {
            width: 4,
            backgroundColor: context.colorScheme.accentColor,
            cursor: 'ew-resize',
        },
    }
    const sortedEvents = [...events].sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
    );

    return (
        <div className='p-3 d-flex flex-column w-100'>
        {selectedEvent ?
            <div>
                <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
                    <button className='btn' onClick={() => setSelectedEvent(null)}>&#x2190;</button>
                    <h3 className='h3 m-0'>{selectedEvent.title}</h3>
                </div>
                <p>{selectedEvent.description}</p>
                <p>Location: {selectedEvent.location}</p>
                <p>{formatTimeRange(selectedEvent.start_time, selectedEvent.end_time)}</p>
            </div>
        :
            <div>
                <h3 className='h3' style={styles.text}>{date.toDateString()}</h3>
                {sortedEvents.map((event, i) =>
                    <EventCard 
                        key={i}
                        onClick={() => setSelectedEvent(event)}
                        event={{
                            ...event,
                            formattedTime: formatTimeRange(event.start_time, event.end_time)
                        }}
                    />
                )}
            </div>
        }
        </div>
    );
}