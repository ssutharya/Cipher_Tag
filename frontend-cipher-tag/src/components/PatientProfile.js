import React, { useState } from 'react';
import './PatientProfile.css';

const PatientProfile = () => {
  // Dummy patient data
  const [patient, setPatient] = useState({
    name: 'Cool Guy',
    age: 26,
    sex: 'Male',
    contact: '9876543210',
    case: 'Flu and Cold',
    note: 'Cool guy, literally; Hes feeling cold, has a flu.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Toggle between edit and view mode for notes and case
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  // Function to open the prescribe medicine pop-up
  const openPrescribeModal = () => {
    setShowModal(true);
  };

  const closePrescribeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="patient-profile">
      <aside className="sidebar">
        <h2>CipherTag™</h2>
        <nav>
          <a href="/Dashboard">Patients</a>
          <a href="/billing">Billing</a>
          <a href="/help">Help Center</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="patient-info">
          <h2>Patient Profile</h2>
          <img src="/patient-profile.jpg" alt="Patient" />
          <p>Name: {patient.name}</p>
          <p>Age: {patient.age}</p>
          <p>Sex: {patient.sex}</p>
          <p>Contact: {patient.contact}</p>

          <div className="editable-field">
            <p>Case: </p>
            {isEditing ? (
              <input
                type="text"
                value={patient.case}
                onChange={(e) => setPatient({ ...patient, case: e.target.value })}
              />
            ) : (
              <span>{patient.case}</span>
            )}
          </div>

          <div className="note-section">
            <h3>Notes</h3>
            {isEditing ? (
              <textarea
                value={patient.note}
                onChange={(e) => setPatient({ ...patient, note: e.target.value })}
              />
            ) : (
              <p>{patient.note}</p>
            )}
          </div>

          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>Save</button>
          ) : (
            <button className="save-btn" onClick={toggleEdit}>Edit</button>
          )}

          {/* Prescribe medicine button */}
          <button className="prescribe-button" onClick={openPrescribeModal}>
            Prescribe Medicine
          </button>

          {/* Prescribe Medicine Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Prescribe Medicine</h3>
                <input type="text" placeholder="Search medicines..." />
                <button className="inventory-btn" onClick={() => window.location.href = '/inventory'}>
                  Inventory
                </button>
                <button onClick={closePrescribeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
