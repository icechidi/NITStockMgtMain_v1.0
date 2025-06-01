-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nitstockmgt;

-- Connect to the database
\c nitstockmgt;

-- Create stock_locations table
CREATE TABLE IF NOT EXISTS stock_locations (
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL UNIQUE,
    total_items INTEGER DEFAULT 0,
    low_stock_items INTEGER DEFAULT 0,
    total_value DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update items table to include location reference and additional fields
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES stock_locations(id),
ADD COLUMN IF NOT EXISTS min_quantity INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'In Stock';

-- Create stock_items view for easier querying
CREATE OR REPLACE VIEW stock_items_view AS
SELECT 
    i.id,
    i.name,
    i.description,
    i.quantity,
    i.unit_price,
    i.min_quantity,
    i.category,
    i.status,
    sl.location_name as location,
    sl.id as location_id,
    i.created_at,
    i.updated_at,
    CASE 
        WHEN i.quantity <= i.min_quantity THEN 'Low Stock'
        ELSE 'In Stock'
    END as calculated_status
FROM items i
LEFT JOIN stock_locations sl ON i.location_id = sl.id;

-- Function to update stock location totals
CREATE OR REPLACE FUNCTION update_stock_location_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update totals for the affected location(s)
    IF TG_OP = 'DELETE' THEN
        UPDATE stock_locations 
        SET 
            total_items = (
                SELECT COALESCE(SUM(quantity), 0) 
                FROM items 
                WHERE location_id = OLD.location_id
            ),
            total_value = (
                SELECT COALESCE(SUM(quantity * unit_price), 0) 
                FROM items 
                WHERE location_id = OLD.location_id
            ),
            low_stock_items = (
                SELECT COUNT(*) 
                FROM items 
                WHERE location_id = OLD.location_id AND quantity <= min_quantity
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.location_id;
        RETURN OLD;
    END IF;

    -- Update totals for new location
    IF NEW.location_id IS NOT NULL THEN
        UPDATE stock_locations 
        SET 
            total_items = (
                SELECT COALESCE(SUM(quantity), 0) 
                FROM items 
                WHERE location_id = NEW.location_id
            ),
            total_value = (
                SELECT COALESCE(SUM(quantity * unit_price), 0) 
                FROM items 
                WHERE location_id = NEW.location_id
            ),
            low_stock_items = (
                SELECT COUNT(*) 
                FROM items 
                WHERE location_id = NEW.location_id AND quantity <= min_quantity
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.location_id;
    END IF;

    -- Update totals for old location if location changed
    IF TG_OP = 'UPDATE' AND OLD.location_id IS DISTINCT FROM NEW.location_id AND OLD.location_id IS NOT NULL THEN
        UPDATE stock_locations 
        SET 
            total_items = (
                SELECT COALESCE(SUM(quantity), 0) 
                FROM items 
                WHERE location_id = OLD.location_id
            ),
            total_value = (
                SELECT COALESCE(SUM(quantity * unit_price), 0) 
                FROM items 
                WHERE location_id = OLD.location_id
            ),
            low_stock_items = (
                SELECT COUNT(*) 
                FROM items 
                WHERE location_id = OLD.location_id AND quantity <= min_quantity
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.location_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update stock location totals
DROP TRIGGER IF EXISTS update_stock_totals_trigger ON items;
CREATE TRIGGER update_stock_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_location_totals();

-- Create trigger to update updated_at timestamp for stock_locations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_stock_locations_updated_at ON stock_locations;
CREATE TRIGGER update_stock_locations_updated_at
    BEFORE UPDATE ON stock_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default stock locations
INSERT INTO stock_locations (location_name, total_items, low_stock_items, total_value) 
VALUES 
    ('Main Warehouse', 0, 0, 0.00),
    ('Store A', 0, 0, 0.00),
    ('Store B', 0, 0, 0.00),
    ('Distribution Center', 0, 0, 0.00)
ON CONFLICT (location_name) DO NOTHING;

-- Update existing items to have location references (if any exist)
UPDATE items 
SET location_id = (SELECT id FROM stock_locations WHERE location_name = 'Main Warehouse' LIMIT 1)
WHERE location_id IS NULL;
