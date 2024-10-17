import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [view, setView] = useState('patients'); // Current view: patients or appointments
  const [patients, setPatients] = useState([]); // Patients list
  const [appointments, setAppointments] = useState([]); // Appointments list
  const [doctorName, setDoctorName] = useState(''); // State to hold the doctor's name
  const token = localStorage.getItem('accessToken'); // Authentication token

  useEffect(() => {
    fetchDoctorName(); // Fetch the doctor's name on component mount

    // Fetch data based on the current view
    if (view === 'appointments') {
      fetchAllAppointments(); // Fetch all appointments when the appointments view is selected
    } else {
      fetchPatients(); // Fetch patients when in patient view
    }
  }, [view]); // Re-fetch only when the view changes

  // Fetch the doctor's name
  const fetchDoctorName = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/doctor/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctorName(response.data.name);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  // Fetch all patients for the doctor, including their appointment status
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/doctor/patients/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(response.data); // Set sorted patients directly from the API
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fetch all appointments (ignore selected date)
  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data); // Set sorted appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className='logo'>
          <h2>CipherTag™</h2>
        </div>
        <nav>
          <a href="/dashboard" className={view === 'patients' ? 'active' : ''}>Patients</a>
          <a href="/billing">Billing</a>
          <a href="/help">Help Center</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="greeting">
            <h1>Good Morning, Dr. {doctorName}!</h1>
            <p>{view === 'patients' 
              ? `I hope you're in a good mood because there are ${patients.length} patients waiting for you.` 
              : `You have ${appointments.length} appointments scheduled.`}</p>
          </div>
          <div className="profile">
            <img src="/doctor-profile.jpg" alt="Doctor Profile" />
          </div>
        </header>

        <div className="content-wrapper">
          <section className={`section ${view === 'patients' ? 'patients-section' : 'appointments-section'}`}>
            <div className="section-header">
              {view === 'patients' ? (
                <>
                  <h2 className="patients-title">Patients</h2>
                  <span 
                    className="toggle-symbol"
                    onClick={() => setView('appointments')}
                    style={{ cursor: 'pointer' }}
                  >
                    &gt;&gt;
                  </span>
                </>
              ) : (
                <>
                  <span 
                    className="toggle-symbol"
                    onClick={() => setView('patients')}
                    style={{ cursor: 'pointer' }}
                  >
                    &lt;&lt;
                  </span>
                  <h2 className="appointments-title">Appointments</h2>
                </>
              )}
            </div>
            <table className={`table ${view === 'patients' ? 'patients-table' : 'appointments-table'}`}>
              <thead>
                <tr>
                  <th>{view === 'patients' ? 'Name (Age, Gender)' : 'Name (Date & Time)'}</th>
                  <th>Token No.</th>
                  {view === 'patients' && <th>Appointment Status</th>}
                </tr>
              </thead>
              <tbody>
                {(view === 'patients' ? patients : appointments).map((item, index) => (
                  <tr key={index}>
                    <td>
                      {view === 'patients' ? (
                        <>
                          {item.name}<br />
                          {item.sex}, {item.age} Years
                        </>
                      ) : (
                        <>
                          {item.patient.name}<br />
                          Appointment on: {new Date(item.appointment_date).toLocaleString()}
                        </>
                      )}
                    </td>
                    <td>
                      <Link to={`/patient-profile/${item.token}`}>#{item.token}</Link>
                    </td>
                    {view === 'patients' && (
                      <td>{item.hasAppointment ? 'Booked' : 'Not Booked'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="calendar-section">
            <Calendar 
              className="react-calendar" 
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
