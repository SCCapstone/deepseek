import React, {
    useState,
    useEffect,
    useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleLoginButton from "../components/GoogleLoginButton";
import NavBar from '../components/NavBar';
import { useAppContext } from '../lib/context';
import api from '../lib/api';


export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const context = useAppContext();
    const { setUser } = useAppContext();

    async function getData() {
        const { data, error } = await api.get('/get-profile');
        console.log(data)
        console.log('Profile data received:', data); // Debug log
        if (error) {
            console.error('Profile error:', error); // Debug log
            setError(error);
        }
        else {
            setUserData(data);
            setEditedData(data || {});
            setUser(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        // Check hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const success = hashParams.get('success');
        const count = hashParams.get('count');
        
        if (error) {
            setError(error);
            // Clear hash
            window.location.hash = '';
        } else if (success) {
            setSuccessMessage(`Successfully imported ${count || 'new'} events from Google Calendar!`);
            // Clear hash
            window.location.hash = '';
        }
        
        getData();
    }, []);

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        const { error } = await api.post('/update-profile', editedData);
        if (error) {
            setError(error);
        } else {
            setUserData(editedData);
            setUser(editedData);
            setEditing(false);
            getData(); // Refresh data
        }
    };

    const handleEditClick = () => {
        setEditedData(userData || {});
        setEditing(true);
    };

    const handleCancel = () => {
        setEditedData(userData || {});
        setEditing(false);
    };

    const handleGoogleLogin = () => {
        const returnUrl = '/calendar';
        window.location.href = `${process.env.REACT_APP_API_URL}/googlelogin?return_to=${encodeURIComponent(returnUrl)}`;
    };

    const styles = {
        page: {
            minHeight: '100vh',
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
        },
        input: {
            backgroundColor: context.colorScheme.backgroundColor,
            color: context.colorScheme.textColor,
        }
    }

    const renderMessages = () => (
        <>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
        </>
    );

    if (error) return <div>Error: {error}</div>;

    const renderField = (label, field, type = 'text') => {
        console.log('Rendering field:', field, {
            editing,
            editedValue: editedData[field],
            userDataValue: userData?.[field]
        });
        return (
            <div className='mb-3'>
                <label htmlFor={field} style={styles.label}>{label}</label>
                <input
                    id={field}
                    type={type}
                    className='form-control'
                    style={styles.input}
                    value={editing ? editedData[field] || '' : userData?.[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    disabled={!editing}
                />
            </div>
        );
    };

    return (
        <div style={styles.page}>
            <NavBar/>
            {loading ? <p>Loading...</p> :
                <div className='container'>
                    {renderMessages()}
                    <div className='p-3 shadow rounded-lg mt-5' style={styles.section}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h1 className='h1' style={styles.sectionTitle}>User Profile</h1>
                            <div>
                                <button 
                                    className='btn btn-secondary mr-3'
                                    onClick={handleGoogleLogin}>
                                    Add Google Events
                                </button>
                                {!editing ? (
                                    <button 
                                        className='btn btn-primary'
                                        onClick={handleEditClick}>
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className='d-inline'>
                                        <button 
                                            className='btn btn-success me-2'
                                            onClick={handleSave}>
                                            Save
                                        </button>
                                        <button 
                                            className='btn btn-secondary'
                                            onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <img
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                            className='mb-3'
                            src={userData?.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                            alt='Profile'
                        />
                        
                        {editing && (
                            <div className='mb-3'>
                                <label htmlFor='profile_picture' style={styles.label}>Profile Picture URL</label>
                                <input
                                    id='profile_picture'
                                    type='text'
                                    className='form-control'
                                    style={styles.input}
                                    value={editedData.profile_picture || ''}
                                    onChange={(e) => handleInputChange('profile_picture', e.target.value)}
                                />
                            </div>
                        )}

                        {renderField('Name', 'name')}
                        {renderField('Username', 'username')}
                        {renderField('Email', 'email', 'email')}
                        {renderField('Bio', 'bio')}
                        
                        <div className='mb-3'>
                            <label style={styles.label}>Default Event Visibility</label>
                            <select
                                className='form-control'
                                style={styles.input}
                                value={editing ? editedData.default_event_visibility : userData?.default_event_visibility}
                                onChange={(e) => handleInputChange('default_event_visibility', e.target.value === 'true')}
                                disabled={!editing}>
                                <option value={true}>Public</option>
                                <option value={false}>Private</option>
                            </select>
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