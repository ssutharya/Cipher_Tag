import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient-profile/:id" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
