"use client"

import { useState } from "react"
import "./Groups.css"

function Groups() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Electronics", description: "Electronic devices and components", itemCount: 45 },
    { id: 2, name: "Office Supplies", description: "Office stationery and supplies", itemCount: 78 },
    { id: 3, name: "Furniture", description: "Office and home furniture", itemCount: 23 },
    { id: 4, name: "IT Equipment", description: "Computers, servers, and networking equipment", itemCount: 56 },
    { id: 5, name: "Tools", description: "Hand and power tools", itemCount: 34 },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editGroup, setEditGroup] = useState(null)
  const [newGroup, setNewGroup] = useState({ name: "", description: "" })

  const handleAddGroup = () => {
    // In a real app, you would send this to your backend
    const newId = Math.max(...groups.map((g) => g.id)) + 1
    setGroups([...groups, { ...newGroup, id: newId, itemCount: 0 }])
    setNewGroup({ name: "", description: "" })
    setShowModal(false)
  }

  const handleEditSubmit = () => {
    // In a real app, you would send this to your backend
    setGroups(groups.map((g) => (g.id === editGroup.id ? editGroup : g)))
    setEditGroup(null)
  }

  const handleDeleteGroup = (id) => {
    // In a real app, you would send this to your backend
    setGroups(groups.filter((g) => g.id !== id))
  }

  return (
    <div className="groups-container">
      <h2>Item Groups</h2>
      <p>Manage your inventory groups to better organize your items.</p>

      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Add New Group
      </button>

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            <div className="group-stats">
              <span>Items: {group.itemCount}</span>
            </div>
            <div className="group-actions">
              <button className="btn btn-sm btn-info" onClick={() => setEditGroup(group)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGroup(group.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding a New Group */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Group</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleAddGroup}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing a Group */}
      {editGroup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Group</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editGroup.name}
                  onChange={(e) => setEditGroup({ ...editGroup, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={editGroup.description}
                  onChange={(e) => setEditGroup({ ...editGroup, description: e.target.value })}
                ></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleEditSubmit}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditGroup(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups
