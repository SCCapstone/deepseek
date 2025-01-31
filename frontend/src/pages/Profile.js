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


export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const context = useContext(AppContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/myprofile', {
                    credentials: 'include',  // Include cookies for session-based authentication
                });

                if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();  // Parse the JSON response
                setUserData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);  // Empty dependency array to run only on component mount

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <NavBar/>
            <h1>User Profile</h1>
            <div className="profile-section">
                {/* Placeholder profile picture */}
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    alt="Profile Placeholder"
                    className="profile-pic"
                />
            </div>
            {userData ? <ProfileCard userData={userData} /> : <p>Loading user data...</p>}
            <footer>
                <button onClick={() => context.toggleTheme()}>
                    Switch to {context.theme === 'light' ? 'dark' : 'light'} Mode
                </button>
                <GoogleLoginButton/>
            </footer>
        </div>
    );
}

