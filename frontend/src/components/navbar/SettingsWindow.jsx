// this is the settings window component
// it displays the settings window for the navbar

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

import CustomButton from '../input/CustomButton';

import Modal from '../utility/Modal';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';

import api from '../../lib/api';
import { useAppContext } from '../../lib/context';

export default function SettingsWindow({ showWindow, hideWindow }) {
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [settingsData, setSettingsData] = useState(null);
    const context = useAppContext();

    const [isLinkHovered, setIsLinkHovered] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);

    const hideAlert = () => {
        setAlertMessage(null);
    }

    const getData = async () => {
        try {
            setLoading(true);
            setAlertMessage(null);
    
            const response = await api.get('/get-settings');
    
            if (response.error) {
                setAlertMessage(response.error);
            } else if (response.data) {
                const { email, default_event_visibility, default_reminder } = response.data;
                setSettingsData({
                    email,
                    default_event_visibility: default_event_visibility,
                    default_reminder: default_reminder
                });
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setAlertMessage('Failed to load settings');
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            setAlertMessage(null);
            const { data, error: apiError } = await api.post('/logout');
            
            if (apiError) {
                setAlertMessage(apiError);
                setLoading(false);
                return;
            }
            
            context.setUser(null);
            window.location.href = '/login';
        } catch (err) {
            setAlertMessage('Failed to log out');
            setLoading(false);
        }
    };

    const handleLinkWithGoogle = async () => {
        try {
            setLoading(true);
            setAlertMessage(null);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            window.location.href = `${API_URL}/googlelogin`;
        } catch (err) {
            setAlertMessage('Failed to link with Google');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showWindow) {
            getData();
        }
    }, [showWindow]);

    return (
        <Modal showModal={showWindow} hideModal={hideWindow}>
            {alertMessage && (
                <Alert 
                    message={alertMessage} 
                    hideAlert={hideAlert} 
                />
            )}
            <div className='w-100 d-flex flex-column p-4 rounded' style={{backgroundColor: context.colorScheme.secondaryBackground}}>
                {loading ? <Loading/> :
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h3 className='h3 m-0'>Settings</h3>
                            <div className='d-flex flex-row'>
                                <button
                                    className="btn p-0 border-0"
                                    onClick={hideWindow}
                                >
                                <FaTimes size={20} color={context.colorScheme.textColor} />
                                </button>
                            </div>
                        </div>
                        <h4 className="mt-4 mb-2">Preferences</h4>
                        <div className="card p-3 mb-4" style={{backgroundColor: context.colorScheme.tertiaryBackground}}>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={settingsData?.email || ''}
                                    onChange={e => setSettingsData({...settingsData, email: e.target.value})}
                                    style={{
                                        backgroundColor: context.colorScheme.secondaryBackground,
                                        color: context.colorScheme.textColor,
                                        border: `1px solid ${context.colorScheme.borderColor}`,
                                    }}
                                />

                            </div>

                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="defaultVisibility"
                                    checked={!!settingsData?.default_event_visibility}
                                    onChange={e => setSettingsData({...settingsData, default_event_visibility: e.target.checked})}
                                />
                                <label className="form-check-label" htmlFor="defaultVisibility">
                                    Make new events public by default
                                </label>
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="defaultReminder"
                                    checked={!!settingsData?.default_reminder}
                                    onChange={e => setSettingsData({...settingsData, default_reminder: e.target.checked})}
                                />
                                <label className="form-check-label" htmlFor="defaultReminder">
                                    Default reminders for events to on
                                </label>
                            </div>

                            <div className='d-flex justify-content-end'>
                                <CustomButton
                                    text={loading ? 'Saving...' : 'Save Changes'}
                                    className='btn-success'
                                    disabled={loading}
                                    onClick={async () => {
                                        // calling the api in the html is a little wild but it works and i am not changing it
                                        try {
                                            setLoading(true);
                                            setAlertMessage(null);

                                            const response = await api.post('/update-settings', settingsData);

                                            if (response.error) {
                                                setAlertMessage(response.error);
                                            } else {
                                                setAlertMessage(response.data?.message || 'Settings updated successfully!'); 
                                                console.log('Settings updated successfully:', response.data);
                                                if (response.data?.user) context.setUser(response.data.user);
                                            }
                                        } catch (err) {
                                            console.error('Failed to update settings:', err);
                                            const errorMessage = err?.response?.data?.error || err?.message || 'Failed to update settings. Please try again.';
                                            setAlertMessage(errorMessage);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <h4 className="mt-3 mb-2">Account</h4>
                        <div className="card p-3 mb-4" style={{backgroundColor: context.colorScheme.tertiaryBackground}}>
                            <div className="d-flex flex-column">
                                <CustomButton
                                    text='Link with Google'
                                    className='btn-primary mb-3'
                                    onClick={handleLinkWithGoogle}
                                    onMouseEnter={() => setIsLinkHovered(true)}
                                    onMouseLeave={() => setIsLinkHovered(false)}
                                    style={{
                                        color: 'white'
                                    }}
                                />
                                <CustomButton
                                    text='Logout'
                                    className='btn-danger'
                                    onClick={handleLogout}
                                    onMouseEnter={() => setIsLogoutHovered(true)}
                                    onMouseLeave={() => setIsLogoutHovered(false)}
                                    style={{
                                        backgroundColor: isLogoutHovered ? '#8c2f39'+'dd' : '#8c2f39',
                                        color: 'white'
                                    }}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </Modal>
    );
}