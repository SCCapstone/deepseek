import {
    useEffect,
    useState,
    useContext,
 } from 'react';
import EventCard from './EventCard.js';
import { AppContext } from '../lib/context';


export default function EventList({ events, date }) {
    const context = useContext(AppContext);
    const [width, setWidth] = useState(300);

    const styles = {
        container: {
            width: width,
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

    return (
        <div style={styles.container} className='d-flex flex-row justify-content-start shadow-sm'>
            <div className='h-100' style={styles.border}></div>
            <div className='p-3 d-flex flex-column'>
                <h3 className='h3' style={styles.text}>{date.toDateString()}</h3>
                {events.map((event, i) =>
                    <EventCard key={i} event={event}/>
                )}
            </div>
        </div>
    );
}