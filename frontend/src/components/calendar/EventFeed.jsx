import { useState, useEffect } from 'react';
import EventList from './EventList';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import { useAppContext } from '../../lib/context';


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
    const context = useAppContext();

    return (
        <div className='w-100 d-flex flex-column align-items-center overflow-hidden'>
            <div
                className='my-2 d-flex flex-row justify-content-center rounded-lg border'
                style={{
                    cursor: 'pointer',
                    backgroundColor: context.colorScheme.secondaryBackground,
                    color: context.colorScheme.textColor,
                }}
            >
                <div
                    className={'p-2 rounded-left '+(tab === 'my-events' ? 'bg-primary text-white' : '')}
                    onClick={() => setTab('my-events')}
                    style={{
                        backgroundColor: context.colorScheme.secondaryBackground,
                        color: context.colorScheme.textColor,
                    }}
                >My events</div>
                <div
                    className={'p-2 rounded-right '+(tab === 'friends-events' ? 'bg-primary text-white' : '')}
                    onClick={() => setTab('friends-events')}
                    style={{
                        backgroundColor: context.colorScheme.secondaryBackground,
                        color: context.colorScheme.textColor,
                    }}
                >Friends events</div>
            </div>
            <div className='w-100 flex-grow-1 flex-shrink-1' style={{overflowY: 'auto'}}>
                <Events url={tab === 'my-events' ? '/get-events' : '/get-friends-events'}/>
            </div>
        </div>
    );
}