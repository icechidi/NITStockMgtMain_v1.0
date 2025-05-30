const express = require("express")
const router = express.Router()
const {
  getAllStockLocations,
  getStockLocationById,
  createStockLocation,
  updateStockLocation,
  deleteStockLocation,
} = require("../controllers/stockLocationController")

// Get all stock locations
router.get("/", getAllStockLocations)

// Get stock location by ID
router.get("/:id", getStockLocationById)

// Add new stock location
router.post("/", createStockLocation)

// Update stock location
router.put("/:id", updateStockLocation)

// Delete stock location
router.delete("/:id", deleteStockLocation)

module.exports = router
