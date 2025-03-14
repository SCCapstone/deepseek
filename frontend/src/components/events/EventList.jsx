import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Event({ event }) {
    const navigate = useNavigate();

    const handleClick = () => navigate('/events/' + event.id);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateParts = event.date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const eventDate = new Date(year, month, day);

    return (
        <div
            className='mb-3 p-2 w-100 d-flex flex-row bg-light rounded'
            onClick={handleClick}
            style={{cursor: 'pointer'}}
        >
            <div>
                <div className='mb-2'>
                    <p className='m-0'>{event.title}</p>
                    {event.user ?
                        <p className='m-0 text-muted'>@{event.user.username}</p>
                    : null}
                </div>
                <p className='text-muted m-0'>{eventDate.toDateString()}</p>
                <p className='text-muted m-0'>
                    {event.start_time && event.start_time.length > 0 ? (
                        event.start_time + '-' + event.end_time
                    ) : 'All day'}
                </p>
            </div>
        </div>
    );
}


export default function EventList({ events }) {
    const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (a.date === b.date) {
            const hasStartTimeA = a.start_time && a.start_time.length > 0;
            const hasStartTimeB = b.start_time && b.start_time.length > 0;

            if (!hasStartTimeA)
                return -1;

            if (!hasStartTimeB)
                return 1;

            const hoursA = parseInt(a.start_time.split(':')[0]);
            const minsA = parseInt(a.start_time.split(':')[1]);
            const hoursB = parseInt(b.start_time.split(':')[0]);
            const minsB = parseInt(b.start_time.split(':')[1]);

            dateA.setHours(hoursA);
            dateA.setMinutes(minsA);
            dateB.setHours(hoursB);
            dateB.setMinutes(minsB);
        }
        return dateA - dateB;
    });

    return (
        <div className='p-2 w-100 d-flex flex-column'>
            {sortedEvents.map((event, i) => <Event key={i} event={event}/>)}
        </div>
    );
}