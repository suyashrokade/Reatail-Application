import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/OrderPage.css';

const API_URL = 'http://localhost:5000/api';

function OrderPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchUserOrders();
    
    // Check for payment success message
    if (location.state?.paymentSuccess) {
      setSuccessMessage(`Payment successful! Order #${location.state.orderId} has been placed. Payment ID: ${location.state.paymentId}`);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
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

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      case 'refunded':
        return '#8b5cf6';
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
      {successMessage && <div className="success-message">{successMessage}</div>}

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
                <div className="status-container">
                  <div
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div
                    className="payment-status"
                    style={{ backgroundColor: getPaymentStatusColor(order.payment_status) }}
                  >
                    Payment: {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                  </div>
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

              {order.payment_method && (
                <div className="payment-info">
                  <p><strong>Payment Method:</strong> {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}</p>
                  {order.payment_id && <p><strong>Payment ID:</strong> {order.payment_id}</p>}
                </div>
              )}
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
