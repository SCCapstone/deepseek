import {
    useContext,
    createContext,
    useState,
    useEffect,
    useRef,
} from 'react';

import { lightTheme, darkTheme } from './themes';

// Create the app context
const AppContext = createContext();

// Helper function to check if a JWT token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        if (!exp) return false; // If no expiration, consider it valid
        
        // Add 5 minute buffer to prevent edge cases
        const expired = Date.now() >= (exp * 1000) - (5 * 60 * 1000);
        return expired;
    } catch (err) {
        console.error('Error checking token expiration:', err);
        // If we can't decode the token, consider it valid and let the backend decide
        return false;
    }
};

// Provider component
export function AppContextProvider({ children }) {
    const [colorScheme, setColorScheme] = useState(darkTheme);
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const isInitializing = useRef(true);
    const [isInitialized, setIsInitialized] = useState(false);

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

    // Load user and token from localStorage on initial load
    useEffect(() => {
        console.log("Context Effect: Attempting to load user/token from localStorage...");
        isInitializing.current = true;
        setIsInitialized(false);
        
        let loadedToken = null;
        let loadedUser = null;
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                loadedUser = JSON.parse(savedUser);
                console.log("Context Effect: Loaded user from localStorage.", loadedUser);
            } else {
                console.log("Context Effect: No user found in localStorage.");
            }
            const savedToken = localStorage.getItem('authToken'); 
            if (savedToken && !isTokenExpired(savedToken)) {
                loadedToken = savedToken;
                console.log(`Context Effect: Loaded valid token '${loadedToken.substring(0,5)}...' from localStorage.`);
            } else {
                if (savedToken) {
                    console.log("Context Effect: Token found but expired, clearing auth data.");
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                } else {
                    console.log("Context Effect: No token found in localStorage.");
                }
            }

            // Only update state if we found valid data
            if (loadedToken && loadedUser) {
                console.log("Context Effect: Setting initial auth state from localStorage.");
                setUser(loadedUser);
                setAuthToken(loadedToken);
            }
        } catch (error) {
            console.error("Context Effect: Failed to parse user/token from localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
        } finally {
            console.log("Context Effect: Finished loading attempt, state updated.");
            // Set initializing to false after a small delay to ensure state updates have propagated
            setTimeout(() => {
                isInitializing.current = false;
                setIsInitialized(true);
                console.log("Context Effect: Initialization complete.");
            }, 100); // Increased the delay to ensure state updates
        }
    }, []); // Run only once on initial mount

    // Save user and token to localStorage whenever they change
    useEffect(() => {
        // Skip if we're still initializing
        if (isInitializing.current) {
            console.log("Context Effect: Skipping auth state change during initialization.");
            return;
        }

        console.log("Context Effect: Auth state changed, updating localStorage...");
        try {
            if (user && authToken && !isTokenExpired(authToken)) {
                console.log("Context Effect: Saving valid auth data to localStorage.");
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authToken', authToken);
            } else if (!user && !authToken) {
                // Only clear if this is an explicit logout (not during initialization)
                const hadPreviousAuth = localStorage.getItem('user') || localStorage.getItem('authToken');
                if (hadPreviousAuth) {
                    console.log("Context Effect: Clearing localStorage due to logout.");
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                } else {
                    console.log("Context Effect: Skipping localStorage clear - no previous auth data.");
                }
            }
        } catch (error) {
            console.error("Failed to save user/token to localStorage", error);
        }
    }, [user, authToken]);

    // Function to update user and token together (e.g., after login)
    const setAuthData = (userData, tokenData) => {
        console.log("Context Effect: setAuthData called");
        if (tokenData && !isTokenExpired(tokenData)) {
            // Update localStorage first to ensure consistency
            try {
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('authToken', tokenData);
                console.log("Context Effect: Auth data saved to localStorage");
                
                // Then update state
                setUser(userData);
                setAuthToken(tokenData);
            } catch (error) {
                console.error("Failed to save auth data to localStorage", error);
                // Still update state even if localStorage fails
                setUser(userData);
                setAuthToken(tokenData);
            }
        } else {
            clearAuthData();
        }
    };

    // Function to clear user and token (e.g., after logout)
    const clearAuthData = () => {
        isInitializing.current = false; // Ensure we're not in initialization mode
        console.log("Context Effect: clearAuthData called - explicit logout");
        // Clear localStorage first
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            console.log("Context Effect: localStorage cleared");
        } catch (error) {
            console.error("Failed to clear localStorage", error);
        }
        // Then clear state
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AppContext.Provider value={{ 
            colorScheme, toggleColorScheme, 
            user, setUser,
            authToken,
            setAuthData,
            clearAuthData,
            isInitialized,
            isInitializing: isInitializing.current
            }}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to use the app context
export function useAppContext() {
    return useContext(AppContext);
}

export default AppContext;