import React, { useState, useEffect } from 'react';
import '../styles/ProductCard.css';

const API_URL = 'http://localhost:5000/api';

function ProductCard({ product, onAddToCart, user }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, product.id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/wishlists/check?user_id=${user.id}&product_id=${product.id}`
      );
      const data = await response.json();
      setInWishlist(data.in_wishlist);
      setWishlistId(data.wishlist_id);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (inWishlist) {
        // Remove from wishlist
        const response = await fetch(`${API_URL}/wishlists/${wishlistId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setInWishlist(false);
          setWishlistId(null);
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${API_URL}/wishlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setInWishlist(true);
          setWishlistId(data.wishlist_item.id);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="product-placeholder"
          style={{ display: product.image_url ? 'none' : 'flex' }}
        >
          {product.category === 'Oils' && '🫗'}
          {product.category === 'Dals' && '🍲'}
          {product.category === 'Other Items' && '🌾'}
        </div>

        {user && (
          <button
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={loading}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {loading ? '⏳' : (inWishlist ? '❤️' : '🤍')}
          </button>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            <span className="price">₹{product.price.toFixed(2)}</span>
            <span className="stock">
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={product.quantity === 0}
          >
            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
