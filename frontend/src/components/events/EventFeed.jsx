import { useState, useEffect } from 'react';
import EventList from './EventList';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';


function Events({ url }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState(null);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get(url);
        setError(apiError);
        setEvents(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [url]);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <EventList events={events}/>
    );
}


export default function EventFeed() {
    const [tab, setTab] = useState('my-events');
    return (
        <div className='w-100 d-flex flex-column align-items-center'>
            <div className='my-3 d-flex flex-row justify-content-center rounded-lg border overflow-hidden' style={{
                cursor: 'pointer',
            }}>
                <div
                    className={'p-2 '+(tab === 'my-events' ? 'bg-primary text-white' : '')}
                    onClick={() => setTab('my-events')}
                >My events</div>
                <div
                    className={'p-2 '+(tab === 'friends-events' ? 'bg-primary text-white' : '')}
                    onClick={() => setTab('friends-events')}
                >Friends events</div>
            </div>
            <Events url={tab === 'my-events' ? '/get-events' : '/get-friends-events'}/>
        </div>
    );
}