const express = require('express');
const router = express.Router();
const { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem 
} = require('../controllers/itemController');

// Get all items
router.get('/', getAllItems);

// Get item by ID
router.get('/:id', getItemById);

// Add new item
router.post('/', createItem);

// Update item
router.put('/:id', updateItem);

// Delete item
router.delete('/:id', deleteItem);

module.exports = router; 