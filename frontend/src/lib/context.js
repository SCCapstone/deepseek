import {
    useContext,
    createContext,
    useState,
} from 'react';
import { Themes } from './themes';


export const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    const colorScheme = Themes[theme];
    const [user, _setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser)
            return JSON.parse(savedUser);
        return null;
    })
    const setUser = (_user) => {
        localStorage.setItem('user', JSON.stringify(_user));
        _setUser(_user);
    }

    return (
        <AppContext.Provider value={{
            theme,
            toggleTheme,
            colorScheme,
            user,
            setUser,
        }}>
            {children}
        </AppContext.Provider>
    );
}