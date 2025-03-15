import { useState, useEffect } from 'react';
import CustomButton from '../input/CustomButton';
import CustomTextInput from '../input/CustomTextInput';
import Modal from '../utility/Modal';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';


export default function SettingsWindow({ showWindow, hideWindow }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [settingsData, setSettingsData] = useState(null);

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
            window.location.href = '/login';
        } catch (err) {
            setError('Failed to log out');
            setLoading(false);
        }
    };

    const handleLinkWithGoogle = async () => {
        try {
            setLoading(true);
            // these are not right
            const { data, error: apiError } = await api.get('/auth/google/link');
            
            if (apiError) {
                setError(apiError);
                setLoading(false);
                return;
            }
            
            // these are not right
            window.location.href = data.authUrl || '/auth/google';
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
            <div className='w-100 d-flex flex-column bg-white p-4 rounded shadow'>
                {loading ? <Loading/> :
                    <>
                        <div className='w-100 d-flex flex-row justify-content-between align-items-center mb-3'>
                            <h3 className='h3 m-0'>Settings</h3>
                            <div className='d-flex flex-row'>
                                <CustomButton
                                    text='Close'
                                    onClick={hideWindow}
                                />
                            </div>
                        </div>
                        
                        <h4 className="mt-3 mb-2">Account</h4>
                        <div className="card p-3 mb-4">
                            <div className="d-flex flex-column">
                                <CustomButton
                                    text='Link with Google'
                                    className='btn-primary mb-3'
                                    onClick={handleLinkWithGoogle}
                                />
                                <CustomButton
                                    text='Logout'
                                    className='btn-danger'
                                    onClick={handleLogout}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </Modal>
    );
}