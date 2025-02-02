import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../lib/context';


export default function NavBar() {
    const context = useContext(AppContext);

    const styles = {
        header: {
            backgroundColor: context.colorScheme.accentColor,
        },
        link: {
            color: context.colorScheme.textColor,
        },
    }

    return (
        <header className='d-flex flex-row p-2 shadow-sm' style={styles.header}>
            <Link style={styles.link} to='/' className='p-2 font-weight-bold'>CalendarMedia</Link>
            <Link style={styles.link} to='/profile' className='p-2'>Profile</Link>
            <Link style={styles.link} to='/calendar' className='p-2'>Calendar</Link>
            <Link style={styles.link} to='/create-event' className='p-2'>Create Event</Link>
        </header>
    );
};
