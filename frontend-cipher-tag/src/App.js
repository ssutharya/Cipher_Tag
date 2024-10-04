import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import Inventory from './components/Inventory';
import Login_2 from './components/Login_2';
import Dashboard_2 from './components/Dashboard_2';
import DoctorList from './components/DoctorList';
import MedicineList from './components/MedicineList';
import AddGlobalMedicine from './components/AddGlobalMedicine';
import AssignMedicineToDoctor from './components/AssignMedicineToDoctor';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes from HEAD */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-profile/:token" element={<PatientProfile />} /> {/* Dynamic route for patient profile */}
        <Route path="/inventory" element={<Inventory />} />
        
        {/* Routes from pharma-frontend */}
        <Route path="/loginpharma" element={<Login_2 />} />
        <Route path="/dashboard-pharma" element={<Dashboard_2 />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/add-global-medicine" element={<AddGlobalMedicine />} />
        <Route path="/assign-medicine" element={<AssignMedicineToDoctor />} />
      </Routes>
    </Router>
  );
}

export default App;
