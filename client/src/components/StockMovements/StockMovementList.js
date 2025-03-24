import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StockMovementList() {
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stock-movements');
      const data = await response.json();
      // Ensure data is an array before setting it
      setMovements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      setError('Error loading stock movements');
      setMovements([]);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will show both date and time in local format
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="stock-movements-list">
      <h2>Stock Movements</h2>
      <Link to="/stock-movements/new" className="btn btn-primary mb-3">Add New Movement</Link>
      <table className="table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Item</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(movements) && movements.map(movement => (
            <tr key={movement.id}>
              <td>{formatDateTime(movement.movement_date)}</td>
              <td>{movement.item_name}</td>
              <td>{movement.movement_type}</td>
              <td>{movement.quantity}</td>
              <td>{movement.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockMovementList; 