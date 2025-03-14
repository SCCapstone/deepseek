import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DefaultPFP from '../../assets/default-pfp.jpg';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import api from '../../lib/api';


function UserResult({ user, handleRemoveFriend, showAddButton }) {
    const [error, setError] = useState(null);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>

    return (
        <div className='p-2 rounded-lg mb-2 bg-light d-flex flex-row justify-content-between align-items-center'>
            <Link className='d-flex flex-row align-items-center' to={'/profile/' + user.username}>
                <img
                    className='mr-2'
                    src={user.profile_picture || DefaultPFP}
                    style={{
                        width: '40px',
                        borderRadius: 1000,
                    }}
                />
                <div className='d-flex flex-column'>
                    {(user.name && user.name !== '') ?
                        <p className='m-0 font-weight-bold text-dark'>{user.name}</p>
                    : null}
                    <p className='m-0 text-muted text-dark'>@{user.username}</p>
                </div>
            </Link>
            {showAddButton ?
                <button
                    onClick={handleRemoveFriend}
                    className='btn btn-danger'
                >Remove</button>
            : null}
        </div>
    );
}


export default function FriendsTab({ username }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState(null);

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
            <div>
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
                        <p className='m-0'>Nothing to see here!</p>
                    </div>
                }
            </div>
        );
    }

    return null;
}