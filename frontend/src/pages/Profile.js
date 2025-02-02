import React, {
    useState,
    useEffect,
    useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../lib/context.js';
import ProfileCard from '../components/ProfileCard';
import GoogleLoginButton from "../components/GoogleLoginButton";
import NavBar from '../components/NavBar.js';
import api from '../lib/api.js';


export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const context = useAppContext();

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

    const styles = {
        page: {
            height: '100vh',
            backgroundColor: context.colorScheme.backgroundColor,
        },
        section: {
            backgroundColor: context.colorScheme.accentColor,
        },
        sectionTitle: {
            color: context.colorScheme.textColor,
        },
        label: {
            color: context.colorScheme.textColor,
        }
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.page}>
            <NavBar/>
            {loading ? <p>Loading...</p> :
                <div className='container'>
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <h1 className='h1' style={styles.sectionTitle}>User Profile</h1>
                        <img
                        style={{
                            width: '100px',
                            borderRadius: 1000,
                        }}
                        className='mb-3'
                        src='https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
                        alt='Profile Placeholder'/>
                        <div className='mb-3'>
                            <label style={styles.label}>Username</label>
                            <input
                            type='text'
                            className='form-control'
                            value={userData.username}
                            onChange={() => {}}/>
                        </div>
                        <div className='mb-3'>
                            <label style={styles.label}>Email</label>
                            <input
                            type='text'
                            className='form-control'
                            value={userData.email}
                            onChange={() => {}}/>
                        </div>
                        <div className='mb-3'>
                            <label style={styles.label}>Password</label>
                            <input
                            type='password'
                            className='form-control'
                            value={'xxxxxxxx'}
                            onChange={() => {}}/>
                        </div>
                    </div>
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <h1 className='h1' style={styles.sectionTitle}>Settings</h1>
                        <button
                            className='btn btn-primary'
                            onClick={context.toggleTheme}>
                            Switch to {context.theme === 'light' ? 'dark' : 'light'} mode
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}