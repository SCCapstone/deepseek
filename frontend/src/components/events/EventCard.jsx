import { useAppContext } from '../../lib/context';

// Event colors for visual distinction - same as in Calendar component
const eventColors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#8E24AA', // Purple
    '#F06292', // Pink
    '#FF9800', // Orange
];

export default function EventCard({ event, onClick }) {
    const context = useAppContext();

    // Function to get a consistent color for an event based on its ID or title
    const getEventColor = (event) => {
        // Use event ID or title to generate a consistent color
        const identifier = event.id || event.title;
        const hash = identifier.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return eventColors[Math.abs(hash) % eventColors.length];
    };

    const eventColor = getEventColor(event);

    const styles = {
        text: {
            color: context.colorScheme.textColor,
        },
        card: {
            cursor: 'pointer',
            borderLeft: `4px solid ${eventColor}`,
            backgroundColor: context.colorScheme.name === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)',
            transition: 'background-color 0.2s ease',
        }
    }

    return (
        <div 
            onClick={onClick} 
            className='p-2 mb-3 shadow-sm rounded-lg border w-100'
            style={styles.card}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = context.colorScheme.name === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)';
            }}
        >
            <div className='font-weight-bold' style={styles.text}>
                {event.title}
            </div>
            <div style={styles.text}>
                {event.description}
            </div>
            <div style={styles.text}>
                {event.formattedTime}
            </div>
        </div>
    );
} 