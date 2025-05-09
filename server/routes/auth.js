const express = require("express")
const router = express.Router()
const db = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body)
    const { username, email, password } = req.body

    // Validate input
    if (!username || !email || !password) {
      console.log("Missing required fields:", {
        username: !!username,
        email: !!email,
        password: !!password,
      })
      return res.status(400).json({
        message: "Please provide username, email, and password",
      })
    }

    console.log("Registration attempt with valid fields:", {
      username,
      email,
      passwordLength: password.length,
    })

    try {
      // Check if username or email already exists
      console.log("Checking if user exists...")
      const userCheck = await db.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email])

      if (userCheck.rows.length > 0) {
        console.log("User already exists:", userCheck.rows[0].username)
        return res.status(400).json({
          message: "Username or email already exists",
        })
      }

      console.log("User does not exist, proceeding with registration")

      // Hash the password
      console.log("Hashing password...")
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      console.log("Password hashed successfully")

      // Insert the new user
      console.log("Inserting new user into database...")
      const result = await db.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
        [username, email, hashedPassword, "user"],
      )

      const user = result.rows[0]
      console.log("User created successfully:", user.username)

      // Create JWT token
      console.log("Creating JWT token...")
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "stockmanagementsecret",
        { expiresIn: "1d" },
      )
      console.log("JWT token created successfully")

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (dbError) {
      console.error("Database error during registration:", dbError)

      // Check if it's a database constraint violation
      if (dbError.code === "23505") {
        // unique_violation
        return res.status(400).json({
          message: "Username or email already exists",
        })
      }

      // Check if the users table exists
      try {
        const tableCheck = await db.query(
          "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')",
        )
        if (!tableCheck.rows[0].exists) {
          console.error("Users table does not exist!")
          return res.status(500).json({
            message: "Database setup issue: Users table does not exist",
          })
        }
      } catch (tableCheckError) {
        console.error("Error checking if users table exists:", tableCheckError)
      }

      throw dbError
    }
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)

    // Extract username and password, handling both formats
    let username, password

    if (typeof req.body.username === "object" && req.body.username !== null) {
      // Handle case where username is an object containing both username and password
      console.log("Username is an object, extracting values")
      username = req.body.username.username
      password = req.body.username.password
    } else {
      // Normal case
      username = req.body.username
      password = req.body.password
    }

    console.log("Extracted credentials:", { username, passwordProvided: !!password })

    // Validate input
    if (!username || !password) {
      console.log("Missing required fields:", {
        username: !!username,
        password: !!password,
      })
      return res.status(400).json({
        message: "Please provide username and password",
      })
    }

    console.log("Login attempt for user:", username)

    // Check if user exists
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username])

    if (result.rows.length === 0) {
      console.log("User not found:", username)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = result.rows[0]
    console.log("User found:", user.username)

    // Check password
    console.log("Verifying password...")
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      console.log("Password does not match")
      return res.status(401).json({ message: "Invalid credentials" })
    }

    console.log("Password verified successfully")

    // Create JWT token
    console.log("Creating JWT token...")
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "stockmanagementsecret",
      { expiresIn: "1d" },
    )
    console.log("JWT token created successfully")

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({
      message: "Server error during login",
      error: err.message,
    })
  }
})

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "stockmanagementsecret")

      // Get user from database
      const result = await db.query("SELECT id, username, email, role FROM users WHERE id = $1", [decoded.id])

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json(result.rows[0])
    } catch (err) {
      return res.status(401).json({ message: "Token is not valid" })
    }
  } catch (err) {
    console.error("Get current user error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
