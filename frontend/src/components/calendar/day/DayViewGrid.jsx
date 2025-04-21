import React from 'react';
import DayViewEventColumn from './DayViewEventColumn'; // A new component similar to WeekViewDayColumn
import { useAppContext } from '../../../lib/context';
const hours = Array.from({ length: 24 }, (_, i) => i); // Array for 24 hours of the day

export default function DayViewGrid({ selectedDate, events, onEventClick }) {
    const context = useAppContext();
    const weekday = selectedDate.toLocaleDateString(undefined, { weekday: 'short' });
    const month = selectedDate.toLocaleDateString(undefined, { month: 'short' });
    const day = selectedDate.toLocaleDateString(undefined, { day: 'numeric' });
    const formattedDate = `${weekday} ${month} ${day}`;

    return (
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
            {/* Grid Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    height: '40px',
                }}
            >
                {/* Day Label */}
                <div
                    style={{
                        padding: '8px',
                        textAlign: 'center',
                        borderBottom: '1px solid #ccc',
                        backgroundColor: context.colorScheme.tertiaryBackground,
                        color: context.colorScheme.textColor,
                    }}
                >
                    {formattedDate}
                </div>
                <div />
            </div>

            {/* Grid Body with Hours and Events */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gridTemplateRows: 'repeat(24, 60px)', // 24 hours in a day
                    minHeight: '1440px',
                }}
            >
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Hour Label */}
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

                        {/* Event Column for this hour */}
                        <DayViewEventColumn
                            key={hour}
                            selectedDate={selectedDate}
                            events={events}
                            onEventClick={onEventClick}
                            hour={hour} // Pass current hour
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
