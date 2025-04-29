"use client"

import { useState } from "react"
import "./Company.css"

function Company() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "NIT Stock Management",
    address: "123 Business Avenue, Tech City, TC 12345",
    phone: "+1 (555) 987-6543",
    email: "info@nitstockmgt.com",
    website: "www.nitstockmgt.com",
    taxId: "TAX-123456789",
    registrationNumber: "REG-987654321",
    logo: "🏢",
    established: "2020-01-15",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send the updated company info to your backend
    setIsEditing(false)
  }

  const [locations, setLocations] = useState([
    { id: 1, name: "Headquarters", address: "123 Business Avenue, Tech City, TC 12345", type: "Main Office" },
    { id: 2, name: "Warehouse A", address: "456 Storage Lane, Warehouse District, WD 54321", type: "Warehouse" },
    { id: 3, name: "Retail Store 1", address: "789 Shopping Street, Retail Row, RR 67890", type: "Store" },
  ])

  const [showLocationModal, setShowLocationModal] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: "", address: "", type: "Warehouse" })

  const handleAddLocation = () => {
    // In a real app, you would send this to your backend
    const newId = Math.max(...locations.map((l) => l.id)) + 1
    setLocations([...locations, { ...newLocation, id: newId }])
    setNewLocation({ name: "", address: "", type: "Warehouse" })
    setShowLocationModal(false)
  }

  return (
    <div className="company-container">
      <h2>Company Information</h2>

      <div className="company-content">
        <div className="company-header">
          <div className="company-logo">{companyInfo.logo}</div>
          <div className="company-title">
            <h3>{companyInfo.name}</h3>
            <p>Established: {new Date(companyInfo.established).toLocaleDateString()}</p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Company Info
            </button>
          )}
        </div>

        <div className="company-details">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Established Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="established"
                    value={companyInfo.established}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={companyInfo.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={companyInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  className="form-control"
                  name="website"
                  value={companyInfo.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tax ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taxId"
                    value={companyInfo.taxId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="registrationNumber"
                    value={companyInfo.registrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-grid">
              <div className="info-group">
                <label>Address</label>
                <p>{companyInfo.address}</p>
              </div>

              <div className="info-group">
                <label>Phone</label>
                <p>{companyInfo.phone}</p>
              </div>

              <div className="info-group">
                <label>Email</label>
                <p>{companyInfo.email}</p>
              </div>

              <div className="info-group">
                <label>Website</label>
                <p>{companyInfo.website}</p>
              </div>

              <div className="info-group">
                <label>Tax ID</label>
                <p>{companyInfo.taxId}</p>
              </div>

              <div className="info-group">
                <label>Registration Number</label>
                <p>{companyInfo.registrationNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="company-locations">
        <div className="section-header">
          <h3>Company Locations</h3>
          <button className="btn btn-primary" onClick={() => setShowLocationModal(true)}>
            Add Location
          </button>
        </div>

        <div className="locations-grid">
          {locations.map((location) => (
            <div key={location.id} className="location-card">
              <h4>{location.name}</h4>
              <p className="location-type">{location.type}</p>
              <p className="location-address">{location.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding a New Location */}
      {showLocationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Location</h3>
            <form>
              <div className="form-group">
                <label>Location Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={newLocation.type}
                  onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                >
                  <option value="Main Office">Main Office</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Store">Store</option>
                  <option value="Distribution Center">Distribution Center</option>
                </select>
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddLocation}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowLocationModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Company
