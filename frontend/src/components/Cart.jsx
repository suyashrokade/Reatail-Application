import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

const API_URL = 'http://localhost:5000/api';

function Cart({ items, user, onRemove, onUpdateQuantity }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        user_id: user.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Clear cart and show success
      items.forEach(item => onRemove(item.id));
      alert('Order placed successfully! Order ID: ' + data.order.id);
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>

      {error && <div className="error-message">{error}</div>}

      {items.length > 0 ? (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p className="empty-message">Add items to get started</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
