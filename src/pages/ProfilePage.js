import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication failed: Token not found');
        }
        const response = await axios.get('http://localhost:5000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmail(response.data.email);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleUpdateEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      const response = await axios.patch(
        'http://localhost:5000/users/profile',
        { email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEmail(newEmail);
      setNewEmail('');
      setSuccessMessage('Email updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      const response = await axios.patch(
        'http://localhost:5000/users/profile',
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewPassword('');
      setSuccessMessage('Password updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (redirect) {
    // Perform redirection
    window.location.href = '/dashboard'; // Redirect to dashboard
    return null; // This is necessary to prevent further rendering of the component
  }

  return (
    <div>
      <h2>Profile Page</h2>
      {error && <p>Error: {error}</p>}
      {successMessage && <p>{successMessage}</p>}
      <p>Email: {email}</p>
      <input type="email" value={newEmail} onChange={handleEmailChange} />
      <button onClick={handleUpdateEmail}>Update Email</button>
      <br />
      <input type="password" value={newPassword} onChange={handlePasswordChange} />
      <button onClick={handleUpdatePassword}>Update Password</button>
      <div>
        <button onClick={() => setRedirect(true)}>Go back to dashboard</button> {/* Button to trigger redirection */}
      </div>

    </div>
  );
};

export default ProfilePage;
