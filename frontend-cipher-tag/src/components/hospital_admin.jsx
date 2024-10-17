// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './hospital_admin.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/doctors">View Doctors</Link></li>
        <li><Link to="/global-medicine">Add Global Medicine</Link></li>
        <li><Link to="/medicines">Manage Global Medicines</Link></li>
        <li><Link to=""></Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
