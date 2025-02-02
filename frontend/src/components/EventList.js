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
    const MAX_SIDEBAR_WIDTH = 500;
    const DEFAULT_SIDEBAR_WIDTH = 400;
    const context = useAppContext();
    const sidebarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const [isResizing, setIsResizing] = useState(false);

    const styles = {
        container: {
            width: sidebarWidth,
        },
        text: {
            color: context.colorScheme.textColor,
        },
        border: {
            width: 2,
            backgroundColor: context.colorScheme.accentColor,
            cursor: 'ew-resize',
        },
    }

    const resize = useCallback((event) => {
        if (isResizing) {
            const newWidth = sidebarRef.current.getBoundingClientRect().right - event.clientX;
            if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH)
                setSidebarWidth(newWidth);
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
            style={{ width: sidebarWidth }}
            className='d-flex flex-row justify-content-start shadow-sm'>
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