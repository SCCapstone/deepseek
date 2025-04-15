import { useState } from 'react';
import { useParams } from 'react-router-dom';

import EventHeader from '../components/events/EventHeader';
import EventComments from '../components/events/EventComments';
import UpdateEvent from '../components/events/update/UpdateEvent';
import NavBar from '../components/navbar/NavBar';

import { useAppContext } from '../lib/context';

export default function Event() {
    const { id } = useParams();
    const context = useAppContext();
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleShowUpdateModal = () => setShowUpdateModal(true);
    const handleHideUpdateModal = () => setShowUpdateModal(false);

    return (
        <>
            <NavBar/>
            <div
                className='container my-3 w-100 rounded
                d-flex flex-column justify-content-start align-items-stretch'
                style={{backgroundColor: context.colorScheme.secondaryBackground,
                    paddingTop: '15px'}}
            >
                <div className='mb-3'>
                    <EventHeader eventId={id} onEditClick={handleShowUpdateModal}/>
                </div>
                <div className='mb-3'>
                    <EventComments eventId={id}/>
                </div>
            </div>
            <UpdateEvent
                showEditor={showUpdateModal}
                hideEditor={handleHideUpdateModal}
                eventId={id}
            />
        </>
    );
}