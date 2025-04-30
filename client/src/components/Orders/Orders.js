"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaEye, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa"
import "./Orders.css"

function Orders() {
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showNewOrderForm, setShowNewOrderForm] = useState(false)

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    items: [{ product: "", quantity: 1, price: 0 }],
  })

  // Available products for order form
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

    { id: 1, name: "Dell XPS 15 Laptop", price: 1299.99 },
    { id: 2, name: "HP LaserJet Printer", price: 349.99 },
    { id: 3, name: "Office Desk Chair", price: 199.99 },
    { id: 4, name: "Wireless Mouse", price: 29.99 },
    { id: 5, name: "Mechanical Keyboard", price: 89.99 },
  ])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockOrders = [
        {
          id: "ORD-001",
          date: "2025-04-28",
          customer: {
            name: "John Doe",
            email: "john.doe@example.com",
          },
          items: [
            { name: "Dell XPS 15 Laptop", quantity: 1, price: 1299.99 },
            { name: "Wireless Mouse", quantity: 2, price: 29.99 },
          ],
          total: 1359.97,
          status: "Pending",
        },
        {
          id: "ORD-002",
          date: "2025-04-27",
          customer: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
          items: [
            { name: "Office Desk Chair", quantity: 1, price: 199.99 },
            { name: "Mechanical Keyboard", quantity: 1, price: 89.99 },
          ],
          total: 289.98,
          status: "Processing",
        },
        {
          id: "ORD-003",
          date: "2025-04-26",
          customer: {
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
          },
          items: [{ name: "HP LaserJet Printer", quantity: 1, price: 349.99 }],
          total: 349.99,
          status: "Shipped",
        },
        {
          id: "ORD-004",
          date: "2025-04-25",
          customer: {
            name: "Emily Davis",
            email: "emily.davis@example.com",
          },
          items: [
            { name: "Dell XPS 15 Laptop", quantity: 2, price: 1299.99 },
            { name: "Wireless Mouse", quantity: 2, price: 29.99 },
            { name: "Mechanical Keyboard", quantity: 2, price: 89.99 },
          ],
          total: 2839.94,
          status: "Delivered",
        },
        {
          id: "ORD-005",
          date: "2025-04-24",
          customer: {
            name: "Michael Wilson",
            email: "michael.wilson@example.com",
          },
          items: [{ name: "Office Desk Chair", quantity: 5, price: 199.99 }],
          total: 999.95,
          status: "Cancelled",
        },
      ]

      setOrders(mockOrders)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
      setLoading(false)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleDeleteOrder = (id) => {
    // In a real app, you would call your API to delete the order
    setOrders(orders.filter((order) => order.id !== id))
  }

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { product: "", quantity: 1, price: 0 }],
    })
  }

  const handleRemoveItem = (index) => {
    const updatedItems = [...newOrder.items]
    updatedItems.splice(index, 1)
    setNewOrder({
      ...newOrder,
      items: updatedItems,
    })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items]

    if (field === "product") {
      const selectedProduct = products.find((p) => p.id === Number.parseInt(value))
      updatedItems[index] = {
        ...updatedItems[index],
        product: value,
        price: selectedProduct ? selectedProduct.price : 0,
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }
    }

    setNewOrder({
      ...newOrder,
      items: updatedItems,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewOrder({
      ...newOrder,
      [name]: value,
    })
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()

    // In a real app, you would call your API to create the order
    const newOrderId = `ORD-${String(orders.length + 1).padStart(3, "0")}`

    const orderItems = newOrder.items.map((item) => {
      const product = products.find((p) => p.id === Number.parseInt(item.product))
      return {
        name: product ? product.name : "Unknown Product",
        quantity: Number.parseInt(item.quantity),
        price: Number.parseFloat(item.price),
      }
    })

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const createdOrder = {
      id: newOrderId,
      date: new Date().toISOString().split("T")[0],
      customer: {
        name: newOrder.customerName,
        email: newOrder.customerEmail,
      },
      items: orderItems,
      total,
      status: "Pending",
    }

    setOrders([createdOrder, ...orders])
    setShowNewOrderForm(false)
    setNewOrder({
      customerName: "",
      customerEmail: "",
      items: [{ product: "", quantity: 1, price: 0 }],
    })
  }

  const calculateTotal = () => {
    return newOrder.items
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price) || 0
        const quantity = Number.parseInt(item.quantity) || 0
        return total + price * quantity
      }, 0)
      .toFixed(2)
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return order.status === "Pending"
    if (activeTab === "processing") return order.status === "Processing"
    if (activeTab === "shipped") return order.status === "Shipped"
    if (activeTab === "delivered") return order.status === "Delivered"
    if (activeTab === "cancelled") return order.status === "Cancelled"
    return false
  })

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Processing":
        return "status-processing"
      case "Shipped":
        return "status-shipped"
      case "Delivered":
        return "status-delivered"
      case "Cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (showNewOrderForm) {
    return (
      <div className="orders-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Create New Order</h2>
          <button className="btn btn-outline-secondary" onClick={() => setShowNewOrderForm(false)}>
            Back to Orders
          </button>
        </div>

        <div className="new-order-form">
          <form onSubmit={handleSubmitOrder}>
            <div className="form-section">
              <h3 className="form-section-title">Customer Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className="form-control"
                    value={newOrder.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customerEmail">Customer Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    className="form-control"
                    value={newOrder.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Order Items</h3>
              <div className="order-items-list">
                {newOrder.items.map((item, index) => (
                  <div key={index} className="order-item-form">
                    <div className="item-form-header">
                      <h4 className="item-form-title">Item #{index + 1}</h4>
                      {newOrder.items.length > 1 && (
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
                              {product.name} - ${product.price}
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
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-outline-primary" onClick={handleAddItem}>
                <FaPlus /> Add Another Item
              </button>
            </div>

            <div className="form-section">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="form-section-title">Order Summary</h3>
                <h4>Total: ${calculateTotal()}</h4>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewOrderForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Orders</h2>
        <button className="btn btn-primary" onClick={() => setShowNewOrderForm(true)}>
          <FaPlus /> New Order
        </button>
      </div>

      <div className="orders-tabs">
        <div className={`orders-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          All Orders
        </div>
        <div
          className={`orders-tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </div>
        <div
          className={`orders-tab ${activeTab === "processing" ? "active" : ""}`}
          onClick={() => setActiveTab("processing")}
        >
          Processing
        </div>
        <div
          className={`orders-tab ${activeTab === "shipped" ? "active" : ""}`}
          onClick={() => setActiveTab("shipped")}
        >
          Shipped
        </div>
        <div
          className={`orders-tab ${activeTab === "delivered" ? "active" : ""}`}
          onClick={() => setActiveTab("delivered")}
        >
          Delivered
        </div>
        <div
          className={`orders-tab ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3 className="order-id">{order.id}</h3>
                <span className="order-date">{order.date}</span>
              </div>
              <div className="order-body">
                <div className="order-customer">
                  <p className="customer-name">{order.customer.name}</p>
                  <p className="customer-email">{order.customer.email}</p>
                </div>
                <div className="order-items">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="order-item">
                      <span className="item-name">+ {order.items.length - 2} more items</span>
                    </div>
                  )}
                </div>
                <div className="order-total">Total: ${order.total.toFixed(2)}</div>
              </div>
              <div className="order-footer">
                <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                <div className="order-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewOrder(order)}>
                    <FaEye />
                  </button>
                  <Link to={`/orders/${order.id}/edit`} className="btn btn-sm btn-outline-secondary">
                    <FaEdit />
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOrder(order.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBoxOpen />
          </div>
          <h3 className="empty-title">No Orders Found</h3>
          <p className="empty-message">
            {activeTab === "all" ? "You haven't created any orders yet." : `You don't have any ${activeTab} orders.`}
          </p>
          <button className="btn btn-primary" onClick={() => setShowNewOrderForm(true)}>
            <FaPlus /> Create Your First Order
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details - {selectedOrder.id}</h5>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <h6>Order Information</h6>
                <p>
                  <strong>Date:</strong> {selectedOrder.date}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </p>
              </div>

              <div className="mb-4">
                <h6>Customer Information</h6>
                <p>
                  <strong>Name:</strong> {selectedOrder.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customer.email}
                </p>
              </div>

              <div className="mb-4">
                <h6>Order Items</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Total:</strong>
                      </td>
                      <td>
                        <strong>${selectedOrder.total.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <Link to={`/orders/${selectedOrder.id}/edit`} className="btn btn-primary">
                Edit Order
              </Link>
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

export default Orders
