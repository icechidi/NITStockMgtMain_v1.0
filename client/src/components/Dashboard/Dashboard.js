"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [items, setItems] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0, // This is the only instance of lowStockItems now
    totalUsers: 1,
    itemsForRepair: 0,
    newAssets: 5,
    newLicense: 12,
    pendingOrders: 7,
    pendingShipments: 4,
    recentMovements: [],
    stockTrendData: [],
    lowStockItemsList: [], // Changed from lowStockItems to lowStockItemsList
  })
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("week")
  const [isChartLoading, setIsChartLoading] = useState(true)

//update here
  // Process stock movement data into trend data for the chart
  const processStockTrendData = useCallback((movements, timeframe) => {
    if (!Array.isArray(movements) || movements.length === 0) {
      setStats((prevStats) => ({ ...prevStats, stockTrendData: getDefaultStockTrendData() }))
      return
    }

    // Sort movements by date
    const sortedMovements = [...movements].sort((a, b) => new Date(a.movement_date) - new Date(b.movement_date))

    // Filter movements based on timeframe
    const filteredMovements = filterMovementsByTimeframe(sortedMovements, timeframe)

    // Group movements by date and type
    const groupedData = groupMovementsByDateAndType(filteredMovements)

    // Format data for Google Charts
    const chartData = formatDataForChart(groupedData)
    setStats((prevStats) => ({ ...prevStats, stockTrendData: chartData }))
  }) // Empty dependency array since this doesn't depend on any external variables

  // Use useCallback to memoize the fetch functions
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
      return data
    } catch (err) {
      console.error("Error fetching items:", err)
      setError("Failed to load items data. Please try again later.")
      return []
    }
  }, [])

  const fetchMovements = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stock-movements")
      const data = await response.json()
      setMovements(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching movements:", err)
      setError("Failed to load movement data")
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchItems(), fetchMovements()])
      .then(() => {
        // Process data after fetching
        processFetchedData()
      })
      .finally(() => setLoading(false))

    // No dependencies here - we only want to fetch once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    processStockTrendData(movements, timeframe)
  }, [movements, timeframe, processStockTrendData]) // Added processStockTrendData to dependency array

  const processFetchedData = () => {
    // Get low stock items
    const lowStockItems = Array.isArray(items) ? items.filter((item) => item.quantity < 10) : []

    setStats((prevStats) => ({
      ...prevStats,
      totalItems: Array.isArray(items) ? items.length : 0,
      lowStockItems: lowStockItems.length,
      itemsForRepair: Array.isArray(items) ? items.filter((item) => item.needsRepair).length : 0,
      recentMovements: Array.isArray(movements) ? movements.slice(0, 5) : [],
      lowStockItemsList: lowStockItems.slice(0, 3), // Get top 3 low stock items
    }))
  }

  // Filter movements based on selected timeframe
  const filterMovementsByTimeframe = (movements, timeframe) => {
    const now = new Date()
    const cutoffDate = new Date()

    switch (timeframe) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      default:
        cutoffDate.setDate(now.getDate() - 7)
    }

    return movements.filter((movement) => new Date(movement.movement_date) >= cutoffDate)
  }

  // Group movements by date and movement type
  const groupMovementsByDateAndType = (movements) => {
    const groupedData = {}

    movements.forEach((movement) => {
      const date = new Date(movement.movement_date)
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })

      if (!groupedData[dateStr]) {
        groupedData[dateStr] = { IN: 0, OUT: 0 }
      }

      const type = movement.movement_type
      const quantity = Number(movement.quantity) || 0

      groupedData[dateStr][type] += quantity
    })

    return groupedData
  }

  // Format grouped data for Google Charts
  const formatDataForChart = (groupedData) => {
    const chartData = [["Day", "Stock In", "Stock Out"]]

    // If we have real data, use it
    if (Object.keys(groupedData).length > 0) {
      Object.entries(groupedData).forEach(([date, data]) => {
        chartData.push([date, data.IN || 0, data.OUT || 0])
      })
    } else {
      // If no data, return default data
      return getDefaultStockTrendData()
    }

    return chartData
  }

  // Default stock trend data when no real data is available
  const getDefaultStockTrendData = () => {
    return [
      ["Day", "Stock In", "Stock Out"],
      ["Mon", 45, 22],
      ["Tue", 38, 25],
      ["Wed", 55, 30],
      ["Thu", 41, 18],
      ["Fri", 60, 35],
      ["Sat", 25, 15],
      ["Sun", 10, 5],
    ]
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (loading) return <div className="dashboard-error-alert">Loading dashboard data...</div>
  if (error) {
    return <div className="dashboard-error-alert">{error}</div>
  }

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
    <div className="dashboard-container">
      {/* Stats Cards - First Row */}
      <div className="dashboard-stats-cards">
        <div className="dashboard-stat-card dashboard-blue-card">
          <div className="dashboard-stat-card-icon">
            <FaBox />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Total Items</p>
            <h3 className="dashboard-stat-card-value">{stats.totalItems}</h3>
          </div>
          <Link to="/items" className="dashboard-stat-card-link">
            View All →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-orange-card">
          <div className="dashboard-stat-card-icon">
            <FaExclamationTriangle />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Low Stock Items</p>
            <h3 className="dashboard-stat-card-value">{stats.lowStockItems}</h3>
          </div>
          <Link to="/items" className="dashboard-stat-card-link">
            Check Now →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-green-card">
          <div className="dashboard-stat-card-icon">
            <FaUsers />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Total Users</p>
            <h3 className="dashboard-stat-card-value">{stats.totalUsers}</h3>
          </div>
          <Link to="/users" className="dashboard-stat-card-link">
            Manage →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-red-card">
          <div className="dashboard-stat-card-icon">
            <FaTools />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Items for Repair</p>
            <h3 className="dashboard-stat-card-value">{stats.itemsForRepair}</h3>
          </div>
          <Link to="/repairs" className="dashboard-stat-card-link">
            View →
          </Link>
        </div>
      </div>

      {/* Stats Cards - Second Row */}
      <div className="dashboard-stats-cards">
        <div className="dashboard-stat-card dashboard-purple-card">
          <div className="dashboard-stat-card-icon">
            <FaLaptop />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">New Assets</p>
            <h3 className="dashboard-stat-card-value">{stats.newAssets}</h3>
          </div>
          <Link to="/assets" className="dashboard-stat-card-link">
            Details →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-teal-card">
          <div className="dashboard-stat-card-icon">
            <FaFileContract />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">New Licenses</p>
            <h3 className="dashboard-stat-card-value">{stats.newLicense}</h3>
          </div>
          <Link to="/licenses" className="dashboard-stat-card-link">
            View All →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-indigo-card">
          <div className="dashboard-stat-card-icon">
            <FaShoppingCart />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Pending Orders</p>
            <h3 className="dashboard-stat-card-value">{stats.pendingOrders}</h3>
          </div>
          <Link to="/orders" className="dashboard-stat-card-link">
            Process →
          </Link>
        </div>

        <div className="dashboard-stat-card dashboard-pink-card">
          <div className="dashboard-stat-card-icon">
            <FaTruck />
          </div>
          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">Pending Shipments</p>
            <h3 className="dashboard-stat-card-value">{stats.pendingShipments}</h3>
          </div>
          <Link to="/shipments" className="dashboard-stat-card-link">
            Track →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <Link to="/items/new" className="dashboard-action-card">
          <div className="dashboard-action-icon text-primary">
            <FaPlusCircle />
          </div>
          <p className="dashboard-action-title">Add New Item</p>
        </Link>

        <Link to="/stock-movements/new" className="dashboard-action-card">
          <div className="dashboard-action-icon text-success">
            <FaExchangeAlt />
          </div>
          <p className="dashboard-action-title">Record Movement</p>
        </Link>

        <Link to="/reports" className="dashboard-action-card">
          <div className="dashboard-action-icon text-warning">
            <FaFileAlt />
          </div>
          <p className="dashboard-action-title">Generate Report</p>
        </Link>

        <Link to="/items" className="dashboard-action-card">
          <div className="dashboard-action-icon text-info">
            <FaSearch />
          </div>
          <p className="dashboard-action-title">Search Inventory</p>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="dashboard-row">
        <div className="dashboard-col-md-8">
          <div className="dashboard-chart-container">
            <div className="dashboard-chart-header">
              <h5 className="dashboard-chart-title">Stock Movement Trends</h5>
              <div className="dashboard-chart-actions">
                <select
                  className="dashboard-form-select"
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
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={stats.stockTrendData}
              options={{
                title: "",
                legend: { position: "bottom" },
                hAxis: {
                  title: "Day",
                  textStyle: { color: "#6c757d" },
                },
                vAxis: {
                  title: "Quantity",
                  textStyle: { color: "#6c757d" },
                },
                colors: ["#0d6efd", "#dc3545"],
                chartArea: { width: "80%", height: "70%" },
                animation: {
                  startup: true,
                  duration: 1000,
                  easing: "out",
                },
                isStacked: false,
                bar: { groupWidth: "70%" },
              }}
            />
          </div>
        </div>
        <div className="dashboard-col-md-4">
          <div className="dashboard-chart-container">
            <div className="dashboard-chart-header">
              <h5 className="dashboard-chart-title">Category Distribution</h5>
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
      <div className="dashboard-chart-container">
        <div className="dashboard-chart-header">
          <h5 className="dashboard-chart-title">Recent Stock Movements</h5>
          <Link to="/stock-movements" className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="dashboard-table-responsive">
          <table className="dashboard-data-table">
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
                      <span
                        className={`dashboard-status-badge ${movement.movement_type === "IN" ? "dashboard-status-in" : "dashboard-status-out"}`}
                      >
                        {movement.movement_type}
                      </span>
                    </td>
                    <td>{movement.quantity}</td>
                    <td>
                      <Link
                        to={`/stock-movements/${movement.id}`}
                        className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-secondary"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              {(!Array.isArray(stats.recentMovements) || stats.recentMovements.length === 0) && (
                <tr>
                  <td colSpan="5" className="dashboard-text-center">
                    No recent movements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="dashboard-chart-container">
        <div className="dashboard-chart-header">
          <h5 className="dashboard-chart-title">Low Stock Alerts</h5>
          <Link to="/items" className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-danger">
            Manage Inventory
          </Link>
        </div>
        <div className="dashboard-table-responsive">
          <table className="dashboard-data-table">
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
              {Array.isArray(stats.lowStockItemsList) && stats.lowStockItemsList.length > 0 ? (
                stats.lowStockItemsList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>10</td>
                    <td>
                      <span
                        className={`dashboard-status-badge ${item.quantity < 5 ? "dashboard-status-out" : "dashboard-status-pending"}`}
                      >
                        {item.quantity < 5 ? "Critical" : "Low"}
                      </span>
                    </td>
                    <td>
                      <Link
                        to="/stock-movements/new"
                        className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-primary"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td>Laptop Dell XPS</td>
                    <td>5</td>
                    <td>10</td>
                    <td>
                      <span className="dashboard-status-badge dashboard-status-out">Critical</span>
                    </td>
                    <td>
                      <Link
                        to="/stock-movements/new"
                        className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-primary"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>HP Printer Ink</td>
                    <td>8</td>
                    <td>15</td>
                    <td>
                      <span className="dashboard-status-badge dashboard-status-pending">Low</span>
                    </td>
                    <td>
                      <Link
                        to="/stock-movements/new"
                        className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-primary"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Wireless Mouse</td>
                    <td>12</td>
                    <td>20</td>
                    <td>
                      <span className="dashboard-status-badge dashboard-status-pending">Low</span>
                    </td>
                    <td>
                      <Link
                        to="/stock-movements/new"
                        className="dashboard-btn dashboard-btn-sm dashboard-btn-outline-primary"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
