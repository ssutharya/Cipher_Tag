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
    <div className="pharma-dashboard container">
      <aside className="pharma-dashboard sidebar">
        <h2>Pharmaceutical Dashboard</h2>
        <ul>
          <li>Dashboard</li>
          <li>Products</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="pharma-dashboard main-content">
        <div className="pharma-dashboard statistics">
          <button onClick={handlePrevGraph} className="pharma-dashboard arrow left">←</button>
          <div className="pharma-dashboard graph-display">
            <h3>Graph {currentGraph + 1}</h3>
          </div>
          <button onClick={handleNextGraph} className="pharma-dashboard arrow right">→</button>
        </div>

        <div className="pharma-dashboard search-map">
          <input type="text" placeholder="Search medicine..." />
          <div className="pharma-dashboard map">
            <div className="pharma-dashboard central-point">Company</div>
            <div className="pharma-dashboard hospital-point">Hospital A</div>
            <div className="pharma-dashboard pharmacy-point">Pharmacy B</div>
          </div>
        </div>

        <div className="pharma-dashboard popular-pharmacy">
          <h3>Most Popular Pharmacy</h3>
          <p onClick={() => alert("Showing doctor who prescribes the most")}>
            Pharmacy Name
          </p>
        </div>

        <div className="pharma-dashboard heatmap">
          <h3>Medicine Usage Intensity</h3>
          <div className="pharma-dashboard heatmap-grid">
            {/* Heatmap cells would be placed here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmaDashboard;
