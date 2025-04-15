import { Route, Routes, useLocation } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './lib/context';
import Login from './pages/Login'
import Register from './pages/Register';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Event from './pages/Event';
import { useEffect } from 'react';
import Home from './pages/Home';
import NavBar from './components/navbar/NavBar';
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
            <Routes>
                <Route path='/' element={<Landing />} /> 
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile/>} />
                <Route path='/profile/:username' element={<Profile/>} />
                <Route path='/calendar' element={<Home/>} />
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