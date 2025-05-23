// this is the profile header component
// it displays the profile header for the profile page, all of the main
// details about the user

import CustomButton from '../input/CustomButton';

import DefaultPFP from '../../assets/default-pfp.jpg';

import { useAppContext } from '../../lib/context';


export default function ProfileHeader({ userData, showEditor }) {
    const context = useAppContext();

    return (
        <div
            className='w-100 d-flex flex-column
            justify-content-center align-items-center rounded-lg'
            style={{
                backgroundColor: context.colorScheme.quaternaryBackground,
                color: context.colorScheme.textColor,
                padding: '15px'
            }}
        >
            {showEditor ?
                <div className='w-100 d-flex flex-row justify-content-end'>
                    <CustomButton
                        style={{top: 0, right: 0, backgroundColor: context.colorScheme.accentColor}}
                        text='Edit profile'
                        onClick={showEditor}
                    />
                </div>
            : null}
            <img
                className='mb-3 bg-white'
                src={userData.profile_picture || DefaultPFP}
                style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: 1000,
                }}
            />
            {userData.name ?
                <p className='mb-0' style={{color: context.colorScheme.textColor}}>{userData.name}</p>
            : null}
            <p
                className='mb-3'
                style={{
                    color: context.colorScheme.secondaryText,
                }}
            >@{userData.username}</p>
            {userData.bio ?
                <p style={{color: context.colorScheme.textColor}}>{userData.bio}</p>
            : null}
            <p style={{color: context.colorScheme.textColor}}>Joined {new Date(userData.joined).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
        </div>
    );
}