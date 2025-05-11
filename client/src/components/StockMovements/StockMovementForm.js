"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { FaArrowLeft, FaBoxOpen, FaSave, FaTimes } from "react-icons/fa"
import "./StockMovements.css"

function StockMovementForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    item_id: "",
    movement_type: "IN",
    quantity: 0,
    notes: "",
  })

  useEffect(() => {
    fetchItems()

    // Check for item_id in URL query params
    const params = new URLSearchParams(location.search)
    const itemId = params.get("item")
    if (itemId) {
      setFormData((prev) => ({ ...prev, item_id: itemId }))
    }
  }, [location.search])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/items")
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
      setError(null)
    } catch (error) {
      console.error("Error fetching items:", error)
      setError("Error loading items")
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch("http://localhost:5000/api/stock-movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          item_id: Number(formData.item_id),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create stock movement")
      }

      navigate("/stock-movements")
    } catch (error) {
      console.error("Error creating stock movement:", error)
      setError("Error saving stock movement")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const selectedItem = items.find((item) => item.id === Number(formData.item_id))

  return (
    <div className="stock-movements-container">
      <div className="stock-movements-header">
        <h2 className="stock-movements-title">Record Stock Movement</h2>
        <Link to="/stock-movements" className="btn btn-secondary">
          <FaArrowLeft className="mr-2" /> Back to Movements
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Item</label>
              <select
                className="form-control"
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select an item</option>
                {Array.isArray(items) &&
                  items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - Current Stock: {item.quantity}
                    </option>
                  ))}
              </select>
            </div>

            {selectedItem && (
              <div className="alert alert-info mb-4">
                <div className="d-flex align-items-center">
                  <FaBoxOpen className="mr-2" size={20} />
                  <div>
                    <strong>Current Stock:</strong> {selectedItem.quantity} units
                    <br />
                    <strong>Unit Price:</strong> ${Number.parseFloat(selectedItem.unit_price).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Movement Type</label>
              <div className="movement-type-selector">
                <div className={`movement-type-option ${formData.movement_type === "IN" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    id="type-in"
                    name="movement_type"
                    value="IN"
                    checked={formData.movement_type === "IN"}
                    onChange={handleChange}
                  />
                  <label htmlFor="type-in" className="movement-type-label">
                    <div className="movement-badge movement-badge-in">Stock In</div>
                    <div className="movement-type-description">Add items to inventory</div>
                  </label>
                </div>
                <div className={`movement-type-option ${formData.movement_type === "OUT" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    id="type-out"
                    name="movement_type"
                    value="OUT"
                    checked={formData.movement_type === "OUT"}
                    onChange={handleChange}
                  />
                  <label htmlFor="type-out" className="movement-type-label">
                    <div className="movement-badge movement-badge-out">Stock Out</div>
                    <div className="movement-type-description">Remove items from inventory</div>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
              {formData.movement_type === "OUT" &&
                selectedItem &&
                Number(formData.quantity) > selectedItem.quantity && (
                  <div className="text-danger mt-2">
                    Warning: The quantity exceeds the current stock level ({selectedItem.quantity} units).
                  </div>
                )}
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Add any additional information about this movement"
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Movement
                  </>
                )}
              </button>
              <Link to="/stock-movements" className="btn btn-secondary">
                <FaTimes className="mr-2" /> Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StockMovementForm
