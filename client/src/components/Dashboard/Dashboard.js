import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file

import { Chart } from 'react-google-charts'; // Import Google Charts

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalUsers: 1, // Example static value for Total Users
    itemsForRepair: 0, // Example static value for Items for Repair
    newAssets: 0,
    newLicense: 0,
    newAccessories: 0,
    newConsumables: 0,
    newTools: 0,
    recentMovements: [],
    trackStock: [] // New state for Track Stock data
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
        totalUsers: 1, // Example static value
        itemsForRepair: Array.isArray(items) ? items.filter(item => item.needsRepair).length : 0,
        recentMovements: Array.isArray(movements) ? movements.slice(0, 5) : [],
        trackStock: Array.isArray(movements) ? movements.slice(0, 5) : [] // Fetch data for Track Stock
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


 // Sankey chart data
  const sankeyData = [
    ['From', 'To', 'Quantity'], // Header row
    ['Warehouse', 'Store A', 50],
    ['Warehouse', 'Store B', 30],
    ['Store A', 'Customer 1', 20],
    ['Store A', 'Customer 2', 30],
    ['Store B', 'Customer 3', 30],
  ];

  const sankeyOptions = {
    width: '100%',
    height: 400,
    sankey: {
      node: {
        label: { fontSize: 14 },
      },
      link: {
        colorMode: 'gradient',
      },
    },
  };


  // Line chart data
  const lineChartData = [
    ['Date', 'Stock In', 'Stock Out'], // Header row
    ['2025-04-01', 100, 50],
    ['2025-04-02', 120, 60],
    ['2025-04-03', 150, 80],
    ['2025-04-04', 170, 90],
    ['2025-04-05', 200, 100],
  ];

  const lineChartOptions = {
    title: 'Stock In vs Stock Out Over Time',
    curveType: 'function',
    legend: { position: 'bottom' },
    width: '100%',
    height: 400,
  };
  //end of both charts



  return (
    <div className="dashboard">
      {/* Dashboard content */}
      <div className="row">
        {/* Total Items Box */}
        <div className="col-md-3">
          <div className="card mb-4 total-items-box">
            <div className="card-body">
              <h5 className="card-title"><i className="fas fa-shopping-cart"></i> Total Items</h5>
              <p className="card-text display-4">{stats.totalItems}</p>
              <Link to="/items" className="btn btn-primary">View Items</Link>
            </div>
          </div>
        </div>

        {/* Low Stock Items Box */}
        <div className="col-md-3">
          <div className="card mb-4 low-stock-box">
            <div className="card-body">
              <h5 className="card-title"><i className="fas fa-chart-line"></i> Low Stock Items</h5>
              <p className="card-text display-4">{stats.lowStockItems}</p>
              <Link to="/items" className="btn btn-warning">Check Inventory</Link>
            </div>
          </div>
        </div>

        {/* Total Users Box */}
        <div className="col-md-3">
          <div className="card mb-4 total-users-box">
            <div className="card-body">
              <h5 className="card-title"><i className="fas fa-users"></i> Total Users</h5>
              <p className="card-text display-4">{stats.totalUsers}</p>
              <Link to="/users" className="btn btn-orange">View Users</Link>
            </div>
          </div>
        </div>

        {/* Items for Repair Box */}
        <div className="col-md-3">
          <div className="card mb-4 items-repair-box">
            <div className="card-body">
              <h5 className="card-title"><i className="fas fa-home"></i> Items for Repair</h5>
              <p className="card-text display-4">{stats.itemsForRepair}</p>
              <Link to="/repairs" className="btn btn-danger">View Repairs</Link>
            </div>
          </div>
        </div>
      </div>

      
      {/* Recent Stock Movements */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'black' }}>Recent Stock Movements</h5>
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


      {/* Mini Boxes containing New Assets and New Accessories */}
      {/* New Assets */}
      <div className="row">
      <div className="col-md-3">
          <div className="card mb-4 total-items-box">
            <div className="mini-box-content">
              <h5 className="card-title"><i className=""></i> New Assets</h5>
              <p className="card-text display-4">{stats.newAssets}</p>
            </div>
          </div>
        </div>

            {/* New Accessories */}
            <div className="col-md-3">
          <div className="card mb-4 low-stock-box">
            <div className="mini-box-content">
              <h5 className="card-title"><i className=""></i> New Accessories</h5>
              <p className="card-text display-4">{stats.newAccessories}</p>
            </div>
          </div>
        </div>


        <div className="col-md-3">
          <div className="card mb-4 total-items-box">
            <div className="mini-box-content">
              <h5 className="card-title"><i className=""></i> New Assets</h5>
              <p className="card-text display-4">{stats.newAssets}</p>
            </div>
          </div>
        </div>

            {/* New Accessories */}
            <div className="col-md-3">
          <div className="card mb-4 low-stock-box">
            <div className="mini-box-content">
              <h5 className="card-title"><i className=""></i> New Accessories</h5>
              <p className="card-text display-4">{stats.newAccessories}</p>
            </div>
          </div>
        </div>

        {/* end of rows */}
        </div>



      {/* Track Stock Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'black' }}>Track Stock</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Note to be Edited</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(stats.trackStock) && stats.trackStock.map(movement => (
                    <tr key={movement.id}>
                      <td>{formatDateTime(movement.movement_date)}</td>
                      <td>{movement.item_name}</td>
                      <td>{movement.movement_type}</td>
                      <td>{movement.quantity}</td>
                      <td>
                        <Link to={`/stock-movements/${movement.id}/edit`} className="btn btn-warning btn-sm">
                          Edit Note
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/stock-movements" className="btn btn-primary">View All Movements</Link>
            </div>
          </div>
        </div>
      </div>


    {/* Sankey and Line Chart Section */}
    <div className="row" style={{ marginTop: '20px' }}>
        <div className="col-md-6">
          <div className="stock-chart">
            <h2>Stock Flow Overview</h2>
            <Chart
              chartType="Sankey"
              width="100%"
              height="400px"
              data={sankeyData}
              options={sankeyOptions}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="stock-chart">
            <h2>Stock Trends</h2>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>
        </div>
      </div>
    </div>

    
    



  );
}

export default Dashboard;