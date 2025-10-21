// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors()); // allow requests from your client (adjust origin in production)
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // uncomment if needed for your environment
});

// GET /api/items - returns { items, locations }
app.get("/api/items", async (req, res) => {
  const client = await pool.connect();
  try {
    const itemsQ = `
      SELECT i.id, i.name, i.description, i.quantity, i.min_quantity, i.unit_price, i.created_at, l.location
      FROM items i
      LEFT JOIN locations l ON i.location_id = l.id
      ORDER BY i.id
    `;
    const locQ = `SELECT id, location, total_items, low_stock, total_value FROM locations ORDER BY id`;

    const [itemsRes, locsRes] = await Promise.all([client.query(itemsQ), client.query(locQ)]);
    const items = itemsRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      quantity: Number(r.quantity),
      minQuantity: Number(r.min_quantity),
      unit_price: Number(r.unit_price),
      location: r.location || null,
      created_at: r.created_at,
    }));
    const locations = locsRes.rows.map((r) => ({
      id: r.id,
      location: r.location,
      totalItems: Number(r.total_items),
      lowStock: Number(r.low_stock),
      value: Number(r.total_value),
    }));

    res.json({ items, locations });
  } catch (err) {
    console.error("GET /api/items error", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// POST /api/locations - add a location
app.post("/api/locations", async (req, res) => {
  const { location, total_items = 0, total_value = 0 } = req.body;
  if (!location) return res.status(400).json({ error: "location is required" });

  const client = await pool.connect();
  try {
    const insertQ = `
      INSERT INTO locations (location, total_items, low_stock, total_value)
      VALUES ($1, $2, 0, $3)
      ON CONFLICT (location) DO NOTHING
      RETURNING id, location, total_items, low_stock, total_value
    `;
    const r = await client.query(insertQ, [location, Number(total_items), Number(total_value)]);
    if (r.rowCount === 0) {
      // already existed - fetch it
      const existing = await client.query("SELECT id, location, total_items, low_stock, total_value FROM locations WHERE location = $1", [location]);
      return res.status(200).json(existing.rows[0]);
    }
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error("POST /api/locations", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// POST /api/items - add an item and update location totals
app.post("/api/items", async (req, res) => {
  const { name, description = null, quantity = 0, unit_price = 0, minQuantity = 0, location } = req.body;

  if (!name || typeof quantity === "undefined" || typeof unit_price === "undefined") {
    return res.status(400).json({ error: "name, quantity and unit_price are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // find or create location (if provided)
    let locationId = null;
    if (location) {
      const locRes = await client.query("SELECT id FROM locations WHERE location = $1", [location]);
      if (locRes.rowCount === 0) {
        const insLoc = await client.query(
          "INSERT INTO locations (location, total_items, low_stock, total_value) VALUES ($1, 0, 0, 0) RETURNING id",
          [location]
        );
        locationId = insLoc.rows[0].id;
      } else {
        locationId = locRes.rows[0].id;
      }
    }

    const insertItemQ = `
      INSERT INTO items (name, description, quantity, min_quantity, unit_price, location_id)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, name, quantity, min_quantity, unit_price
    `;
    const itemRes = await client.query(insertItemQ, [name, description, quantity, minQuantity, unit_price, locationId]);

    // update location counts
    if (locationId) {
      const isLow = Number(quantity) <= Number(minQuantity) ? 1 : 0;
      const updateLocQ = `
        UPDATE locations
        SET total_items = total_items + $1,
            total_value = total_value + $2,
            low_stock = low_stock + $3
        WHERE id = $4
      `;
      await client.query(updateLocQ, [Number(quantity), Number(unit_price) * Number(quantity), isLow, locationId]);
    }

    await client.query("COMMIT");

    const created = itemRes.rows[0];
    res.status(201).json({
      id: created.id,
      name: created.name,
      quantity: Number(created.quantity),
      minQuantity: Number(created.min_quantity || minQuantity),
      unit_price: Number(created.unit_price),
      location,
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("POST /api/items", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// POST /api/items/:id/transfer - transfer item to another location (adjust totals)
app.post("/api/items/:id/transfer", async (req, res) => {
  const itemId = Number(req.params.id);
  const { location: newLocationName } = req.body;
  if (!newLocationName) return res.status(400).json({ error: "new location required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // load item and current location
    const itemRes = await client.query(
      `SELECT i.id, i.quantity, i.min_quantity, i.unit_price, COALESCE(l.location, NULL) AS location, l.id AS location_id
       FROM items i
       LEFT JOIN locations l ON i.location_id = l.id
       WHERE i.id = $1 FOR UPDATE`,
      [itemId]
    );

    if (itemRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Item not found" });
    }

    const item = itemRes.rows[0];
    const qty = Number(item.quantity);
    const unit_price = Number(item.unit_price || 0);
    const minQty = Number(item.min_quantity || 0);

    // ensure new location exists (create if not)
    let newLocRes = await client.query("SELECT id FROM locations WHERE location = $1 FOR UPDATE", [newLocationName]);
    let newLocationId;
    if (newLocRes.rowCount === 0) {
      const ins = await client.query(
        "INSERT INTO locations (location, total_items, low_stock, total_value) VALUES ($1, 0, 0, 0) RETURNING id",
        [newLocationName]
      );
      newLocationId = ins.rows[0].id;
    } else {
      newLocationId = newLocRes.rows[0].id;
    }

    // decrease totals on old location if exists
    if (item.location_id) {
      const wasLow = qty <= minQty ? 1 : 0;
      await client.query(
        `UPDATE locations
         SET total_items = GREATEST(total_items - $1, 0),
             total_value = GREATEST(total_value - $2, 0),
             low_stock = GREATEST(low_stock - $3, 0)
         WHERE id = $4`,
        [qty, unit_price * qty, wasLow, item.location_id]
      );
    }

    // increase totals on new location
    const isLow = qty <= minQty ? 1 : 0;
    await client.query(
      `UPDATE locations
       SET total_items = total_items + $1,
           total_value = total_value + $2,
           low_stock = low_stock + $3
       WHERE id = $4`,
      [qty, unit_price * qty, isLow, newLocationId]
    );

    // update item row
    await client.query("UPDATE items SET location_id = $1 WHERE id = $2", [newLocationId, itemId]);

    await client.query("COMMIT");
    res.json({ success: true, itemId, newLocation: newLocationName });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("POST /api/items/:id/transfer", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
