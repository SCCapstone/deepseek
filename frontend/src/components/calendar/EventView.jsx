import React from 'react';
import { useAppContext } from '../../lib/context';
import { formatDate } from '../utility/dateUtils';

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

export default function EventView({ event, onClick }) {
    const context = useAppContext();
    const { title, description, location, date, formattedTime } = event;

    // Function to get a consistent color for an event based on its ID or title
    const getEventColor = (event) => {
        const identifier = event.user_id;
        const hash = String(identifier).split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return eventColors[Math.abs(hash) % eventColors.length];
    };

    const eventColor = getEventColor(event);

    const formattedDate = formatDate(date);

    const styles = {
        card: {
            backgroundColor: context.colorScheme.secondaryBackground,
            color: context.colorScheme.textColor,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
            border: `1px solid ${context.colorScheme.borderColor}`,
        },
        cardHover: {
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
        title: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        time: {
            color: context.colorScheme.secondaryText,
            fontSize: '0.9rem',
        },
        location: {
            color: context.colorScheme.secondaryText,
            fontSize: '0.9rem',
        },
        description: {
            marginTop: '5px',
            fontSize: '0.9rem',
        }
    };
    
    // Handle hover state
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
        <div 
            style={{
                ...styles.card,
                ...(isHovered ? styles.cardHover : {})
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.title}>{title}</div>
            {formattedTime && <div style={styles.time}>{formattedTime}</div>}
            {location && <div style={styles.location}>Location: {location}</div>}
            {description && (
                <div style={styles.description}>
                    {description.length > 100 
                        ? `${description.substring(0, 100)}...` 
                        : description}
                </div>
            )}
        </div>
    );
} 