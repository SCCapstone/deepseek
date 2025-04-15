// this is the navbar component
// it displays the navbar at the top of the page

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import SearchBar from './SearchBar';
import ProfileIcon from './ProfileIcon';
import NotificationsWidgetContainer from './notifications/NotificationsWidgetContainer';
import SettingsWidget from './SettingsWidget';

import CreateEvent from '../events/create/CreateEvent';

import CalendarIcon from '../../assets/calendar.png';

import { useAppContext } from '../../lib/context';


export default function NavBar({ onEventCreated }) {
    const [creatingEvent, setCreatingEvent] = useState(false);
    const context = useAppContext();
    const { pathname } = useLocation();
    if (pathname === '/' || pathname === '/login' || pathname === '/register')
        return null;

    return (
        <>
            <header
                className='w-100 position-relative d-flex flex-row p-2 align-items-center justify-content-between'
                style={{backgroundColor: context.colorScheme.tertiaryBackground}}
            >
                <div className='d-flex flex-row align-items-center'>
                    <Link 
                        to='/calendar' 
                        className='p-2 font-weight-bold d-flex flex-row align-items-center mr-3' 
                        style={{
                            color: context.colorScheme.textColor, 
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <img
                            style={{
                                width: '30px',
                            }}
                            src={CalendarIcon}
                            className='mr-3'
                        />
                        <p className='m-0'>CalendarMedia</p>
                    </Link>
                    <button
                        className='btn d-flex flex-row align-items-center'
                        onClick={() => setCreatingEvent(true)}
                        style={{
                            backgroundColor: context.colorScheme.accentColor, 
                            color: '#ffffff',
                            transition: 'background-color 0.2s ease, transform 0.1s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}cc`;
                            e.currentTarget.style.transform = 'scale(1.03)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = context.colorScheme.accentColor;
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <div className='mr-1'>Create</div>
                        <FaPlus size={16} color='white'/>
                    </button>
                </div>
                <SearchBar/>
                <div className='d-flex flex-row align-items-center'>
                    <NotificationsWidgetContainer className='mr-3'/>
                    <SettingsWidget className='mr-3'/>
                    <ProfileIcon/>
                </div>
            </header>
            <CreateEvent 
                showEditor={creatingEvent} 
                hideEditor={() => setCreatingEvent(false)}
                onEventCreated={onEventCreated}
            />
        </>
    );
};