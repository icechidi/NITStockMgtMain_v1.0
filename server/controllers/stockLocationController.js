const pool = require("../config/db")
const StockLocation = require("../models/StockLocation")

const getAllStockLocations = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stock_locations ORDER BY location_name")
    const locations = result.rows.map((row) => StockLocation.fromDB(row))
    res.json(locations)
  } catch (err) {
    console.error("Error fetching stock locations:", err)
    res.status(500).json({ error: err.message })
  }
}

const getStockLocationById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM stock_locations WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stock location not found" })
    }
    const location = StockLocation.fromDB(result.rows[0])
    res.json(location)
  } catch (err) {
    console.error("Error fetching stock location:", err)
    res.status(500).json({ error: err.message })
  }
}

const createStockLocation = async (req, res) => {
  try {
    const { location_name, total_items = 0, total_value = 0 } = req.body

    // Validate required fields
    if (!location_name) {
      return res.status(400).json({ error: "Location name is required" })
    }

    // Check if location already exists
    const existingLocation = await pool.query("SELECT id FROM stock_locations WHERE location_name = $1", [
      location_name,
    ])

    if (existingLocation.rows.length > 0) {
      return res.status(400).json({ error: "Location name already exists" })
    }

    const result = await pool.query(
      `INSERT INTO stock_locations 
       (location_name, total_items, low_stock_items, total_value) 
       VALUES ($1, $2, 0, $3) 
       RETURNING *`,
      [location_name, Number(total_items) || 0, Number(total_value) || 0],
    )

    const newLocation = StockLocation.fromDB(result.rows[0])
    res.status(201).json(newLocation)
  } catch (err) {
    console.error("Database error:", err)
    if (err.code === "23505") {
      // Unique constraint violation
      res.status(400).json({ error: "Location name already exists" })
    } else {
      res.status(500).json({ error: "Failed to create stock location" })
    }
  }
}

const updateStockLocation = async (req, res) => {
  try {
    const { id } = req.params
    const { location_name, total_items, low_stock_items, total_value } = req.body

    // Validate required fields
    if (!location_name) {
      return res.status(400).json({ error: "Location name is required" })
    }

    const result = await pool.query(
      `UPDATE stock_locations 
       SET location_name = $1, total_items = $2, low_stock_items = $3, total_value = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [location_name, Number(total_items) || 0, Number(low_stock_items) || 0, Number(total_value) || 0, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stock location not found" })
    }

    const updatedLocation = StockLocation.fromDB(result.rows[0])
    res.json(updatedLocation)
  } catch (err) {
    console.error("Database error:", err)
    if (err.code === "23505") {
      res.status(400).json({ error: "Location name already exists" })
    } else {
      res.status(500).json({ error: "Failed to update stock location" })
    }
  }
}

const deleteStockLocation = async (req, res) => {
  try {
    const { id } = req.params

    // Check if location has items
    const itemsCheck = await pool.query("SELECT COUNT(*) as count FROM items WHERE location_id = $1", [id])
    if (itemsCheck.rows[0].count > 0) {
      return res.status(400).json({ error: "Cannot delete location with existing items" })
    }

    const result = await pool.query("DELETE FROM stock_locations WHERE id = $1 RETURNING *", [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stock location not found" })
    }
    res.json({ message: "Stock location deleted successfully" })
  } catch (err) {
    console.error("Error deleting stock location:", err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllStockLocations,
  getStockLocationById,
  createStockLocation,
  updateStockLocation,
  deleteStockLocation,
}
