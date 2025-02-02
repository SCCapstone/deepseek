import {
    useState,
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import NavBar from '../components/NavBar';
import EventList from '../components/EventList';
import api from '../lib/api';
import { useAppContext } from '../lib/context';


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const context = useAppContext();

    async function getData() {
        const { data, error } = await api.get('/getevents');
        if (error) {
            setError(error);
        }
        else {
            setEvents(data.events);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [selectedDate]);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: context.colorScheme.backgroundColor,
        },
        calendar: {
            backgroundColor: context.colorScheme.backgroundColor,
        },
    }
  
    if (error) return <div>Error: {error}</div>;
  
    return (
        <div style={styles.page} className='d-flex flex-column justify-content-start'>
            <NavBar/>
            {loading ? <div>Loading...</div> :
                <div className='flex-grow-1 d-flex flex-row align-items-stretch'>
                    <div className='flex-grow-1 d-flex flex-column'>
                        <Calendar
                            className='w-100 h-100'
                            style={styles.calendar}
                            onChange={handleDateChange}
                            value={selectedDate}
                            view='month'/>
                    </div>
                    <EventList
                        events={events.filter(event => {
                            const eventDate = new Date(event.start_time).toDateString();
                            return eventDate === selectedDate.toDateString();
                        })}
                        date={selectedDate}/>
                </div>
            }
        </div>
    );
}