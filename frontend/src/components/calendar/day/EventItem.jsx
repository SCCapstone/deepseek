// this handles the individual event items in the calendar
// handles hover effects, color, and click handling

import React from 'react';

import { getEventColor, eventColors } from '../../utility/componentUtils/calendarUtils';

import { useAppContext } from '../../../lib/context';

export default function EventItem({ event, onClick }) {
    const context = useAppContext();
    const eventColor = getEventColor(event, eventColors);
    
    const styles = {
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
            backgroundColor: context.colorScheme.name === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.1s ease, background-color 0.2s ease',
        },
        eventColor: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            marginRight: '4px',
            flexShrink: 0,
            backgroundColor: eventColor
        },
        eventTitle: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
        }
    };

    const handleMouseOver = (e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(0, 0, 0, 0.08)';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)';
    };

    return (
        <div 
            style={styles.eventPreview}
            onClick={(e) => onClick(event, e)}
            title={event.title}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div style={styles.eventColor} />
            <div style={styles.eventTitle}>
                {event.title}
            </div>
        </div>
    );
} 