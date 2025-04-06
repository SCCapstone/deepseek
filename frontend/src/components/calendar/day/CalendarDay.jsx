// this handles the single day cell in the calendar
// handles highlighting, event display, hover states, etc specific to a single day

import React from 'react';

import EventItem from './EventItem';

import { getEventsForDay, getMaxEventsToShow } from '../../utility/componentUtils/calendarUtils';

import { useAppContext } from '../../../lib/context';

export default function CalendarDay({ day, events, selectedDate, onDayClick, view, onEventClick }) {
    const context = useAppContext();
    const today = new Date();
    
    const isCurrentMonth = day.date.getMonth() === selectedDate.getMonth();
    const isSelected = selectedDate.toDateString() === day.date.toDateString();
    const isToday = day.date.toDateString() === today.toDateString();
    const dayEvents = getEventsForDay(day, events);
    const maxEventsToShow = getMaxEventsToShow(view);
    
    const styles = {
        day: {
            color: context.colorScheme.textColor,
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderColor: context.colorScheme.borderColor,
            backgroundColor: isSelected 
                ? `${context.colorScheme.accentColor}20` 
                : isToday 
                    ? `${context.colorScheme.secondaryText}20` 
                    : context.colorScheme.backgroundColor,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            opacity: isCurrentMonth ? 1 : 0.5
        },
        dayNumber: {
            fontWeight: 'bold',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
            willChange: 'transform',
            backgroundColor: isSelected ? context.colorScheme.accentColor : 'transparent',
            color: isSelected 
                ? context.colorScheme.name === 'light' ? 'white' : context.colorScheme.textColor 
                : context.colorScheme.textColor,
        },
        moreEvents: {
            fontSize: '0.75rem',
            textAlign: 'center',
            color: context.colorScheme.secondaryText,
            cursor: 'pointer',
            transition: 'color 0.2s ease',
        }
    };

    const handleMouseOver = (e) => {
        if (!isSelected) {
            e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)';
        }
    };

    const handleMouseOut = (e) => {
        if (!isSelected) {
            e.currentTarget.style.backgroundColor = isToday 
                ? `${context.colorScheme.secondaryText}20` 
                : context.colorScheme.backgroundColor;
        }
    };

    const handleMoreEventsHover = (e) => {
        e.currentTarget.style.color = context.colorScheme.accentColor + 'cc';
    };

    const handleMoreEventsLeave = (e) => {
        e.currentTarget.style.color = context.colorScheme.secondaryText;
    };
    
    const parseEventStartDate = (event) => {
        const date = new Date(event.date);
        if (event.start_time && event.start_time.length > 0) {
            const timeSplit = event.start_time.split(':');
            const hours = parseInt(timeSplit[0]);
            const mins = parseInt(timeSplit[1]);
            date.setHours(hours);
            date.setMinutes(mins);
        }
        else {
            date.setHours(0);
            date.setMinutes(0);
        }
        return date;
    }

    const sortEventsByDate = (events) => events.sort((a, b) => {
        const aDate = parseEventStartDate(a);
        const bDate = parseEventStartDate(b);
        return aDate - bDate;
    });

    const sortedEvents = sortEventsByDate(events);

    return (
        <div
            style={styles.day}
            className='border p-1'
            onClick={() => onDayClick(day)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div style={styles.dayNumber}>
                {day.date.getDate()}
            </div>
            <div className='flex-grow-1'>
                {dayEvents.slice(0, maxEventsToShow).map((event, eventIndex) => (
                    <EventItem 
                        key={eventIndex} 
                        event={event} 
                        onClick={(event, e) => {
                            e.stopPropagation();
                            onEventClick(event);
                        }} 
                    />
                ))}
                {dayEvents.length > maxEventsToShow && (
                    <div 
                        style={styles.moreEvents}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDayClick(day);
                        }}
                        onMouseOver={handleMoreEventsHover}
                        onMouseOut={handleMoreEventsLeave}
                    >
                        +{dayEvents.length - maxEventsToShow} more
                    </div>
                )}
            </div>
        </div>
    );
} 