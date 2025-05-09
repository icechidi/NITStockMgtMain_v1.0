const express = require("express")
const router = express.Router()
const pool = require("../config/db")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const upload = require("../config/upload")
const fs = require("fs")
const path = require("path")

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const result = await pool.query(
      "SELECT id, username, email, role, profile_image, created_at FROM users WHERE id = $1",
      [userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { username, email, currentPassword, newPassword } = req.body

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" })
    }

    // Check if username or email already exists (excluding current user)
    const checkResult = await pool.query("SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3", [
      username,
      email,
      userId,
    ])

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        message: "Username or email already in use by another account",
      })
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password",
        })
      }

      // Get current user data to verify password
      const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId])

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" })
      }

      const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password)

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update user with new password
      await pool.query("UPDATE users SET username = $1, email = $2, password = $3, updated_at = NOW() WHERE id = $4", [
        username,
        email,
        hashedPassword,
        userId,
      ])
    } else {
      // Update user without changing password
      await pool.query("UPDATE users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3", [
        username,
        email,
        userId,
      ])
    }

    // Get updated user data
    const updatedUser = await pool.query(
      "SELECT id, username, email, role, profile_image, created_at FROM users WHERE id = $1",
      [userId],
    )

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.rows[0],
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Upload profile image
router.post("/profile/image", auth, upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    const userId = req.user.id
    const imagePath = `/uploads/profiles/${req.file.filename}`

    // Get current profile image to delete old one if exists
    const currentUser = await pool.query("SELECT profile_image FROM users WHERE id = $1", [userId])

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const oldImagePath = currentUser.rows[0].profile_image

    // Update user with new profile image
    await pool.query("UPDATE users SET profile_image = $1, updated_at = NOW() WHERE id = $2", [imagePath, userId])

    // Delete old profile image if exists
    if (oldImagePath) {
      const fullOldPath = path.join(__dirname, "..", oldImagePath.replace(/^\//, ""))

      // Check if file exists before attempting to delete
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath)
      }
    }

    res.json({
      message: "Profile image updated successfully",
      profileImage: imagePath,
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)

    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads/profiles", req.file.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    res.status(500).json({ message: "Server error" })
  }
})

// Delete profile image
router.delete("/profile/image", auth, async (req, res) => {
  try {
    const userId = req.user.id

    // Get current profile image
    const currentUser = await pool.query("SELECT profile_image FROM users WHERE id = $1", [userId])

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const imagePath = currentUser.rows[0].profile_image

    if (!imagePath) {
      return res.status(400).json({ message: "No profile image to delete" })
    }

    // Update user to remove profile image reference
    await pool.query("UPDATE users SET profile_image = NULL, updated_at = NOW() WHERE id = $1", [userId])

    // Delete the image file
    const fullPath = path.join(__dirname, "..", imagePath.replace(/^\//, ""))

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }

    res.json({ message: "Profile image deleted successfully" })
  } catch (error) {
    console.error("Error deleting profile image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
