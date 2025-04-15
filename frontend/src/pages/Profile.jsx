import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditor from '../components/profile/ProfileEditor';
import ProfileTabs from '../components/profile/ProfileTabs';
import Modal from '../components/utility/Modal';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';

import api from '../lib/api';
import { useAppContext } from '../lib/context';
import NavBar from '../components/navbar/NavBar';   

export default function ProfilePage() {
    const { username } = useParams();
    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const context = useAppContext();

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
        <>
            <NavBar/>
            <div className='w-100' style={{ overflowY: 'auto' }}>
                <div
                    className='container my-3 w-100 rounded-lg
                d-flex flex-column justify-content-start align-items-stretch'
                style={{ backgroundColor: context.colorScheme.secondaryBackground, 
                    paddingTop: '15px',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}
                >
                <ProfileHeader userData={userData} showEditor={username ? null : () => setEditing(true)}/>
                <div className='w-100' style={{backgroundColor: context.colorScheme.quaternaryBackground, 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    padding: '15px',
                    marginTop: '15px',
                    marginBottom: '15px'
                }}>
                    <ProfileTabs username={username}/>
                </div>
            </div>
            <ProfileEditor showEditor={editing} hideEditor={() => setEditing(false)}/>
        </div>
        </>
    );
}