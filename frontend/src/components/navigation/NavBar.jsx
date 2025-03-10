import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../input/SearchBar';
import ProfileIcon from './ProfileIcon';
import Modal from '../Modal';
import CreateEvent from '../CreateEvent';


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
                <div className='d-flex flex-row'>
                    <Link to='/calendar' className='text-dark p-2 mr-3 font-weight-bold'>CalendarMedia</Link>
                    <SearchBar className='mr-3'/>
                    <button className='btn btn-primary' onClick={() => setCreatingEvent(true)}>Create event</button>
                </div>
                <div className='d-flex flex-row'>
                    <ProfileIcon/>
                </div>
            </header>
            <Modal showModal={creatingEvent} hideModal={() => setCreatingEvent(false)}>
                <CreateEvent hideEditor={() => setCreatingEvent(false)}/>
            </Modal>
        </>
    );
};