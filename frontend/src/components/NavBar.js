import React from 'react';
import { Link } from 'react-router-dom';


export default function NavBar() {
    return (
        <header className='d-flex flex-row p-2 shadow-sm'>
            <Link to='/' className='p-2 text-dark font-weight-bold'>CalendarMedia</Link>
            <Link to='/profile' className='p-2 text-dark'>Profile</Link>
            <Link to='/calendar' className='p-2 text-dark'>Calendar</Link>
            <Link to='/create-event' className='p-2 text-dark'>Create Event</Link>
        </header>
    );
};
