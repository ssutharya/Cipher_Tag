import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('patients'); // State to toggle between patients and appointments

  const patients = [
    { name: 'Sad Guy', age: 26, sex: 'Male', token: 'A123' },
    { name: 'Troubled Lady', age: 22, sex: 'Female', token: 'B456' },
    { name: 'Cool Guy', age: 30, sex: 'Male', token: 'C789' },
  ];

  const appointments = [
    { name: 'Sad Guy', date: '2024-09-30 10:00 AM', token: 'A123' },
    { name: 'Troubled Lady', date: '2024-09-30 11:00 AM', token: 'B456' },
    { name: 'Cool Guy', date: '2024-09-30 12:00 PM', token: 'C789' },
  ];

  return (
    <div className="container">
      <aside className="sidebar">
        <div className='logo'>
          <h2>CipherTag™</h2>
        </div>
        <nav>
          <a href="/dashboard" className="active">Patients</a>
          <a href="/billing">Billing</a>
          <a href="/help">Help Center</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="greeting">
            <h1>Good Morning, Dr. A!</h1>
            <p>{view === 'patients' ? `I hope you're in a good mood because there are ${patients.length} patients waiting for you.` : `You have ${appointments.length} appointments today.`}</p>
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
                          {item.name}<br />
                          Appointment on: {item.date}
                        </>
                      )}
                    </td>
                    <td>
                      <Link to={`/patient-profile/${item.token}`}>#{item.token}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

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
