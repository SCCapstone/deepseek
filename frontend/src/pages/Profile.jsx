import { useState } from 'react';
import NavBar from '../components/NavBar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditor from '../components/profile/ProfileEditor';


export default function ProfilePage() {
    const [editing, setEditing] = useState(false);

    return (
        <div className='position-relative'>
            <NavBar/>
            <ProfileHeader showEditor={() => setEditing(true)}/>
            {editing ? <ProfileEditor hideEditor={() => setEditing(false)}/> : null}
        </div>
    );
}