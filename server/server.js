const express = require("express")
const cors = require("cors")
const itemRoutes = require("./routes/items")
const stockMovementRoutes = require("./routes/stockMovements")

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  // Only log the method and path, not the full URL to keep logs cleaner
  console.log(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use("/api/items", itemRoutes)
app.use("/api/stock-movements", stockMovementRoutes)

// Database connection logging
const pool = require("./config/db")
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err)
  } else {
    console.log("Database connected successfully")
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
