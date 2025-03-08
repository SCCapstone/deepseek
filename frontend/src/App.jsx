import { Route, Routes } from 'react-router-dom';

import { AppContextProvider } from './lib/context';
import NavBar from './components/Navbar';
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import CreateEvent from './pages/CreateEvent';
import EventFeed from './pages/EventFeed';
import Friends from './pages/Friends';



export default function App() {
    return (
        <AppContextProvider>
            <div
                className='d-flex flex-column justify-content-start'
                style={{height: '100vh', overflow: 'hidden'}}
            >
                <NavBar/>
                <div className='flex-grow-1 d-flex flex-column' style={{overflowY: 'auto'}}>
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
                </div>
            </div>
        </AppContextProvider>
    );
}