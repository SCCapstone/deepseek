// base component for the profile tabs
// it displays the tabs for the profile page

import { useState } from 'react';

import EventsTab from './EventsTab';
import FriendsTab from './FriendsTab';
import { useAppContext } from '../../lib/context';


function TabButton({ active, label, onClick }) {
    const context = useAppContext();
    const [isHovered, setIsHovered] = useState(false);

    const styles = {
        tab: {
            backgroundColor: context.colorScheme.tertiaryBackground,
            transition: 'background-color 0.2s ease',
        },
        tabHovered: {
            backgroundColor: `${context.colorScheme.tertiaryBackground}65`,
        },
    };

    return (
        <button className='w-100 p-3 font-weight-bold' onClick={onClick} style={{
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: (active ? 4 : 0),
            borderColor: context.colorScheme.accentColor,
            outline: 'none',
            ...styles.tab,
            ...(isHovered ? styles.tabHovered : {}),
            color: context.colorScheme.textColor,
            transition: 'all 0.2s ease',
            borderRadius: '3px',
        }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{label}</button>
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
    const context = useAppContext();
    const [tab, setTab] = useState('events');

    return (
        <div>
            <div
                className='w-100 d-flex flex-row justify-content-between align-items-center'
                style={{gap: 15,
                    padding: '15px',
                    backgroundColor: 'transparent',
                }}

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