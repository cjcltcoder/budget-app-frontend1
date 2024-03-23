import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      const response = await fetch('http://localhost:5000/users', {
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
        // Handle error (display error message, etc.)
      }
    } catch (error) {
      console.error('Error signing up user:', error.message);
      setMessage('Error adding user');
      // Handle error (display error message, etc.)
    }
  };

  return (
    <div>
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
      <p><Link to="/">Back to Home Page</Link></p>
    </div>
  );
};

export default SignupPage;
