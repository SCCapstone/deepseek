// this is the event feed component for the calendar sidebar
// it displays a list of events in a card format
// these are the events under event feed

import { useState, useEffect } from 'react';

import EventList from './EventList';

import Loading from '../../utility/Loading';
import Alert from '../../utility/Alert';

import api from '../../../lib/api';
import { useAppContext } from '../../../lib/context';


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
                    backgroundColor: context.colorScheme.tertiaryBackground,
                    color: context.colorScheme.textColor,
                }}
            >
                <div
                    className={'p-2 rounded-left '+(tab === 'my-events' ? 'text-white' : '')}
                    onClick={() => setTab('my-events')}
                    style={{
                        backgroundColor: tab === 'my-events' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground,
                        color: context.colorScheme.textColor,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                        if (tab === 'my-events') {
                            e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}dd`;
                        } else {
                            e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.05)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = tab === 'my-events' ? context.colorScheme.accentColor : context.colorScheme.secondaryBackground;
                    }}
                >My events</div>
                <div
                    className={'p-2 rounded-right '+(tab === 'friends-events' ? 'text-white' : '')}
                    onClick={() => setTab('friends-events')}
                    style={{
                        backgroundColor: tab === 'friends-events' ? context.colorScheme.accentColor : context.colorScheme.tertiaryBackground,
                        color: context.colorScheme.textColor,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                        if (tab === 'friends-events') {
                            e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}dd`;
                        } else {
                            e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.05)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = tab === 'friends-events' ? context.colorScheme.accentColor : context.colorScheme.tertiaryBackground;
                    }}
                >Friends events</div>
            </div>
            <div className='w-100 flex-grow-1 flex-shrink-1' style={{overflowY: 'auto'}}>
                <Events url={tab === 'my-events' ? '/get-events' : '/get-friends-events'}/>
            </div>
        </div>
    );
}