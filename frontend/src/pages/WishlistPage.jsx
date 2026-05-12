import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/WishlistPage.css';

const API_URL = 'http://localhost:5000/api';

function WishlistPage({ user }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/wishlists?user_id=${user.id}`);
      const data = await response.json();
      setWishlistItems(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const response = await fetch(`${API_URL}/wishlists/${wishlistId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId));
      } else {
        setError('Failed to remove item from wishlist');
      }
    } catch (err) {
      setError('Failed to remove item from wishlist');
      console.error(err);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Your saved items for later</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading wishlist...</div>
      ) : wishlistItems.length > 0 ? (
        <div className="wishlist-content">
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-item">
                <ProductCard
                  product={item.product}
                  user={user}
                  onAddToCart={handleAddToCart}
                />
                <button
                  className="remove-wishlist-btn"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <p className="empty-message">Add items you like to your wishlist for easy access later</p>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;