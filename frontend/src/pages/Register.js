import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../lib/api';


export default function Register() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const { error } = await api.post('/register', {email, username, password});
        if (error) {
            // handle error here
        }
        else {
            navigate('/calendar');
        }
    }

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center'>
            <form
            className='p-3 d-flex flex-column align-items-center
            border border-black rounded-lg shadow'
            onSubmit={handleSubmit}>
                <h3 className='h3'>Register</h3>
                <div className='mb-3'>
                    <div className='mb-1'>
                        <label className='m-0'>Email</label>
                        <input
                            className='form-control'
                            placeholder='EMAIL'
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
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
                type='submit'>Register</button>
                <Link className='' to='/login'>Login</Link>
            </form>
        </div>
    );
};