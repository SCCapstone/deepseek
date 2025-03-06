import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAppContext } from '../lib/context';


export default function Login() {
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
            // getting profile data
            context.setUser(data.user);
            navigate('/calendar');
        }
    };

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center'>
            <form
            className='p-3 d-flex flex-column align-items-center
            border border-black rounded-lg shadow'
            onSubmit={handleSubmit}>
                <h3 className='h3'>Login</h3>
                <div className='mb-3'>
                    <div className='mb-1'>
                        <label className='m-0'>Username</label>
                        <input
                            className='form-control'
                            placeholder='USERNAME'
                            type='text'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-1'>
                        <label className='m-0'>Password</label>
                        <input
                            className='form-control'
                            type='password'
                            placeholder='PASSWORD'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button
                onClick={handleSubmit}
                className='btn btn-primary mb-3'
                type='submit'>Login</button>
                <Link className='' to='/register'>Register</Link>
            </form>
        </div>
    );
}