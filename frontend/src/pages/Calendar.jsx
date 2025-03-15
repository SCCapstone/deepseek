import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/calendar/Calendar';

import Sidebar from '../components/utility/Sidebar';
import EventList from '../components/calendar/EventList';
import EventFeed from '../components/calendar/EventFeed';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';
import api from '../lib/api';
import { useAppContext } from '../lib/context';


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('selected-date');
    const context = useAppContext();

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
    
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setTab('selected-date');
    }

    // something is off with the date
    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        d1.setDate(d1.getDate() + 1);
        
        const d2 = new Date(date2);
        
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };
  
    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <div className='w-100 flex-grow-1 flex-shrink-1 d-flex flex-row' style={{overflowY: 'hidden', backgroundColor: context.colorScheme.backgroundColor, color: context.colorScheme.textColor}}>
            <div className='w-100 h-100'>
                <Calendar
                    onChange={handleDateChange}
                    selectedDate={selectedDate}
                    events={events}
                    onEventSelect={handleEventSelect}
                />
            </div>
            <Sidebar>
                <div className='d-flex flex-row justify-content-between w-100 border-bottom' style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}>
                    <div
                        className={'p-2 w-100 text-center '+(tab === 'selected-date' ? 'bg-primary text-white' : '')}
                        onClick={() => setTab('selected-date')}
                        style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}
                    >
                        {selectedDate.toDateString()}
                    </div>
                    <div
                        className={'p-2 w-100 text-center '+(tab === 'event-feed' ? 'bg-primary text-white' : '')}
                        onClick={() => setTab('event-feed')}
                        style={{backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor}}
                    >
                        Event feed
                    </div>
                </div>
                {tab === 'selected-date' ?
                    <EventList
                        events={events.filter(event => {
                            const eventDate = new Date(event.date);
                            return isSameDay(eventDate, selectedDate);
                        })}
                        selectedEvent={selectedEvent}
                        setSelectedEvent={setSelectedEvent}
                    />
                : <EventFeed/>}
            </Sidebar>
        </div>
    );
}