import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Inventory.css';

const medicinesData = [
  { id: 1, name: 'Paracetamol', image: '/images/paracetamol.jpg' },
  { id: 2, name: 'Ibuprofen', image: '/images/ibuprofen.jpg' },
  { id: 3, name: 'Amoxicillin', image: '/images/amoxicillin.jpg' },
  { id: 4, name: 'Cetirizine', image: '/images/cetirizine.jpg' },
  // Add more medicines here...
];

const Inventory = () => {
  const [quantities, setQuantities] = useState({});
  const [showQRCode, setShowQRCode] = useState(false);

  const handleIncrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
    }));
  };

  const generateBill = () => {
    setShowQRCode(true);
  };

  const prescribedMedicines = medicinesData
    .filter((medicine) => quantities[medicine.id])
    .map((medicine) => `${medicine.name}: ${quantities[medicine.id]}`);

  return (
    <div className="inventory-container">
      <h1>Medicine Inventory</h1>
      <div className="inventory-grid">
        {medicinesData.map((medicine) => (
          <div key={medicine.id} className="medicine-card">
            <img src={medicine.image} alt={medicine.name} />
            <h3>{medicine.name}</h3>
            {quantities[medicine.id] ? (
              <div className="quantity-control">
                <button onClick={() => handleDecrement(medicine.id)}>-</button>
                <span>{quantities[medicine.id]}</span>
                <button onClick={() => handleIncrement(medicine.id)}>+</button>
              </div>
            ) : (
              <button className="add-button" onClick={() => handleIncrement(medicine.id)}>
                Add +
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="bill-button" onClick={generateBill}>
        Generate Bill
      </button>

      {showQRCode && (
      <div className="qr-code-container">
        <h2>QR Code for Prescribed Medicines:</h2>
        <QRCodeCanvas value={prescribedMedicines.join('\n')} />
      </div>
    )}

    </div>
  );
};

export default Inventory;
