import {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback,
 } from 'react';
import EventCard from './EventCard.js';
import { useAppContext } from '../lib/context';


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

    return (
        <div
            ref={sidebarRef}
            className='d-flex flex-row justify-content-start'
            style={styles.container}>
            <div className='h-100' style={styles.border} onMouseDown={startResizing}></div>
            <div className='p-3 d-flex flex-column w-100'>
                <h3 className='h3' style={styles.text}>{date.toDateString()}</h3>
                {events.map((event, i) =>
                    <EventCard key={i} event={event}/>
                )}
            </div>
        </div>
    );
}