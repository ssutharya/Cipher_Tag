// src/components/DoctorList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get('http://localhost:8000/api/doctors/', config);
        setDoctors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctor-list-container">
      <h2>Doctors List</h2>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.id}>
            {doctor.name} ({doctor.specialization}) - {doctor.available ? 'Available' : 'Unavailable'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
