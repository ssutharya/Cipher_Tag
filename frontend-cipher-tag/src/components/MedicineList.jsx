// src/components/MedicineList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get('http://localhost:8000/api/admin/global-medicines/', config);
        setMedicines(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div className="medicine-list-container">
      <h2>Global Medicines</h2>
      <ul>
        {medicines.map(medicine => (
          <li key={medicine.id}>
            {medicine.name} - {medicine.company} ({medicine.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineList;
