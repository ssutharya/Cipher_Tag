// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './hospital_admin.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Hospital Admin Dashboard</h2>
      <ul>
        <li><Link to="/doctors">View and Manage Doctors</Link></li>
        <li><Link to="">Add Patients</Link></li>
        <li><Link to="/global-medicine">Manage Global Medicines</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
