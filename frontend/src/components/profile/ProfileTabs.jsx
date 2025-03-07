import { useState } from 'react';


function TabButton({ active, label, onClick }) {
    return (
        <button className='w-100 p-3' onClick={onClick} style={{
            borderBottomWidth: (active ? 4 : 0),
            borderColor: 'rgb(0, 0, 200)',
            outline: 'none',
            backgroundColor: (active ? 'rgb(200, 200, 200)' : null)
        }}>{label}</button>
    );
}


export default function ProfileTabs() {
    const [tab, setTab] = useState('events');

    return (
        <div>
            <div
                className='d-flex flex-row justify-content-between align-items-center'
                style={{
                    gap: 10,
                }}
            >
                <TabButton active={tab === 'events'} onClick={() => setTab('events')} label='Events'/>
                <TabButton active={tab === 'friends'} onClick={() => setTab('friends')} label='Friends'/>
                <TabButton active={tab === 'friend-requests'} onClick={() => setTab('friend-requests')} label='Friend requests'/>
                <TabButton active={tab === 'comments'} onClick={() => setTab('comments')} label='Comments'/>
            </div>
        </div>
    );
}