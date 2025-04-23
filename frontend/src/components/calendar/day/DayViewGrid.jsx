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
        <div style={{ overflowY: 'auto', height: '80vh', maxHeight: '80vh' }}>
            {/* Grid Header */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    height: '35px',
                }}
            >
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

            {/* Scrollable Grid Body */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gridTemplateRows: 'repeat(24, 60px)', // Adjust height of hour slots
                    height: '100%',  // Take up remaining height in the scrollable area
                    maxHeight: 'calc(76vh - 35px)', // Reduce height for grid content to fit in the 80vh space
                    overflowY: 'auto',
                }}
            >
                {hours.map(hour => (
                    <React.Fragment key={hour}>
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

                        <DayViewEventColumn
                            selectedDate={selectedDate}
                            events={events}
                            onEventClick={onEventClick}
                            hour={hour}
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
