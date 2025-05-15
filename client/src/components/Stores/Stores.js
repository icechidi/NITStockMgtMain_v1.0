import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stores.css'; // Add custom CSS for styling

function Stores() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStores();
    fetchProducts();
    fetchActivities();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/store-activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleAddStore = async () => {
    try {
      const response = await axios.post('/api/stores', newStore);
      setStores([...stores, response.data]);
      setShowAddStoreModal(false);
      setNewStore({ name: '', location: '', status: 'active' });
    } catch (error) {
      console.error('Error adding store:', error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await axios.delete(`/api/stores/${storeId}`);
      setStores(stores.filter(store => store.id !== storeId));
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleViewStore = async (storeId) => {
    try {
      const response = await axios.get(`/api/stores/${storeId}/stock`);
      // Handle viewing store details - you can add a modal or navigation here
      console.log('Store stock:', response.data);
    } catch (error) {
      console.error('Error viewing store:', error);
    }
  };

  const getTotalStores = () => stores.length;
  const getTotalProducts = () => products.length;
  const getActiveStores = () => stores.filter(store => store.status === 'active').length;
  const getInactiveStores = () => stores.filter(store => store.status === 'inactive').length;

  return (
    <div className="stores-dashboard">
      <header className="stores-header">
        <div className="header-actions">
          <h1>Stores Dashboard</h1>
          <button className="btn btn-primary" onClick={() => setShowAddStoreModal(true)}>
            Add New Store
          </button>
        </div>
        <p>Track and manage all stores and their products efficiently.</p>
      </header>

      {/* Overview Section */}
      <section className="stores-overview-section">
        <h2>Overview</h2>
        <div className="stores-overview-cards">
          <div className="stores-card-stores">
            <h3>Total Stores</h3>
            <p>{getTotalStores()}</p>
          </div>
          <div className="stores-card-products">
            <h3>Total Products</h3>
            <p>{getTotalProducts()}</p>
          </div>
          <div className="stores-card-active">
            <h3>Active Stores</h3>
            <p>{getActiveStores()}</p>
          </div>
          <div className="stores-card">
            <h3>Inactive Stores</h3>
            <p>{getInactiveStores()}</p>
          </div>
        </div>
      </section>

      {/* Stores List Section */}
      <section className="stores-list-section">
        <h2>Stores List</h2>
        <table className="stores-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.location}</td>
                <td>
                  <span className={`status-badge ${store.status}`}>
                    {store.status}
                  </span>
                </td>
                <td>{products.filter(p => p.storeId === store.id).length}</td>
                <td>
                  <button 
                    className="strs-btn strs-btn-primary"
                    onClick={() => handleViewStore(store.id)}
                  >
                    View
                  </button>
                  <button 
                    className="strs-btn strs-btn-danger"
                    onClick={() => handleDeleteStore(store.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Products Section */}
      <section className="stores-products-section">
        <h2>Products</h2>
        <div className="stores-products-grid">
          {products.slice(0, 6).map(product => (
            <div key={product.id} className="stores-product-card">
              <h3>{product.name}</h3>
              <p>Store: {stores.find(s => s.id === product.storeId)?.name}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="stores-recent-activity-section">
        <h2>Recent Activity</h2>
        <ul className="stores-activity-list">
          {activities.map(activity => (
            <li key={activity.id}>{activity.description}</li>
          ))}
        </ul>
      </section>

      {showAddStoreModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Store</h3>
            <form>
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStore.location}
                  onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={newStore.status}
                  onChange={(e) => setNewStore({ ...newStore, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddStore}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddStoreModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stores;