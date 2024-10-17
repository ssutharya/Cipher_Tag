import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import Inventory from './components/Inventory';
import Dashboard_2 from './components/hospital_admin';
import DoctorList from './components/DoctorList';
import MedicineList from './components/MedicineList';
import AddGlobalMedicine from './components/AddGlobalMedicine';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hospital-admin" element={<Dashboard_2 />} />
        <Route path="/patient-profile/:token" element={<PatientProfile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/add-global-medicine" element={<AddGlobalMedicine />} />
      </Routes>
    </Router>
  );
}

export default App;
