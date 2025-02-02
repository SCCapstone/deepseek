import { useContext } from 'react';
import EventCard from './EventCard.js';
import { AppContext } from '../lib/context';


export default function EventList({ events, date }) {
    const context = useContext(AppContext);

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        }
    }

    return (
        <div className='d-flex flex-column w-25 p-3 shadow-sm border-left'>
            <h3 className='h3' style={styles.text}>{date.toDateString()}</h3>
            {events.map((event, i) =>
                <EventCard key={i} event={event}/>
            )}
        </div>
    );
}