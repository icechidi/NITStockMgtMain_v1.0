"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaEye,
  FaTrash,
  FaExchangeAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
} from "react-icons/fa"
import "./StockMovements.css"

function StockMovementList() {
  const location = useLocation()
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [viewMovement, setViewMovement] = useState(null)
  const [editMovement, setEditMovement] = useState(null)
  const [deleteMovement, setDeleteMovement] = useState(null)
  const [newMovement, setNewMovement] = useState({
    item_id: "",
    movement_type: "IN",
    quantity: "",
    notes: "",
  })
  const [editForm, setEditForm] = useState({
    item_id: "",
    movement_type: "IN",
    quantity: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [movementsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: "movement_date", direction: "descending" })
  const [items, setItems] = useState([])
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true)
  const modalRef = useRef(null)

  // Fetch movements and items when component mounts
  useEffect(() => {
    Promise.all([fetchMovements(), fetchItems()])

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false
    }
  }, [])

  // Filter and sort movements when movements, searchTerm, typeFilter, dateRange, or sortConfig changes
  useEffect(() => {
    let result = [...movements]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (movement) =>
          movement.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by movement type
    if (typeFilter !== "ALL") {
      result = result.filter((movement) => movement.movement_type === typeFilter)
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from)
      result = result.filter((movement) => new Date(movement.movement_date) >= fromDate)
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999) // Set to end of day
      result = result.filter((movement) => new Date(movement.movement_date) <= toDate)
    }

    // Sort movements
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "movement_date") {
          return sortConfig.direction === "ascending"
            ? new Date(a.movement_date) - new Date(b.movement_date)
            : new Date(b.movement_date) - new Date(a.movement_date)
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredMovements(result)
  }, [movements, searchTerm, typeFilter, dateRange, sortConfig])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Check for item_id in URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const itemId = params.get("item")
    if (itemId) {
      setShowModal(true)
      setNewMovement((prev) => ({ ...prev, item_id: itemId }))
    }
  }, [location.search])

  const fetchMovements = async () => {
    if (!isMounted.current) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/stock-movements")
      const data = await response.json()

      // Only update state if component is still mounted
      if (isMounted.current) {
        const movementsWithData = Array.isArray(data) ? data : []

        // If no movements or very few movements, add some dummy movements
        if (movementsWithData.length < 5) {
          const dummyMovements = generateDummyMovements(10 - movementsWithData.length)
          setMovements([...movementsWithData, ...dummyMovements])
        } else {
          setMovements(movementsWithData)
        }

        setError(null)
      }
    } catch (error) {
      console.error("Error fetching stock movements:", error)
      if (isMounted.current) {
        // If error fetching, use dummy data
        const dummyMovements = generateDummyMovements(10)
        setMovements(dummyMovements)
        setError("Could not fetch stock movements from server. Showing sample data.")
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  const fetchItems = async () => {
    if (!isMounted.current) return

    try {
      const response = await fetch("http://localhost:5000/api/items")
      const data = await response.json()

      // Only update state if component is still mounted
      if (isMounted.current) {
        setItems(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      if (isMounted.current) {
        setItems([])
      }
    }
  }

  const generateDummyMovements = (count) => {
    const movementTypes = ["IN", "OUT"]
    const itemNames = [
      "Laptop",
      "Monitor",
      "Keyboard",
      "Mouse",
      "Printer",
      "Desk",
      "Chair",
      "Phone",
      "Tablet",
      "Headphones",
    ]
    const dummyMovements = []

    for (let i = 0; i < count; i++) {
      const id = 1000 + i
      const movementType = movementTypes[Math.floor(Math.random() * movementTypes.length)]
      const itemName = itemNames[Math.floor(Math.random() * itemNames.length)]
      const quantity = Math.floor(Math.random() * 20) + 1

      dummyMovements.push({
        id,
        item_id: id,
        item_name: itemName,
        movement_type: movementType,
        quantity,
        notes: `Sample ${movementType.toLowerCase()} movement for ${itemName}`,
        movement_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    return dummyMovements
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleAddMovement = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovement),
      })
      if (response.ok) {
        fetchMovements()
        setShowModal(false)
        setNewMovement({
          item_id: "",
          movement_type: "IN",
          quantity: "",
          notes: "",
        })
      } else {
        console.error("Failed to add stock movement")
      }
    } catch (error) {
      console.error("Error adding stock movement:", error)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stock-movements/${editMovement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (response.ok) {
        fetchMovements()
        setEditMovement(null)
      } else {
        console.error("Failed to update stock movement")
      }
    } catch (error) {
      console.error("Error updating stock movement:", error)
    }
  }

  const handleDeleteMovement = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stock-movements/${deleteMovement.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchMovements()
        setDeleteMovement(null)
      } else {
        console.error("Failed to delete stock movement")
      }
    } catch (error) {
      console.error("Error deleting stock movement:", error)
    }
  }

  const closeAllModals = () => {
    setShowModal(false)
    setViewMovement(null)
    setEditMovement(null)
    setDeleteMovement(null)
  }

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ml-1" />
    }
    return sortConfig.direction === "ascending" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
  }

  // Get current movements for pagination
  const indexOfLastMovement = currentPage * movementsPerPage
  const indexOfFirstMovement = indexOfLastMovement - movementsPerPage
  const currentMovements = filteredMovements.slice(indexOfFirstMovement, indexOfLastMovement)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getMovementTypeBadge = (type) => {
    if (type === "IN") {
      return <span className="movement-badge movement-badge-in">IN</span>
    } else {
      return <span className="movement-badge movement-badge-out">OUT</span>
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setTypeFilter("ALL")
    setDateRange({ from: "", to: "" })
    setSortConfig({ key: "movement_date", direction: "descending" })
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="stock-movements-container">
      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="stock-movements-header">
        <h2 className="stock-movements-title">Stock Movements</h2>
        <div className="stock-movements-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="mr-2" /> Record Movement
          </button>
        </div>
      </div>

      <div className="stock-movements-search">
        <FaSearch className="stock-movements-search-icon" />
        <input
          type="text"
          placeholder="Search by item name or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stock-movements-filters">
        <div className="stock-movements-filter">
          <label className="stock-movements-filter-label">Movement Type</label>
          <select
            className="stock-movements-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>
        </div>

        <div className="stock-movements-filter">
          <label className="stock-movements-filter-label">From Date</label>
          <input
            type="date"
            className="stock-movements-filter-select"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>

        <div className="stock-movements-filter">
          <label className="stock-movements-filter-label">To Date</label>
          <input
            type="date"
            className="stock-movements-filter-select"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>

        <div className="stock-movements-filter" style={{ display: "flex", alignItems: "flex-end" }}>
          <button className="btn btn-secondary" onClick={resetFilters}>
            <FaFilter className="mr-2" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="stock-movements-table-container">
        <table className="stock-movements-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("movement_date")}>Date/Time {getSortIcon("movement_date")}</th>
              <th onClick={() => requestSort("item_name")}>Item {getSortIcon("item_name")}</th>
              <th onClick={() => requestSort("movement_type")}>Type {getSortIcon("movement_type")}</th>
              <th onClick={() => requestSort("quantity")}>Quantity {getSortIcon("quantity")}</th>
              <th onClick={() => requestSort("notes")}>Notes {getSortIcon("notes")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovements.length > 0 ? (
              currentMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{formatDateTime(movement.movement_date)}</td>
                  <td>{movement.item_name}</td>
                  <td>{getMovementTypeBadge(movement.movement_type)}</td>
                  <td className="movement-quantity">{movement.quantity}</td>
                  <td>{movement.notes}</td>
                  <td>
                    <div className="movement-actions">
                      <button className="movement-btn movement-btn-view" onClick={() => setViewMovement(movement)}>
                        <FaEye /> View
                      </button>
                      <button
                        className="movement-btn movement-btn-edit"
                        onClick={() => {
                          setEditMovement(movement)
                          setEditForm(movement)
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button className="movement-btn movement-btn-delete" onClick={() => setDeleteMovement(movement)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No stock movements found. Try a different search term or add new movements.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="stock-movements-card-container">
        {currentMovements.length > 0 ? (
          currentMovements.map((movement) => (
            <div className="movement-card" key={movement.id}>
              <div className="movement-card-header">
                <div className="movement-card-title">{movement.item_name}</div>
                {getMovementTypeBadge(movement.movement_type)}
              </div>
              <div className="movement-card-body">
                <div className="movement-card-row">
                  <span className="movement-card-label">Date/Time:</span>
                  <span className="movement-card-value">{formatDateTime(movement.movement_date)}</span>
                </div>
                <div className="movement-card-row">
                  <span className="movement-card-label">Quantity:</span>
                  <span className="movement-card-value">{movement.quantity}</span>
                </div>
                <div className="movement-card-row">
                  <span className="movement-card-label">Notes:</span>
                  <span className="movement-card-value">{movement.notes}</span>
                </div>
              </div>
              <div className="movement-card-footer">
                <button className="movement-btn movement-btn-view" onClick={() => setViewMovement(movement)}>
                  <FaEye /> View
                </button>
                <button
                  className="movement-btn movement-btn-edit"
                  onClick={() => {
                    setEditMovement(movement)
                    setEditForm(movement)
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button className="movement-btn movement-btn-delete" onClick={() => setDeleteMovement(movement)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaExchangeAlt />
            </div>
            <p className="empty-state-text">
              No stock movements found. Try a different search term or add new movements.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredMovements.length > movementsPerPage && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: Math.ceil(filteredMovements.length / movementsPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredMovements.length / movementsPerPage)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add Movement Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Record Stock Movement</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Item</label>
                <select
                  className="form-control"
                  value={newMovement.item_id}
                  onChange={(e) => setNewMovement({ ...newMovement, item_id: e.target.value })}
                  required
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Movement Type</label>
                <select
                  className="form-control"
                  value={newMovement.movement_type}
                  onChange={(e) => setNewMovement({ ...newMovement, movement_type: e.target.value })}
                  required
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newMovement.quantity}
                  onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={newMovement.notes}
                  onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })}
                  placeholder="Enter notes (optional)"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleAddMovement}>
                Save Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Movement Modal */}
      {viewMovement && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Movement Details</h3>
              <button className="modal-close" onClick={() => setViewMovement(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Item</label>
                <p>{viewMovement.item_name}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Movement Type</label>
                <p>{getMovementTypeBadge(viewMovement.movement_type)}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <p>{viewMovement.quantity}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Date/Time</label>
                <p>{formatDateTime(viewMovement.movement_date)}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <p>{viewMovement.notes || "No notes provided"}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewMovement(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movement Modal */}
      {editMovement && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Movement</h3>
              <button className="modal-close" onClick={() => setEditMovement(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Item</label>
                <select
                  className="form-control"
                  value={editForm.item_id}
                  onChange={(e) => setEditForm({ ...editForm, item_id: e.target.value })}
                  required
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Movement Type</label>
                <select
                  className="form-control"
                  value={editForm.movement_type}
                  onChange={(e) => setEditForm({ ...editForm, movement_type: e.target.value })}
                  required
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditMovement(null)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Movement Modal */}
      {deleteMovement && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteMovement(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this stock movement?</p>
              <p>
                <strong>Item:</strong> {deleteMovement.item_name}
              </p>
              <p>
                <strong>Type:</strong> {deleteMovement.movement_type}
              </p>
              <p>
                <strong>Quantity:</strong> {deleteMovement.quantity}
              </p>
              <p>
                <strong>Date:</strong> {formatDateTime(deleteMovement.movement_date)}
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteMovement(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteMovement}>
                Delete Movement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockMovementList
