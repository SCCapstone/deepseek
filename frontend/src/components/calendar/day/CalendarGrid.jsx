// this contains the weekday headers and the grid of days
// uses the calendarUtils to generate the days

import React from 'react';

import CalendarDay from './CalendarDay';

import { useAppContext } from '../../../lib/context';

import { generateCalendarDays } from '../../utility/componentUtils/calendarUtils';

export default function CalendarGrid({ selectedDate, events, onDayClick, view, onEventClick }) {
    const context = useAppContext();
    const days = generateCalendarDays(selectedDate);
    
    const styles = {
        weekDays: {
            color: context.colorScheme.textColor,
            backgroundColor: context.colorScheme.tertiaryBackground,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
        calendarGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
    };

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <>
            <div style={styles.weekDays}>
                {weekDays.map((day, index) => (
                    <div key={index} className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>{day}</p>
                    </div>
                ))}
            </div>
            
            <div style={styles.calendarGrid} className='flex-grow-1'>
                {days.map((day, i) => (
                    <CalendarDay 
                        key={i}
                        day={day}
                        events={events}
                        selectedDate={selectedDate}
                        onDayClick={onDayClick}
                        view={view}
                        onEventClick={onEventClick}
                    />
                ))}
            </div>
        </>
    );
} 