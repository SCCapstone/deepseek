import {
    useState,
    useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAppContext } from '../lib/context';


export default function CreateEvent() {
    const navigate = useNavigate();
    const context = useAppContext();

    const [eventDetails, setEventDetails] = useState({
        title: '',
        description: '',
        day: '',
        location: '',
        startTime: '',
        endTime: '',
        reminder: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventDetails({
            ...eventDetails,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const start = new Date(eventDetails.day + ' ' + eventDetails.startTime);
        const end = new Date(eventDetails.day + ' ' + eventDetails.endTime);
        const newEvent = {
            title: eventDetails.title,
            description: eventDetails.description,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            reminder: eventDetails.reminder,
            location: eventDetails.location,
            reminder: eventDetails.reminder,
        }
        const { data, error } = await api.post('/add-event', newEvent);
        if (error) {
            // handle error here
            alert('Could not create event');
        }
        else {
            alert('Event created');
            navigate('/calendar');
        }
    };

    const handleCancel = () => {
        setEventDetails({
            title: '',
            description: '',
            day: '',
            location: '',
            startTime: '',
            endTime: '',
            reminder: false,
        });
    };

    const styles = {
        page: {
            height: '100vh',
            backgroundColor: context.colorScheme.backgroundColor,
        },
        section: {
            backgroundColor: context.colorScheme.accentColor,
        },
        sectionTitle: {
            color: context.colorScheme.textColor,
        },
        label: {
            color: context.colorScheme.textColor,
        }
    }

    return (
        <div style={styles.page}>
            <form
                onSubmit={handleSubmit}
                className='container shadow rounded-lg mt-5 p-3'
                style={styles.section}>
                <h1 style={styles.sectionTitle}>Create an Event</h1>
                <div className='mb-3'>
                    <label htmlFor="title" style={styles.label}>Title</label>
                    <input
                        className='form-control'
                        type="text"
                        id="title"
                        name="title"
                        value={eventDetails.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="description" style={styles.label}>Description</label>
                    <textarea
                        className='form-control'
                        id="description"
                        name="description"
                        value={eventDetails.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className='mb-3'>
                    <label htmlFor="location" style={styles.label}>Location</label>
                    <input
                        className='form-control'
                        type="text"
                        id="location"
                        name="location"
                        value={eventDetails.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='d-flex flex-row justify-content-start mb-3'>
                    <div className='mr-3'>
                        <label htmlFor="day" style={styles.label}>Day</label>
                        <input
                            className='form-control'
                            type="date"
                            id="day"
                            name="day"
                            value={eventDetails.day}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mr-3'>
                        <label htmlFor="startTime" style={styles.label}>Start Time</label>
                        <input
                            className='form-control'
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={eventDetails.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" style={styles.label}>End Time</label>
                        <input
                            className='form-control'
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={eventDetails.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className='mb-3'>
                    <label className='form-control d-flex flex-row'>
                        <input
                            className='mr-1'
                            type="checkbox"
                            name="reminder"
                            checked={eventDetails.reminder}
                            onChange={handleChange}
                        />
                        <div>Set Reminder</div>
                    </label>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary mr-3">
                        Save Event
                    </button>
                    <button type="button" onClick={handleCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
