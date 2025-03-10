import { useState, useEffect } from 'react';
import Loading from '../Loading';
import Alert from '../Alert';
import EventsGrid from './EventsGrid';
import api from '../../lib/api';


export default function EventsTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState(null);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-events');
        setError(apiError);
        setEvents(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading className='mb-3'/>

    if (events) return (
        <div>
            {events.length > 0 ?
                <div>
                    <EventsGrid events={events}/>
                </div>
            :
                <div className='p-5 d-flex flex-column justify-content-center align-items-center'>
                    <p className='m-0'>Nothing to see here!</p>
                    <a href='/create-event'>Create an event &#8594;</a>
                </div>
            }
        </div>
    );
    
    return null;
}