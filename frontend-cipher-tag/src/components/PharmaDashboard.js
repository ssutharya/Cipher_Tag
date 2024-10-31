import React, { useState } from 'react';
import './PharmaDashboard.css';

const PharmaDashboard = () => {
  const [currentGraph, setCurrentGraph] = useState(0);
  const totalGraphs = 5;

  const handlePrevGraph = () => {
    setCurrentGraph((prev) => (prev > 0 ? prev - 1 : totalGraphs - 1));
  };

  const handleNextGraph = () => {
    setCurrentGraph((prev) => (prev < totalGraphs - 1 ? prev + 1 : 0));
  };

  return (
    <div className="pharma-dashboard">
      <div className="sidebar">
        <h2>Pharmaceutical Dashboard</h2>
        <ul>
          <li>Dashboard</li>
          <li>Products</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="statistics">
          <button onClick={handlePrevGraph} className="arrow left">←</button>
          <div className="graph-display">
            <h3>Graph {currentGraph + 1}</h3>
          </div>
          <button onClick={handleNextGraph} className="arrow right">→</button>
        </div>

        <div className="search-map">
          <input type="text" placeholder="Search medicine..." />
          <div className="map">
            <div className="central-point">Company</div>
            <div className="hospital-point">Hospital A</div>
            <div className="pharmacy-point">Pharmacy B</div>
          </div>
        </div>

        <div className="popular-pharmacy">
          <h3>Most Popular Pharmacy</h3>
          <p onClick={() => alert("Showing doctor who prescribes the most")}>
            Pharmacy Name
          </p>
        </div>

        <div className="heatmap">
          <h3>Medicine Usage Intensity</h3>
          <div className="heatmap-grid">
            {/* Heatmap cells would be placed here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaDashboard;
