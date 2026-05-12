import React, { useState, useEffect } from 'react';
import '../styles/OrderPage.css';

const API_URL = 'http://localhost:5000/api';

function OrderPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>My Orders</h1>
        <p>View your order history</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header-info">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>
                      <span>{item.product_name} x {item.quantity}</span>
                      <span className="item-price">₹{item.total.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-total">
                <strong>Total: ₹{order.total_amount.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
