"use client"

import { useState, useEffect } from "react"
import "./Stocks.css"

function Stocks() {
  const [stocks, setStocks] = useState([])
  const [stockItems, setStockItems] = useState([])

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
    location: "Main Warehouse",
    minQuantity: 10,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStockLocations()
    fetchStockItems()
  }, [])

  const fetchStockLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stock-locations")
      if (response.ok) {
        const locations = await response.json()
        setStocks(locations.map(loc => ({
          id: loc.id,
          location: loc.location_name,
          totalItems: loc.total_items,
          lowStock: loc.low_stock_items,
          value: loc.total_value
        })))
      }
    } catch (error) {
      console.error("Error fetching stock locations:", error)
    }
  }

  const fetchStockItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items")
      if (response.ok) {
        const items = await response.json()
        setStockItems(items.map(item => ({
          id: item.id,
          name: item.name,
          location: item.location || 'Unknown',
          quantity: item.quantity,
          minQuantity: item.min_quantity,
          status: item.calculated_status || item.status
        })))
      }
    } catch (error) {
      console.error("Error fetching stock items:", error)
    }
  }

  const handleAddStockLocation = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stock-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_name: newStockLocation.location,
          total_items: Number(newStockLocation.totalItems),
          total_value: Number(newStockLocation.value),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add stock location")
      }

      const savedLocation = await response.json()
      
      // Add to local state
      setStocks([...stocks, {
        id: savedLocation.id,
        location: savedLocation.location_name,
        totalItems: savedLocation.total_items,
        lowStock: savedLocation.low_stock_items,
        value: savedLocation.total_value
      }])

      setNewStockLocation({ location: "", totalItems: 0, lowStock: 0, value: 0 })
      setShowModal(false)
    } catch (error) {
      console.error("Error adding stock location:", error)
      setError("Failed to add stock location. Please try again.")
    }
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
      // Find location_id from location name
      const selectedLocation = stocks.find(stock => stock.location === newStockItem.location)
      if (!selectedLocation) {
        setError("Please select a valid location")
        setIsSubmitting(false)
        return
      }

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
          location_id: selectedLocation.id,
          min_quantity: Number(newStockItem.minQuantity),
          category: "IT Equipment"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to database")
      }

      // Refresh data from database
      await fetchStockItems()
      await fetchStockLocations()

      // Reset form and close modal
      setNewStockItem({
        name: "",
        description: "",
        quantity: 0,
        unit_price: 0,
        location: stocks[0]?.location || "Main Warehouse",
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
