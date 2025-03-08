import { useNavigate } from 'react-router-dom';


function EventCard({ event }) {
    const navigate = useNavigate();
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);

    return (
        <button
            onClick={() => navigate('/events/' + event.id)}
            className='p-2 d-flex flex-column justify-content-start align-items-center rounded bg-light'
        >
            <h4 className='h4 w-100 text-left'>{event.title}</h4>
            <p className='w-100 text-left'>{event.location}</p>
            <p className='w-100 text-left'>
                {startDate.getMonth()}/{startDate.getDate()} {startDate.getHours()}:{startDate.getMinutes()}
                -{endDate.getHours()}:{endDate.getMinutes()}
            </p>
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