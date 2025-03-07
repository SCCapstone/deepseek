import { useState } from 'react';
import NavBar from '../components/NavBar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditor from '../components/profile/ProfileEditor';
import ProfileTabs from '../components/profile/ProfileTabs';


export default function ProfilePage() {
    const [editing, setEditing] = useState(false);

    return (
        <div>
            <div
                className='container mt-3 w-100 rounded
                d-flex flex-column justify-content-start align-items-stretch'
                style={{ backgroundColor: '#eee' }}
            >
                <ProfileHeader {...{editing, setEditing}}/>
                <ProfileTabs/>
            </div>
            {editing ? <ProfileEditor hideEditor={() => setEditing(false)}/> : null}
        </div>
    );
}