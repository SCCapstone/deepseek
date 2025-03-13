import { useState } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditor from '../components/profile/ProfileEditor';
import ProfileTabs from '../components/profile/ProfileTabs';
import Modal from '../components/utility/Modal';


export default function ProfilePage() {
    const [editing, setEditing] = useState(false);

    return (
        <div className='w-100' style={{ overflowY: 'auto' }}>
            <div
                className='container my-3 w-100 rounded
                d-flex flex-column justify-content-start align-items-stretch'
                style={{ backgroundColor: '#eee' }}
            >
                <ProfileHeader {...{editing, setEditing}}/>
                <ProfileTabs/>
            </div>
            <ProfileEditor showEditor={editing} hideEditor={() => setEditing(false)}/>
        </div>
    );
}