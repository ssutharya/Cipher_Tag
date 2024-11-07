import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialization, setActiveSpecialization] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', image: null, available: true });
  const specializationRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const response = await axios.get('http://34.47.208.77/api/doctors/', config);
        setDoctors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecializationClick = (specialization) => {
    setActiveSpecialization((prev) => (prev === specialization ? null : specialization));
  };

  const handleAvailabilityFilterChange = (event) => {
    setAvailabilityFilter(event.target.value);
  };

  const handleToggleAvailability = (id) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === id ? { ...doctor, available: !doctor.available } : doctor
      )
    );
  };

  const handleAddDoctor = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const formData = new FormData();
    formData.append('name', newDoctor.name);
    formData.append('specialization', newDoctor.specialization);
    formData.append('available', newDoctor.available);
    if (newDoctor.image) {
      formData.append('image', newDoctor.image);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/doctors/', formData, config);
      setDoctors([...doctors, response.data]);
      setNewDoctor({ name: '', specialization: '', image: null, available: true });
      setShowAddDoctorForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearchTerm = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = !activeSpecialization || doctor.specialization === activeSpecialization;

    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && doctor.available) ||
      (availabilityFilter === 'unavailable' && !doctor.available);

    return matchesSearchTerm && matchesSpecialization && matchesAvailability;
  });

  return (
    <div className="doctor-list-container">
      <h2>Doctors List</h2>

      {/* Specialization Tiles */}
      <div className="specialization-container" ref={specializationRef}>
        {['GP', 'Cardiology', 'Orthopaedic', 'Oncology', 'Dentistry', 'Neurology', 'Psychiatry', 'Dermatology'].map(specialization => (
          <div
            className={`specialization-tile ${activeSpecialization === specialization ? 'active' : ''}`} 
            key={specialization}
            onClick={() => handleSpecializationClick(specialization)}
          >
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
        <select className="filter-dropdown" value={availabilityFilter} onChange={handleAvailabilityFilterChange}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Add Doctor Form Toggle */}
      <button 
        className="button add-doctor-button" 
        onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
      >
        {showAddDoctorForm ? 'Cancel' : 'Add Doctor'}
      </button>

      {/* Add Doctor Form */}
      {showAddDoctorForm && (
        <form onSubmit={handleAddDoctor} className="add-doctor-form">
          <input 
            type="text" 
            placeholder="Doctor's Name" 
            value={newDoctor.name} 
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} 
            required 
          />
          <select 
            value={newDoctor.specialization} 
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} 
            required
          >
            <option value="">Select Specialization</option>
            {['GP', 'Cardiology', 'Orthopaedic', 'Oncology', 'Dentistry', 'Neurology', 'Psychiatry', 'Dermatology'].map(specialization => (
              <option key={specialization} value={specialization}>{specialization}</option>
            ))}
          </select>
          <label className="custom-file-upload">
            <input 
              type="file" 
              onChange={(e) => setNewDoctor({ ...newDoctor, image: e.target.files[0] })} 
            />
            Choose File
          </label>
          <button type="submit" className="button add-doctor-button">Add Doctor</button>
        </form>
      )}

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
              <div 
                className={`availability-toggle ${doctor.available ? 'available' : 'unavailable'}`}
                onClick={() => handleToggleAvailability(doctor.id)}
              >
                {doctor.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
