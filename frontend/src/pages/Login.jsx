import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt } from "react-icons/fa";

import CustomTextInput from '../components/input/CustomTextInput';
import CustomButton from '../components/input/CustomButton';
import Alert from '../components/utility/Alert';

import { useAppContext } from '../lib/context';
import api from '../lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const context = useAppContext();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setShowAlert(false);
        const { data, error: apiError } = await api.post('/login', { username, password });
        if (apiError) {
            console.log(apiError);
            setError(apiError || 'An unexpected error occurred.');
            setShowAlert(true);
        } else {
            context.setUser(data.user);
            navigate('/calendar');
        }
    };

    const hideAlert = () => {
        setShowAlert(false);
        setError('');
    };

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center'>
            {showAlert && <Alert message={error} hideAlert={hideAlert} />}
            <form
            className='p-4 d-flex flex-column align-items-center shadow-sm'
            style={{
                backgroundColor: context.colorScheme.backgroundColor,
                color: context.colorScheme.textColor,
                borderRadius: '8px',
                minWidth: '300px'
            }}
            onSubmit={handleSubmit}>
                <div className='d-flex align-items-center mb-3'>
                    <FaCalendarAlt className='mr-2' size={32} />
                    <h3 className='h3 mb-0'>Login</h3>
                </div>
                <div className='w-100 mb-3'>
                    <CustomTextInput
                        className='mb-2'
                        type='text'
                        value={username}
                        onChange={text => setUsername(text)}
                        placeholder='Enter username'
                        style={{
                            backgroundColor: context.colorScheme.secondaryBackground,
                            color: context.colorScheme.textColor,
                        }}
                    />
                    <CustomTextInput
                        className='mb-2'
                        type='password'
                        value={password}
                        onChange={text => setPassword(text)}
                        placeholder='Enter password'
                        style={{
                            backgroundColor: context.colorScheme.secondaryBackground,
                            color: context.colorScheme.textColor,
                        }}
                    />
                </div>
                <CustomButton className='mb-3 w-100' onClick={handleSubmit} text='Submit'/>
                <Link className='text-muted mt-2' to='/register'>Don't have an account? Register</Link>
            </form>
        </div>
    );
}