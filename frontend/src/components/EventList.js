import EventCard from './EventCard.js';


export default function EventList({ events, date }) {
    return (
        <div className='h-100 p-3 shadow-sm border-left' style={{width: '25%'}}>
            <h3 className='h3'>{date.toDateString()}</h3>
            {events.map((event, i) =>
                <EventCard key={i} event={event}/>
            )}
        </div>
    );
}