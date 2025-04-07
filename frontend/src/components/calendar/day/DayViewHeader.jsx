import React from 'react';

export default function DayViewHeader({ selectedDate, onDateChange }) {
    const prevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        onDateChange(d);
    };
   
    const nextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        onDateChange(d);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#222', color: '#fff' }}>
            <button onClick={prevDay}>&lt;</button>
            <h5 style={{ flex: 1, textAlign: 'center', margin: 0 }}>
                {selectedDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </h5>
            <button onClick={nextDay}>&gt;</button>
        </div>
    );
}
