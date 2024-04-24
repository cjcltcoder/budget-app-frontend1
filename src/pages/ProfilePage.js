import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Profile.css';

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      const url = `https://budget-app-backend1.onrender.com/users/profile`;
      console.log('Fetching user profile from:', url); // Log the URL being used
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching user profile:', error); // Log any error that occurs
      setError(error.message);
    }
  };

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleUpdateEmail = async () => {
    try {
      if (!newEmail.trim()) {
        throw new Error('Please enter a new email');
      }
      const response = await updateProfile({ email: newEmail });
      setEmail(newEmail);
      setNewEmail('');
      setSuccessMessage('Email updated successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!newPassword.trim()) {
        throw new Error('Please enter a new password');
      }
      await updateProfile({ password: newPassword });
      setNewPassword('');
      setSuccessMessage('Password updated successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteProfile();
      setRedirect(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateProfile = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/profile`;
      console.log('Updating user profile at:', url); // Log the URL being used
      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/profile`;
      console.log('Deleting user profile at:', url); // Log the URL being used
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      throw error;
    }
  };

  if (redirect) {
    window.location.href = '/'; // Redirect to homepage after deletion
    return null;
  }

  return (
    <div>
      <div>
        <button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
      </div>

      <div className="profile-page">
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
          <button onClick={handleDeleteUser}>Delete User</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
