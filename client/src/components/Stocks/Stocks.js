"use client"

import { useState } from "react"
import "./Stocks.css"

function Stocks() {
  const [stocks, setStocks] = useState([
    { id: 1, location: "A-Block S2", totalItems: 1250, lowStock: 45, value: 125000 },
    { id: 2, location: "A-Block S2", totalItems: 350, lowStock: 12, value: 42000 },
    { id: 3, location: "B-Block S1", totalItems: 420, lowStock: 18, value: 51000 },
    { id: 4, location: "B-Block S2", totalItems: 780, lowStock: 30, value: 95000 },
    { id: 5, location: "B-Block S3", totalItems: 120, lowStock: 18, value: 51000 },
    { id: 6, location: "B-Block S4", totalItems: 80, lowStock: 18, value: 51000 },
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

  const [itTemplates] = useState([
    {
      id: 1,
      name: "Desktop Computer",
      description: "Standard office desktop computer with monitor, keyboard, and mouse",
      unit_price: 800,
      minQuantity: 5,
      category: "Hardware",
    },
    {
      id: 2,
      name: "Laptop",
      description: "Business laptop for mobile work",
      unit_price: 1200,
      minQuantity: 10,
      category: "Hardware",
    },
    {
      id: 3,
      name: 'Monitor 24"',
      description: "24-inch LED monitor for workstation",
      unit_price: 250,
      minQuantity: 8,
      category: "Hardware",
    },
    {
      id: 4,
      name: "Wireless Mouse",
      description: "Ergonomic wireless optical mouse",
      unit_price: 25,
      minQuantity: 20,
      category: "Accessories",
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      description: "Professional mechanical keyboard",
      unit_price: 120,
      minQuantity: 15,
      category: "Accessories",
    },
    {
      id: 6,
      name: "Network Switch 24-Port",
      description: "Managed 24-port Gigabit Ethernet switch",
      unit_price: 300,
      minQuantity: 3,
      category: "Networking",
    },
    {
      id: 7,
      name: "WiFi Router",
      description: "Enterprise-grade wireless router",
      unit_price: 200,
      minQuantity: 5,
      category: "Networking",
    },
    {
      id: 8,
      name: "Laser Printer",
      description: "Black and white laser printer for office use",
      unit_price: 400,
      minQuantity: 3,
      category: "Printers",
    },
    {
      id: 9,
      name: "UPS Battery Backup",
      description: "Uninterruptible power supply for critical equipment",
      unit_price: 150,
      minQuantity: 10,
      category: "Power",
    },
    {
      id: 10,
      name: "External Hard Drive 1TB",
      description: "Portable external storage drive",
      unit_price: 80,
      minQuantity: 15,
      category: "Storage",
    },
    {
      id: 11,
      name: "USB Cable Type-C",
      description: "High-speed USB Type-C cable",
      unit_price: 15,
      minQuantity: 30,
      category: "Cables",
    },
    {
      id: 12,
      name: "HDMI Cable 6ft",
      description: "High-definition multimedia interface cable",
      unit_price: 12,
      minQuantity: 25,
      category: "Cables",
    },
    {
      id: 13,
      name: "Webcam HD",
      description: "High-definition webcam for video conferencing",
      unit_price: 60,
      minQuantity: 12,
      category: "Accessories",
    },
    {
      id: 14,
      name: "Headset with Microphone",
      description: "Professional headset for calls and meetings",
      unit_price: 45,
      minQuantity: 20,
      category: "Accessories",
    },
    {
      id: 15,
      name: "Server Rack 42U",
      description: "Standard 42U server rack cabinet",
      unit_price: 800,
      minQuantity: 2,
      category: "Infrastructure",
    },
  ])

  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [newStockLocation, setNewStockLocation] = useState({ location: "", totalItems: 0, lowStock: 0, value: 0 })

  const [showItemModal, setShowItemModal] = useState(false)
  const [newStockItem, setNewStockItem] = useState({
    name: "",
    description: "",
    quantity: 0,
    unit_price: 0,
    location: "A-Block S2",
    minQuantity: 10,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

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

  const handleTemplateSelect = (template) => {
    setNewStockItem({
      ...newStockItem,
      name: template.name,
      description: template.description,
      unit_price: template.unit_price,
      minQuantity: template.minQuantity,
    })
    setShowTemplates(false)
    setSelectedTemplate(template)
  }

  const handleAddStockItem = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!newStockItem.name || newStockItem.quantity < 0 || newStockItem.unit_price < 0) {
        setError("Please fill in all required fields with valid values")
        setIsSubmitting(false)
        return
      }

      // Send to backend API
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStockItem.name,
          description: newStockItem.description,
          quantity: Number(newStockItem.quantity),
          unit_price: Number(newStockItem.unit_price),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to database")
      }

      const savedItem = await response.json()

      // Add to local state for immediate UI update
      const newItem = {
        id: savedItem.id,
        name: newStockItem.name,
        location: newStockItem.location,
        quantity: Number(newStockItem.quantity),
        minQuantity: Number(newStockItem.minQuantity),
        status: Number(newStockItem.quantity) <= Number(newStockItem.minQuantity) ? "Low Stock" : "In Stock",
      }

      setStockItems([...stockItems, newItem])

      // Update stock location totals
      setStocks(
        stocks.map((stock) =>
          stock.location === newStockItem.location
            ? {
                ...stock,
                totalItems: stock.totalItems + Number(newStockItem.quantity),
                value: stock.value + Number(newStockItem.quantity) * Number(newStockItem.unit_price),
                lowStock: newItem.status === "Low Stock" ? stock.lowStock + 1 : stock.lowStock,
              }
            : stock,
        ),
      )

      // Reset form and close modal...
      setNewStockItem({
        name: "",
        description: "",
        quantity: 0,
        unit_price: 0,
        location: "B-Block S1",
        minQuantity: 10,
      })
      setShowItemModal(false)
    } catch (error) {
      console.error("Error adding stock item:", error)
      setError("Failed to add item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stocks-container">
      <h2>Stock Management</h2>
      <p>Monitor and manage your inventory across different locations.</p>

      <div className="stock-actions mb-3">
        <button className="btn btn-success me-2" onClick={() => setShowItemModal(true)}>
          Add New Stock Item
        </button>
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

      {/* Modal for Adding a New Stock Item */}
      {showItemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Stock Item</h3>
            <div className="template-section">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mb-3"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? "Hide" : "Show"} IT Item Templates
              </button>

              {showTemplates && (
                <div className="templates-grid">
                  <h5>Quick Add Templates</h5>
                  <div className="templates-container">
                    {itTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`template-card ${selectedTemplate?.id === template.id ? "selected" : ""}`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="template-header">
                          <strong>{template.name}</strong>
                          <span className="template-category">{template.category}</span>
                        </div>
                        <div className="template-description">{template.description}</div>
                        <div className="template-price">${template.unit_price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddStockItem()
              }}
            >
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStockItem.name}
                  onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={newStockItem.description}
                  onChange={(e) => setNewStockItem({ ...newStockItem, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockItem.quantity}
                  onChange={(e) => setNewStockItem({ ...newStockItem, quantity: Number(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={newStockItem.unit_price}
                  onChange={(e) => setNewStockItem({ ...newStockItem, unit_price: Number(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <select
                  className="form-control"
                  value={newStockItem.location}
                  onChange={(e) => setNewStockItem({ ...newStockItem, location: e.target.value })}
                >
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.location}>
                      {stock.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Minimum Quantity Alert</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockItem.minQuantity}
                  onChange={(e) => setNewStockItem({ ...newStockItem, minQuantity: Number(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowItemModal(false)
                    setError(null)
                    setNewStockItem({
                      name: "",
                      description: "",
                      quantity: 0,
                      unit_price: 0,
                      location: "Main Warehouse",
                      minQuantity: 10,
                    })
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stocks
