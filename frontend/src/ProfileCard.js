import React from 'react';
import './App.css'; // CSS for styling

function ProfileCard({ userData }) {
  console.log('ProfileCard received userData:', userData)

  if (!userData) {
    return <p>Loading user data...</p>;  // Or show a loading indicator
  }

  return (
    <div className="profile-card">
      <p>User: {userData.username}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
}

export default ProfileCard;