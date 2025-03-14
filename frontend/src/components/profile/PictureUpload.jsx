import { useState } from 'react';
import CustomTextInput from '../input/CustomTextInput';
import DefaultPFP from '../../assets/default-pfp.jpg';
import api from '../../lib/api';


export default function PictureUpload({ url, setUrl, className }) {
    const [tab, setTab] = useState('url');
    const [file, setFile] = useState(null);

    const handleUpdateFile = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const { data, error: apiError } = await api.post('/upload-picture', formData);
        if (apiError) {

        }
        else {
            setUrl(data.url);
            setTab('url');
        }
    }

    return (
        <div className={'d-flex flex-row justify-content-start align-items-stretch border \
        rounded-lg overflow-hidden '+(className || '')}>
            <img
                className='p-2'
                style={{width: '180px', height: '180px'}}
                src={url || DefaultPFP}
            />
            <div className='flex-grow-1 d-flex flex-column justify-content-start border-left'>
                <div className='d-flex flex-row justify-content-between
                align-items-center border-bottom'>
                    <div
                        onClick={() => setTab('url')}
                        className={'w-100 p-2 text-center '+(tab === 'url' ? ' bg-primary' : '')}
                    >URL</div>
                    <div
                        onClick={() => setTab('upload')}
                        className={'w-100 p-2 text-center '+(tab === 'upload' ? ' bg-primary' : '')}
                    >Upload</div>
                </div>
                <div className='p-3 flex-grow-1 d-flex flex-column justify-content-center'>
                    {tab === 'url' ?
                        <>
                            <label className='m-0' htmlFor='profile-picture-url'>Profile picture URL</label>
                            <CustomTextInput
                                id='profile-picture-url'
                                className='w-100'
                                value={url || ''}
                                onChange={text => setUrl(text)}
                                placeholder='PROFILE PICTURE URL'
                                />
                        </>
                    :
                        <div className='d-flex flex-row justify-content-between align-items-center'>
                            {file ?
                                <>
                                    <p className='m-0'>{file.name}</p>
                                    <button 
                                        className='btn btn-primary'
                                        onClick={handleUploadFile}
                                    >Upload</button>
                                </>
                            :
                                <>
                                    <label
                                        className='p-2 w-100 h-100 m-0 text-center'
                                        htmlFor='file-input'>Upload file</label>
                                    <input
                                        onChange={handleUpdateFile}
                                        hidden type='file'
                                        id='file-input'
                                        accept='image/jpeg, image/png'
                                    />
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}