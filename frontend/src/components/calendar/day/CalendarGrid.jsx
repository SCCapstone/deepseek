// this contains the weekday headers and the grid of days
// uses the calendarUtils to generate the days

import React, { useState, useEffect, useRef } from 'react';

import CalendarDay from './CalendarDay';
import EventItem from './EventItem';

import { useAppContext } from '../../../lib/context';

import { generateCalendarDays } from '../../utility/componentUtils/calendarUtils';

export default function CalendarGrid({ selectedDate, events, onDayClick, view, onEventClick }) {
    const context = useAppContext();
    const days = generateCalendarDays(selectedDate);
    const tooltipRef = useRef(null);

    const [tooltipData, setTooltipData] = useState({
        visible: false,
        day: null,
        events: [],
        position: { x: 0, y: 0 }
    });
    
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
            position: 'relative',
        },
        tooltip: {
            position: 'absolute',
            backgroundColor: context.colorScheme.tooltipBackground || context.colorScheme.secondaryBackground,
            color: context.colorScheme.textColor,
            border: `1px solid ${context.colorScheme.borderColor}`,
            borderRadius: '5px',
            padding: '10px',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxWidth: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
        },
        tooltipDate: {
            fontWeight: 'bold',
            marginBottom: '5px',
            borderBottom: `1px solid ${context.colorScheme.borderColor}`,
            paddingBottom: '5px',
        }
    };

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleMoreEventsClick = (day, dayEvents, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const gridRect = e.currentTarget.closest('[style*="grid-template-columns"]').getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const x = rect.left + scrollLeft - gridRect.left;
        const y = rect.top + scrollTop - gridRect.top;

        setTooltipData({
            visible: true,
            day: day,
            events: dayEvents,
            position: { 
                x: x,
                y: y + rect.height + 5
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                if (!event.target.closest('[style*="moreEvents"]')) {
                     setTooltipData(prev => ({ ...prev, visible: false }));
                }
            }
        };

        if (tooltipData.visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [tooltipData.visible]);

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
                        onMoreEventsClick={handleMoreEventsClick}
                    />
                ))}
                
                {tooltipData.visible && tooltipData.day && (
                    <div
                        ref={tooltipRef}
                        style={{
                            ...styles.tooltip,
                            left: `${tooltipData.position.x}px`,
                            top: `${tooltipData.position.y}px`,
                            transform: 'translateX(-50%)',
                            minWidth: '200px',
                            visibility: 'visible',
                            opacity: 1
                        }}
                    >
                        <div style={styles.tooltipDate}>
                            {tooltipData.day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        {tooltipData.events.map((event, index) => (
                            <EventItem
                                key={index}
                                event={event}
                                onClick={(event, e) => {
                                    e.stopPropagation();
                                    onEventClick(event);
                                    setTooltipData(prev => ({ ...prev, visible: false }));
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
} 