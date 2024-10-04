import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import Login_2 from './components/Login_2';
import Dashboard_2 from './components/Dashboard_2';
import DoctorList from './components/DoctorList';
import MedicineList from './components/MedicineList';
import AddGlobalMedicine from './components/AddGlobalMedicine';
import AssignMedicineToDoctor from './components/AssignMedicineToDoctor';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient-profile/:id" element={<PatientProfile />} />
        <Route path="/loginpharma" element={<Login_2 />} />
        <Route path="/dashboard" element={<Dashboard_2 />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/add-global-medicine" element={<AddGlobalMedicine />} />
        <Route path="/assign-medicine" element={<AssignMedicineToDoctor />} />
      </Routes>
    </Router>
  );
};

export default App;
