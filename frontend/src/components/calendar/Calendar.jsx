import { useState } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { useAppContext } from '../../lib/context';
import { formatDate } from '../utility/dateUtils';

// Debug code to check if this file exists and what components it imports
console.log('Calendar component file exists');

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const views = [
    'Month',
    'Week',
    'Day',
];

// Event colors for visual distinction
const eventColors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#8E24AA', // Purple
    '#F06292', // Pink
    '#FF9800', // Orange
];

export default function Calendar({ onChange, selectedDate, events = [], onEventSelect }) {
    const today = new Date();
    const context = useAppContext();
    const [view, setView] = useState(0);

    const styles = {
        calendarHeader: {
            color: context.colorScheme.textColor,
        },
        calendar: {

        },
        arrow: {
            color: context.colorScheme.textColor,
        },
        weekDays: {
            color: context.colorScheme.textColor,
            backgroundColor: context.colorScheme.accentColor,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
        calendarGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        },
        day: {
            color: context.colorScheme.textColor,
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
        dayNumber: {
            fontWeight: 'bold',
            padding: '2px 5px',
            borderRadius: '50%',
            width: 'fit-content',
            marginBottom: '4px',
            color: context.colorScheme.textColor,
        },
        eventPreview: {
            padding: '2px 4px',
            marginBottom: '2px',
            borderRadius: '3px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: context.colorScheme.textColor,
        },
        eventColor: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            marginRight: '4px',
            flexShrink: 0,
        },
        eventTitle: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
        },
        moreEvents: {
            fontSize: '0.75rem',
            textAlign: 'center',
            color: context.colorScheme.textColor,
        },
        otherMonthDay: {
            opacity: 0.5,
        }
    }

    function lastMonth() {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() - 1);
        newDate.setDate(1);
        onChange(newDate);
    }

    function nextMonth() {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + 1);
        newDate.setDate(1);
        onChange(newDate);
    }

    // getting the Sunday of the first week of the month
    let startDate = new Date(selectedDate);
    while ((startDate.getMonth() == selectedDate.getMonth()
            && startDate.getDate() > 1) || (startDate.getDay() > 0)) {
        startDate.setDate(startDate.getDate() - 1);
    }

    // continuing to get weeks until we get the whole month
    let days = [];
    let current = new Date(startDate);
    while (true) {
        if ((current.getMonth() > selectedDate.getMonth()
            && current.getFullYear() === selectedDate.getFullYear())
            || current.getFullYear() > selectedDate.getFullYear())
            break
        for (let i=0; i<7; i++) {
            days.push({date: new Date(current)});
            current.setDate(current.getDate() + 1);
        }
    }

    // Function to get events for a specific day
    const getEventsForDay = (day) => {
        if (!events || events.length === 0) return [];
        
        return events.filter(event => {
            try {
                // Handle ISO date format properly
                if (typeof event.date === 'string' && event.date.includes('-')) {
                    const [year, month, dayOfMonth] = event.date.split('-').map(num => parseInt(num, 10));
                    
                    // Create date using year, month, day components to avoid timezone issues
                    // Month is 0-indexed in JavaScript
                    const eventDate = new Date(year, month - 1, dayOfMonth);
                    
                    // Get the components of the day we're checking
                    const dayYear = day.date.getFullYear();
                    const dayMonth = day.date.getMonth();
                    const dayDay = day.date.getDate();
                    
                    // Compare year, month, and day components directly
                    return (
                        eventDate.getFullYear() === dayYear &&
                        eventDate.getMonth() === dayMonth &&
                        eventDate.getDate() === dayDay
                    );
                }
                
                // Fallback for other date formats
                const eventDate = new Date(event.date);
                if (!isNaN(eventDate.getTime())) {
                    // Create date objects with only year, month, and day for comparison
                    const eventDateOnly = new Date(
                        eventDate.getFullYear(),
                        eventDate.getMonth(),
                        eventDate.getDate()
                    );
                    
                    const dayDateOnly = new Date(
                        day.date.getFullYear(),
                        day.date.getMonth(),
                        day.date.getDate()
                    );
                    
                    // Compare dates without time component
                    return eventDateOnly.getTime() === dayDateOnly.getTime();
                }
                
                return false;
            } catch (e) {
                console.error('Error comparing dates:', e);
                return false;
            }
        });
    };

    // Function to handle event click
    const handleEventClick = (event, e) => {
        e.stopPropagation(); // Prevent day click from triggering
        if (onEventSelect) {
            onEventSelect(event);
        }
    };

    // Function to get a consistent color for an event based on its ID or title
    const getEventColor = (event) => {
        // Use event ID or title to generate a consistent color
        const identifier = event.id || event._id || event.title;
        const hash = String(identifier).split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return eventColors[Math.abs(hash) % eventColors.length];
    };

    // Determine how many events to show based on day cell height
    // For simplicity, we'll use a fixed number, but this could be dynamic
    const getMaxEventsToShow = () => {
        return view === 0 ? 3 : 5; // Show more events in week/day view
    };

    return (
        <div className='d-flex flex-column w-100 h-100'>
            <div className='d-flex flex-row p-3' style={styles.calendarHeader}>
                <button
                    onClick={() => onChange(new Date())}
                    className='btn btn-primary shadow-none mr-1'>
                    Today</button>
                    <div className='dropdown'>
                        <button
                            className='btn btn-secondary dropdown-toggle mr-1 shadow-none'
                            type='button'
                            id='dropdownMenuButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'>
                            {views[view]}</button>
                        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                            <button onClick={() => setView(0)} className='dropdown-item'>Month</button>
                            <button onClick={() => setView(1)} className='dropdown-item'>Week</button>
                            <button onClick={() => setView(2)} className='dropdown-item'>Day</button>
                        </div>
                    </div>
                <button
                    onClick={lastMonth}
                    className='btn d-flex justify-content-center align-items-center shadow-none'>
                    <AiFillCaretLeft size={20} style={styles.arrow}/>
                </button>
                <button
                    onClick={nextMonth}
                    className='btn d-flex justify-content-center align-items-center shadow-none mr-1'>
                    <AiFillCaretRight size={20} style={styles.arrow}/>
                </button>
                <h3 className='h3 mb-0'>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
            </div>
            <div style={styles.calendar} className='h-100 d-flex flex-column'>
                <div style={styles.weekDays}>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Sunday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Monday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Tuesday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Wednesday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Thursday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Friday</p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center p-1'>
                        <p className='mb-0'>Saturday</p>
                    </div>
                </div>
                <div style={styles.calendarGrid} className='flex-grow-1'>
                    {days.map((day, i) => {
                        const isCurrentMonth = day.date.getMonth() === selectedDate.getMonth();
                        const isSelected = selectedDate.toDateString() === day.date.toDateString();
                        const isToday = day.date.toDateString() === today.toDateString();
                        const dayEvents = getEventsForDay(day);
                        const maxEventsToShow = getMaxEventsToShow();
                        
                        // Determine day number style based on state
                        const dayNumberStyle = {
                            ...styles.dayNumber,
                            backgroundColor: isSelected ? '#007bff' : isToday ? '#6c757d' : 'transparent',
                            color: (isSelected || isToday) ? 'white' : context.colorScheme.textColor,
                        };
                        
                        return (
                            <div
                                key={i}
                                style={{
                                    ...styles.day,
                                    ...(isCurrentMonth ? {} : styles.otherMonthDay),
                                    backgroundColor: isSelected ? 'rgba(0, 123, 255, 0.1)' : isToday ? 'rgba(108, 117, 125, 0.1)' : 'transparent',
                                }}
                                className='border p-1'
                                onClick={() => onChange(day.date)}>
                                <div style={dayNumberStyle}>
                                    {day.date.getDate()}
                                </div>
                                <div className='flex-grow-1'>
                                    {dayEvents.slice(0, maxEventsToShow).map((event, eventIndex) => {
                                        const eventColor = getEventColor(event);
                                        const eventPreviewStyle = {
                                            ...styles.eventPreview,
                                            backgroundColor: context.colorScheme.name === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.1)' 
                                                : 'rgba(0, 0, 0, 0.05)',
                                        };
                                        
                                        return (
                                            <div 
                                                key={eventIndex} 
                                                style={eventPreviewStyle}
                                                onClick={(e) => handleEventClick(event, e)}
                                                title={event.title}
                                            >
                                                <div 
                                                    style={{
                                                        ...styles.eventColor,
                                                        backgroundColor: eventColor
                                                    }} 
                                                />
                                                <div style={styles.eventTitle}>
                                                    {event.title}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {dayEvents.length > maxEventsToShow && (
                                        <div 
                                            style={styles.moreEvents}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onChange(day.date);
                                            }}
                                        >
                                            +{dayEvents.length - maxEventsToShow} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}