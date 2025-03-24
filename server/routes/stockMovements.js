const express = require('express');
const router = express.Router();
const {
  getAllStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement
} = require('../controllers/stockMovementController');

// Get all stock movements
router.get('/', getAllStockMovements);

// Get a single stock movement by ID
router.get('/:id', getStockMovementById);

// Add new stock movement
router.post('/', createStockMovement);

// Update a stock movement
router.put('/:id', updateStockMovement);

// Delete a stock movement
router.delete('/:id', deleteStockMovement);

module.exports = router; 