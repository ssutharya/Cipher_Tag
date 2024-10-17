import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
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
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (selectedFilter === 'available') {
      return doctor.available && doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedFilter === 'unavailable') {
      return !doctor.available && doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="doctor-list-container">
      <div className="specialization-container">
        {['GP', 'Cardiologist', 'Orthopedic', 'Oncologist', 'Dentist', 'Neurologist', 'Psychiatrist'].map(specialization => (
          <div className="specialization-tile" key={specialization}>
            <img src={`/images/${specialization.toLowerCase()}.jpeg`} alt={specialization} />
            <div className="specialization-name">{specialization}</div>
          </div>
        ))}
      </div>

      <div className="search-bar-container">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search doctors..." 
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="filter-icon" onClick={() => handleFilter('available')}>
          🔍
        </div>
        {/* Replace with a dropdown or modal for more options */}
      </div>

      <div className="doctor-grid">
        {filteredDoctors.map(doctor => (
          <div className="doctor-card" key={doctor.id}>
            <img
              src={doctor.image || '/doctor-profile.jpg'}
              alt={doctor.name}
              className="doctor-avatar"
            />
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
