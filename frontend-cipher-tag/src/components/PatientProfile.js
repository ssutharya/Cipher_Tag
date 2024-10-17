import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import './PatientProfile.css'; 

const PatientProfile = () => {
  const { token } = useParams();
  const navigate = useNavigate(); 
  const [patient, setPatient] = useState(null);
  const [editableCase, setEditableCase] = useState('');
  const [newNote, setNewNote] = useState('');
  const [history, setHistory] = useState([]);
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const patientData = {
    'A123': {
      name: 'Sad Guy',
      age: 26,
      sex: 'Male',
      contact: '7654398473',
      address: '123 Example Street',
      case: 'Sickness',
      occupation: 'Engineer',
      history: [
        { date: '2023-09-30', case: 'Check-up', status: 'Ongoing' }
      ],
      vitals: { height: '175 cm', weight: '70 kg', bp: '120/80', pulse: '72 bpm' },
      notes: []
    },
    'B456': {
      name: 'Troubled Lady',
      age: 32,
      sex: 'Female',
      contact: '0987654321',
      address: '456 Trouble Road',
      case: 'Cannot assault assaulters.',
      occupation: 'Designer',
      history: [
        { date: '2023-10-01', case: 'Consultation', status: 'Ongoing' }
      ],
      vitals: { height: '160 cm', weight: '60 kg', bp: '110/75', pulse: '70 bpm' },
      notes: []
    },
    'C789': {
      name: 'Cool Guy',
      age: 29,
      sex: 'Male',
      contact: '0987654321',
      address: '789 Sample Blvd',
      case: 'Coolness Overload',
      occupation: 'DJ',
      history: [
        { date: '2023-09-28', case: 'Lifestyle Consultation', status: 'Ongoing' }
      ],
      vitals: { height: '180 cm', weight: '75 kg', bp: '110/70', pulse: '65 bpm' },
      notes: []
    }
  };

  useEffect(() => {
    const loadedPatient = patientData[token];
    if (loadedPatient) {
      setPatient(loadedPatient);
      setEditableCase(loadedPatient.case);
      setHistory(loadedPatient.history);
    }
    setLoading(false);
  }, [token]); 

  if (loading) {
    return <h2>Loading patient information...</h2>;
  }

  if (!patient) {
    return <h2>Patient not found!</h2>;
  }

  const addVisitToHistory = () => {
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      case: editableCase,
      status: 'Ongoing'
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const handleSaveChanges = () => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      case: editableCase,
    }));
    addVisitToHistory();
    setIsEditingCase(false);
  };

  const handleAddNote = () => {
    const date = new Date().toISOString().split('T')[0];
    const updatedNotes = [...patient.notes, { date, note: newNote }];
    setPatient((prevPatient) => ({
      ...prevPatient,
      notes: updatedNotes,
    }));
    setNewNote(''); 
  };

  const handleStatusClick = (index) => {
    setActiveDropdownIndex(index === activeDropdownIndex ? null : index);
  };

  const handleSelectStatus = (index, newStatus) => {
    const updatedHistory = [...history];
    updatedHistory[index].status = newStatus;
    setHistory(updatedHistory);
    setActiveDropdownIndex(null); 
  };

  // Update the prescribe logic to navigate to the appropriate page
  const handlePrescribeClick = () => {
    // Add any logic needed before navigation if necessary
    navigate('/inventory'); 
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <h2>CipherTag™</h2>
        </div>
        <nav>
          <a href="/dashboard">Patients</a>
          <a href="/billing">Billing</a>
          <a href="/help">Help Center</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="patient-info-container">
          <div className="patient-info">
            <img src="/patient-profile.jpg" alt="Patient" className="patient-photo" />
            <div className="patient-details">
              <div className="patient-column">
                <h2>{patient.name}</h2>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
              </div>
              <div className="patient-column">
                <p><strong>Contact:</strong> {patient.contact}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>Occupation:</strong> {patient.occupation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="prescribe-container">
          <h3>Prescribe Medicine</h3>
          <div className="patient-editable">
            <div className="editable-field">
              <label htmlFor="case"><strong>Case</strong></label>
              {isEditingCase ? (
                <input
                  type="text"
                  id="case"
                  value={editableCase}
                  onChange={(e) => setEditableCase(e.target.value)}
                  className="editable-input"
                />
              ) : (
                <p>{editableCase} <span className="edit-icon" onClick={() => setIsEditingCase(true)}>✎</span></p>
              )}
            </div>

            {isEditingCase && <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>}

            <div className="editable-field">
              <label htmlFor="notes"><strong>Add Notes</strong></label>
              <input
                id="notes"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter new note"
                className="note-input"
              />
              <button onClick={handleAddNote} className="add-note-button save-button">Add Note</button>
            </div>
          </div>

          <button className="prescribe-button" onClick={handlePrescribeClick}>Prescribe</button>
        </div>

        <div className="patient-vitals">
          <h3>Patient Vitals</h3>
          <div className="vitals-box">
            <p><strong>Height:</strong> {patient.vitals.height}</p>
            <p><strong>Weight:</strong> {patient.vitals.weight}</p>
            <p><strong>Blood Pressure:</strong> {patient.vitals.bp}</p>
            <p><strong>Pulse:</strong> {patient.vitals.pulse}</p>
          </div>
        </div>

        <div className="patient-history">
          <h3>Patient History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Case</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.date}</td>
                  <td>{visit.case}</td>
                  <td>
                    <div className="status-dropdown-container">
                      <button
                        className={`status-button ${visit.status.toLowerCase()}`}
                        onClick={() => handleStatusClick(index)}
                      >
                        {visit.status}
                      </button>
                      {activeDropdownIndex === index && (
                        <div className="status-dropdown">
                          {['Cured', 'Ongoing', 'Discontinued'].map((status) => (
                            <div
                              key={status}
                              className="dropdown-option"
                              onClick={() => handleSelectStatus(index, status)}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="patient-notes">
          <h3>Notes Log</h3>
          <div className="notes-container">
            {patient.notes.length > 0 ? (
              patient.notes.map((note, index) => (
                <div key={index} className="note-item">
                  <p><strong>{note.date}:</strong> {note.note}</p>
                </div>
              ))
            ) : (
              <p>No notes available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
