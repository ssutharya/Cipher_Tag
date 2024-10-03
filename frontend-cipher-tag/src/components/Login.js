import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setErrorMessage('Please fill in both fields');
    } else {
      // Clear the error message and log the data for now
      setErrorMessage('');
      console.log('Email:', email);
      console.log('Password:', password);

      // Navigate to the dashboard after successful login
      navigate('/Dashboard');
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-image"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/doctor-login.jpg)`,
        }}
      >
        {/* No need for <img> tag, as background image is handled here */}
      </div>
      <div className="login-box">
        <h2>CipherTag™</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
