import { useState, useEffect } from 'react';
import Loading from '../Loading';
import Alert from '../Alert';
import FriendsGrid from './FriendsGrid';
import api from '../../lib/api';


export default function FriendsTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friends, setFriends] = useState(null);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/friends/get-friends');
        setError(apiError);
        setFriends(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading className='mb-3'/>

    if (friends) {
        return (
            <div>
                {friends.length > 0 ?
                    <div>
                        <FriendsGrid friends={friends}/>
                    </div>
                :
                    <div className='p-5 d-flex flex-column justify-content-center align-items-center'>
                        <p className='m-0'>Nothing to see here!</p>
                        <a href='/create-event'>Add a friend &#8594;</a>
                    </div>
                }
            </div>
        );
    }

    return null;
}