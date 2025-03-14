import { useState } from 'react';
import EventsTab from './EventsTab';
import FriendsTab from './FriendsTab';


function TabButton({ active, label, onClick }) {
    return (
        <button className='w-100 p-3 font-weight-bold' onClick={onClick} style={{
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: (active ? 4 : 0),
            borderColor: 'rgb(100, 100, 255)',
            outline: 'none',
            backgroundColor: (active ? 'rgb(215, 215, 215)' : null)
        }}>{label}</button>
    );
}

function Tab({ tab, username }) {
    switch(tab) {
        case 'events':
            return <EventsTab username={username}/>
        case 'friends':
            return <FriendsTab username={username}/>
        default:
            return null;
    }
}

export default function ProfileTabs({ username }) {
    const [tab, setTab] = useState('events');

    return (
        <div>
            <div
                className='p-1 mb-3 d-flex flex-row justify-content-between align-items-center'
                style={{gap: 10}}
            >
                <TabButton active={tab === 'events'} onClick={() => setTab('events')} label='Events'/>
                <TabButton active={tab === 'reposts'} onClick={() => setTab('reposts')} label='Reposts'/>
                <TabButton active={tab === 'comments'} onClick={() => setTab('comments')} label='Comments'/>
                <TabButton active={tab === 'friends'} onClick={() => setTab('friends')} label='Friends'/>
            </div>
            <div className='mb-3'>
                <Tab tab={tab} username={username}/>
            </div>
        </div>
    );
}