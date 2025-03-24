import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    recentMovements: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch items
      const itemsResponse = await fetch('http://localhost:5000/api/items');
      const items = await itemsResponse.json();
      
      // Fetch recent movements
      const movementsResponse = await fetch('http://localhost:5000/api/stock-movements');
      const movements = await movementsResponse.json();

      setStats({
        totalItems: Array.isArray(items) ? items.length : 0,
        lowStockItems: Array.isArray(items) ? items.filter(item => item.quantity < 10).length : 0,
        recentMovements: Array.isArray(movements) ? movements.slice(0, 5) : []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Error loading dashboard data');
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will show both date and time in local format
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Items</h5>
              <p className="card-text display-4">{stats.totalItems}</p>
              <Link to="/items" className="btn btn-primary">View Items</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Low Stock Items</h5>
              <p className="card-text display-4">{stats.lowStockItems}</p>
              <Link to="/items" className="btn btn-warning">Check Inventory</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Stock Movements</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(stats.recentMovements) && stats.recentMovements.map(movement => (
                    <tr key={movement.id}>
                      <td>{formatDateTime(movement.movement_date)}</td>
                      <td>{movement.item_name}</td>
                      <td>{movement.movement_type}</td>
                      <td>{movement.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/stock-movements" className="btn btn-primary">View All Movements</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 