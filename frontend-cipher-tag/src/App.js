import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import Inventory from './components/Inventory';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-profile/:token" element={<PatientProfile />} /> {/* Dynamic route for patient profile */}
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;
