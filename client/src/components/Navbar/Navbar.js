import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add a custom CSS file for styling
//import { FaUserCircle } from 'react-icons/fa'; // Example user login icon
import { FaUserAlt } from 'react-icons/fa'; // Import a better user icon

function Navbar() {
  return (
    <div className="navbar">
      
      
      <ul className="nav flex-column">
      {/* <div className="user-icon" style={{ textAlign: 'center', marginBottom: '10px' }}>
        <FaUserCircle size={40} />
        <p style={{ fontSize: '12px', marginTop: '5px' }}>Admin</p>
      </div> */}

      <div className="user-icon">
        <FaUserAlt size={30} color="#ffffff" /> {/* Better user icon */}
        <p className="user-name">User</p> {/* Optional user label */}
      </div>

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