import {
    useContext,
    createContext,
    useState,
} from 'react';


export const AppContext = createContext(null);

export function AppContextProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <AppContext.Provider value={{
            theme,
            toggleTheme,
        }}>
            {children}
        </AppContext.Provider>
    );
}