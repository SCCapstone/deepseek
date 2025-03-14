import { useNavigate } from 'react-router-dom';


function EventCard({ event }) {
    const navigate = useNavigate();
    const eventDate = new Date(event.date);

    if (event.start_time && event.start_time.length > 0) {
        const timeSplit = event.start_time.split(':');
        const hours = timeSplit[0];
        const mins = timeSplit[1];
        eventDate.setHours(hours);
        eventDate.setMinutes(mins);
    }

    return (
        <button
            onClick={() => navigate('/events/' + event.id)}
            className='p-2 d-flex flex-column justify-content-start
            border-0 align-items-center rounded bg-light'
        >
            <h4 className='h4 w-100 text-left mb-0'>{event.title}</h4>
            <p className='w-100 text-left mb-0'>{event.location}</p>
            <p className='w-100 text-left mb-0'>
                {eventDate.toLocaleString('utc', {
                    dateStyle: 'short',
                })}
            </p>
            {event.start_time && event.start_time.length > 0 ?
                <p className='w-100 text-left mb-0'>
                    {eventDate.toLocaleTimeString('utc', {timeStyle: 'short'})}
                </p>
            : null}
        </button>
    );
}


export default function EventsGrid({ events }) {
    return (
        <div
            className='p-1'
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: 12,
            }}
        >
            {events.map((event, i) => <EventCard key={i} event={event}/>)}
        </div>
    );
}