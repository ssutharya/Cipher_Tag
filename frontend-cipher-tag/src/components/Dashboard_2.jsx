// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/doctors">View Doctors</Link></li>
        <li><Link to="/add-global-medicine">Create Global Medicine</Link></li>
        <li><Link to="/assign-medicine">Assign Medicines to Doctors</Link></li>
        <li><Link to="/medicines">Manage Global Medicines</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
