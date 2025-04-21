import React from 'react';
import { useAppContext } from '../../../lib/context';
const hours = Array.from({ length: 24 }, (_, i) => i);


export default function WeekViewDayColumn({ day, events, onEventClick, backgroundColor, borderColor, hour }) {
    const context = useAppContext();
    const parseEventDateTime = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hr, min] = timeStr.split(':').map(Number);
        return new Date(year, month - 1, day, hr, min);
    };

    const isSameDay = (eventDate, targetDate) => {
        return eventDate.toDateString() === targetDate.toDateString();
    };

    const dayEvents = events.filter(event => {
        const start = parseEventDateTime(event.date, event.start_time);
        return isSameDay(start, day) && start.getHours() === hour;
    });

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                borderLeft: `1px solid ${borderColor}`,
                borderTop: `1px solid ${borderColor}`, 
                backgroundColor: context.colorScheme.secondaryBackground,
                height: '60px',
            }}
        >
            {/* Timed events in this hour */}
            {dayEvents.map((event, i) => {
                const start = parseEventDateTime(event.date, event.start_time);
                const end = parseEventDateTime(event.date, event.end_time);
    
                const startMinutes = start.getMinutes();
                const endMinutes = end.getHours() === hour ? end.getMinutes() : 60;
                const height = Math.max((endMinutes - startMinutes), 30);
    
                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${(startMinutes / 60) * 100}%`,
                            left: '4px',
                            right: '4px',
                            height: `${(height / 60) * 100}%`,
                            backgroundColor: '#add8e6',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            fontSize: '0.8rem',
                            zIndex: 2,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            color: 'black',
                        }}
                        onClick={() => onEventClick(event)}
                    >
                        {event.title}
                    </div>
                );
            })}
        </div>
    )}
