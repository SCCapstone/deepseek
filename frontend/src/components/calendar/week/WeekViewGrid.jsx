import React from 'react';
import WeekViewDayColumn from './WeekViewDayColumn';  // import the WeekViewDayColumn component
import { useAppContext } from '../../../lib/context';

const hours = Array.from({ length: 24 }, (_, i) => i);

function getWeekDays(selectedDate) {
    const start = new Date(selectedDate);
    const offset = start.getDay(); // Sunday = 0
    start.setDate(start.getDate() - offset); // Go to Sunday

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}



export default function WeekViewGrid({ selectedDate, events, onEventClick }) {
    const weekDays = getWeekDays(selectedDate);
    const context = useAppContext();
    return (
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
            {/* Day Headers */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(7, 1fr)',
                    height: '40px',
                }}
            >
                <div />
                {weekDays.map((day, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '1px solid #ccc',
                            backgroundColor: context.colorScheme.tertiaryBackground,
                            color: context.colorScheme.textColor,
                        }}
                    >
                        {day.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(7, 1fr)',
                    gridTemplateRows: 'repeat(24, 60px)',
                    minHeight: '1440px',
                }}
            >
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Hour Label Column */}
                        <div
                            style={{
                                height: '60px',
                                paddingRight: '4px',
                                fontSize: '0.75rem',
                                textAlign: 'right',
                                paddingTop: '2px',
                                borderTop: '1px solid #555',
                                backgroundColor: context.colorScheme.secondaryBackground,
                                color: context.colorScheme.textColor,
                            }}
                        >
                            {hour}:00
                        </div>

                        {/* Event Columns for this hour */}
                        {weekDays.map((day, dayIndex) => (
                            <WeekViewDayColumn
                                key={`${hour}-${dayIndex}`}
                                day={day}
                                events={events}
                                onEventClick={onEventClick}
                                backgroundColor="#000"
                                borderColor="#555"
                                hour={hour} // Pass current hour so each column shows only this hour’s events
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
