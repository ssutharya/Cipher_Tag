import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Redirect if token is invalid or expired

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // To redirect in case of errors

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('accessToken');

      // Check if token exists in localStorage
      if (!token) {
        setError('No access token found. Please log in.');
        navigate('/');  // Redirect to login page if no token is found
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:8000/api/doctors/', config);
        setDoctors(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('access_token');  // Clear the token
          navigate('/login');  // Redirect to login page
        } else {
          setError('Error fetching doctors.');
        }
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [navigate]);

  return (
    <div className="doctor-list-container">
      <h2>Doctors List</h2>
      {error ? <p className="error-message">{error}</p> : (
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.id}>
              {doctor.name} ({doctor.specialization}) - {doctor.available ? 'Available' : 'Unavailable'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorList;
