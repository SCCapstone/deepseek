import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import CustomTextInput from '../components/input/CustomTextInput';
import CustomButton from '../components/input/CustomButton';

import { useAppContext } from '../lib/context';
import api from '../lib/api';



export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const context = useAppContext();
    async function handleSubmit(event) {
        event.preventDefault();
        const { data, error } = await api.post('/login', { username, password });
        if (error) {
            // handle error here
            alert(error);
        }
        else {
            navigate('/calendar');
        }
    };

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center rounded-lg'>
            <form
            className='p-3 d-flex flex-column align-items-center'
            style={{
                backgroundColor: context.colorScheme.backgroundColor,
                color: context.colorScheme.textColor,
            }}
            onSubmit={handleSubmit}>
                <h3 className='h3'>Login</h3>
                <CustomTextInput
                    className='mb-2'
                    type='text'
                    value={username}
                    onChange={text => setUsername(text)}
                    placeholder='USERNAME'
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
                    placeholder='PASSWORD'
                    style={{
                        backgroundColor: context.colorScheme.secondaryBackground,
                        color: context.colorScheme.textColor,
                    }}
                />
                <CustomButton className='mb-2' onClick={handleSubmit} text='Submit'/>
                <Link className='text-muted' to='/register'>Register</Link>
            </form>
        </div>
    );
}