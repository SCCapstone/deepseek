import {
    useState,
    useEffect,
} from 'react';
import { useAppContext } from '../lib/context';
import api from '../lib/api';
import NavBar from '../components/NavBar';


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
        }
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
            getData();
        }
    }

    const getData = async () => {
        setLoading(true);
        const { data, error, message } = await api.get('/friends/get-friends');
        if (error) {
            // handle error here
            setError(error);
        }
        else {
            console.log(data.friends)
            setFriends(data.friends);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div style={styles.page}>
            <NavBar/>
            <div className='mt-5 container p-3 rounded-lg bg-light'>
                <h3>Friends</h3>
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
                <div className='p-3 bg-white rounded'>
                    {friends.map((friend, i) =>
                        <div
                            key={i}
                            className='p-1 rounded d-flex flex-row justify-content-between align-items-center'>
                            <div className='d-flex flex-row justify-content-start align-items-center'>
                                <img
                                    className='mr-3'
                                    src={context.user.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 1000,
                                    }}/>
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