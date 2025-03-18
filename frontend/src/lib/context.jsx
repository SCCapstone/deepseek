import {
    useContext,
    createContext,
    useState,
    useEffect,
} from 'react';

import { lightTheme, darkTheme } from './themes';

// Create the app context
const AppContext = createContext();

// Provider component
export function AppContextProvider({ children }) {
    // Use the light theme as default
    const [colorScheme, setColorScheme] = useState(darkTheme);
    const [user, setUser] = useState(null);

    // Toggle between light and dark themes
    const toggleColorScheme = () => {
        setColorScheme(prevScheme => 
            prevScheme.name === 'light' ? darkTheme : lightTheme
        );
    };

    // Load user preference for color scheme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setColorScheme(savedTheme === 'dark' ? darkTheme : lightTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setColorScheme(prefersDark ? darkTheme : lightTheme);
        }
    }, []);

    // Save theme preference when it changes
    useEffect(() => {
        localStorage.setItem('theme', colorScheme.name);
    }, [colorScheme]);

    return (
        <AppContext.Provider value={{ colorScheme, toggleColorScheme, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to use the app context
export function useAppContext() {
    return useContext(AppContext);
}

export default AppContext;