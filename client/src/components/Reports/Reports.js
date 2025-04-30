"use client"

import { useState } from "react"
import "./Reports.css"
import { Chart } from "react-google-charts"

function Reports() {
  const [reportType, setReportType] = useState("inventory")
  const [dateRange, setDateRange] = useState("month")

  // Inventory Value by Category data
  const inventoryData = [
    ["Category", "Value"],
    ["Electronics", 45000],
    ["Furniture", 28000],
    ["Office Supplies", 15000],
    ["IT Equipment", 35000],
    ["Tools", 12000],
  ]

  // Stock Movement data
  const stockMovementData = [
    ["Month", "Stock In", "Stock Out"],
    ["Jan", 1000, 400],
    ["Feb", 1170, 460],
    ["Mar", 660, 1120],
    ["Apr", 1030, 540],
    ["May", 1000, 400],
    ["Jun", 1170, 460],
  ]

  // Low Stock Items data
  const lowStockData = [
    ["Item", "Current Stock", "Minimum Required"],
    ["Laptops", 5, 10],
    ["Monitors", 8, 15],
    ["Keyboards", 12, 20],
    ["Mice", 7, 15],
    ["Printers", 3, 8],
  ]

  // Top Moving Items data
  const topMovingData = [
    ["Item", "Units Moved"],
    ["Laptops", 120],
    ["Smartphones", 95],
    ["Monitors", 85],
    ["Keyboards", 75],
    ["Headphones", 65],
  ]

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <p>Generate and view reports about your inventory and stock movements.</p>

      <div className="report-controls">
        <div className="form-group">
          <label>Report Type</label>
          <select className="form-control" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="inventory">Inventory Value</option>
            <option value="movement">Stock Movement</option>
            <option value="lowstock">Low Stock Items</option>
            <option value="topmoving">Top Moving Items</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date Range</label>
          <select className="form-control" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <button className="btn btn-primary">Generate Report</button>
        <button className="btn btn-secondary">Export PDF</button>
      </div>

      <div className="report-content">
        {reportType === "inventory" && (
          <div className="report-chart">
            <h3>Inventory Value by Category</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={inventoryData}
              options={{
                title: "Inventory Value Distribution",
                pieHole: 0.4,
                is3D: false,
              }}
            />
          </div>
        )}

        {reportType === "movement" && (
          <div className="report-chart">
            <h3>Stock Movement Over Time</h3>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={stockMovementData}
              options={{
                title: "Stock Movement Trends",
                curveType: "function",
                legend: { position: "bottom" },
              }}
            />
          </div>
        )}

        {reportType === "lowstock" && (
          <div className="report-chart">
            <h3>Low Stock Items</h3>
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={lowStockData}
              options={{
                title: "Items Below Minimum Stock Level",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Quantity",
                  minValue: 0,
                },
                vAxis: {
                  title: "Item",
                },
              }}
            />
          </div>
        )}

        {reportType === "topmoving" && (
          <div className="report-chart">
            <h3>Top Moving Items</h3>
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={topMovingData}
              options={{
                title: "Items with Highest Movement",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Units Moved",
                  minValue: 0,
                },
                vAxis: {
                  title: "Item",
                },
              }}
            />
          </div>
        )}
      </div>

      <div className="report-summary">
        <h3>Summary</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Inventory Value</h4>
            <p className="summary-value">$135,000</p>
          </div>
          <div className="summary-card">
            <h4>Items in Stock</h4>
            <p className="summary-value">1,250</p>
          </div>
          <div className="summary-card">
            <h4>Low Stock Items</h4>
            <p className="summary-value">45</p>
          </div>
          <div className="summary-card">
            <h4>Stock Movement</h4>
            <p className="summary-value">+320 units</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
