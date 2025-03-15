import { useState, useEffect } from 'react';
import CustomButton from '../input/CustomButton';
import CustomTextInput from '../input/CustomTextInput';
import CustomTextarea from '../input/CustomTextarea';
import Loading from '../utility/Loading';
import Alert from '../utility/Alert';
import Modal from '../utility/Modal';
import PictureUpload from './PictureUpload';
import api from '../../lib/api';
import { useAppContext } from '../../lib/context';

export default function ProfileEditor({ showEditor, hideEditor }) {
    const context = useAppContext();
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
    }, [showEditor]);

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

    return (
        <Modal showModal={showEditor} hideModal={hideEditor}>
            {loading ? <Loading/> :
                <div className='w-100 p-4 rounded' style={{backgroundColor: context.colorScheme.secondaryBackground}}>
                    <div className='w-100 mb-3 d-flex flex-row justify-content-between align-items-center' style={{backgroundColor: context.colorScheme.secondaryBackground}}>
                        <h3 className='h3 m-0' style={{color: context.colorScheme.textColor}}>Edit profile</h3>
                        <div>
                            <CustomButton className='mr-1 btn-danger' text='Cancel' onClick={hideEditor}/>
                            <CustomButton text='Save' onClick={handleSaveProfile}/>
                        </div>
                    </div>
                    <label className='m-0 w-100' htmlFor='profile-picture' style={{color: context.colorScheme.textColor}}>Profile picture</label>
                    <PictureUpload
                        id='profile-picture'
                        className='mb-4'
                        url={userData.profile_picture}
                        setUrl={url => handleUpdateField('profile_picture', url)}
                    />
                    <label className='m-0 w-100' htmlFor='name' style={{color: context.colorScheme.textColor}}>Name</label>
                    <CustomTextInput
                        id='name'
                        type='text'
                        placeholder='NAME'
                        value={userData.name || ''}
                        onChange={text => handleUpdateField('name', text)}
                        className='mb-2 w-100'
                    />
                    <label className='m-0 w-100' htmlFor='username' style={{color: context.colorScheme.textColor}}>Username</label>
                    <CustomTextInput
                        id='username'
                        type='text'
                        placeholder='USERNAME'
                        value={userData.username}
                        onChange={text => handleUpdateField('username', text)}
                        className='mb-2 w-100'
                    />
                    <label className='m-0 w-100' htmlFor='bio' style={{color: context.colorScheme.textColor}}>Bio</label>
                    <CustomTextarea
                        id='bio'
                        value={userData.bio || ''}
                        onChange={text => handleUpdateField('bio', text)}
                        className='mb-2 w-100'
                    />
                </div>
            }
        </Modal>
    );
}