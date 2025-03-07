import {
    useState,
    useEffect,
} from 'react';
import CustomButton from '../../components/input/CustomButton';
import api from '../../lib/api';


export default function ProfileHeader({ showEditor }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-profile');
        if (apiError) {
            setError(apiError);
        }
        else {
            setUserData(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (error) return <div>error: {error}</div>
    if (loading) return <div>loading...</div>

    return (
        <div
            className='container p-3 mt-3 p-3 d-flex flex-column
                justify-content-center align-items-center rounded-lg'
            style={{ backgroundColor: '#eee' }}
        >
            <div
                className='position-relative w-100 d-flex flex-row justify-content-center align-items-start'
            >
                <img
                    className='mb-3'
                    src={userData.profile_picture}
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: 1000,
                        backgroundColor: '#888',
                    }}
                />
                <CustomButton
                    className='position-absolute'
                    style={{top: 0, right: 0}}
                    text='Edit profile'
                    onClick={showEditor}
                />
            </div>
            {userData.name ?
                <p className='mb-1'>{userData.name}</p>
            : null}
            <p
                className='mb-3'
                style={{
                    color: '#888',
                }}
            >@{userData.username}</p>
            {userData.bio ?
                <p style={{color: 'black'}}>{userData.bio}</p>
            : null}
            <p>Joined {new Date(userData.joined).toLocaleDateString('en-us')}</p>
        </div>
    );
}