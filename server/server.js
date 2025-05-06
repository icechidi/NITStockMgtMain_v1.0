const express = require("express")
const cors = require("cors")
const itemRoutes = require("./routes/items")
const stockMovementRoutes = require("./routes/stockMovements")
const authRoutes = require("./routes/auth")

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Routes
app.use("/api/items", itemRoutes)
app.use("/api/stock-movements", stockMovementRoutes)
app.use("/api/auth", authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong on the server" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
