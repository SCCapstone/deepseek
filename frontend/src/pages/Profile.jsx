import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditor from '../components/profile/ProfileEditor';
import ProfileTabs from '../components/profile/ProfileTabs';
import Modal from '../components/utility/Modal';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';
import api from '../lib/api';


export default function ProfilePage() {
    const { username } = useParams();
    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const showEditor = () => setEditing(true);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-profile' + (username ? '/' + username : ''));
        setError(apiError);
        setUserData(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!editing)
            getData();
    }, [editing, username]);

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading className='mt-5'/>

    return (
        <div className='w-100' style={{ overflowY: 'auto' }}>
            <div
                className='container my-3 w-100 rounded
                d-flex flex-column justify-content-start align-items-stretch'
                style={{ backgroundColor: '#eee' }}
            >
                <ProfileHeader userData={userData} showEditor={username ? null : () => setEditing(true)}/>
                <ProfileTabs username={username}/>
            </div>
            <ProfileEditor showEditor={editing} hideEditor={() => setEditing(false)}/>
        </div>
    );
}