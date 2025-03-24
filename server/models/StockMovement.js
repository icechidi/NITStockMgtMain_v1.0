class StockMovement {
  constructor(id, item_id, movement_type, quantity, movement_date, notes, created_at, transaction_date) {
    this.id = id;
    this.item_id = item_id;
    this.movement_type = movement_type;
    this.quantity = quantity;
    this.movement_date = movement_date;
    this.notes = notes;
    this.created_at = created_at;
    this.transaction_date = transaction_date;
  }

  static fromDB(row) {
    return new StockMovement(
      row.id,
      row.item_id,
      row.movement_type,
      row.quantity,
      row.movement_date,
      row.notes,
      row.created_at,
      row.transaction_date
    );
  }

  toJSON() {
    return {
      id: this.id,
      item_id: this.item_id,
      movement_type: this.movement_type,
      quantity: this.quantity,
      movement_date: this.movement_date,
      notes: this.notes,
      created_at: this.created_at,
      transaction_date: this.transaction_date
    };
  }
}

module.exports = StockMovement; 