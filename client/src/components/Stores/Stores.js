import React from 'react';
import './Stores.css'; // Add custom CSS for styling

function Stores() {
  return (
    <div className="stores-dashboard">
      <header className="stores-header">
        <h1>Stores Dashboard</h1>
        <p>Track and manage all stores and their products efficiently.</p>
      </header>

      {/* Overview Section */}
      <section className="stores-overview-section">
        <h2>Overview</h2>
        <div className="stores-overview-cards">
          <div className="stores-card">
            <h3>Total Stores</h3>
            <p>15</p>
          </div>
          <div className="stores-card">
            <h3>Total Products</h3>
            <p>120</p>
          </div>
          <div className="stores-card">
            <h3>Active Stores</h3>
            <p>12</p>
          </div>
          <div className="stores-card">
            <h3>Inactive Stores</h3>
            <p>3</p>
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
            <tr>
              <td>Store A</td>
              <td>New York</td>
              <td>Active</td>
              <td>50</td>
              <td>
                <button className="strs-btn strs-btn-primary">View</button>
                <button className="strs-btn strs-btn-danger">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Store B</td>
              <td>Los Angeles</td>
              <td>Inactive</td>
              <td>30</td>
              <td>
                <button className="strs-btn strs-btn-primary">View</button>
                <button className="strs-btn strs-btn-danger">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Store C</td>
              <td>Chicago</td>
              <td>Active</td>
              <td>40</td>
              <td>
                <button className="strs-btn strs-btn-primary">View</button>
                <button className="strs-btn strs-btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Products Section */}
      <section className="stores-products-section">
        <h2>Products</h2>
        <div className="stores-products-grid">
          <div className="stores-product-card">
            <h3>Product A</h3>
            <p>Store: Store A</p>
            <p>Quantity: 20</p>
          </div>
          <div className="stores-product-card">
            <h3>Product B</h3>
            <p>Store: Store B</p>
            <p>Quantity: 15</p>
          </div>
          <div className="stores-product-card">
            <h3>Product C</h3>
            <p>Store: Store C</p>
            <p>Quantity: 25</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="stores-recent-activity-section">
        <h2>Recent Activity</h2>
        <ul className="stores-activity-list">
          <li>Store A added 10 new products.</li>
          <li>Store B updated its status to inactive.</li>
          <li>Store C sold 5 products.</li>
        </ul>
      </section>
    </div>
  );
}

export default Stores;