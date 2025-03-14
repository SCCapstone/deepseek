import CustomButton from '../input/CustomButton';
import DefaultPFP from '../../assets/default-pfp.jpg';


export default function ProfileHeader({ userData, showEditor }) {
    return (
        <div
            className='w-100 p-3 d-flex flex-column
            justify-content-center align-items-center rounded-lg'
        >
            {showEditor ?
                <div className='w-100 d-flex flex-row justify-content-end'>
                    <CustomButton
                        style={{top: 0, right: 0}}
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
                <p className='mb-0'>{userData.name}</p>
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