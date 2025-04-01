import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import CustomTextInput from '../components/input/CustomTextInput';
import CustomButton from '../components/input/CustomButton';

import api from '../lib/api';
import { useAppContext } from '../lib/context';

export default function RegisterPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const context = useAppContext();

    async function handleSubmit(event) {
        event.preventDefault();
        const { data, error } = await api.post('/register', {email, username, password});
        if (error) {
            // handle error here
            alert(error);
        }
        else {
            // Set the nested user object into context
            context.setUser(data.user);
            navigate('/calendar');
        }
    }

    return (
        <div style={{height: '100vh'}} className='d-flex align-items-center justify-content-center rounded-lg'>
            <form
            className='p-3 d-flex flex-column align-items-center'
            style={{
                backgroundColor: context.colorScheme.backgroundColor,
                color: context.colorScheme.textColor,
            }}
            onSubmit={handleSubmit}>
                <h3 className='h3'>Register</h3>
                <div className='mb-3'>
                    <CustomTextInput
                        className='mb-2'
                        type='text'
                        value={email}
                        onChange={text => setEmail(text)}
                        placeholder='EMAIL'
                        style={{
                            backgroundColor: context.colorScheme.secondaryBackground,
                            color: context.colorScheme.textColor,
                        }}
                    />
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
                </div>
                <CustomButton className='mb-2' onClick={handleSubmit} text='Submit'/>
                <Link className='text-muted' to='/login'>Login</Link>
            </form>
        </div>
    );
};