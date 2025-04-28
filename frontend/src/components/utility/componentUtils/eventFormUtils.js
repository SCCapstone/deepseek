
// Utilities for event form handling
// Contains constants, validation logic, and helper functions for working with event forms
 

// Default empty event template
export const BLANK_EVENT = {
    title: '',
    description: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    set_reminder: false,
    public: false,
}

/**
 * Validates if the minimum required fields for an event are filled
 * @param {Object} eventData - The event data to validate
 * @returns {boolean} - Whether the form is valid
 */
export function isEventFormValid(eventData) {
    return eventData.title.trim() !== '' && 
           eventData.date !== '';
} 