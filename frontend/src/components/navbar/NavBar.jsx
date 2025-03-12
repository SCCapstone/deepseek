import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import SearchBar from './SearchBar';
import ProfileIcon from './ProfileIcon';
import NotificationsWidget from './NotificationsWidget';
import SettingsWidget from './SettingsWidget';
import CreateEvent from '../events/CreateEvent';
import CalendarIcon from '../../assets/calendar.png';


export default function NavBar() {
    const [creatingEvent, setCreatingEvent] = useState(false);
    const { pathname } = useLocation();
    if (pathname === '/' || pathname === '/login' || pathname === '/register')
        return null;

    return (
        <>
            <header
                className='position-relative d-flex flex-row p-2 align-items-center justify-content-between'
                style={{backgroundColor: '#eee'}}
            >
                <div className='d-flex flex-row align-items-center'>
                    <Link to='/calendar' className='text-dark p-2 font-weight-bold d-flex flex-row align-items-center mr-3'>
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
                        className='btn btn-primary d-flex flex-row align-items-center'
                        onClick={() => setCreatingEvent(true)}
                    >
                        <div className='mr-1'>Create</div>
                        <FaPlus size={16} color='white'/>
                    </button>
                </div>
                <SearchBar/>
                <div className='d-flex flex-row align-items-center'>
                    <NotificationsWidget className='mr-3'/>
                    <SettingsWidget className='mr-3'/>
                    <ProfileIcon/>
                </div>
            </header>
            <CreateEvent showEditor={creatingEvent} hideEditor={() => setCreatingEvent(false)}/>
        </>
    );
};