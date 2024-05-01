import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Signup.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send only email and password
      });
      if (response.ok) {
        console.log('User signed up successfully');
        setMessage('User added successfully');
        // Clear the input fields
        setEmail('');
        setPassword('');
        // Optionally, redirect to a different page or display a success message
      } else {
        console.error('Failed to sign up user:', response.statusText);
        setMessage('Failed to add user');
  
      }
    } catch (error) {
      console.error('Error signing up user:', error.message);
      setMessage('Error adding user');
  
    }
  };

  return (
    <div className="signup-page">
      <div className="go-to-home">
        <button onClick={() => window.location.href = '/'}>Go to Homepage</button>
      </div>
      <div className="signup-container">
        <h2>Signup</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
