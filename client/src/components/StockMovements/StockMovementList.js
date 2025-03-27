import React, { useState, useEffect } from 'react';
import './StockMovements.css'; // Add custom styles for the modal

function StockMovementList() {
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control Add New Movement modal visibility
  const [viewMovement, setViewMovement] = useState(null); // State for viewing a movement
  const [editMovement, setEditMovement] = useState(null); // State for editing a movement
  const [newMovement, setNewMovement] = useState({ item: '', type: '', quantity: '', date: '', notes: '' });
  const [editForm, setEditForm] = useState({ item: '', type: '', quantity: '', date: '', notes: '' });

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stock-movements');
      const data = await response.json();
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

  const handleAddMovement = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stock-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovement),
      });
      if (response.ok) {
        fetchMovements(); // Refresh the stock movements list
        setShowModal(false); // Close the modal
        setNewMovement({ item: '', type: '', quantity: '', date: '', notes: '' }); // Reset the form
      } else {
        console.error('Failed to add stock movement');
      }
    } catch (error) {
      console.error('Error adding stock movement:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stock-movements/${editMovement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        fetchMovements(); // Refresh the stock movements list
        setEditMovement(null); // Close the edit modal
      } else {
        console.error('Failed to update stock movement');
      }
    } catch (error) {
      console.error('Error updating stock movement:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="stock-movements">
      <h2>Stock Movements</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add New Movement
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Item</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(movements) &&
            movements.map((movement) => (
              <tr key={movement.id}>
                <td>{formatDateTime(movement.movement_date)}</td>
                <td>{movement.item_name}</td>
                <td>{movement.movement_type}</td>
                <td>{movement.quantity}</td>
                <td>{movement.notes}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => setViewMovement(movement)}>
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm mx-2"
                    onClick={() => {
                      setEditMovement(movement);
                      setEditForm(movement); // Populate the edit form with the movement's data
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal for Adding a New Movement */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Movement</h3>
            <form>
              <div className="form-group">
                <label>Item</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMovement.item}
                  onChange={(e) => setNewMovement({ ...newMovement, item: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMovement.type}
                  onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newMovement.quantity}
                  onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newMovement.date}
                  onChange={(e) => setNewMovement({ ...newMovement, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={newMovement.notes}
                  onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddMovement}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Viewing a Movement */}
      {viewMovement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Movement Details</h3>
            <p><strong>Item:</strong> {viewMovement.item_name}</p>
            <p><strong>Type:</strong> {viewMovement.movement_type}</p>
            <p><strong>Quantity:</strong> {viewMovement.quantity}</p>
            <p><strong>Date:</strong> {formatDateTime(viewMovement.movement_date)}</p>
            <p><strong>Notes:</strong> {viewMovement.notes}</p>
            <button className="btn btn-secondary" onClick={() => setViewMovement(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing a Movement */}
      {editMovement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Movement</h3>
            <form>
              <div className="form-group">
                <label>Item</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.item_name}
                  onChange={(e) => setEditForm({ ...editForm, item_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.movement_type}
                  onChange={(e) => setEditForm({ ...editForm, movement_type: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editForm.movement_date}
                  onChange={(e) => setEditForm({ ...editForm, movement_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleEditSubmit}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditMovement(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockMovementList;