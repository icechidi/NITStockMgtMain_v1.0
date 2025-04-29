"use client"

import { useState } from "react"
import "./Brands.css"

function Brands() {
  const [brands, setBrands] = useState([
    { id: 1, name: "Apple", logo: "🍎", products: 25, description: "Consumer electronics and software" },
    { id: 2, name: "Samsung", logo: "📱", products: 42, description: "Electronics, appliances, and mobile devices" },
    { id: 3, name: "Dell", logo: "💻", products: 18, description: "Computers and IT equipment" },
    { id: 4, name: "HP", logo: "🖨️", products: 31, description: "Printers, computers, and IT solutions" },
    { id: 5, name: "Logitech", logo: "🖱️", products: 15, description: "Computer peripherals and accessories" },
    { id: 6, name: "Microsoft", logo: "🪟", products: 22, description: "Software and hardware products" },
    { id: 7, name: "Sony", logo: "🎮", products: 28, description: "Electronics, gaming, and entertainment" },
    { id: 8, name: "LG", logo: "📺", products: 19, description: "Electronics and home appliances" },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editBrand, setEditBrand] = useState(null)
  const [newBrand, setNewBrand] = useState({ name: "", logo: "", description: "" })

  const handleAddBrand = () => {
    // In a real app, you would send this to your backend
    const newId = Math.max(...brands.map((b) => b.id)) + 1
    setBrands([...brands, { ...newBrand, id: newId, products: 0 }])
    setNewBrand({ name: "", logo: "", description: "" })
    setShowModal(false)
  }

  const handleEditSubmit = () => {
    // In a real app, you would send this to your backend
    setBrands(brands.map((b) => (b.id === editBrand.id ? editBrand : b)))
    setEditBrand(null)
  }

  const handleDeleteBrand = (id) => {
    // In a real app, you would send this to your backend
    setBrands(brands.filter((b) => b.id !== id))
  }

  return (
    <div className="brands-container">
      <h2>Brands Management</h2>
      <p>Manage the brands of products in your inventory.</p>

      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add New Brand
      </button>

      <div className="brands-grid">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-card">
            <div className="brand-logo">{brand.logo}</div>
            <h3>{brand.name}</h3>
            <p>{brand.description}</p>
            <div className="brand-stats">
              <span>Products: {brand.products}</span>
            </div>
            <div className="brand-actions">
              <button className="btn btn-sm btn-info" onClick={() => setEditBrand(brand)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteBrand(brand.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding a New Brand */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Brand</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Logo (Emoji)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBrand.logo}
                  onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddBrand}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing a Brand */}
      {editBrand && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Brand</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editBrand.name}
                  onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Logo (Emoji)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editBrand.logo}
                  onChange={(e) => setEditBrand({ ...editBrand, logo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={editBrand.description}
                  onChange={(e) => setEditBrand({ ...editBrand, description: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleEditSubmit}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditBrand(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Brands
