import { useState, useEffect } from 'react';
import CustomButton from './input/CustomButton';
import CustomTextInput from './input/CustomTextInput';
import CustomTextarea from './input/CustomTextarea';
import Loading from './Loading';
import Alert from './Alert';
import api from '../lib/api';


export default function CreateEvent({ hideEditor }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        start_time: '',
        end_time: '',
        set_reminder: false,
    });

    const handleUpdateField = (field, value) => {
        let tmp = {}
        tmp[field] = value;
        setEventData({...eventData, ...tmp});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { data, error: apiError } = await api.post('/add-event', eventData);
        console.log(apiError)
        setError(apiError);
        if (!apiError)
            hideEditor();
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <form className='w-100 d-flex flex-column'>
            <div className='w-100 d-flex flex-row justify-content-between align-items-center mb-3'>
                <h3 className='h3 m-0'>Create event</h3>
                <div className='d-flex flex-row'>
                    <button className='btn btn-danger mr-1' onClick={hideEditor}>Cancel</button>
                    <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                </div>
            </div>
            <label htmlFor='title' className='m-0'>Title</label>
            <CustomTextInput
                id='title'
                placeholder='TITLE'
                className='mb-3'
                value={eventData.title}
                onChange={text => handleUpdateField('title', text)}
            />
            <label htmlFor='location' className='m-0'>Location</label>
            <CustomTextInput
                id='location'
                placeholder='LOCATION'
                className='mb-3'
                value={eventData.location}
                onChange={text => handleUpdateField('location', text)}
            />
            <label htmlFor='description' className='m-0'>Description</label>
            <CustomTextarea
                id='description'
                className='mb-3'
                value={eventData.description}
                onChange={text => handleUpdateField('description', text)}
            />
            <div className='d-flex flex-row justify-content-start align-items-center mb-3'>
                <div
                    className='mr-3'
                    style={{
                        maxWidth: '200px',
                    }}
                >
                    <label htmlFor='date' className='m-0'>Date</label>
                    <input
                        id='date'
                        type='date'
                        value={eventData.date}
                        required
                        onChange={event => handleUpdateField('date', event.target.value)}
                        className='form-control'
                    />
                </div>
                <div className='d-flex flex-column align-items-start mr-3'>
                    <label htmlFor='start-time' className='m-0'>Start time</label>
                    <input
                        id='start-time'
                        type='time'
                        className='form-control'
                        required
                        value={eventData.start_time}
                        onChange={event => handleUpdateField('start_time', event.target.value)}
                    />
                </div>
                <div className='d-flex flex-column align-items-start'>
                    <label htmlFor='end-time' className='m-0'>End time</label>
                    <input
                        id='end-time'
                        type='time'
                        className='form-control'
                        required
                        value={eventData.end_time}
                        onChange={event => handleUpdateField('end_time', event.target.value)}
                    />
                </div>
            </div>
        </form>
    );
}