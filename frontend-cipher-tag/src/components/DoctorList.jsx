import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorList.css'; // Import your CSS

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [specializations] = useState(['GP', 'Cardiologist', 'Orthopedic', 'Oncologist', 'Dentist', 'Neurologist', 'Psychiatrist']);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('accessToken');
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
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle filter selection
  const handleFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Filter doctors based on availability and search term
  const filteredDoctors = doctors.filter(doctor => {
    const isAvailable = selectedFilter === 'available' ? doctor.available : selectedFilter === 'unavailable' ? !doctor.available : true;
    return doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) && isAvailable;
  });

  return (
    <div className="doctor-list-container">
      <h2>Doctors List</h2>

      {/* Specialization Tiles */}
      <div className="specialization-container">
        {specializations.map(specialization => (
          <div className="specialization-tile" key={specialization}>
            <img src={`/images/${specialization.toLowerCase()}.jpeg`} alt={specialization} />
            <div className="specialization-name">{specialization}</div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="search-bar-container">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search doctors..." 
          value={searchTerm}
          onChange={handleSearch}
        />
        <select className="filter-dropdown" value={selectedFilter} onChange={handleFilter}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Doctors Grid */}
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
