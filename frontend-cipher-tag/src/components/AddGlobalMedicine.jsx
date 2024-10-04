import React, { useState } from 'react';
import axios from 'axios';
import './AddGlobalMedicine.css';  // Import CSS for styling

const AddGlobalMedicine = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [error, setError] = useState('');  // For error messages
  const [successMessage, setSuccessMessage] = useState('');  // For success messages
  const [isGenerated, setIsGenerated] = useState(false);  // Track if the code is generated

  // Generate unique code for the medicine
  const generateMedicineCode = async (e) => {
    e.preventDefault();
    setError('');  // Reset errors before starting
    setSuccessMessage('');  // Reset success message

    const data = {
      name,
      category,
      company,  // Assuming company is required for all
    };

    try {
      const response = await axios.post('http://localhost:8000/api/admin/generate-medicine-code/', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      // Set the unique code from the response and display in a separate box
      setUniqueCode(response.data.unique_code);
      setIsGenerated(true);  // Indicate code generation is done

      // Clear success message after generating the code
      setSuccessMessage(`Generated Code: ${response.data.unique_code}`);
    } catch (error) {
      console.error('Error generating code:', error);
      setError('Failed to generate unique code.');
    }
  };

  // Confirm and save the generated medicine
  const confirmMedicine = async () => {
    const data = {
      name,
      category,
      company,
      unique_code: uniqueCode,
    };

    try {
      await axios.post('http://localhost:8000/api/admin/confirm-medicine-code/', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      alert('Medicine successfully added!');
      resetForm();  // Reset form after successful addition
    } catch (error) {
      console.error('Error confirming medicine:', error);
      setError('Failed to save the medicine.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setCategory('');
    setCompany('');
    setUniqueCode('');
    setIsGenerated(false);  // Reset the generated state
  };

  return (
    <div className="medicine-form-container">
      <h2 className="form-title">Add Global Medicine</h2>
      
      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}

      {/* Display success message if any */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={generateMedicineCode} className="medicine-form">
        <label className="form-label">Medicine Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />

        <label className="form-label">Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="form-input"
        />

        <label className="form-label">Company:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="form-input"
        />

        <button type="submit" className="submit-button" disabled={isGenerated}>
          {isGenerated ? 'Code Generated' : 'Generate Code'}
        </button>
      </form>

      {/* Display generated code and provide option to save */}
      {uniqueCode && (
        <div className="generated-code-container">
          <h3 className="generated-code-title">
            Generated Code: <span className="code-highlight">{uniqueCode}</span>
          </h3>
          <button onClick={confirmMedicine} className="confirm-button">Save Medicine</button>
        </div>
      )}
    </div>
  );
};

export default AddGlobalMedicine;
