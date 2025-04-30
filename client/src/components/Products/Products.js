"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaList, FaTh, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa"
import "./Products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  })

  // Categories
  const categories = ["All Categories", "Electronics", "Office Supplies", "Furniture", "IT Equipment", "Tools"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockProducts = [
        {
          id: 1,
          name: "Dell XPS 15 Laptop",
          category: "Electronics",
          quantity: 25,
          price: 1299.99,
          status: "In Stock",
          icon: "💻",
        },
        {
          id: 2,
          name: "HP LaserJet Printer",
          category: "IT Equipment",
          quantity: 8,
          price: 349.99,
          status: "Low Stock",
          icon: "🖨️",
        },
        {
          id: 3,
          name: "Office Desk Chair",
          category: "Furniture",
          quantity: 15,
          price: 199.99,
          status: "In Stock",
          icon: "🪑",
        },
        {
          id: 4,
          name: "Wireless Mouse",
          category: "IT Equipment",
          quantity: 42,
          price: 29.99,
          status: "In Stock",
          icon: "🖱️",
        },
        {
          id: 5,
          name: "Mechanical Keyboard",
          category: "IT Equipment",
          quantity: 0,
          price: 89.99,
          status: "Out of Stock",
          icon: "⌨️",
        },
        {
          id: 6,
          name: "27-inch Monitor",
          category: "Electronics",
          quantity: 12,
          price: 249.99,
          status: "In Stock",
          icon: "🖥️",
        },
        {
          id: 7,
          name: "Stapler",
          category: "Office Supplies",
          quantity: 50,
          price: 5.99,
          status: "In Stock",
          icon: "📎",
        },
        {
          id: 8,
          name: "Paper Shredder",
          category: "Office Supplies",
          quantity: 7,
          price: 79.99,
          status: "Low Stock",
          icon: "🗑️",
        },
      ]

      setProducts(mockProducts)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again.")
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      status: "",
      search: "",
    })
    setCurrentPage(1)
  }

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleDeleteProduct = (id) => {
    // In a real app, you would call your API to delete the product
    setProducts(products.filter((product) => product.id !== id))
  }

  // Apply filters
  const filteredProducts = products.filter((product) => {
    return (
      (filters.category === "" || product.category === filters.category) &&
      (filters.status === "" || product.status === filters.status) &&
      (filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase()))
    )
  })

  // Pagination
  const productsPerPage = 8
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "status-in-stock"
      case "Low Stock":
        return "status-low-stock"
      case "Out of Stock":
        return "status-out-of-stock"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">Products</h2>
        <div className="d-flex gap-3">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <FaTh /> Grid
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <FaList /> List
            </button>
          </div>
          <Link to="/products/new" className="btn btn-primary">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      <div className="products-filters">
        <div className="filters-header">
          <h5 className="filters-title">Filters</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
        <div className="filters-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.slice(1).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              className="form-control"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-stats">
                  <div className="product-stat">
                    <p className="stat-value">{product.quantity}</p>
                    <p className="stat-label">In Stock</p>
                  </div>
                  <div className="product-stat">
                    <p className="stat-value">${product.price}</p>
                    <p className="stat-label">Price</p>
                  </div>
                  <div className="product-stat">
                    <span className={`status-badge ${getStatusClass(product.status)}`}>{product.status}</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewProduct(product)}>
                    <FaEye /> View
                  </button>
                  <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-outline-secondary">
                    <FaEdit /> Edit
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(product.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-list">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-list-item">
              <div className="product-list-image">{product.icon}</div>
              <div className="product-list-details">
                <h3 className="product-list-name">{product.name}</h3>
                <div className="product-list-info">
                  <span className="product-list-stat">Category: {product.category}</span>
                  <span className="product-list-stat">Quantity: {product.quantity}</span>
                  <span className="product-list-stat">Price: ${product.price}</span>
                  <span className={`status-badge ${getStatusClass(product.status)}`}>{product.status}</span>
                </div>
              </div>
              <div className="product-list-actions">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewProduct(product)}>
                  <FaEye />
                </button>
                <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-outline-secondary">
                  <FaEdit />
                </Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(product.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Product Details</h5>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <div style={{ fontSize: "4rem" }}>{selectedProduct.icon}</div>
              </div>
              <h3>{selectedProduct.name}</h3>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedProduct.quantity}
              </p>
              <p>
                <strong>Price:</strong> ${selectedProduct.price}
              </p>
              <p>
                <strong>Status:</strong>
                <span className={`status-badge ${getStatusClass(selectedProduct.status)}`}>
                  {selectedProduct.status}
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <Link to={`/products/${selectedProduct.id}/edit`} className="btn btn-primary">
                Edit Product
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

export default Products
