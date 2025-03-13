import { Route, Routes } from 'react-router-dom';
import { AppContextProvider } from './lib/context';
import NavBar from './components/navbar/NavBar';
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Event from './pages/Event';


export default function App() {
    return (
        <AppContextProvider>
            <div
                className='position-fixed d-flex flex-column'
                style={{
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '100vw',
                    maxHeight: '100vh',
                    maxWidth: '100vw',
                }}
            >
                <NavBar/>
                <Routes>
                    <Route path='/' element={<Home />} /> 
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile/>} />
                    <Route path='/calendar' element={<Calendar/>} />
                    <Route path='/events/:id' element={<Event/>} />
                </Routes>
            </div>
        </AppContextProvider>
    );
}