import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function StockMovementForm() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    item_id: '',
    movement_type: 'IN',
    quantity: 0,
    notes: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error loading items');
      setItems([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/stock-movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          item_id: Number(formData.item_id)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create stock movement');
      }

      navigate('/stock-movements');
    } catch (error) {
      console.error('Error creating stock movement:', error);
      setError('Error saving stock movement');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="stock-movement-form">
      <h2>Add Stock Movement</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Item</label>
          <select
            className="form-control"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            required
          >
            <option value="">Select an item</option>
            {Array.isArray(items) && items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Movement Type</label>
          <select
            className="form-control"
            name="movement_type"
            value={formData.movement_type}
            onChange={handleChange}
            required
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Save</button>
          <Link to="/stock-movements" className="btn btn-secondary ms-2">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default StockMovementForm; 