const pool = require("../config/db")
const Item = require("../models/Item")

const getAllItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stock_items_view ORDER BY id DESC")
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching items:", err)
    res.status(500).json({ error: err.message })
  }
}

const getItemById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }
    const item = Item.fromDB(result.rows[0])
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const createItem = async (req, res) => {
  try {
    const { name, description, quantity, unit_price, location_id, min_quantity = 10, category } = req.body

    // Validate required fields
    if (!name || quantity === undefined || unit_price === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Ensure numeric values are valid
    const numericQuantity = Number(quantity)
    const numericUnitPrice = Number(unit_price)
    const numericMinQuantity = Number(min_quantity)

    if (isNaN(numericQuantity) || isNaN(numericUnitPrice) || isNaN(numericMinQuantity)) {
      return res.status(400).json({ error: "Invalid numeric values" })
    }

    // Determine status based on quantity vs min_quantity
    const status = numericQuantity <= numericMinQuantity ? "Low Stock" : "In Stock"

    const result = await pool.query(
      `INSERT INTO items 
       (name, description, quantity, unit_price, location_id, min_quantity, category, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, description || "", numericQuantity, numericUnitPrice, location_id, numericMinQuantity, category, status],
    )

    const newItem = Item.fromDB(result.rows[0])
    res.status(201).json(newItem)
  } catch (err) {
    console.error("Database error:", err)
    res.status(500).json({ error: "Failed to create item" })
  }
}

const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, quantity, unit_price } = req.body

    // Validate required fields
    if (!name || quantity === undefined || unit_price === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Ensure numeric values are valid
    const numericQuantity = Number(quantity)
    const numericUnitPrice = Number(unit_price)

    if (isNaN(numericQuantity) || isNaN(numericUnitPrice)) {
      return res.status(400).json({ error: "Invalid quantity or unit price" })
    }

    const result = await pool.query(
      "UPDATE items SET name = $1, description = $2, quantity = $3, unit_price = $4 WHERE id = $5 RETURNING *",
      [name, description || "", numericQuantity, numericUnitPrice, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    const updatedItem = Item.fromDB(result.rows[0])
    res.json(updatedItem)
  } catch (err) {
    console.error("Database error:", err)
    res.status(500).json({ error: "Failed to update item" })
  }
}

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }
    res.json({ message: "Item deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
}
