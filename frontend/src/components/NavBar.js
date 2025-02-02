import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AiFillSun, AiFillMoon } from "react-icons/ai";

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
        themeIcon: {
            color: context.colorScheme.textColor,
        },
    }

    return (
        <header
            className='d-flex flex-row p-2 shadow-sm align-items-center justify-content-between'
            style={styles.header}>
            <div className='d-flex flex-row'>
                <Link style={styles.link} to='/' className='p-2 font-weight-bold'>CalendarMedia</Link>
                <Link style={styles.link} to='/profile' className='p-2'>Profile</Link>
                <Link style={styles.link} to='/calendar' className='p-2'>Calendar</Link>
                <Link style={styles.link} to='/create-event' className='p-2'>Create Event</Link>
            </div>
            <button
                className='btn d-flex justify-content-center align-items-center shadow-none'
                onClick={context.toggleTheme}>
                {context.theme === 'light' ?
                    <AiFillSun size={20} style={styles.themeIcon}/>
                :
                    <AiFillMoon size={20} style={styles.themeIcon}/>
                }
            </button>
        </header>
    );
};
