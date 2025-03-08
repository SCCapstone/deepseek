import { useState } from 'react';
import EventsTab from './EventsTab';


function TabButton({ active, label, onClick }) {
    return (
        <button className='w-100 p-3 font-weight-bold' onClick={onClick} style={{
            borderBottomWidth: (active ? 4 : 0),
            borderColor: 'rgb(0, 0, 255)',
            outline: 'none',
            backgroundColor: (active ? 'rgb(215, 215, 215)' : null)
        }}>{label}</button>
    );
}

const renderTab = (tab) => {
    switch(tab) {
        case 'events':
            return <EventsTab/>
    }
    return null;
}

export default function ProfileTabs() {
    const [tab, setTab] = useState('events');

    return (
        <div>
            <div
                className='p-1 mb-3 d-flex flex-row justify-content-between align-items-center'
                style={{
                    gap: 10,
                }}
            >
                <TabButton active={tab === 'events'} onClick={() => setTab('events')} label='Events'/>
                <TabButton active={tab === 'comments'} onClick={() => setTab('comments')} label='Comments'/>
                <TabButton active={tab === 'friends'} onClick={() => setTab('friends')} label='Friends'/>
                <TabButton
                    active={tab === 'friend-requests'}
                    onClick={() => setTab('friend-requests')}
                    label='Friend requests'
                />
            </div>
            {renderTab(tab)}
        </div>
    );
}