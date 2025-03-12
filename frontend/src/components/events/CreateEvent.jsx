import { useState, useEffect } from 'react';
import CustomButton from '../input/CustomButton';
import CustomTextInput from '../input/CustomTextInput';
import CustomTextarea from '../input/CustomTextarea';
import Loading from '../utility/Loading';
import Modal from '../utility/Modal';
import Alert from '../utility/Alert';
import api from '../../lib/api';


export default function CreateEvent({ showEditor, hideEditor }) {
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
        public: false,
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
        setError(apiError);
        setLoading(false);
        if (!apiError)
            hideEditor();
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <Modal showModal={showEditor} hideModal={hideEditor}>
            <form className='w-100 d-flex flex-column'>
                {loading ? <Loading className='mb-3'/> :
                    <>
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
                                    disabled={eventData.start_time === ''}
                                    required={!(eventData.start_time === '')}
                                    value={eventData.start_time === '' ? '' : eventData.end_time}
                                    onChange={event => handleUpdateField('end_time', event.target.value)}
                                />
                            </div>
                        </div>
                        <div className='d-flex flex-row'>
                            <div className='form-control d-flex flex-row align-items-center mr-2'>
                                <input
                                    id='set-reminder'
                                    type='checkbox'
                                    className='mr-1'
                                    checked={eventData.set_reminder}
                                    onChange={event => handleUpdateField('set_reminder', !eventData.set_reminder)}
                                />
                                <label className='m-0 w-100' htmlFor='set-reminder'>Set reminder</label>
                            </div>
                            <div className='form-control d-flex flex-row align-items-center'>
                                <input
                                    id='public'
                                    type='checkbox'
                                    className='mr-1'
                                    checked={eventData.public}
                                    onChange={event => handleUpdateField('public', !eventData.public)}
                                />
                                <label className='m-0 w-100' htmlFor='public'>Public</label>
                            </div>
                        </div>
                    </>
                }
            </form>
        </Modal>
    );
}