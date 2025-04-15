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

export default function CreateEvent({ showEditor, hideEditor, onEventCreated }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(BLANK_EVENT);
    const [userSettings, setUserSettings] = useState(null);
    const context = useAppContext();

    const handleUpdateField = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        console.log("Event Data Being Submitted:", eventData); 
        const { data, error: apiError } = await api.post('/add-event', eventData);
        setError(apiError);
        setLoading(false);
        if (!apiError) {
            if (onEventCreated) {
                onEventCreated();
            }
            hideEditor();
        }
    }

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await api.get('/get-settings');
                if (response.data) {
                    setUserSettings(response.data);
                    setEventData(prevEventData => ({
                        ...prevEventData,
                        set_reminder: response.data.default_reminder,
                        public: response.data.default_event_visibility
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Failed to fetch user settings');
            }
        };

        fetchUserSettings();
        setEventData(BLANK_EVENT);
    }, [showEditor]);

    
    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    if (!userSettings) {
        return <Loading />;  // Show loading state while fetching user settings
    }

    
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
                                submitText="Create"
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