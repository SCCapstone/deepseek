import {
    useState,
    useEffect,
} from 'react';
import CustomButton from '../../components/input/CustomButton';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import api from '../../lib/api';


export default function ProfileHeader({ editing, setEditing, className }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const showEditor = () => setEditing(true);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-profile');
        setError(apiError);
        setUserData(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [editing]);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading className='mt-5'/>

    return (
        <div
            className='position-relative w-100 p-3 d-flex flex-column
            justify-content-center align-items-center rounded-lg'
        >
            <CustomButton
                className='position-absolute m-3'
                style={{top: 0, right: 0}}
                text='Edit profile'
                onClick={showEditor}
            />
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