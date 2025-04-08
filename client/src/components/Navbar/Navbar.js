import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add a custom CSS file for styling

function Navbar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">NITStockMgt</h2>
      <ul className="nav flex-column">
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Users</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/items">Items</Link></li>
        <li className="nav-item">
          <Link className="nav-link" to="/stock-movements">Stock Movements</Link></li>
          
        <li className="nav-item"><Link className="nav-link" to="/groups">Groups</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/brands">Brands</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/category">Category</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/stores">Stores</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/stocks">Stocks</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/attributes">Attributes</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/company">Company</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/settings">Settings</Link></li>
        <li className="nav-item"><Link className="nav-link text-danger" to="/logout">Logout</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;