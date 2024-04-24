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
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication failed: Token not found');
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
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
      if (!newEmail.trim()) {
        throw new Error('Please enter a new email');
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile`,
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
      if (!newPassword.trim()) {
        throw new Error('Please enter a new password');
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile`,
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

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication failed: Token not found');
      }
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Optional: You can also clear local storage or perform any other actions here
      setRedirect(true); // Redirect to another page after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  if (redirect) {
    // Redirect to homepage after deletion
    window.location.href = '/'; // Change '/' to your actual homepage route if needed
    return null; // Prevent further rendering
  }

  return (
    <div>
      <div>
        <button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button> {/* Button to trigger redirection */}
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
          <button onClick={handleDeleteUser}>Delete User</button> {/* Button to delete the user */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
