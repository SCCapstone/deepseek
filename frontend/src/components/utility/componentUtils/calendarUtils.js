// this contains all the utils for the calendar
// it includes the month names, views, and event colors
// also includes some helper functions for the calendar

// Calendar constants
export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const views = [
    'Month',
    'Week',
    'Day',
];

// Event colors for visual distinction
export const eventColors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#8E24AA', // Purple
    '#F06292', // Pink
    '#FF9800', // Orange
];

// Returns the first day (Sunday) of the calendar view for a given month
export function getCalendarStartDate(selectedDate) {
    let startDate = new Date(selectedDate);
    while ((startDate.getMonth() == selectedDate.getMonth() && startDate.getDate() > 1) || (startDate.getDay() > 0)) {
        startDate.setDate(startDate.getDate() - 1);
    }
    return startDate;
}

// Generate all calendar days needed to display a month
export function generateCalendarDays(selectedDate) {
    let startDate = getCalendarStartDate(selectedDate);
    let days = [];
    let current = new Date(startDate);
    
    while (true) {
        if ((current.getMonth() > selectedDate.getMonth() && current.getFullYear() === selectedDate.getFullYear()) || 
            current.getFullYear() > selectedDate.getFullYear())
            break;
            
        for (let i = 0; i < 7; i++) {
            days.push({date: new Date(current)});
            current.setDate(current.getDate() + 1);
        }
    }
    
    return days;
}

// Get events for a specific day
export function getEventsForDay(day, events) {
    if (!events || events.length === 0) return [];
    
    return events.filter(event => {
        try {
            // Handle ISO date format properly
            if (typeof event.date === 'string' && event.date.includes('-')) {
                const [year, month, dayOfMonth] = event.date.split('-').map(num => parseInt(num, 10));
                
                // Create date using year, month, day components to avoid timezone issues
                // Month is 0-indexed in JavaScript
                const eventDate = new Date(year, month - 1, dayOfMonth);
                
                // Get the components of the day we're checking
                const dayYear = day.date.getFullYear();
                const dayMonth = day.date.getMonth();
                const dayDay = day.date.getDate();
                
                // Compare year, month, and day components directly
                return (
                    eventDate.getFullYear() === dayYear &&
                    eventDate.getMonth() === dayMonth &&
                    eventDate.getDate() === dayDay
                );
            }
            
            // Fallback for other date formats
            const eventDate = new Date(event.date);
            if (!isNaN(eventDate.getTime())) {
                // Create date objects with only year, month, and day for comparison
                const eventDateOnly = new Date(
                    eventDate.getFullYear(),
                    eventDate.getMonth(),
                    eventDate.getDate()
                );
                
                const dayDateOnly = new Date(
                    day.date.getFullYear(),
                    day.date.getMonth(),
                    day.date.getDate()
                );
                
                // Compare dates without time component
                return eventDateOnly.getTime() === dayDateOnly.getTime();
            }
            
            return false;
        } catch (e) {
            console.error('Error comparing dates:', e);
            return false;
        }
    });
}

// Get a consistent color for an event based on its ID or title
export function getEventColor(event, eventColors) {
    // Use event ID or title to generate a consistent color
    const identifier = event.id || event._id || event.title;
    const hash = String(identifier).split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return eventColors[Math.abs(hash) % eventColors.length];
}

// Calculate the number of events to show based on view
export function getMaxEventsToShow(view) {
    return view === 0 ? 3 : 5; // Show more events in week/day view
}

// Navigate to previous month
export function getPreviousMonth(selectedDate) {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    newDate.setDate(1);
    return newDate;
}

// Navigate to next month
export function getNextMonth(selectedDate) {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    newDate.setDate(1);
    return newDate;
} 