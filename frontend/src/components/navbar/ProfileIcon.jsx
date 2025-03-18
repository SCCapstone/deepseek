// this is the profile icon component
// it displays the profile icon for the navbar

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DefaultPFP from '../../assets/default-pfp.jpg';

import Alert from '../utility/Alert';

import api from '../../lib/api';
import { useAppContext } from '../../lib/context';


export default function ProfileIcon() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isIconHovered, setIsIconHovered] = useState(false);
    const context = useAppContext();

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
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    transform: isIconHovered ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isIconHovered ? `0 0 8px ${context.colorScheme.accentColor}40` : 'none',
                    cursor: 'pointer'
                }}
                src={
                    (loading || (user && (!user.profile_picture || user.profile_picture === '')))
                    ? DefaultPFP : user.profile_picture
                }
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
            />
        </Link>
    );
}