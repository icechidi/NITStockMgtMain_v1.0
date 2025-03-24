const pool = require('../config/db');
const StockMovement = require('../models/StockMovement');

const getAllStockMovements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sm.*, i.name as item_name 
      FROM stock_movements sm 
      JOIN items i ON sm.item_id = i.id 
      ORDER BY sm.movement_date DESC
    `);
    const movements = result.rows.map(row => ({
      ...StockMovement.fromDB(row),
      item_name: row.item_name
    }));
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStockMovementById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM stock_movements WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    const movement = StockMovement.fromDB(result.rows[0]);
    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStockMovement = async (req, res) => {
  try {
    const { item_id, movement_type, quantity, notes } = req.body;
    
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create stock movement
      const movementResult = await client.query(
        'INSERT INTO stock_movements (item_id, movement_type, quantity, notes, transaction_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
        [item_id, movement_type, quantity, notes]
      );

      // Update item quantity
      const quantityChange = movement_type === 'IN' ? quantity : -quantity;
      await client.query(
        'UPDATE items SET quantity = quantity + $1 WHERE id = $2',
        [quantityChange, item_id]
      );

      await client.query('COMMIT');
      res.status(201).json(movementResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating stock movement:', err);
    res.status(500).json({ error: 'Failed to create stock movement' });
  }
};

const updateStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_id, movement_type, quantity, notes } = req.body;
    const result = await pool.query(
      'UPDATE stock_movements SET item_id = $1, movement_type = $2, quantity = $3, notes = $4 WHERE id = $5 RETURNING *',
      [item_id, movement_type, quantity, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM stock_movements WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    res.json({ message: 'Stock movement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement
}; 