import React from 'react';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';
import './App.css';

const user = {
  name: "Robert Graham",
  email: "bobbyg@gmail.com",
  password:"jellybeans",
};

export default function Profile() {
  return (
    <div className="app-container">
      <h1>User Profile</h1>
      <ProfileCard user={user} />
    </div>
  );
}

