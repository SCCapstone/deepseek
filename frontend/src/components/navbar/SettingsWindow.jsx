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
    const [error, setError] = useState(null);
    const [settingsData, setSettingsData] = useState(null);
    const context = useAppContext();

    const [isLinkHovered, setIsLinkHovered] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);

    const getData = async () => {
        setLoading(false);
        setSettingsData({});
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            const { data, error: apiError } = await api.post('/logout');
            
            if (apiError) {
                setError(apiError);
                setLoading(false);
                return;
            }
            
            // these are not right
            context.setUser(null);
            window.location.href = '/login';
        } catch (err) {
            setError('Failed to log out');
            setLoading(false);
        }
    };

    const handleLinkWithGoogle = async () => {
        try {
            setLoading(true);
            // Direct window location to the googlelogin endpoint
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            window.location.href = `${API_URL}/googlelogin`;
        } catch (err) {
            setError('Failed to link with Google');
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <Modal showModal={showWindow} hideModal={hideWindow}>
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
                        
                        <h4 className="mt-3 mb-2">Account</h4>
                        <div className="card p-3 mb-4" style={{backgroundColor: context.colorScheme.tertiaryBackground}}>
                            <div className="d-flex flex-column">
                                <CustomButton
                                    text='Link with Google'
                                    className='btn-primary mb-3'
                                    onClick={handleLinkWithGoogle}
                                    style={{
                                        backgroundColor: isLinkHovered ? context.colorScheme.accentHover : context.colorScheme.accentColor,
                                        color: context.colorScheme.textColor
                                    }}
                                    onMouseEnter={() => setIsLinkHovered(true)}
                                    onMouseLeave={() => setIsLinkHovered(false)}
                                />
                                <CustomButton
                                    text='Logout'
                                    className='btn-danger'
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: isLogoutHovered ? context.colorScheme.accentHover : context.colorScheme.danger,
                                        color: context.colorScheme.textColor
                                    }}
                                    onMouseEnter={() => setIsLogoutHovered(true)}
                                    onMouseLeave={() => setIsLogoutHovered(false)}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </Modal>
    );
}