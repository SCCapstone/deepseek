/**
 * Utility functions for date and time formatting
 */

/**
 * Format a date string to a localized date string, handling timezone issues
 * 
 * @param {string} dateString - The date string to format (e.g., "2025-03-14")
 * @param {string} [locale] - Optional locale for formatting (defaults to user's locale)
 * @param {Object} [options] - Optional formatting options for toLocaleDateString
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale, options) {
    if (!dateString) return 'No date specified';
    try {
        // For date strings like "2025-03-14" (YYYY-MM-DD)
        if (dateString.includes('-') && dateString.split('-').length === 3) {
            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
            // Create date using local timezone (month is 0-indexed in JS)
            return new Date(year, month - 1, day).toLocaleDateString(locale, options);
        }
        
        // For other date formats, use standard parsing but adjust for timezone
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            // Create a new date with just the date parts to avoid timezone issues
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            return new Date(year, month, day).toLocaleDateString(locale, options);
        }
        return dateString;
    } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
    }
}

/**
 * Format a time string to a localized time string
 * 
 * @param {string} timeString - The time string to format (e.g., "10:00")
 * @param {string} [locale] - Optional locale for formatting (defaults to user's locale)
 * @param {Object} [options] - Optional formatting options for toLocaleTimeString
 * @returns {string} Formatted time string
 */
export function formatTime(timeString, locale, options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
}) {
    if (!timeString || timeString.length === 0) return '';
    
    try {
        // Handle time strings like "10:00" or "11:00"
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours, 10));
            timeObj.setMinutes(parseInt(minutes, 10));
            return timeObj.toLocaleTimeString(locale, options);
        }
        
        // Handle ISO datetime strings if they're passed
        try {
            const date = new Date(timeString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString(locale, options);
            }
        } catch (e) {
            console.error('Error parsing date in time formatter:', e);
        }
        
        return timeString; // Return as-is if we can't parse it
    } catch (e) {
        console.error('Error formatting time:', e);
        return timeString;
    }
}

/**
 * Format a time range with start and end times
 * 
 * @param {string} startTime - Start time string (e.g., "10:00")
 * @param {string} endTime - End time string (e.g., "11:00")
 * @param {string} [separator] - String to separate the times (defaults to " - ")
 * @returns {string} Formatted time range string
 */
export function formatTimeRange(startTime, endTime, separator = " - ") {
    if (!startTime || !endTime) return '';
    
    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
    
    return `${formattedStart}${separator}${formattedEnd}`;
}

/**
 * Format a complete date and time
 * 
 * @param {string} dateString - The date string (e.g., "2025-03-14")
 * @param {string} startTime - Start time string (e.g., "10:00")
 * @param {string} endTime - End time string (e.g., "11:00")
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateString, startTime, endTime) {
    const formattedDate = formatDate(dateString);
    
    if (!startTime && !endTime) {
        return formattedDate;
    }
    
    const formattedTimeRange = formatTimeRange(startTime, endTime);
    return `${formattedDate}, ${formattedTimeRange}`;
} 