import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Event({ event }) {
    const navigate = useNavigate();

    const handleClick = () => navigate('/events/' + event.id);

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
                <p className='text-muted m-0'>{(new Date(event.date)).toDateString()}</p>
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
    return (
        <div className='p-2 w-100 d-flex flex-column'>
            {events.map((event, i) => <Event key={i} event={event}/>)}
        </div>
    );
}