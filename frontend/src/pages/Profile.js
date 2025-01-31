import React, {
    useState,
    useEffect,
    useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../lib/AppContext.js';
import ProfileCard from '../components/ProfileCard';
import GoogleLoginButton from "../components/GoogleLoginButton";
import '../App.css';
import NavBar from '../components/NavBar.js';
import api from '../lib/api.js';


export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const context = useContext(AppContext);

    async function getData() {
        const { data, error } = await api.get('/myprofile');
        if (error) {
            // handle error here
            setError(error);
        }
        else {
            setUserData(data.user);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);  // Empty dependency array to run only on component mount

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <NavBar/>
            {loading ? <p>Loading...</p> :
                <>
                    <div className='container p-3 shadow rounded-lg mt-5'>
                        <h1 className='h1'>User Profile</h1>
                        <img
                        style={{
                            width: '100px',
                            borderRadius: 1000,
                        }}
                        className='mb-3'
                        src='https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
                        alt='Profile Placeholder'/>
                        <div className='mb-3'>
                            <label>Username</label>
                            <input
                            type='text'
                            className='form-control'
                            value={userData.username}
                            onChange={() => {}}/>
                        </div>
                        <div className='mb-3'>
                            <label>Email</label>
                            <input
                            type='text'
                            className='form-control'
                            value={userData.email}
                            onChange={() => {}}/>
                        </div>
                        <div className='mb-3'>
                            <label>Password</label>
                            <input
                            type='password'
                            className='form-control'
                            value={'xxxxxxxx'}
                            onChange={() => {}}/>
                        </div>
                    </div>
                    <div className='container p-3 shadow rounded-lg mt-5'>
                        <h1 className='h1'>Settings</h1>
                        <button
                            className='btn btn-primary'
                            onClick={context.toggleTheme}>
                            Switch to {context.theme === 'light' ? 'dark' : 'light'} mode
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

