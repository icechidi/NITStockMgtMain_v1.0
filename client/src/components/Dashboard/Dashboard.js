"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Dashboard.css"
import { Chart } from "react-google-charts"
import {
  FaBox,
  FaExclamationTriangle,
  FaUsers,
  FaTools,
  FaLaptop,
  FaFileContract,
  FaShoppingCart,
  FaTruck,
  FaPlusCircle,
  FaExchangeAlt,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa"

function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalUsers: 1,
    itemsForRepair: 0,
    newAssets: 5,
    newLicense: 12,
    pendingOrders: 7,
    pendingShipments: 4,
    recentMovements: [],
    trackStock: [],
  })
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("week")

  useEffect(() => {
    fetchStats()
  })

  const fetchStats = async () => {
    try {
      // Fetch items
      const itemsResponse = await fetch("http://localhost:5000/api/items")
      const items = await itemsResponse.json()

      // Fetch recent movements
      const movementsResponse = await fetch("http://localhost:5000/api/stock-movements")
      const movements = await movementsResponse.json()

      setStats({
        ...stats,
        totalItems: Array.isArray(items) ? items.length : 0,
        lowStockItems: Array.isArray(items) ? items.filter((item) => item.quantity < 10).length : 0,
        itemsForRepair: Array.isArray(items) ? items.filter((item) => item.needsRepair).length : 0,
        recentMovements: Array.isArray(movements) ? movements.slice(0, 5) : [],
        trackStock: Array.isArray(movements) ? movements.slice(0, 5) : [],
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Error loading dashboard data")
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  // Line chart data
  const stockTrendData = [
    ["Date", "Stock In", "Stock Out"],
    ["Mon", 45, 22],
    ["Tue", 38, 25],
    ["Wed", 55, 30],
    ["Thu", 41, 18],
    ["Fri", 60, 35],
    ["Sat", 25, 15],
    ["Sun", 10, 5],
  ]

  // Pie chart data
  const categoryDistributionData = [
    ["Category", "Items"],
    ["Electronics", 45],
    ["Furniture", 28],
    ["Office Supplies", 65],
    ["IT Equipment", 52],
    ["Tools", 18],
  ]

  return (
    <div className="dashboard">
      {/* Stats Cards - First Row */}
      <div className="stats-cards">
        <div className="stat-card blue-card">
          <div className="stat-card-icon">
            <FaBox />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Total Items</p>
            <h3 className="stat-card-value">{stats.totalItems}</h3>
          </div>
          <Link to="/items" className="stat-card-link">
            View All →
          </Link>
        </div>

        <div className="stat-card orange-card">
          <div className="stat-card-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Low Stock Items</p>
            <h3 className="stat-card-value">{stats.lowStockItems}</h3>
          </div>
          <Link to="/items" className="stat-card-link">
            Check Now →
          </Link>
        </div>

        <div className="stat-card green-card">
          <div className="stat-card-icon">
            <FaUsers />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Total Users</p>
            <h3 className="stat-card-value">{stats.totalUsers}</h3>
          </div>
          <Link to="/users" className="stat-card-link">
            Manage →
          </Link>
        </div>

        <div className="stat-card red-card">
          <div className="stat-card-icon">
            <FaTools />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Items for Repair</p>
            <h3 className="stat-card-value">{stats.itemsForRepair}</h3>
          </div>
          <Link to="/repairs" className="stat-card-link">
            View →
          </Link>
        </div>
      </div>

      {/* Stats Cards - Second Row */}
      <div className="stats-cards">
        <div className="stat-card purple-card">
          <div className="stat-card-icon">
            <FaLaptop />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">New Assets</p>
            <h3 className="stat-card-value">{stats.newAssets}</h3>
          </div>
          <Link to="/assets" className="stat-card-link">
            Details →
          </Link>
        </div>

        <div className="stat-card teal-card">
          <div className="stat-card-icon">
            <FaFileContract />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">New Licenses</p>
            <h3 className="stat-card-value">{stats.newLicense}</h3>
          </div>
          <Link to="/licenses" className="stat-card-link">
            View All →
          </Link>
        </div>

        <div className="stat-card indigo-card">
          <div className="stat-card-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Pending Orders</p>
            <h3 className="stat-card-value">{stats.pendingOrders}</h3>
          </div>
          <Link to="/orders" className="stat-card-link">
            Process →
          </Link>
        </div>

        <div className="stat-card pink-card">
          <div className="stat-card-icon">
            <FaTruck />
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Pending Shipments</p>
            <h3 className="stat-card-value">{stats.pendingShipments}</h3>
          </div>
          <Link to="/shipments" className="stat-card-link">
            Track →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/items/new" className="action-card">
          <div className="action-icon text-primary">
            <FaPlusCircle />
          </div>
          <p className="action-title">Add New Item</p>
        </Link>

        <Link to="/stock-movements/new" className="action-card">
          <div className="action-icon text-success">
            <FaExchangeAlt />
          </div>
          <p className="action-title">Record Movement</p>
        </Link>

        <Link to="/reports" className="action-card">
          <div className="action-icon text-warning">
            <FaFileAlt />
          </div>
          <p className="action-title">Generate Report</p>
        </Link>

        <Link to="/items" className="action-card">
          <div className="action-icon text-info">
            <FaSearch />
          </div>
          <p className="action-title">Search Inventory</p>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-md-8">
          <div className="chart-container">
            <div className="chart-header">
              <h5 className="chart-title">Stock Movement Trends</h5>
              <div className="chart-actions">
                <select
                  className="form-select form-select-sm"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
              </div>
            </div>
            <Chart
              chartType="LineChart"
              width="100%"
              height="300px"
              data={stockTrendData}
              options={{
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { textStyle: { color: "#6c757d" } },
                vAxis: { textStyle: { color: "#6c757d" } },
                colors: ["#0d6efd", "#dc3545"],
                chartArea: { width: "80%", height: "70%" },
                animation: {
                  startup: true,
                  duration: 1000,
                  easing: "out",
                },
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-container">
            <div className="chart-header">
              <h5 className="chart-title">Category Distribution</h5>
            </div>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={categoryDistributionData}
              options={{
                pieHole: 0.4,
                legend: { position: "bottom" },
                colors: ["#0d6efd", "#20c997", "#ffc107", "#6f42c1", "#dc3545"],
                chartArea: { width: "100%", height: "70%" },
                animation: {
                  startup: true,
                  duration: 1000,
                  easing: "out",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="chart-container">
        <div className="chart-header">
          <h5 className="chart-title">Recent Stock Movements</h5>
          <Link to="/stock-movements" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stats.recentMovements) &&
                stats.recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDateTime(movement.movement_date)}</td>
                    <td>{movement.item_name}</td>
                    <td>
                      <span className={`status-badge ${movement.movement_type === "IN" ? "status-in" : "status-out"}`}>
                        {movement.movement_type}
                      </span>
                    </td>
                    <td>{movement.quantity}</td>
                    <td>
                      <Link to={`/stock-movements/${movement.id}`} className="btn btn-sm btn-outline-secondary">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              {(!Array.isArray(stats.recentMovements) || stats.recentMovements.length === 0) && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No recent movements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="chart-container">
        <div className="chart-header">
          <h5 className="chart-title">Low Stock Alerts</h5>
          <Link to="/items" className="btn btn-sm btn-outline-danger">
            Manage Inventory
          </Link>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Minimum Required</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptop Dell XPS</td>
                <td>5</td>
                <td>10</td>
                <td>
                  <span className="status-badge status-out">Critical</span>
                </td>
                <td>
                  <Link to="/stock-movements/new" className="btn btn-sm btn-outline-primary">
                    Restock
                  </Link>
                </td>
              </tr>
              <tr>
                <td>HP Printer Ink</td>
                <td>8</td>
                <td>15</td>
                <td>
                  <span className="status-badge status-pending">Low</span>
                </td>
                <td>
                  <Link to="/stock-movements/new" className="btn btn-sm btn-outline-primary">
                    Restock
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Wireless Mouse</td>
                <td>12</td>
                <td>20</td>
                <td>
                  <span className="status-badge status-pending">Low</span>
                </td>
                <td>
                  <Link to="/stock-movements/new" className="btn btn-sm btn-outline-primary">
                    Restock
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
