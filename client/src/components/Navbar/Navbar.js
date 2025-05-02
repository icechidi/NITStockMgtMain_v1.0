import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add a custom CSS file for styling
import { FaHome, FaBox, FaExchangeAlt, FaClipboard, FaUsers, FaTags, FaThList, FaStore, FaWarehouse, FaCogs, FaClipboardList, FaChartBar, FaBuilding, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Import icons

function Navbar() {
  return (
    <div className="navbar">
      <ul className="nav flex-column">
      <div className="user-icon-admin">
        <FaUserCircle size={40} color="#ffffff" /> {/* User icon */}
        <p className="user-name">Admin</p> {/* Optional user label */}
      </div>

        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            <FaHome className="nav-icon" /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/items">
            <FaBox className="nav-icon" /> Items
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/stock-movements">
            <FaExchangeAlt className="nav-icon" /> Stock Movements
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/groups">
            <FaUsers className="nav-icon" /> Groups
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/brands">
            <FaTags className="nav-icon" /> Brands
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/category">
            <FaThList className="nav-icon" /> Category
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/stores">
            <FaStore className="nav-icon" /> Stores
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/stocks">
            <FaWarehouse className="nav-icon" /> Stocks
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/attributes">
            <FaCogs className="nav-icon" /> Attributes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/products">
            <FaClipboardList className="nav-icon" /> Products
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/orders">
            <FaChartBar className="nav-icon" /> Orders
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/requests">
            <FaClipboard className="nav-icon" /> Requests
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reports">
            <FaChartBar className="nav-icon" /> Reports
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/company">
            <FaBuilding className="nav-icon" /> Company
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            <FaUserCircle className="nav-icon" /> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-danger" to="/logout">
            <FaSignOutAlt className="nav-icon" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;