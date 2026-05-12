import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import '../styles/HomePage.css';

const API_URL = 'http://localhost:5000/api';

function HomePage({ user }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailProduct, setDetailProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [productRating, setProductRating] = useState({ average_rating: 0, total_reviews: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const categories = ['All', 'Oils', 'Dals', 'Other Items'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, searchTerm, sortBy, sortOrder, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchTerm,
        sort: sortBy,
        order: sortOrder
      });

      const response = await fetch(`${API_URL}/products?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load products');
      }

      setProducts(data);
      setError('');
    } catch (err) {
      setProducts([]);
      setError(err.message || 'Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
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

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const openProductDetails = async (product) => {
    setDetailError('');
    setDetailProduct(product);
    setDetailLoading(true);

    try {
      const [reviewsRes, ratingRes] = await Promise.all([
        fetch(`${API_URL}/reviews/product/${product.id}`),
        fetch(`${API_URL}/reviews/product/${product.id}/average`)
      ]);

      const reviewsData = await reviewsRes.json();
      const ratingData = await ratingRes.json();

      setProductReviews(reviewsRes.ok ? reviewsData : []);
      setProductRating(ratingRes.ok ? ratingData : { average_rating: 0, total_reviews: 0 });
    } catch (err) {
      console.error(err);
      setDetailError('Unable to load reviews for this product');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeProductDetails = () => {
    setDetailProduct(null);
    setProductReviews([]);
    setProductRating({ average_rating: 0, total_reviews: 0 });
    setReviewForm({ rating: 5, comment: '' });
    setDetailError('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!detailProduct) return;

    try {
      setDetailLoading(true);
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: detailProduct.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      setProductReviews([...productReviews, result.review]);
      const ratingRes = await fetch(`${API_URL}/reviews/product/${detailProduct.id}/average`);
      const ratingData = await ratingRes.json();
      setProductRating(ratingRes.ok ? ratingData : productRating);
      setReviewForm({ rating: 5, comment: '' });
      setDetailError('Review added successfully!');
    } catch (err) {
      console.error(err);
      setDetailError(err.message || 'Could not submit review');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReviewChange = (field, value) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome, {user.full_name}! 👋</h1>
        <p>Browse our collection of premium products</p>
      </div>

      <div className="home-content">
        <div className="products-section">
          {error && <div className="error-message">{error}</div>}

          {/* Search and Filter Controls */}
          <div className="controls-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>

            <div className="filter-controls">
              <div className="category-filter">
                <h3>Categories</h3>
                <div className="category-buttons">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sort-controls">
                <h3>Sort By</h3>
                <div className="sort-options">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="quantity">Stock</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="sort-order-btn"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    user={user}
                    onAddToCart={handleAddToCart}
                    onViewDetails={openProductDetails}
                  />
                ))
              ) : (
                <p className="no-products">No products found matching your criteria</p>
              )}
            </div>
          )}
        </div>

        <Cart
          items={cartItems}
          user={user}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>

      {detailProduct && (
        <div className="product-modal-overlay" onClick={closeProductDetails}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{detailProduct.name}</h2>
              <button className="modal-close" onClick={closeProductDetails}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-image-section">
                {detailProduct.image_url ? (
                  <img src={detailProduct.image_url} alt={detailProduct.name} />
                ) : (
                  <div className="product-placeholder">
                    {detailProduct.category === 'Oils' && '🫗'}
                    {detailProduct.category === 'Dals' && '🍲'}
                    {detailProduct.category === 'Other Items' && '🌾'}
                  </div>
                )}
              </div>
              <div className="modal-details-section">
                <p className="product-category">{detailProduct.category}</p>
                <p className="product-description">{detailProduct.description}</p>

                <div className="modal-rating-summary">
                  <div>
                    <span className="rating-value">⭐ {productRating.average_rating}</span>
                    <span className="rating-count">({productRating.total_reviews} reviews)</span>
                  </div>
                  <div className="modal-price">₹{detailProduct.price.toFixed(2)}</div>
                </div>

                <div className="reviews-section">
                  <h3>Customer Reviews</h3>
                  {detailLoading ? (
                    <p>Loading reviews...</p>
                  ) : productReviews.length > 0 ? (
                    <ul className="review-list">
                      {productReviews.map(review => (
                        <li key={review.id} className="review-item">
                          <div className="review-meta">
                            <strong>{review.user_name}</strong>
                            <span>⭐ {review.rating}</span>
                          </div>
                          <p>{review.comment || 'No comment provided.'}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet for this product.</p>
                  )}
                </div>

                <div className="submit-review">
                  <h3>Add a Review</h3>
                  {detailError && <p className="detail-error">{detailError}</p>}
                  <form onSubmit={handleReviewSubmit}>
                    <label>
                      Rating
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => handleReviewChange('rating', Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map(value => (
                          <option key={value} value={value}>{value} stars</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Comment
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => handleReviewChange('comment', e.target.value)}
                        placeholder="Share your thoughts about the product"
                      />
                    </label>
                    <button type="submit" className="review-submit-btn" disabled={detailLoading}>
                      {detailLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
