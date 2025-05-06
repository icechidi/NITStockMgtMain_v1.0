const db = require("../config/db")
const bcrypt = require("bcrypt")

class User {
  // Find user by username
  static async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = $1"
      const result = await db.query(query, [username])
      return result.rows[0]
    } catch (error) {
      console.error("Error finding user by username:", error)
      throw error
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1"
      const result = await db.query(query, [email])
      return result.rows[0]
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw error
    }
  }

  // Create a new user
  static async create({ username, email, password, role }) {
    try {
      // Hash the password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Insert the new user
      const query = `
        INSERT INTO users (username, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, username, email, role
      `
      const values = [username, email, hashedPassword, role || "user"]
      const result = await db.query(query, values)
      return result.rows[0]
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error("Error verifying password:", error)
      throw error
    }
  }
}

module.exports = User
