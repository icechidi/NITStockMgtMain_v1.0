"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Stocks.css"

function Stocks() {
  const [stocks, setStocks] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [categories, setCategories] = useState([])
  const [stores, setStores] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [newStockLocation, setNewStockLocation] = useState({ 
    location: "", 
    totalItems: 0, 
    lowStock: 0, 
    value: 0,
    sourceStore: "" 
  })
  const [newStockItem, setNewStockItem] = useState({
    name: "",
    location: "",
    quantity: 0,
    minQuantity: 0,
    category: "",
    sourceStore: ""
  })

  useEffect(() => {
    fetchStocks()
    fetchStockItems()
    fetchCategories()
    fetchStores()
  }, [])

  const fetchStocks = async () => {
    try {
      const response = await axios.get('/api/stocks')
      setStocks(response.data)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    }
  }

  const fetchStockItems = async () => {
    try {
      const response = await axios.get('/api/stock-items')
      setStockItems(response.data)
    } catch (error) {
      console.error('Error fetching stock items:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores')
      setStores(response.data)
    } catch (error) {
      console.error('Error fetching stores:', error)
    }
  }

  const handleAddStockLocation = async () => {
    try {
      const response = await axios.post('/api/stocks', newStockLocation)
      setStocks([...stocks, response.data])
      setNewStockLocation({ location: "", totalItems: 0, lowStock: 0, value: 0, sourceStore: "" })
      setShowModal(false)
    } catch (error) {
      console.error('Error adding stock location:', error)
    }
  }

  const handleAddStockItem = async () => {
    try {
      const response = await axios.post('/api/stock-items', newStockItem)
      setStockItems([...stockItems, response.data])
      setNewStockItem({
        name: "",
        location: "",
        quantity: 0,
        minQuantity: 0,
        category: "",
        sourceStore: ""
      })
    } catch (error) {
      console.error('Error adding stock item:', error)
    }
  }

  const handleTransferStock = async (itemId, newLocation) => {
    try {
      await axios.put(`/api/stock-items/${itemId}/transfer`, { newLocation })
      setStockItems(stockItems.map((item) => 
        item.id === itemId ? { ...item, location: newLocation } : item
      ))
    } catch (error) {
      console.error('Error transferring stock:', error)
    }
  }

  const filteredStockItems = selectedCategory === 'all' 
    ? stockItems 
    : stockItems.filter(item => item.category === selectedCategory)

  return (
    <div className="stocks-container">
      <h2>Stock Management</h2>
      <p>Monitor and manage your inventory across different locations.</p>

      <div className="stock-actions mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
          Add New Stock Location
        </button>
        <button className="btn btn-success me-2" onClick={() => setShowAddItemModal(true)}>
          Add New Stock Item
        </button>
        <select 
          className="form-select d-inline-block w-auto ms-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
              <th>Category</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Source Store</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockItems.map((item) => (
              <tr key={item.id} className={item.status === "Low Stock" ? "low-stock-row" : ""}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.location}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={`status-badge ${item.status === "Low Stock" ? "status-low" : "status-ok"}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.sourceStore}</td>
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
                <label>Source Store</label>
                <select
                  className="form-control"
                  value={newStockLocation.sourceStore}
                  onChange={(e) => setNewStockLocation({ ...newStockLocation, sourceStore: e.target.value })}
                >
                  <option value="">Select Store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
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

      {showAddItemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Stock Item</h3>
            <form>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStockItem.name}
                  onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={newStockItem.category}
                  onChange={(e) => setNewStockItem({ ...newStockItem, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <select
                  className="form-control"
                  value={newStockItem.location}
                  onChange={(e) => setNewStockItem({ ...newStockItem, location: e.target.value })}
                >
                  <option value="">Select Location</option>
                  {stocks.map(stock => (
                    <option key={stock.id} value={stock.location}>
                      {stock.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Source Store</label>
                <select
                  className="form-control"
                  value={newStockItem.sourceStore}
                  onChange={(e) => setNewStockItem({ ...newStockItem, sourceStore: e.target.value })}
                >
                  <option value="">Select Store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockItem.quantity}
                  onChange={(e) => setNewStockItem({ ...newStockItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Minimum Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newStockItem.minQuantity}
                  onChange={(e) => setNewStockItem({ ...newStockItem, minQuantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddStockItem}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddItemModal(false)}>
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
