import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [medName, setMedName] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medCompany, setMedCompany] = useState('');
  const [addMedMessage, setAddMedMessage] = useState('');
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchDoctorName();
    fetchAllAppointments();
    fetchInventory();
  }, []);

  const fetchDoctorName = async () => {
    try {
      const response = await axios.get('http://34.47.208.77/api/doctor/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctorName(response.data.name);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get('http://34.47.208.77/api/admin/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://34.47.208.77/api/api/global-medicines/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setAddMedMessage('');

    try {
      const response = await axios.post('http://34.47.208.77/api/api/global-medicines/add_to_inventory/', {
        doctor_id: 3, // Replace with actual doctor ID from your state or context
        name: medName,
        category: medCategory,
        company: medCompany,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setAddMedMessage('Medicine added successfully.');
        fetchInventory(); // Refresh inventory
      } else {
        setAddMedMessage('Failed to add medicine. Please try again.');
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      setAddMedMessage('Error adding medicine. Please check your input and try again.');
    }
  };

  const handlePrescribeClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleAddToPrescription = (medicine) => {
    const existingMedicine = selectedMedicines.find(med => med.id === medicine.id);
    if (existingMedicine) {
      // Update existing medicine
      setSelectedMedicines(selectedMedicines.map(med => 
        med.id === medicine.id ? { ...med, quantity, remarks } : med
      ));
    } else {
      // Add new medicine
      setSelectedMedicines([...selectedMedicines, { ...medicine, quantity, remarks }]);
    }
    // Reset form fields
    setQuantity(1);
    setRemarks('');
  };

  const handleRemoveMedicine = (medicineId) => {
    setSelectedMedicines(selectedMedicines.filter(med => med.id !== medicineId));
  };

  const handlePrescribe = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await axios.post('http://34.47.208.77/api/api/prescriptions/prescribe/', {
        doctor_id: 3, // Replace with actual doctor ID
        patient_id: selectedAppointment.patient.id,
        appointment_id: selectedAppointment.id,
        items: selectedMedicines.map(med => ({
          medicine_id: med.id,
          quantity: med.quantity,
          remarks: med.remarks,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        alert('Prescription created successfully.');
        setShowPrescriptionModal(false);
        setSelectedMedicines([]);
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Failed to create prescription.');
    }
  };

  return (
    <div className="dashboard container">
      <aside className="dashboard sidebar">
        <div className="dashboard logo">
          <h2>CipherTag™</h2>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" className="dashboard active">Patients</Link>
            </li>
            <li>
              <Link to="/billing">Billing</Link>
            </li>
            <li className="dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setShowAddMedicineForm(!showAddMedicineForm)}
              >
                Add Medicine
              </button>
              {showAddMedicineForm && (
                <div className="dropdown-content">
                  <form onSubmit={handleAddMedicine} className="add-medicine-form">
                    <div className="form-group">
                      <label htmlFor="medName">Medicine Name:</label>
                      <input
                        type="text"
                        id="medName"
                        value={medName}
                        onChange={(e) => setMedName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="medCategory">Category:</label>
                      <input
                        type="text"
                        id="medCategory"
                        value={medCategory}
                        onChange={(e) => setMedCategory(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="medCompany">Company:</label>
                      <input
                        type="text"
                        id="medCompany"
                        value={medCompany}
                        onChange={(e) => setMedCompany(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit">Add Medicine</button>
                  </form>
                  {addMedMessage && <p>{addMedMessage}</p>}
                </div>
              )}
            </li>
            <li>
              <Link to="/help">Help Center</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard main-content">
        <header className="dashboard dashboard-header">
          <div className="dashboard greeting">
            <h1>Good Morning, Dr. {doctorName}!</h1>
            <p>You have {appointments.length} scheduled appointments today.</p>
          </div>
          <div className="dashboard profile">
            <img src="/doctor-profile.jpg" alt="Doctor Profile" />
          </div>
        </header>

        <div className="dashboard content-wrapper">
          <section className="dashboard appointments-section">
            <div className="dashboard section-header">
              <h2>Appointments</h2>
            </div>
            <table className="dashboard table">
              <thead>
                <tr>
                  <th>Name (Date & Time)</th>
                  <th>Token No.</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>
                      {`${appointment.patient.name} on ${new Date(appointment.appointment_date).toLocaleString()}`}
                    </td>
                    <td>
                      <button onClick={() => handlePrescribeClick(appointment)}>
                        #{appointment.id}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {showPrescriptionModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Prescribe Medicines</h3>
                <div className="form-group">
                  <label htmlFor="searchMedicine">Search Medicine:</label>
                  <select onChange={(e) => {
                    const selectedMed = inventory.find(med => med.id === parseInt(e.target.value));
                    if (selectedMed) handleAddToPrescription(selectedMed);
                  }}>
                    <option value="">Select a Medicine</option>
                    {inventory.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMedicines.length > 0 && (
                  <div className="selected-medicines">
                    <h4>Selected Medicines</h4>
                    <ul>
                      {selectedMedicines.map(med => (
                        <li key={med.id}>
                          <span>{med.name} - Quantity: {med.quantity} - Remarks: {med.remarks}</span>
                          <button onClick={() => handleRemoveMedicine(med.id)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="remarks">Remarks:</label>
                  <input
                    type="text"
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
                <button onClick={handlePrescribe}>Prescribe</button>
                <button onClick={() => setShowPrescriptionModal(false)}>Close</button>
              </div>
            </div>
          )}

          <section className="dashboard calendar-section">
            <Calendar />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
