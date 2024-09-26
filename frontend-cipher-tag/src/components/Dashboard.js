import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  const patients = [
    { name: 'Adam Messy', age: 26, sex: 'Male', visits: 5 },
    { name: 'Celine Aluista', age: 22, sex: 'Female', visits: 3 },
    { name: 'Cool Guy', age: 30, sex: 'Male', visits: 2 }, // Added dummy patient
  ];

  return (
    <div className="container">
      <aside className="sidebar">
        <h2>CipherTag™</h2>
        <nav>
          <ul>
            <a href="/" className="active">Patients</a>
            <a href="/billing">Billing</a>
            <a href="/help">Help Center</a>
            <a href="/settings">Settings</a>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="greeting">
            <h1>Good Morning, Dr. A!</h1>
            <p>I hope you're in a good mood because there are {patients.length} patients waiting for you.</p>
          </div>
          <div className="profile">
            <img src="/doctor-profile.jpg" alt="Doctor Profile" />
          </div>
        </header>

        <div className="content-wrapper">
          <section className="patients-section">
            <div className="patient-list-header">
              <h2>Patients</h2>
            </div>
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Name (Age, Gender)</th>
                  <th>Token No.</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index}>
                    <td>
                      <img 
                        src={`/public/${patient.name.toLowerCase().replace(' ', '')}.jpg`} 
                        alt={patient.name} 
                        onError={(e) => { e.target.src = '/patient-profile.jpg'; }}
                      />
                      {patient.name}<br />
                      {patient.sex}, {patient.age} Years
                    </td>
                    <td>
                      <Link to={`/patient-profile/${index}`}>#{index + 1}</Link> {/* Updated link path */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Calendar Section */}
          <section className="calendar-section">
            <Calendar 
              onChange={setDate} 
              value={date} 
              className="react-calendar" 
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
