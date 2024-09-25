import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 

const PatientList = ({ doctorId }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            const username = 'doctor_username'; // Replace with actual doctor username
            const password = 'doctor_password'; // Replace with actual doctor password

            const token = btoa(`${username}:${password}`);

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/patients/', {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });
                setPatients(response.data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patients');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [doctorId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="patient-list-container">
            <h2>Patient List</h2>
            <ul>
                {patients.map((patient) => (
                    <li key={patient.id}>
                        <strong>Name:</strong> {patient.name} <br />
                        <strong>Age:</strong> {patient.age} <br />
                        <strong>Sex:</strong> {patient.sex} <br />
                        <strong>Height:</strong> {patient.height ? `${patient.height} cm` : 'N/A'} <br />
                        <strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : 'N/A'} <br />
                        <strong>Medical History:</strong> {patient.medical_history || 'None'} <br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientList;
