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
    const context = useAppContext();
    const sidebarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(300);
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
            setSidebarWidth(
                sidebarRef.current.getBoundingClientRect().right - event.clientX
            )
        }
    }, [isResizing]);

    const startResizing = useCallback(() => {
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
            <div className='p-3 d-flex flex-column'>
                <h3 className='h3' style={styles.text}>{date.toDateString()}</h3>
                {events.map((event, i) =>
                    <EventCard key={i} event={event}/>
                )}
            </div>
        </div>
    );
}