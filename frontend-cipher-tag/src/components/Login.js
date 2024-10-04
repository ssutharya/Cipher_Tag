import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState(''); // Change state to 'username'
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }

    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:8000/api/doctor/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  // Use 'username' here
          password,
        }),
      });

      // Parse the response
      const data = await response.json();

      if (response.ok) {
        // Successful login, store the access token
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        // Handle error from the backend
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-image"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/doctor-login.jpg)`,
        }}
      ></div>
      <div className="login-box">
        <h2>CipherTag™</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label> {/* Update label */}
            <input
              type="text"  // Change input type to 'text'
              placeholder="Enter your username"  // Update placeholder
              value={username}
              onChange={(e) => setUsername(e.target.value)}  // Update to set 'username'
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
