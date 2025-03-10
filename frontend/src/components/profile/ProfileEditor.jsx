import { useState, useEffect } from 'react';
import CustomButton from '../../components/input/CustomButton';
import CustomTextInput from '../../components/input/CustomTextInput';
import CustomTextarea from '../../components/input/CustomTextarea';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import PictureUpload from './PictureUpload';
import api from '../../lib/api';


export default function ProfileEditor({ showEditor, hideEditor }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [editedFields, setEditedFields] = useState([]);

    const getData = async () => {
        setLoading(true);
        const { data, error: apiError } = await api.get('/get-profile');
        setError(apiError);
        setUserData(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    const handleUpdateField = (field, value) => {
        if (!editedFields.includes(field))
            setEditedFields([...editedFields, field]);
        let tmp = {}
        tmp[field] = value;
        setUserData({...userData, ...tmp});
    }

    const handleSaveProfile = async () => {
        setLoading(true);
        let updatedData = {}
        editedFields.map(field => {
            updatedData[field] = userData[field];
        });
        const { data, error: apiError } = await api.post('/update-profile', updatedData);
        if (apiError) {
            setError(apiError);
        }
        else {
            setEditedFields([]);
            hideEditor();
        }
        setLoading(false);
    }

    if (error) return <Alert message={error} hideAlert={() => setError(null)}/>
    if (loading) return <Loading/>

    return (
        <div className='w-100'>
            <div className='w-100 mb-3 d-flex flex-row justify-content-between align-items-center'>
                <h3 className='h3 m-0'>Edit profile</h3>
                <div>
                    <CustomButton className='mr-1 btn-danger' text='Cancel' onClick={hideEditor}/>
                    <CustomButton text='Save' onClick={handleSaveProfile}/>
                </div>
            </div>
            <label className='m-0 w-100' htmlFor='profile-picture'>Profile picture</label>
            <PictureUpload
                id='profile-picture'
                className='mb-3'
                url={userData.profile_picture}
                setUrl={url => handleUpdateField('profile_picture', url)}
            />
            <label className='m-0 w-100' htmlFor='name'>Name</label>
            <CustomTextInput
                id='name'
                type='text'
                placeholder='NAME'
                value={userData.name || ''}
                onChange={text => handleUpdateField('name', text)}
                className='mb-2 w-100'
            />
            <label className='m-0 w-100' htmlFor='username'>Username</label>
            <CustomTextInput
                id='username'
                type='text'
                placeholder='USERNAME'
                value={userData.username}
                onChange={text => handleUpdateField('username', text)}
                className='mb-2 w-100'
            />
            <label className='m-0 w-100' htmlFor='email'>Email</label>
            <CustomTextInput
                id='email'
                type='text'
                placeholder='EMAIL'
                value={userData.email}
                onChange={text => handleUpdateField('email', text)}
                className='mb-2 w-100'
            />
            <label className='m-0 w-100' htmlFor='bio'>Bio</label>
            <CustomTextarea
                id='bio'
                value={userData.bio || ''}
                onChange={text => handleUpdateField('bio', text)}
                className='mb-2 w-100'
            />
        </div>
    );
}