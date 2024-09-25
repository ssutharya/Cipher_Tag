import React, { useState } from 'react';
import Login from './components/Login';
import PatientList from './components/PatientList';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [doctorId, setDoctorId] = useState(null);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = (doctorId, username, password) => {
        setDoctorId(doctorId);
        setCredentials({ username, password });
        setIsLoggedIn(true);  // Login success
    };

    return (
        <div>
            {!isLoggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <PatientList doctorId={doctorId} username={credentials.username} password={credentials.password} />
            )}
        </div>
    );
};

export default App;
