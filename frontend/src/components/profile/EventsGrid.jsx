import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../utility/dateUtils';
import { useAppContext } from '../../lib/context';

function EventCard({ event }) {
    const navigate = useNavigate();
    const formattedDate = formatDate(event.date);
    const formattedTime = event.start_time ? formatTime(event.start_time) : '';
    const context = useAppContext();
    return (
        <button
            onClick={() => navigate('/events/' + event.id)}
            className='p-2 d-flex flex-column justify-content-start
            border-0 align-items-center rounded'
            style={{
                backgroundColor: context.colorScheme.tertiaryBackground,
                color: context.colorScheme.textColor,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = context.colorScheme.name === 'dark' 
                    ? '0 4px 8px rgba(0, 0, 0, 0.4)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                    ? `${context.colorScheme.tertiaryBackground}cc` 
                    : `${context.colorScheme.tertiaryBackground}ee`;
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground;
            }}
        >
            <h4 className='h4 w-100 text-left mb-0' style={{color: context.colorScheme.textColor}}>{event.title}</h4>
            {event.location && <p className='w-100 text-left mb-0' style={{color: context.colorScheme.textColor}}>{event.location}</p>}
            <p className='w-100 text-left mb-0' style={{color: context.colorScheme.textColor}}>
                {formattedDate}
            </p>
            {formattedTime && (
                <p className='w-100 text-left mb-0' style={{color: context.colorScheme.textColor}}>
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