import { useState, useEffect, useCallback } from 'react';

import Loading from '../../utility/Loading';
import Modal from '../../utility/Modal';
import Alert from '../../utility/Alert';

import api from '../../../lib/api';
import { useAppContext } from '../../../lib/context';

// Reuse form components from create
import EventDetails from '../create/EventDetails';
import EventDateTime from '../create/EventDateTime';
import EventOptions from '../create/EventOptions';
import EventFormActions from '../create/EventFormActions';

// Reuse or adapt validation logic if needed
import { isEventFormValid } from '../../utility/componentUtils/eventFormUtils';

// Define which fields are updatable based on backend route
const UPDATABLE_FIELDS = [
    'title',
    'date',
    'start_time',
    'end_time',
    'description',
    'location',
    'set_reminder', // Note: backend expects 'reminder', need to alias or fix backend
    'public'
];

export default function UpdateEvent({ showEditor, hideEditor, eventId }) {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null); // Start as null until fetched
    const context = useAppContext();

    const fetchEventData = useCallback(async () => {
        if (!eventId) return;
        setFetchLoading(true);
        setError(null);
        setEventData(null); // Clear previous data
        try {
            const { data, error: apiError } = await api.get(`/get-event/${eventId}`);
            if (apiError) {
                throw new Error(apiError);
            }
            if (data) {
                // Pre-populate form state with fetched data
                setEventData({
                    title: data.title || '',
                    description: data.description || '',
                    date: data.date || '',
                    start_time: data.start_time || '',
                    end_time: data.end_time || '',
                    location: data.location || '',
                    public: data.public || false,
                    set_reminder: data.set_reminder || false,
                    // Add other relevant fields if needed by form components
                });
            } else {
                throw new Error('Event data not found.');
            }
        } catch (err) {
            setError(`Failed to load event data: ${err.message}`);
            setEventData(null); // Ensure form doesn't show with partial/old data
        } finally {
            setFetchLoading(false);
        }
    }, [eventId]);

    // Fetch data when the modal becomes visible or eventId changes
    useEffect(() => {
        if (showEditor && eventId) {
            fetchEventData();
        } else {
            // Reset state when modal is hidden or eventId is missing
            setEventData(null);
            setError(null);
            setFetchLoading(false);
            setSubmitLoading(false);
        }
    }, [showEditor, eventId, fetchEventData]);

    const handleUpdateField = (field, value) => {
        setEventData(prev => (prev ? { ...prev, [field]: value } : null));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!eventData || !isEventFormValid(eventData)) {
            setError("Please fill in all required fields correctly."); // Or more specific validation
            return;
        }
        
        // Prepare only the updatable data
        const updatePayload = {};
        UPDATABLE_FIELDS.forEach(field => {
            if (eventData.hasOwnProperty(field)) {
                // Use the field name directly as it should now match the backend filter
                updatePayload[field] = eventData[field];
            }
        });
        
        setSubmitLoading(true);
        setError(null);
        try {
            const { error: apiError } = await api.post(`/update-event/${eventId}`, updatePayload);
            if (apiError) {
                throw new Error(apiError);
            }
            setSubmitLoading(false);
            hideEditor(); // Close modal on success
            // Optionally: trigger a refresh of the event list or page
        } catch (err) {
            setError(`Failed to update event: ${err.message}`);
            setSubmitLoading(false);
        }
    };

    // Decide if the form is ready to be interacted with
    const canShowForm = !fetchLoading && eventData && !error;

    return (
        <Modal showModal={showEditor} hideModal={hideEditor}>
            <form className='w-100 d-flex flex-column p-4 rounded' style={{backgroundColor: context.colorScheme.secondaryBackground}} onSubmit={handleSubmit}>
                <div className='w-100 d-flex flex-row justify-content-between align-items-center mb-3'>
                    <h3 className='h3 m-0' style={{color: context.colorScheme.textColor}}>Update Event</h3>
                    {/* Only show actions if form data is loaded */}
                    {eventData && (
                        <EventFormActions 
                            onCancel={hideEditor}
                            onSubmit={handleSubmit} // Submit is handled by form's onSubmit
                            isFormValid={isEventFormValid(eventData)} // Use validation
                            loading={submitLoading}
                            submitText="Update"
                        />
                    )}
                </div>

                {fetchLoading && <Loading className='mb-3'/>}
                {error && <Alert message={error} hideAlert={() => setError(null)} className="mb-3"/>}
                
                {/* Render form sections only when data is loaded and no fetch error */}
                {canShowForm && (
                    <>
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
                )}
                
                {/* Redundant submit button handled by EventFormActions */}
                {/* {canShowForm && !submitLoading && <button type="submit" className="btn btn-primary mt-3">Update Event</button>} */}
                {submitLoading && <Loading className='mt-3'/>}
            </form>
        </Modal>
    );
} 