import React from 'react';
import './App.css'; // CSS for styling

function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <p>User: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
    </div>
  );
}

export default ProfileCard;