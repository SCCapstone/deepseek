import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './Login'
import Register from './Register';
import Home from './Home';
import Profile from './Profile';
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} /> 
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile/>} />
    </Routes>
  
  );
}