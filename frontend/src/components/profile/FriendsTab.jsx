// this is the friends tab component
// it displays the friends tab for the profile page

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import DefaultPFP from '../../assets/default-pfp.jpg';

import Loading from '../utility/Loading';
import Alert from '../utility/Alert';

import api from '../../lib/api';
import { useAppContext } from '../../lib/context';


function UserResult({ user, handleRemoveFriend, showAddButton }) {
    const [error, setError] = useState(null);
    const context = useAppContext();

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <div 
            className='p-2 rounded-lg mb-2 d-flex flex-row justify-content-between align-items-center'
            style={{
                backgroundColor: context.colorScheme.tertiaryBackground,
                color: context.colorScheme.textColor
            }}
        >
            <Link 
                className='d-flex flex-row align-items-center' 
                to={'/profile/' + user.username}
                style={{ textDecoration: 'none' }}
            >
                <img
                    className='mr-2'
                    src={user.profile_picture || DefaultPFP}
                    style={{
                        width: '40px',
                        borderRadius: 1000,
                    }}
                    alt={user.username}
                />
                <div className='d-flex flex-column'>
                    {(user.name && user.name !== '') ?
                        <p 
                            className='m-0 font-weight-bold'
                            style={{ color: context.colorScheme.textColor }}
                        >
                            {user.name}
                        </p>
                    : null}
                    <p 
                        className='m-0'
                        style={{ color: context.colorScheme.secondaryText }}
                    >
                        @{user.username}
                    </p>
                </div>
            </Link>
            {showAddButton ?
                <button
                    onClick={handleRemoveFriend}
                    className='btn'
                    style={{
                        backgroundColor: context.colorScheme.danger,
                        color: 'white',
                        border: 'none',
                        transition: 'background-color 0.2s ease, transform 0.1s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = `${context.colorScheme.danger}dd`;
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = context.colorScheme.danger;
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Remove
                </button>
            : null}
        </div>
    );
}


export default function FriendsTab({ username }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState(null);
    const context = useAppContext();

    const getData = async () => {
        setLoading(true);
        let url;
        if (!username)
            url = '/friends/get-friends';
        else
            url = '/friends/get-user-friends/' + username;
        const { data, error: apiError } = await api.get(url);
        setError(apiError);
        setFriends(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    const handleRemoveFriend = async (username) => {
        const { data, error: apiError } = await api.post('/friends/remove/' + username);
        setError(apiError);
        getData();
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading className='mb-3'/>

    if (friends) {
        return (
            <div style={{ backgroundColor: context.colorScheme.secondaryBackground }}>
                {friends.length > 0 ?
                    <div>
                        {friends.map((item, i) => (
                            <UserResult
                                key={i}
                                user={item}
                                handleRemoveFriend={() => handleRemoveFriend(item.username)}
                                showAddButton={username === undefined}
                            />
                        ))}
                    </div>
                :
                    <div className='p-5 d-flex flex-column justify-content-center align-items-center'>
                        <p className='m-0' style={{ color: context.colorScheme.textColor }}>
                            Nothing to see here!
                        </p>
                    </div>
                }
            </div>
        );
    }

    return null;
}