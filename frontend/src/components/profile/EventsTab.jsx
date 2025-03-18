// this is the events tab component
// it displays the events tab for the profile page

import { useState, useEffect } from 'react';

import Loading from '../utility/Loading';
import Alert from '../utility/Alert';

import EventsGrid from './EventsGrid';

import api from '../../lib/api';
import { useAppContext } from '../../lib/context';

export default function EventsTab({ username }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState(null);
    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        let url;
        if (!username)
            url = '/get-events'
        else
            url = '/get-user-events/' + username;
        const { data, error: apiError } = await api.get(url);
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
                <div className='p-2 d-flex flex-column justify-content-center align-items-center'
                    style={{
                        borderRadius: '8px',
                        backgroundColor: context.colorScheme.tertiaryBackground,
                        transition: 'background-color 0.2s ease'
                    }}
                >
                    <p className='m-0'>Nothing to see here!</p>
                </div>
            }
        </div>
    );
    
    return null;
}