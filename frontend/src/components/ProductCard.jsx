import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <div className="product-placeholder">
          {product.category === 'Oils' && '🫗'}
          {product.category === 'Dals' && '🍲'}
          {product.category === 'Other Items' && '🌾'}
        </div>
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
