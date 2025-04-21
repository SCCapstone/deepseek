import React from 'react';
import { useAppContext } from '../../../lib/context';

export default function DayViewHeader({ selectedDate, onDateChange }) {
    const context = useAppContext();
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
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: context.colorScheme.secondaryBackground, color: context.colorScheme.textColor }}>
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
