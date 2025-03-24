const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');
const stockMovementRoutes = require('./routes/stockMovements');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/stock-movements', stockMovementRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 