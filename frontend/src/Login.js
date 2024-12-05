// login page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password };
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                navigate('/');
            }
            else {
                alert('Invalid username or password');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
      };

    return (
        <div className='app-container'>
          <form className='login-form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label className='form-label'>Username</label>
              <input
                className='form-input'
                placeholder='USERNAME'
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Password</label>
              <input
                className='form-input'
                type='password'
                placeholder='PASSWORD'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button className='form-button-login' type='submit'>
              Login
            </button>
          </form>
        </div>
    );
}
