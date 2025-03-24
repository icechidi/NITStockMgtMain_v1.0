class Item {
  constructor(id, name, description, quantity, unit_price, created_at, updated_at, stock_added_at) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.unit_price = unit_price;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.stock_added_at = stock_added_at;
  }

  static fromDB(row) {
    return new Item(
      row.id,
      row.name,
      row.description,
      row.quantity,
      row.unit_price,
      row.created_at,
      row.updated_at,
      row.stock_added_at
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unit_price: this.unit_price,
      created_at: this.created_at,
      updated_at: this.updated_at,
      stock_added_at: this.stock_added_at
    };
  }
}

module.exports = Item; 