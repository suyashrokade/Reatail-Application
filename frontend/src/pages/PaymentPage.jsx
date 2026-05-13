import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PaymentPage.css';

const API_URL = 'http://localhost:5000/api';

function PaymentPage({ user }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from navigation state
  const orderData = location.state?.orderData;

  if (!orderData) {
    navigate('/cart');
    return null;
  }

  const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // First create the order
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const orderId = orderResult.order.id;

      // Then process payment
      const paymentResponse = await fetch(`${API_URL}/orders/${orderId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Success - redirect to order confirmation
      navigate('/orders', {
        state: {
          paymentSuccess: true,
          orderId: orderId,
          paymentId: paymentResult.payment_id
        }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
  ];

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Payment</h1>
          <p>Complete your purchase</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {orderData.items.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: ₹{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <div className="methods-grid">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <span className="method-icon">{method.icon}</span>
                <span className="method-name">{method.name}</span>
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="payment-actions">
          <button
            className="back-btn"
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            Back to Cart
          </button>
          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
          >
            {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;