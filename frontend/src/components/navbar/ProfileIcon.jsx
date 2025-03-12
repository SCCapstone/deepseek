import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DefaultPFP from '../../assets/default-pfp.jpg';
import Alert from '../utility/Alert';
import api from '../../lib/api';


export default function ProfileIcon() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const getData = async () => {
        const { data, error: apiError } = await api.get('/get-profile');
        setError(apiError);
        setUser(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <Link to='/profile'>
            <img
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 1000,
                }}
                src={
                    (loading || (user && (!user.profile_picture || user.profile_picture === '')))
                    ? DefaultPFP : user.profile_picture
                }
            />
        </Link>
    );
}