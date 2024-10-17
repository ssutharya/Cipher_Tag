// src/components/AssignMedicineToDoctor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignMedicineToDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [globalMedicines, setGlobalMedicines] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get('http://localhost:8000/api/list-doctors/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setDoctors(response.data);
    };

    const fetchGlobalMedicines = async () => {
      const response = await axios.get('http://localhost:8000/api/list-global-medicines/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setGlobalMedicines(response.data);
    };

    fetchDoctors();
    fetchGlobalMedicines();
  }, []);

  const handleAssignMedicine = async () => {
    const data = {
      doctor_id: selectedDoctor,
      global_medicine_id: selectedMedicine
    };

    try {
      const response = await axios.post('http://localhost:8000/api/add-medicine-to-inventory/', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Medicine successfully assigned to doctor!');
    } catch (error) {
      console.error('Error assigning medicine:', error);
    }
  };

  return (
    <div className="assign-medicine-container">
      <h2>Assign Medicine to Doctor</h2>
      <div>
        <label>Select Doctor:</label>
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
          <option value="">Select</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Medicine:</label>
        <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)}>
          <option value="">Select</option>
          {globalMedicines.map((medicine) => (
            <option key={medicine.id} value={medicine.id}>{medicine.name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleAssignMedicine}>Assign Medicine</button>
    </div>
  );
};

export default AssignMedicineToDoctor;
