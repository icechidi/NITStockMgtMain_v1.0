import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

function Attributes() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  const fetchItem = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`);
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="item-detail">
      <h2>Item Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">{item.description}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Quantity: {item.quantity}</li>
            <li className="list-group-item">Unit Price: ${item.unit_price}</li>
          </ul>
          <div className="mt-3">
            <Link to={`/items/${id}/edit`} className="btn btn-warning me-2">Edit</Link>
            <Link to="/items" className="btn btn-secondary">Back to List</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attributes;
