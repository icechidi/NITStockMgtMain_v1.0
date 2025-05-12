"\"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaSearch, FaEdit, FaEye, FaTrash, FaBox, FaSort, FaSortUp, FaSortDown, FaFilter } from "react-icons/fa"
import "./ItemList.css"

function ItemList() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [newItem, setNewItem] = useState({ name: "", description: "", quantity: "", unit_price: "" })
  const [editForm, setEditForm] = useState({ name: "", description: "", quantity: "", unit_price: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true)
  const modalRef = useRef(null)

  // Fetch items function with useCallback
  const fetchItems = useCallback(async () => {
    if (!isMounted.current) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/items")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Only update state if component is still mounted
      if (isMounted.current) {
        const itemsWithData = Array.isArray(data) ? data : []

        // If no items or very few items, add some dummy items
        if (itemsWithData.length < 5) {
          const dummyItems = generateDummyItems(10 - itemsWithData.length)
          setItems([...itemsWithData, ...dummyItems])
        } else {
          setItems(itemsWithData)
        }

        setError(null)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      if (isMounted.current) {
        // If error fetching, use dummy data
        const dummyItems = generateDummyItems(10)
        setItems(dummyItems)
        setError("Could not fetch items from server. Showing sample data.")
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [])

  // Fetch items only once when component mounts
  useEffect(() => {
    fetchItems()

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false
    }
  }, [fetchItems])

  // Filter and sort items when items, searchTerm, or sortConfig changes
  useEffect(() => {
    let result = [...items]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      if (statusFilter === "inStock") {
        result = result.filter((item) => item.quantity > 10)
      } else if (statusFilter === "lowStock") {
        result = result.filter((item) => item.quantity > 0 && item.quantity <= 10)
      } else if (statusFilter === "outOfStock") {
        result = result.filter((item) => item.quantity <= 0)
      }
    }

    // Sort items
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredItems(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [items, searchTerm, sortConfig, categoryFilter, statusFilter])

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

  const generateDummyItems = (count) => {
    const categories = ["Electronics", "Office Supplies", "Furniture", "IT Equipment", "Tools"]
    const dummyItems = []

    for (let i = 0; i < count; i++) {
      const id = 1000 + i
      const category = categories[Math.floor(Math.random() * categories.length)]
      const quantity = Math.floor(Math.random() * 100)

      dummyItems.push({
        id,
        name: `${category} Item ${id}`,
        description: `This is a sample ${category.toLowerCase()} item for demonstration purposes.`,
        quantity,
        unit_price: (Math.random() * 1000).toFixed(2),
        category,
        stock_added_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    return dummyItems
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleAddItem = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          quantity: Number(newItem.quantity),
          unit_price: Number(newItem.unit_price),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      await fetchItems()
      setShowModal(false)
      setNewItem({ name: "", description: "", quantity: "", unit_price: "" })
    } catch (error) {
      console.error("Error adding item:", error)
      setError("Failed to add item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5000/api/items/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          quantity: Number(editForm.quantity),
          unit_price: Number(editForm.unit_price),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      await fetchItems()
      setEditItem(null)
    } catch (error) {
      console.error("Error updating item:", error)
      setError("Failed to update item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5000/api/items/${deleteItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      await fetchItems()
      setDeleteItem(null)
    } catch (error) {
      console.error("Error deleting item:", error)
      setError("Failed to delete item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const closeAllModals = () => {
    setShowModal(false)
    setViewItem(null)
    setEditItem(null)
    setDeleteItem(null)
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

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getStockStatusBadge = (quantity) => {
    if (quantity <= 0) {
      return <span className="item-badge item-badge-danger">Out of Stock</span>
    } else if (quantity < 10) {
      return <span className="item-badge item-badge-warning">Low Stock</span>
    } else {
      return <span className="item-badge item-badge-success">In Stock</span>
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setSortConfig({ key: "name", direction: "ascending" })
  }

  // Get unique categories from items
  const categories = ["all", ...new Set(items.map((item) => item.category))].filter(Boolean)

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading items...</p>
      </div>
    )
  }

  return (
    <div className="items-container">
      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="items-header">
        <h2 className="items-title">Inventory Items</h2>
        <div className="items-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus className="mr-2" /> Add New Item
          </button>
        </div>
      </div>

      <div className="items-search">
        <FaSearch className="items-search-icon" />
        <input
          type="text"
          placeholder="Search items by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="d-flex gap-3 mb-4">
        <div className="form-group" style={{ minWidth: "200px" }}>
          <label className="form-label">Category</label>
          <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c !== "all")
              .map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group" style={{ minWidth: "200px" }}>
          <label className="form-label">Stock Status</label>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div className="form-group d-flex align-items-end">
          <button className="btn btn-outline-secondary" onClick={resetFilters}>
            <FaFilter className="mr-2" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("name")}>Item Name {getSortIcon("name")}</th>
              <th onClick={() => requestSort("description")}>Description {getSortIcon("description")}</th>
              <th onClick={() => requestSort("quantity")}>Quantity {getSortIcon("quantity")}</th>
              <th onClick={() => requestSort("unit_price")}>Unit Price {getSortIcon("unit_price")}</th>
              <th onClick={() => requestSort("stock_added_at")}>Date Added {getSortIcon("stock_added_at")}</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td className="item-quantity">{item.quantity}</td>
                  <td className="item-price">${Number.parseFloat(item.unit_price).toFixed(2)}</td>
                  <td>{formatDateTime(item.stock_added_at)}</td>
                  <td>{getStockStatusBadge(item.quantity)}</td>
                  <td>
                    <div className="item-actions">
                      <button className="item-btn item-btn-view" onClick={() => setViewItem(item)}>
                        <FaEye /> View
                      </button>
                      <button
                        className="item-btn item-btn-edit"
                        onClick={() => {
                          setEditItem(item)
                          setEditForm(item)
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button className="item-btn item-btn-delete" onClick={() => setDeleteItem(item)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No items found. Try a different search term or add new items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="items-card-container">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="item-card" key={item.id}>
              <div className="item-card-header">
                <div className="item-card-title">{item.name}</div>
                {getStockStatusBadge(item.quantity)}
              </div>
              <div className="item-card-body">
                <div className="item-card-row">
                  <span className="item-card-label">Description:</span>
                  <span className="item-card-value">{item.description}</span>
                </div>
                <div className="item-card-row">
                  <span className="item-card-label">Quantity:</span>
                  <span className="item-card-value">{item.quantity}</span>
                </div>
                <div className="item-card-row">
                  <span className="item-card-label">Price:</span>
                  <span className="item-card-value">${Number.parseFloat(item.unit_price).toFixed(2)}</span>
                </div>
                <div className="item-card-row">
                  <span className="item-card-label">Date Added:</span>
                  <span className="item-card-value">{formatDateTime(item.stock_added_at)}</span>
                </div>
              </div>
              <div className="item-card-footer">
                <button className="item-btn item-btn-view" onClick={() => setViewItem(item)}>
                  <FaEye /> View
                </button>
                <button
                  className="item-btn item-btn-edit"
                  onClick={() => {
                    setEditItem(item)
                    setEditForm(item)
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button className="item-btn item-btn-delete" onClick={() => setDeleteItem(item)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBox />
            </div>
            <p className="empty-state-text">No items found. Try a different search term or add new items.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <FaPlus className="mr-2" /> Add New Item
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
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
            disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Item</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter item description"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newItem.category || ""}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter((c) => c !== "all")
                    .map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={newItem.unit_price}
                  onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                  placeholder="Enter unit price"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.quantity || !newItem.unit_price}
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewItem && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Item Details</h3>
              <button className="modal-close" onClick={() => setViewItem(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <p>{viewItem.name}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <p>{viewItem.description || "No description provided"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <p>{viewItem.category || "Uncategorized"}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <p>{viewItem.quantity}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price</label>
                <p>${Number.parseFloat(viewItem.unit_price).toFixed(2)}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Date Added</label>
                <p>{formatDateTime(viewItem.stock_added_at)}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <p>{getStockStatusBadge(viewItem.quantity)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewItem(null)}>
                Close
              </button>
              <Link to={`/stock-movements/new?item=${viewItem.id}`} className="btn btn-primary">
                Record Movement
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editItem && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Item</h3>
              <button className="modal-close" onClick={() => setEditItem(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={editForm.category || ""}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter((c) => c !== "all")
                    .map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editForm.unit_price}
                  onChange={(e) => setEditForm({ ...editForm, unit_price: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditItem(null)}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleEditSubmit}
                disabled={!editForm.name || !editForm.quantity || !editForm.unit_price}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {deleteItem && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteItem(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this item?</p>
              <p>
                <strong>Name:</strong> {deleteItem.name}
              </p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteItem(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteItem}>
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemList
