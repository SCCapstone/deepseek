import {
    useState,
    useEffect,
} from 'react';
import { useAppContext } from '../lib/context';
import api from '../lib/api';


export default function Friends() {
    const context = useAppContext();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addInput, setAddInput] = useState('');

    const styles = {
        page: {
            height: '100vh',
            backgroundColor: context.colorScheme.backgroundColor,
        },
        sectionTitle: {
            color: context.colorScheme.textColor,
        },
        label: {
            color: context.colorScheme.textColor,
        },
        friendsWrapper: {
            backgroundColor: context.colorScheme.accentColor,
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
        },
        friendCard: {
            backgroundColor: context.colorScheme.backgroundColor,
            padding: '15px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
            marginBottom: '10px',
            color: context.colorScheme.textColor,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        friendInfo: {
            display: 'flex',
            alignItems: 'center',
        },
        friendPfp: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px',
        },
    }

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (addInput === '') {
            alert('Please enter username');
            return;
        }
        const { data, error, message } = await api.post('/friends/add/' + addInput, {});
        if (error) {
            alert(error);
        }
        else {
            alert(message);
            setAddInput('');
        }
    }
    
    const handleRemoveFriend = async (username) => {
        const { data, error, message } = await api.post('/friends/remove/' + username);
        if (error) {
            alert(error);
        }
        else {
            alert(message);
            await getData();
        }
    };
    

    const getData = async () => {
        setLoading(true);
        const { data, error, message } = await api.get('/friends/get-friends');
        if (error) {
            // handle error here
            setError(error);
        }
        else {
            setFriends(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div style={styles.page}>
            <div className='mt-5 container p-3 rounded-lg'>
                <h3 style={styles.sectionTitle}>Friends</h3>
                <form className='d-flex flex-row mb-3' onSubmit={handleAddFriend}>
                    <input
                        id='username'
                        type='text'
                        placeholder='username'
                        value={addInput}
                        autoComplete='off'
                        onChange={e => setAddInput(e.target.value)}
                    />
                    <button
                        type='submit'
                        className='btn btn-primary'
                    >Add</button>
                </form>
                <div style={styles.friendsWrapper} className='p-3 rounded'>
                    {friends.map((friend, i) =>
                        <div
                            key={i}
                            style={styles.friendCard}
                        >
                            <div style={styles.friendInfo}>
                                <img
                                    src={context.user.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                                    style={styles.friendPfp}
                                />
                                <p className='m-0'>{friend.username}</p>
                            </div>
                            <button onClick={() => handleRemoveFriend(friend.username)} className='btn btn-danger'>
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}