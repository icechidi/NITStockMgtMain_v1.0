import React, { useState, useEffect } from 'react';

function NewOrder() {
  const [items, setItems] = useState([]); // List of available items
  const [order, setOrder] = useState({
    customerName: '',
    customerEmail: '',
    orderItems: [],
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setErrorMessage('Failed to load items. Please try again later.');
      }
    };

    fetchItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  // Handle item selection and quantity input
  const handleItemChange = (index, field, value) => {
    const updatedOrderItems = [...order.orderItems];
    updatedOrderItems[index] = {
      ...updatedOrderItems[index],
      [field]: value,
    };
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: updatedOrderItems,
    }));
  };

  // Add a new item to the order
  const addOrderItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, { itemId: '', quantity: 1 }],
    }));
  };

  // Remove an item from the order
  const removeOrderItem = (index) => {
    const updatedOrderItems = order.orderItems.filter((_, i) => i !== index);
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: updatedOrderItems,
    }));
  };

  // Submit the order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        setSuccessMessage('Order placed successfully!');
        setOrder({
          customerName: '',
          customerEmail: '',
          orderItems: [],
        });
      } else {
        setErrorMessage('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="new-order">
      <h2>Place a New Order</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        {/* Customer Details */}
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            className="form-control"
            value={order.customerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Customer Email</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            className="form-control"
            value={order.customerEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Order Items */}
        <h3>Order Items</h3>
        {order.orderItems.map((orderItem, index) => (
          <div key={index} className="order-item">
            <div className="form-group">
              <label htmlFor={`item-${index}`}>Item</label>
              <select
                id={`item-${index}`}
                className="form-control"
                value={orderItem.itemId}
                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                required
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Quantity</label>
              <input
                type="number"
                id={`quantity-${index}`}
                className="form-control"
                value={orderItem.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                min="1"
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeOrderItem(index)}
            >
              Remove Item
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-secondary" onClick={addOrderItem}>
          Add Item
        </button>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-3">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default NewOrder;