// this is the main calendar component
// it contains the header, the grid, and the day

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CalendarHeader from './CalendarHeader';
import CalendarGrid from './day/CalendarGrid';
import WeekViewGrid from './week/WeekViewGrid';
import DayViewGrid from './day/DayViewGrid';
import DayViewHeader from './day/DayViewHeader';


import { useAppContext } from '../../lib/context';

export default function Calendar({ onChange, selectedDate, events = [], onEventSelect }) {
   // Try to get the saved view from localStorage or default to 0 (month view)
   const savedView = localStorage.getItem('calendarView');
   const initialView = savedView !== null ? Number(savedView) : 0;
   
   const [view, setView] = useState(initialView);  // Initialize with the saved or default value
   const context = useAppContext();
   const navigate = useNavigate();

   // Load the saved view from localStorage when the component mounts
   useEffect(() => {
       const savedView = localStorage.getItem('calendarView');
       if (savedView !== null) {
           const parsedView = Number(savedView);
           if (!isNaN(parsedView)) {
               setView(parsedView);  // Set the view based on the saved value
           }
       }
   }, []);

   // Save the view to localStorage whenever it changes
   useEffect(() => {
       localStorage.setItem('calendarView', view);
   }, [view]);

   

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
                    ) : view === 2 ? (
                        <>
                       <DayViewHeader selectedDate={selectedDate} onDateChange={onChange} />
                       <DayViewGrid selectedDate={selectedDate} events={events} onEventClick={handleEventClick} />
                   </>
                    ) : (
                        <div className="text-center mt-5">View not implemented</div>
                    )}
            </div>
        </div>
    );
}