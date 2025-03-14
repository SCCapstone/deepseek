import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../lib/api';
import CustomTextInput from '../components/input/CustomTextInput';
import CustomButton from '../components/input/CustomButton';


export default function RegisterPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const { data, error } = await api.post('/register', {email, username, password});
        if (error) {
            // handle error here
            alert(error);
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
                    <CustomTextInput
                        className='mb-2'
                        type='text'
                        value={email}
                        onChange={text => setEmail(text)}
                        placeholder='EMAIL'
                    />
                    <CustomTextInput
                        className='mb-2'
                        type='text'
                        value={username}
                        onChange={text => setUsername(text)}
                        placeholder='USERNAME'
                    />
                    <CustomTextInput
                        className='mb-2'
                        type='password'
                        value={password}
                        onChange={text => setPassword(text)}
                        placeholder='PASSWORD'
                    />
                </div>
                <CustomButton className='mb-2' onClick={handleSubmit} text='Submit'/>
                <Link className='' to='/login'>Login</Link>
            </form>
        </div>
    );
};