// Define standardized color schemes for light and dark modes
const accentColor = '#433eb6';

export const lightTheme = {
    name: 'light',
    // Background colors
    backgroundColor: '#ffffff',           // Main background
    secondaryBackground: '#f5f5f5',       // Secondary background (cards, panels)
    tertiaryBackground: '#e9ecef',        // Tertiary background (headers, footers)
    quaternaryBackground: '#d6dbd9',      // New quaternary background 
    // Text colors
    textColor: '#212529',                 // Primary text
    secondaryText: '#6c757d',             // Secondary text
    // Accent colors
    accentColor: accentColor,               // Primary accent (buttons, links)
    accentHover: accentColor + '20',       // Accent hover state
    // Border colors
    borderColor: '#dee2e6',               // Standard borders
    // Status colors
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
};

export const darkTheme = {
    name: 'dark',
    // Background colors
    backgroundColor: '#141415',           // Main background
    secondaryBackground: '#1e1e1e',       // Secondary background (cards, panels)
    tertiaryBackground: '#2d2d2d',        // Tertiary background (headers, footers)
    quaternaryBackground: '#242424',      // New quaternary background (light blue)
    // Text colors
    textColor: '#f8f9fa',                 // Primary text
    secondaryText: '#adb5bd',             // Secondary text
    // Accent colors
    accentColor: accentColor,               // Primary accent (buttons, links)
    accentHover: accentColor + '20',       // Accent hover state
    // Border colors
    borderColor: '#343a40',               // Standard borders
    // Status colors
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
};

// Export default light theme
export default lightTheme;