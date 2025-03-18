// Main container for the event creation form and submission logic


import { useState, useEffect } from 'react';

import Loading from '../../utility/Loading';
import Modal from '../../utility/Modal';
import Alert from '../../utility/Alert';

import api from '../../../lib/api';
import { useAppContext } from '../../../lib/context';

// Import form components
import EventDetails from './EventDetails';
import EventDateTime from './EventDateTime';
import EventOptions from './EventOptions';
import EventFormActions from './EventFormActions';

// Import utilities
import { BLANK_EVENT, isEventFormValid } from '../../utility/componentUtils/eventFormUtils';

export default function CreateEvent({ showEditor, hideEditor }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(BLANK_EVENT);
    const context = useAppContext();

    const handleUpdateField = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { data, error: apiError } = await api.post('/add-event', eventData);
        setError(apiError);
        setLoading(false);
        if (!apiError) {
            hideEditor();
        }
    }

    useEffect(() => {
        setEventData(BLANK_EVENT);
    }, [showEditor]);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <Modal showModal={showEditor} hideModal={hideEditor}>
            <form className='w-100 d-flex flex-column p-4 rounded' style={{backgroundColor: context.colorScheme.secondaryBackground}}>
                {loading ? <Loading className='mb-3'/> :
                    <>
                        <div className='w-100 d-flex flex-row justify-content-between align-items-center mb-3'>
                            <h3 className='h3 m-0' style={{color: context.colorScheme.textColor}}>Create event</h3>
                            <EventFormActions 
                                onCancel={hideEditor}
                                onSubmit={handleSubmit}
                                isFormValid={isEventFormValid(eventData)}
                                loading={loading}
                            />
                        </div>
                        
                        <EventDetails 
                            eventData={eventData} 
                            onUpdateField={handleUpdateField} 
                        />
                        
                        <EventDateTime 
                            eventData={eventData} 
                            onUpdateField={handleUpdateField} 
                        />
                        
                        <EventOptions 
                            eventData={eventData} 
                            onUpdateField={handleUpdateField} 
                        />
                    </>
                }
            </form>
        </Modal>
    );
}