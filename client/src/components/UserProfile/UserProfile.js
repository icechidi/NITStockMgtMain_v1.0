"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import "./UserProfile.css"

const API_URL = "http://localhost:5000/api"

const UserProfile = () => {
  // Remove 'logout' from destructuring since it's not used
  const { currentUser, login } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    profile_image: "",
    created_at: "",
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch profile")
        }

        const data = await response.json()
        setUserData(data)
        setFormData({
          username: data.username,
          email: data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Validate form
      if (!formData.username || !formData.email) {
        throw new Error("Username and email are required")
      }

      if (changePassword) {
        if (!formData.currentPassword) {
          throw new Error("Current password is required")
        }

        if (!formData.newPassword) {
          throw new Error("New password is required")
        }

        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords do not match")
        }

        if (formData.newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Prepare data for update
      const updateData = {
        username: formData.username,
        email: formData.email,
      }

      if (changePassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const data = await response.json()

      // Update local state
      setUserData(data.user)

      // Update auth context
      if (currentUser) {
        login({
          ...currentUser,
          username: data.user.username,
          email: data.user.email,
        })
      }

      setSuccess("Profile updated successfully")
      setIsEditing(false)
      setChangePassword(false)

      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]

    // Validate file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file (jpg, png, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB")
      return
    }

    try {
      setUploadingImage(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const formData = new FormData()
      formData.append("profileImage", file)

      const response = await fetch(`${API_URL}/users/profile/image`, {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upload image")
      }

      const data = await response.json()

      // Update local state with new image path
      setUserData({
        ...userData,
        profile_image: data.profileImage,
      })

      setSuccess("Profile image updated successfully")

      // Clear the file input
      e.target.value = null
    } catch (err) {
      console.error("Error uploading image:", err)
      setError(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!userData.profile_image) {
      return
    }

    if (!window.confirm("Are you sure you want to delete your profile image?")) {
      return
    }

    try {
      setUploadingImage(true)
      setError(null)
      setSuccess(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${API_URL}/users/profile/image`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete image")
      }

      // Update local state to remove image path
      setUserData({
        ...userData,
        profile_image: null,
      })

      setSuccess("Profile image deleted successfully")
    } catch (err) {
      console.error("Error deleting image:", err)
      setError(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getProfileImageUrl = () => {
    if (!userData.profile_image) return null
    return `http://localhost:5000${userData.profile_image}`
  }

  if (loading && !userData.username) {
    return <div className="profile-loading">Loading profile...</div>
  }

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      <div className="profile-content">
        <div className="profile-sidebar">
          <div
            className={`profile-avatar ${uploadingImage ? "uploading" : ""}`}
            onClick={handleImageClick}
            title="Click to change profile picture"
          >
            {uploadingImage ? (
              <div className="upload-spinner"></div>
            ) : userData.profile_image ? (
              <img src={getProfileImageUrl() || "/placeholder.svg"} alt={userData.username} className="profile-image" />
            ) : userData.username ? (
              userData.username.charAt(0).toUpperCase()
            ) : (
              "?"
            )}

            <div className="avatar-overlay">
              <span>Change</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          {userData.profile_image && (
            <button className="btn btn-link btn-delete-image" onClick={handleDeleteImage} disabled={uploadingImage}>
              Remove photo
            </button>
          )}

          <h3>{userData.username}</h3>
          <p className="profile-role">{userData.role || "User"}</p>
          <p className="profile-joined">Joined: {formatDate(userData.created_at)}</p>

          {!isEditing && (
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="password-section">
                <div className="password-header">
                  <h3>Password</h3>
                  <button type="button" className="btn btn-link" onClick={() => setChangePassword(!changePassword)}>
                    {changePassword ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {changePassword && (
                  <>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setChangePassword(false)
                    setFormData({
                      username: userData.username,
                      email: userData.email,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Username</label>
                <p>{userData.username}</p>
              </div>

              <div className="info-group">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>

              <div className="info-group">
                <label>Role</label>
                <p>{userData.role || "User"}</p>
              </div>

              <div className="info-group">
                <label>Account Created</label>
                <p>{formatDate(userData.created_at)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-activity">
        <h3>Recent Activity</h3>
        <p className="activity-empty">Activity tracking will be implemented in a future update.</p>
      </div>
    </div>
  )
}

export default UserProfile
