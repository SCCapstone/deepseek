import { useState } from 'react';
import CustomTextInput from '../input/CustomTextInput';
import DefaultPFP from '../../assets/default-pfp.jpg';
import api from '../../lib/api';
import { useAppContext } from '../../lib/context';
import CustomButton from '../input/CustomButton';
import Alert from '../utility/Alert';

export default function PictureUpload({ url, setUrl, className }) {
    const [tab, setTab] = useState('url');
    const [file, setFile] = useState(null);
    const context = useAppContext();

    const handleUpdateFile = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const { data, error: apiError } = await api.post('/upload-picture', formData);
        if (apiError) {
            <Alert
                message='Upload failed'
                hideAlert={() => {}}
            />
        }
        else {
            setUrl(data.url);
            setTab('url');
            setFile(null);
        }
    }

    const tabStyle = (isActive) => ({
        width: '100%',
        padding: '0.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isActive ? context.colorScheme.accentColor : context.colorScheme.tertiaryBackground,
        color: isActive ? 'white' : context.colorScheme.textColor,
        borderBottom: `1px solid ${context.colorScheme.borderColor}`,
        transition: 'background-color 0.2s ease'
    });

    const hoverBackground = context.colorScheme.name === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)';

    return (
        <div 
            className={`d-flex flex-row justify-content-start align-items-stretch rounded-lg overflow-hidden ${className || ''}`}
            style={{ border: `1px solid ${context.colorScheme.borderColor}`, backgroundColor: context.colorScheme.secondaryBackground }}
        >
            <img
                className='p-2 align-self-center'
                style={{width: '180px', height: '180px', objectFit: 'cover'}}
                src={url || DefaultPFP}
                alt="Profile Preview"
            />
            <div className='flex-grow-1 d-flex flex-column justify-content-start' style={{ borderLeft: `1px solid ${context.colorScheme.borderColor}` }}>
                <div className='d-flex flex-row justify-content-between align-items-center'>
                    <div
                        onClick={() => setTab('url')}
                        style={tabStyle(tab === 'url')}
                        onMouseOver={(e) => { if (tab !== 'url') e.currentTarget.style.backgroundColor = hoverBackground; }}
                        onMouseOut={(e) => { if (tab !== 'url') e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground; }}
                    >URL</div>
                    <div
                        onClick={() => setTab('upload')}
                        style={tabStyle(tab === 'upload')}
                        onMouseOver={(e) => { if (tab !== 'upload') e.currentTarget.style.backgroundColor = hoverBackground; }}
                        onMouseOut={(e) => { if (tab !== 'upload') e.currentTarget.style.backgroundColor = context.colorScheme.tertiaryBackground; }}
                    >Upload</div>
                </div>
                <div className='p-3 flex-grow-1 d-flex flex-column justify-content-center'>
                    {tab === 'url' ?
                        <>
                            <label className='m-0 mb-1' htmlFor='profile-picture-url' style={{ color: context.colorScheme.textColor }}>Profile picture URL</label>
                            <CustomTextInput
                                id='profile-picture-url'
                                className='w-100'
                                value={url || ''}
                                onChange={text => setUrl(text)}
                                placeholder='Paste image URL here'
                            />
                        </>
                    :
                        <div className='d-flex flex-column align-items-center'>
                            {file ?
                                <div className='d-flex flex-row justify-content-between align-items-center w-100'>
                                    <p className='m-0 mr-2' style={{ color: context.colorScheme.textColor, overflowWrap: 'break-word' }}>{file.name}</p>
                                    <CustomButton 
                                        text='Upload'
                                        onClick={handleUploadFile}
                                    />
                                </div>
                            :
                                <>
                                    <label
                                        htmlFor='file-input'
                                        className='btn'
                                        style={{ 
                                            backgroundColor: context.colorScheme.accentColor, 
                                            color: 'white', 
                                            cursor: 'pointer',
                                            padding: '0.5rem 1rem'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = `${context.colorScheme.accentColor}cc`; }}
                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = context.colorScheme.accentColor; }}
                                    >
                                        Choose File
                                    </label>
                                    <input
                                        onChange={handleUpdateFile}
                                        hidden 
                                        type='file'
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