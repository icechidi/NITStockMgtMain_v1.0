import React from 'react';
import './Dashboard.css'; // Add custom styles for the dashboard
import { FaShoppingCart, FaChartBar, FaUsers, FaHome } from 'react-icons/fa'; // Import icons

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-boxes">
        {/* Total Items Box */}
        <div className="dashboard-box baby-blue">
          <FaShoppingCart className="dashboard-icon" />
          <h3>Total Items</h3>
          <p>100</p>
        </div>

        {/* Low Stock Items Box */}
        <div className="dashboard-box calm-green">
          <FaChartBar className="dashboard-icon" />
          <h3>Low Stock Items</h3>
          <p>10</p>
        </div>

        {/* Total Users Box */}
        <div className="dashboard-box calm-orange">
          <FaUsers className="dashboard-icon" />
          <h3>Total Users</h3>
          <p>50</p>
        </div>

        {/* Total Items for Repair Box */}
        <div className="dashboard-box calm-red">
          <FaHome className="dashboard-icon" />
          <h3>Total Items for Repair</h3>
          <p>5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;