import { Route, Routes } from 'react-router-dom';

import { AppContextProvider } from './lib/context.js';
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home.js';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar.js';
import CreateEvent from './pages/CreateEvent';
import EventFeed from './pages/EventFeed';
import Friends from './pages/Friends';

export default function App() {
    return (
        <AppContextProvider>
            <Routes>
                <Route path='/' element={<Home />} /> 
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile/>} />
                <Route path='/friends' element={<Friends/>} />
                <Route path='/calendar' element={<Calendar/>} />
                <Route path='/create-event' element={<CreateEvent />} />
                <Route path='/event-feed' element={<EventFeed />}/>
            </Routes>
        </AppContextProvider>
    );
}