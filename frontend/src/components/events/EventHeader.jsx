import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaLocationArrow, FaClock, FaInfoCircle } from 'react-icons/fa';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';
import { formatDate, formatTimeRange, formatDateTime } from '../utility/dateUtils';

export default function EventHeader({ eventId }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null);

    const getData = async () => {
        const { data, error: apiError } = await api.get('/get-event/' + eventId);
        setEventData(data);
        setError(apiError);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [eventId]);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    const formattedDate = formatDate(eventData.date);
    const formattedTime = eventData.start_time && eventData.end_time 
        ? formatTimeRange(eventData.start_time, eventData.end_time)
        : null;

    return (
        <div className='container p-3 rounded-lg bg-light'>
            <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
                <h3 className='h3 m-0'>{eventData.title}</h3>
                <button className='btn btn-danger'>Edit</button>
            </div>
            
            <div className='mb-3 d-flex align-items-center'>
                <FaClock size={16} className="mr-2 text-primary" />
                <p className='m-0'>
                    {formattedDate}
                    {formattedTime && <span> at {formattedTime}</span>}
                </p>
            </div>
            
            {eventData.location && (
                <div className='d-flex flex-row align-items-center mb-3'>
                    <FaLocationArrow size={16} className='mr-2 text-primary'/>
                    <p className='m-0'>{eventData.location}</p>
                </div>
            )}
            
            {eventData.description && (
                <div className='d-flex flex-row align-items-start mb-3'>
                    <FaInfoCircle size={16} className='mr-2 mt-1 text-primary'/>
                    <p className='m-0'>{eventData.description}</p>
                </div>
            )}
            
            {eventData.set_reminder && (
                <div className='alert alert-info mt-3'>
                    <small>You've set a reminder for this event</small>
                </div>
            )}
        </div>
    );
}