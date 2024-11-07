import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default role is 'admin'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let loginUrl;

    // Determine the login URL based on the role selected
    switch (role) {
      case 'admin':
        loginUrl = 'http://34.47.208.77/api/admin/login/';
        break;
      case 'hospital_admin':
        loginUrl = 'http://34.47.208.77/api/user/login/';
        break;
      case 'doctor':
        loginUrl = 'http://34.47.208.77/api/doctor/login/';
        break;
      default:
        setErrorMessage('Please select a valid role');
        return;
    }

    try {
      const response = await axios.post(loginUrl, { username, password });
      
      // Store access and refresh tokens
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'hospital_admin') {
        navigate('/hospital-admin');
      } else if (role === 'doctor') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error.response);
      setErrorMessage('Login failed. Please check your credentials.');
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
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="hospital_admin">Hospital Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
