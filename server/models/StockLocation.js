class StockLocation {
  constructor(id, location_name, total_items, low_stock_items, total_value, created_at, updated_at) {
    this.id = id
    this.location_name = location_name
    this.total_items = total_items
    this.low_stock_items = low_stock_items
    this.total_value = total_value
    this.created_at = created_at
    this.updated_at = updated_at
  }

  static fromDB(row) {
    return new StockLocation(
      row.id,
      row.location_name,
      row.total_items,
      row.low_stock_items,
      row.total_value,
      row.created_at,
      row.updated_at,
    )
  }

  toJSON() {
    return {
      id: this.id,
      location_name: this.location_name,
      total_items: this.total_items,
      low_stock_items: this.low_stock_items,
      total_value: this.total_value,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }
}

module.exports = StockLocation
