import { Route, Routes, useLocation } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './lib/context';
import NavBar from './components/navbar/NavBar';
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Event from './pages/Event';
import { useEffect } from 'react';

// Debug code to check the App component imports and routing
console.log('App component file exists');

function AppContent() {
    const context = useAppContext();
    const location = useLocation();

    // Apply background color to body whenever theme changes
    useEffect(() => {
        if (context && context.colorScheme) {
            document.body.style.backgroundColor = context.colorScheme.backgroundColor;
            document.body.style.color = context.colorScheme.textColor;
        }
    }, [context.colorScheme]);

    return (
        <div
            className='position-fixed d-flex flex-column'
            style={{
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
                maxHeight: '100vh',
                maxWidth: '100vw',
                backgroundColor: context.colorScheme.backgroundColor,
                color: context.colorScheme.textColor,
            }}
        >
            <NavBar/>
            <Routes>
                <Route path='/' element={<Home />} /> 
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile/>} />
                <Route path='/profile/:username' element={<Profile/>} />
                <Route path='/calendar' element={<Calendar/>} />
                <Route path='/events/:id' element={<Event/>} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
}