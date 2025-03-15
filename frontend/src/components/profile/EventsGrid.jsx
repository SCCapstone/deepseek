import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../utility/dateUtils';

function EventCard({ event }) {
    const navigate = useNavigate();
    const formattedDate = formatDate(event.date);
    const formattedTime = event.start_time ? formatTime(event.start_time) : '';

    return (
        <button
            onClick={() => navigate('/events/' + event.id)}
            className='p-2 d-flex flex-column justify-content-start
            border-0 align-items-center rounded bg-light'
        >
            <h4 className='h4 w-100 text-left mb-0'>{event.title}</h4>
            {event.location && <p className='w-100 text-left mb-0'>{event.location}</p>}
            <p className='w-100 text-left mb-0'>
                {formattedDate}
            </p>
            {formattedTime && (
                <p className='w-100 text-left mb-0'>
                    {formattedTime}
                </p>
            )}
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