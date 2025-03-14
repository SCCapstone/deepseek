import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaLocationArrow } from 'react-icons/fa';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';


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
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    const dateParts = eventData.date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const eventDate = new Date(year, month, day);

    return (
        <div className='container p-3 rounded-lg bg-light'>
            <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
                <h3 className='h3 m-0'>{eventData.title}</h3>
                <button className='btn btn-danger'>Edit</button>
            </div>
            <div className='mb-3'>
                <p className='text-muted m-0'>{eventDate.toDateString()}</p>
                {eventData.start_time && eventData.start_time.length > 0 ?
                    <p className='text-muted m-0'>{eventData.start_time}-{eventData.end_time}</p>
                : null}
            </div>
            {eventData.location ?
                <div className='d-flex flex-row align-items-center mb-3'>
                    <FaLocationArrow size={12} color='blue' className='mr-2'/>
                    <p className='text-muted m-0'>{eventData.location}</p>
                </div>
            : null}
            <p>{eventData.description}</p>
        </div>
    );
}