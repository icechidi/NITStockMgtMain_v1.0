import React, { useState, useEffect } from 'react';
import './ItemList.css'; // Add custom styles for the modal

function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control Add New Item modal visibility
  const [viewItem, setViewItem] = useState(null); // State for viewing an item
  const [editItem, setEditItem] = useState(null); // State for editing an item
  const [newItem, setNewItem] = useState({ name: '', description: '', quantity: '', unit_price: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', quantity: '', unit_price: '' });

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

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will show both date and time in local format
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        fetchItems(); // Refresh the item list
        setShowModal(false); // Close the modal
        setNewItem({ name: '', description: '', quantity: '', unit_price: '' }); // Reset the form
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        fetchItems(); // Refresh the item list
        setEditItem(null); // Close the edit modal
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="items-list">
      <h2>Items</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add New Item
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Date/Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) &&
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.unit_price}</td>
                <td>{formatDateTime(item.stock_added_at)}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => setViewItem(item)}>
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm mx-2"
                    onClick={() => {
                      setEditItem(item);
                      setEditForm(item); // Populate the edit form with the item's data
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal for Adding a New Item */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Item</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                />
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddItem}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Viewing an Item */}
      {viewItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Item Details</h3>
            <p><strong>Name:</strong> {viewItem.name}</p>
            <p><strong>Description:</strong> {viewItem.description}</p>
            <p><strong>Quantity:</strong> {viewItem.quantity}</p>
            <p><strong>Unit Price:</strong> ${viewItem.unit_price}</p>
            <button className="btn btn-secondary" onClick={() => setViewItem(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing an Item */}
      {editItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Item</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
                <label>Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.unit_price}
                  onChange={(e) => setEditForm({ ...editForm, unit_price: e.target.value })}
                />
              </div>
              <button type="button" className="btn btn-success" onClick={handleEditSubmit}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditItem(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemList;