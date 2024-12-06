import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google login route
    window.location.href = 'http://localhost:5000/googlelogin';
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleLoginButton;

