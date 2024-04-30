import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Home.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://budget-app-backend1.onrender.com/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        // Redirect to dashboard page
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data.message);
        setErrorMessage('Email or password invalid'); // Set error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
      <div className="login-container">
        <h1>Welcome to the Budget App</h1>
        <p>Please sign up or log in to continue.</p>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
      </div>
  );
};

export default HomePage;
