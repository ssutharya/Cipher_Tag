import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';
import axios from 'axios';


const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchDoctorName();
    fetchAllAppointments();
  }, []);

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

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div className="dashboard container">
      <aside className="dashboard sidebar">
        <div className="dashboard logo">
          <h2>CipherTag™</h2>
        </div>
        <nav>
          <Link to="/dashboard" className="dashboard active">Patients</Link>
          <Link to="/billing">Billing</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/settings">Settings</Link>
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
                      <Link to={`/patient-profile/${appointment.id}`}>#{appointment.id}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="dashboard calendar-section">
            <Calendar />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
