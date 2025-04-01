// this component is used to display the events that the user has liked
// pretty much the same as the events tab but with a different api call
// and is also used in the profile page

import { useState, useEffect } from 'react';

import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import EventsGrid from './EventsGrid';
import api from '../../lib/api';
import { useAppContext } from '../../lib/context';

export default function LikedEventsTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState(null);
    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-liked-events');
        setError(apiError);
        // Assuming the API returns the liked events directly in 'data'
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
                    <p className='m-0'>You haven't liked any events yet!</p>
                </div>
            }
        </div>
    );
    
    return null;
}
