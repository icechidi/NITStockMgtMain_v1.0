"use client"

import { useState } from "react"
import "./Stocks.css"

function Stocks() {
  const [stocks, setStocks] = useState([
    { id: 1, location: "Main Warehouse", totalItems: 1250, lowStock: 45, value: 125000 },
    { id: 2, location: "Store A", totalItems: 350, lowStock: 12, value: 42000 },
    { id: 3, location: "Store B", totalItems: 420, lowStock: 18, value: 51000 },
    { id: 4, location: "Distribution Center", totalItems: 780, lowStock: 30, value: 95000 },
  ])

  const [stockItems, setStockItems] = useState([
    { id: 1, name: "Laptop Dell XPS", location: "Main Warehouse", quantity: 25, minQuantity: 10, status: "In Stock" },
    { id: 2, name: "iPhone 13", location: "Store A", quantity: 8, minQuantity: 10, status: "Low Stock" },
    { id: 3, name: 'Samsung TV 55"', location: "Store B", quantity: 15, minQuantity: 5, status: "In Stock" },
    {
      id: 4,
      name: "Logitech Mouse",
      location: "Distribution Center",
      quantity: 50,
      minQuantity: 20,
      status: "In Stock",
    },
    { id: 5, name: "HP Printer", location: "Main Warehouse", quantity: 12, minQuantity: 15, status: "Low Stock" },
    { id: 6, name: "Mechanical Keyboard", location: "Store A", quantity: 5, minQuantity: 8, status: "Low Stock" },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newStockLocation, setNewStockLocation] = useState({ location: "", totalItems: 0, lowStock: 0, value: 0 })

  const handleAddStockLocation = () => {
    // In a real app, you would send this to your backend
    const newId = Math.max(...stocks.map((s) => s.id)) + 1
    setStocks([...stocks, { ...newStockLocation, id: newId }])
    setNewStockLocation({ location: "", totalItems: 0, lowStock: 0, value: 0 })
    setShowModal(false)
  }

  const handleTransferStock = (itemId, newLocation) => {
    // In a real app, you would send this to your backend
    setStockItems(stockItems.map((item) => (item.id === itemId ? { ...item, location: newLocation } : item)))
  }

  return (
    <div className="stocks-container">
      <h2>Stock Management</h2>
      <p>Monitor and manage your inventory across different locations.</p>

      <div className="stock-actions mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Stock Location
        </button>
      </div>

      <div className="stock-overview">
        <h3>Stock Locations Overview</h3>
        <div className="stocks-grid">
          {stocks.map((stock) => (
            <div key={stock.id} className="stock-card">
              <h4>{stock.location}</h4>
              <div className="stock-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">{stock.totalItems}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Stock Items</span>
                  <span className="stat-value">{stock.lowStock}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">${stock.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stock-items mt-4">
        <h3>Stock Items</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item) => (
              <tr key={item.id} className={item.status === "Low Stock" ? "low-stock-row" : ""}>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={`status-badge ${item.status === "Low Stock" ? "status-low" : "status-ok"}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-secondary dropdown-toggle"
                      type="button"
                      id={`dropdown-${item.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Transfer
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdown-${item.id}`}>
                      {stocks.map(
                        (stock) =>
                          stock.location !== item.location && (
                            <li key={stock.id}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleTransferStock(item.id, stock.location)}
                              >
                                {stock.location}
                              </button>
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding a New Stock Location */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Stock Location</h3>
            <form>
              <div className="form-group">
                <label>Location Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStockLocation.location}
                  onChange={(e) => setNewStockLocation({ ...newStockLocation, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Initial Items</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockLocation.totalItems}
                  onChange={(e) =>
                    setNewStockLocation({ ...newStockLocation, totalItems: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="form-group">
                <label>Initial Value ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockLocation.value}
                  onChange={(e) =>
                    setNewStockLocation({ ...newStockLocation, value: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddStockLocation}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stocks
