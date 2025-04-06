// this is the main calendar component
// it contains the header, the grid, and the day

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CalendarHeader from './CalendarHeader';
import CalendarGrid from './day/CalendarGrid';
import WeekViewGrid from './week/WeekViewGrid'; // adjust path if needed


import { useAppContext } from '../../lib/context';

export default function Calendar({ onChange, selectedDate, events = [], onEventSelect }) {
    const [view, setView] = useState(0);
    const context = useAppContext();
    const navigate = useNavigate();

    const handleDayClick = (day) => {
        onChange(day.date);
    };

    const handleEventClick = (event) => {
        // Navigate to event page
        const eventId = event._id || event.id;
        if (eventId) {
            navigate(`/events/${eventId}`);
        } else {
            console.error('Event has no ID, cannot navigate');
            // Fall back to using onEventSelect
            if (onEventSelect) {
                onEventSelect(event);
            }
        }
    };

    return (
        <div 
            className='d-flex flex-column w-100 h-100' 
            style={{ 
                backgroundColor: context.colorScheme.backgroundColor, 
                color: context.colorScheme.textColor 
            }}
        >
            <CalendarHeader 
                selectedDate={selectedDate}
                onDateChange={onChange}
                view={view}
                onViewChange={setView}
            />
            
            <div 
                style={{ backgroundColor: context.colorScheme.backgroundColor }} 
                className='h-100 d-flex flex-column'
            >
                {view === 0 ? (
                    <CalendarGrid 
                        selectedDate={selectedDate}
                        events={events}
                        onDayClick={handleDayClick}
                        view={view}
                        onEventClick={handleEventClick}
                    />
                ) : view === 1 ? (
                    <WeekViewGrid 
                        selectedDate={selectedDate}
                        events={events}
                        onEventClick={handleEventClick}
                    />
                ) : (
                    <div className="text-center mt-5">View not implemented</div>
                )}

            </div>
        </div>
    );
}