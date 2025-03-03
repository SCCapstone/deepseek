import {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback,
 } from 'react';
import EventCard from './EventCard.js';
import { useAppContext } from '../lib/context';

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
    const MIN_SIDEBAR_WIDTH = 200;
    const MAX_SIDEBAR_WIDTH = 600;
    const DEFAULT_SIDEBAR_WIDTH = 300;

    const context = useAppContext();
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, sidebarWidthSetter] = useState(() => {
        const savedWidth = localStorage.getItem('events_sidebar_width');
        if (savedWidth)
            return parseInt(savedWidth);
        return DEFAULT_SIDEBAR_WIDTH;
    });
    const setSidebarWidth = useCallback((value) => {
        sidebarWidthSetter(() => {
            localStorage.setItem('events_sidebar_width', value);
            return value;
        });
    }, [sidebarWidthSetter]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const styles = {
        container: {
            width: sidebarWidth,
        },
        text: {
            color: context.colorScheme.textColor,
        },
        border: {
            width: 4,
            backgroundColor: context.colorScheme.accentColor,
            cursor: 'ew-resize',
        },
    }

    const resize = useCallback((event) => {
        if (isResizing) {
            const newWidth = sidebarRef.current.getBoundingClientRect().right - event.clientX;
            if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    const startResizing = useCallback((event) => {
        event.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        }
    }, [resize, stopResizing]);

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
    );

    return (
        <div
            ref={sidebarRef}
            className='d-flex flex-row justify-content-start'
            style={styles.container}>
            <div className='h-100' style={styles.border} onMouseDown={startResizing}></div>
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
        </div>
    );
}