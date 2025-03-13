import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/calendar/Calendar';

import Sidebar from '../components/utility/Sidebar';
import EventList from '../components/events/EventList';
import EventFeed from '../components/events/EventFeed';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';
import api from '../lib/api';


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('selected-date');

    async function getData() {
        const { data, error: apiError } = await api.get('/get-events');
        if (apiError) {
            setError(apiError);
        }
        else {
            setEvents(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [selectedDate]);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }
  
    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <div className='w-100 flex-grow-1 flex-shrink-1 d-flex flex-row' style={{overflowY: 'hidden'}}>
            <div className='w-100 h-100'>
                <Calendar
                    onChange={handleDateChange}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </div>
            <Sidebar>
                <div className='d-flex flex-row justify-content-between w-100 border-bottom'>
                    <div
                        className={'p-2 w-100 text-center '+(tab === 'selected-date' ? 'bg-primary text-white' : '')}
                        onClick={() => setTab('selected-date')}
                    >
                        {selectedDate.toDateString()}
                    </div>
                    <div
                        className={'p-2 w-100 text-center '+(tab === 'event-feed' ? 'bg-primary text-white' : '')}
                        onClick={() => setTab('event-feed')}
                    >
                        Event feed
                    </div>
                </div>
                {tab === 'selected-date' ?
                    <EventList
                        events={events.filter(event => {
                            const dateObj = new Date();
                            const timezoneOffset = dateObj.getTimezoneOffset();
                            const eventDate = new Date(
                                (new Date(event.date)).getTime() + timezoneOffset * 60 * 1000
                            );
                            return (
                                (eventDate.getDate() == selectedDate.getDate())
                                && (eventDate.getMonth() == selectedDate.getMonth())
                                && (eventDate.getFullYear() == selectedDate.getFullYear())
                            );
                        })}
                    />
                : <EventFeed/>}
            </Sidebar>
        </div>
    );
}