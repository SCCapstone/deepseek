import {
    useState,
    useEffect,
} from 'react';
import {
    useNavigate,
} from 'react-router-dom';
import Calendar from '../components/Calendar';
import 'react-calendar/dist/Calendar.css';

import EventList from '../components/EventList';
import api from '../lib/api';
import { useAppContext } from '../lib/context';
import Loading from '../components/Loading';
import Alert from '../components/Alert';


export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
  
    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <div className='flex-grow-1 d-flex flex-row align-items-stretch'>
            <div className='flex-grow-1 d-flex flex-column'>
                <Calendar
                    className='w-100 h-100'
                    onChange={handleDateChange}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}/>
            </div>
            <EventList
                events={events.filter(event => {
                    const dateObj = new Date();
                    const timezoneOffset = dateObj.getTimezoneOffset();
                    const eventDate = new Date((new Date(event.date)).getTime() + timezoneOffset * 60 * 1000);
                    return (
                        (eventDate.getDate() == selectedDate.getDate())
                        && (eventDate.getMonth() == selectedDate.getMonth())
                        && (eventDate.getFullYear() == selectedDate.getFullYear())
                    );
                })}
                date={selectedDate}/>
        </div>
    );
}