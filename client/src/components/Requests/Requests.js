"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaCheck, FaClipboard, FaTimes, FaClock, FaEye } from "react-icons/fa"
import "./Requests.css"

function Requests() {
  const [activeTab, setActiveTab] = useState("all")
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)

  // New request form state
  const [newRequest, setNewRequest] = useState({
    requesterName: "",
    requesterEmail: "",
    department: "",
    items: [{ product: "", quantity: 1, reason: "" }],
    urgency: "normal",
    notes: "",
  })

  // Available products for request form
  const [products, setProducts] = useState([

    useEffect(() => {
      setProducts([
        { id: 1, name: "Dell XPS 15 Laptop", price: 1299.99 },
        { id: 2, name: "HP LaserJet Printer", price: 349.99 },
        { id: 3, name: "Office Desk Chair", price: 199.99 },
        { id: 4, name: "Wireless Mouse", price: 29.99 },
        { id: 5, name: "Mechanical Keyboard", price: 89.99 },
      ])
      }, []),

    { id: 1, name: "Dell XPS 15 Laptop", category: "Electronics" },
    { id: 2, name: "HP LaserJet Printer", category: "IT Equipment" },
    { id: 3, name: "Office Desk Chair", category: "Furniture" },
    { id: 4, name: "Wireless Mouse", category: "IT Equipment" },
    { id: 5, name: "Mechanical Keyboard", category: "IT Equipment" },
    { id: 6, name: "Whiteboard Markers", category: "Office Supplies" },
    { id: 7, name: "Notebooks", category: "Office Supplies" },
    { id: 8, name: "Stapler", category: "Office Supplies" },
  ])

  // Departments
  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
    "Customer Support",
    "Research & Development",
  ]

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockRequests = [
        {
          id: "REQ-001",
          date: "2025-04-28",
          requester: {
            name: "John Doe",
            email: "john.doe@example.com",
            department: "IT",
          },
          items: [
            { name: "Dell XPS 15 Laptop", quantity: 1, reason: "New hire equipment" },
            { name: "Wireless Mouse", quantity: 2, reason: "Replacement for broken equipment" },
          ],
          urgency: "high",
          notes: "Needed for new employee starting next week",
          status: "Pending",
        },
        {
          id: "REQ-002",
          date: "2025-04-27",
          requester: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            department: "Marketing",
          },
          items: [
            { name: "Whiteboard Markers", quantity: 10, reason: "Team brainstorming sessions" },
            { name: "Notebooks", quantity: 5, reason: "Team meeting notes" },
          ],
          urgency: "normal",
          notes: "",
          status: "Approved",
        },
        {
          id: "REQ-003",
          date: "2025-04-26",
          requester: {
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            department: "Finance",
          },
          items: [{ name: "HP LaserJet Printer", quantity: 1, reason: "Department needs dedicated printer" }],
          urgency: "low",
          notes: "Can be delivered anytime in the next month",
          status: "Rejected",
        },
        {
          id: "REQ-004",
          date: "2025-04-25",
          requester: {
            name: "Emily Davis",
            email: "emily.davis@example.com",
            department: "HR",
          },
          items: [{ name: "Office Desk Chair", quantity: 3, reason: "Ergonomic requirements" }],
          urgency: "high",
          notes: "Required for employees with medical accommodations",
          status: "Fulfilled",
        },
      ]

      setRequests(mockRequests)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setError("Failed to load requests. Please try again.")
      setLoading(false)
    }
  }

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  // const handleDeleteRequest = (id) => {
  //   // In a real app, you would call your API to delete the request
  //   setRequests(requests.filter((request) => request.id !== id))
  // }

  const handleAddItem = () => {
    setNewRequest({
      ...newRequest,
      items: [...newRequest.items, { product: "", quantity: 1, reason: "" }],
    })
  }

  const handleRemoveItem = (index) => {
    const updatedItems = [...newRequest.items]
    updatedItems.splice(index, 1)
    setNewRequest({
      ...newRequest,
      items: updatedItems,
    })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newRequest.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    setNewRequest({
      ...newRequest,
      items: updatedItems,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRequest({
      ...newRequest,
      [name]: value,
    })
  }

  const handleSubmitRequest = (e) => {
    e.preventDefault()

    // In a real app, you would call your API to create the request
    const newRequestId = `REQ-${String(requests.length + 1).padStart(3, "0")}`

    const requestItems = newRequest.items.map((item) => {
      const product = products.find((p) => p.id === Number.parseInt(item.product))
      return {
        name: product ? product.name : "Unknown Product",
        quantity: Number.parseInt(item.quantity),
        reason: item.reason,
      }
    })

    const createdRequest = {
      id: newRequestId,
      date: new Date().toISOString().split("T")[0],
      requester: {
        name: newRequest.requesterName,
        email: newRequest.requesterEmail,
        department: newRequest.department,
      },
      items: requestItems,
      urgency: newRequest.urgency,
      notes: newRequest.notes,
      status: "Pending",
    }

    setRequests([createdRequest, ...requests])
    setShowNewRequestForm(false)
    setNewRequest({
      requesterName: "",
      requesterEmail: "",
      department: "",
      items: [{ product: "", quantity: 1, reason: "" }],
      urgency: "normal",
      notes: "",
    })
  }

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return request.status === "Pending"
    if (activeTab === "approved") return request.status === "Approved"
    if (activeTab === "rejected") return request.status === "Rejected"
    if (activeTab === "fulfilled") return request.status === "Fulfilled"
    return false
  })

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Approved":
        return "status-approved"
      case "Rejected":
        return "status-rejected"
      case "Fulfilled":
        return "status-fulfilled"
      default:
        return ""
    }
  }

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "low":
        return "urgency-low"
      case "normal":
        return "urgency-normal"
      case "high":
        return "urgency-high"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading requests...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (showNewRequestForm) {
    return (
      <div className="requests-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Create New Request</h2>
          <button className="btn btn-outline-secondary" onClick={() => setShowNewRequestForm(false)}>
            Back to Requests
          </button>
        </div>

        <div className="new-request-form">
          <form onSubmit={handleSubmitRequest}>
            <div className="form-section">
              <h3 className="form-section-title">Requester Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="requesterName">Name</label>
                  <input
                    type="text"
                    id="requesterName"
                    name="requesterName"
                    className="form-control"
                    value={newRequest.requesterName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="requesterEmail">Email</label>
                  <input
                    type="email"
                    id="requesterEmail"
                    name="requesterEmail"
                    className="form-control"
                    value={newRequest.requesterEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={newRequest.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Requested Items</h3>
              <div className="request-items-list">
                {newRequest.items.map((item, index) => (
                  <div key={index} className="request-item-form">
                    <div className="item-form-header">
                      <h4 className="item-form-title">Item #{index + 1}</h4>
                      {newRequest.items.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`product-${index}`}>Product</label>
                        <select
                          id={`product-${index}`}
                          className="form-select"
                          value={item.product}
                          onChange={(e) => handleItemChange(index, "product", e.target.value)}
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor={`quantity-${index}`}>Quantity</label>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`reason-${index}`}>Reason for Request</label>
                      <input
                        type="text"
                        id={`reason-${index}`}
                        className="form-control"
                        value={item.reason}
                        onChange={(e) => handleItemChange(index, "reason", e.target.value)}
                        placeholder="Why is this item needed?"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-outline-primary" onClick={handleAddItem}>
                <FaPlus /> Add Another Item
              </button>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Additional Information</h3>
              <div className="form-group">
                <label htmlFor="urgency">Urgency Level</label>
                <select
                  id="urgency"
                  name="urgency"
                  className="form-select"
                  value={newRequest.urgency}
                  onChange={handleInputChange}
                >
                  <option value="low">Low - Within a month</option>
                  <option value="normal">Normal - Within two weeks</option>
                  <option value="high">High - As soon as possible</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={newRequest.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional information about this request"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewRequestForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="requests-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Item Requests</h2>
        <button className="btn btn-primary" onClick={() => setShowNewRequestForm(true)}>
          <FaPlus /> New Request
        </button>
      </div>

      <div className="requests-tabs">
        <div className={`requests-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          All Requests
        </div>
        <div
          className={`requests-tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </div>
        <div
          className={`requests-tab ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </div>
        <div
          className={`requests-tab ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </div>
        <div
          className={`requests-tab ${activeTab === "fulfilled" ? "active" : ""}`}
          onClick={() => setActiveTab("fulfilled")}
        >
          Fulfilled
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="requests-grid">
          {filteredRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3 className="request-id">{request.id}</h3>
                <span className="request-date">{request.date}</span>
              </div>
              <div className="request-body">
                <div className="request-requester">
                  <p className="requester-name">{request.requester.name}</p>
                  <p className="requester-department">{request.requester.department}</p>
                </div>
                <div className="request-items">
                  {request.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="request-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                  {request.items.length > 2 && (
                    <div className="request-item">
                      <span className="item-name">+ {request.items.length - 2} more items</span>
                    </div>
                  )}
                </div>
                <div className="request-urgency">
                  <span className={`urgency-badge ${getUrgencyClass(request.urgency)}`}>
                    {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="request-footer">
                <span className={`status-badge ${getStatusClass(request.status)}`}>{request.status}</span>
                <div className="request-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewRequest(request)}>
                    <FaEye />
                  </button>
                  {request.status === "Pending" && (
                    <>
                      <button className="btn btn-sm btn-outline-success">
                        <FaCheck />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {request.status === "Approved" && (
                    <button className="btn btn-sm btn-outline-success">
                      <FaClock /> Fulfill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaClipboard />
          </div>
          <h3 className="empty-state-message">No requests found.</h3>
          <button className="btn btn-primary" onClick={() => setShowNewRequestForm(true)}>
            <FaPlus /> Create New Request
          </button>
        </div>
      )}

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request Details - {selectedRequest.id}</h5>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <h6>Request Information</h6>
                <p>
                  <strong>Date:</strong> {selectedRequest.date}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${getStatusClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </p>
                <p>
                  <strong>Urgency:</strong>
                  <span className={`urgency-badge ${getUrgencyClass(selectedRequest.urgency)}`}>
                    {selectedRequest.urgency.charAt(0).toUpperCase() + selectedRequest.urgency.slice(1)}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h6>Requester Information</h6>
                <p>
                  <strong>Name:</strong> {selectedRequest.requester.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRequest.requester.email}
                </p>
                <p>
                  <strong>Department:</strong> {selectedRequest.requester.department}
                </p>
              </div>

              <div className="mb-4">
                <h6>Requested Items</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h6>Notes</h6>
                <p>{selectedRequest.notes || "No notes provided."}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Requests
