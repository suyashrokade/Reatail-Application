# Retail Application

A complete Full Stack Retail Application built with React, Python Flask, and SQLite.

## 🚀 Features

### ✅ Core Features
- **User Authentication**: Login and Signup with secure password hashing
- **Product Catalog**: 20+ products across 3 categories (Oils, Dals, Other Items)
- **Product Images**: High-quality product images from Unsplash
- **Shopping Cart**: Add/remove items, update quantities, real-time total
- **Order Management**: Place orders, view order history with status tracking
- **Wishlist**: Save favorite products for later
- **Search & Filter**: Search products by name/description, filter by category
- **Sorting**: Sort by name, price, or stock quantity
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

### ✅ Advanced Features
- **Product Reviews**: Rate and review products (1-5 stars)
- **Real-time Updates**: Live cart updates and wishlist status
- **Image Fallbacks**: Automatic fallback to emojis if images fail to load
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Smooth loading indicators throughout the app
- **Form Validation**: Client-side validation with error messages

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Python 3.8+** - Server-side logic
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Werkzeug** - Password hashing utilities

## 📦 Project Structure

```
Retail Application/
├── backend/                          # Python Flask Backend
│   ├── app.py                       # Main Flask application
│   ├── database.py                  # Database configuration
│   ├── requirements.txt             # Python dependencies
│   └── app/
│       ├── models/                  # Database models
│       │   ├── user.py             # User model
│       │   ├── product.py          # Product model
│       │   ├── order.py            # Order models
│       │   ├── wishlist.py         # Wishlist model
│       │   └── review.py           # Review model
│       └── routes/                  # API endpoints
│           ├── auth.py             # Authentication routes
│           ├── products.py         # Products routes
│           ├── orders.py           # Orders routes
│           ├── wishlists.py        # Wishlist routes
│           └── reviews.py          # Reviews routes
│
├── frontend/                         # React Frontend Application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── ProductCard.jsx     # Product display card
│   │   │   └── Cart.jsx            # Shopping cart
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.jsx       # Login page
│   │   │   ├── SignupPage.jsx      # Registration page
│   │   │   ├── HomePage.jsx        # Main shopping page
│   │   │   ├── OrderPage.jsx       # Order history
│   │   │   └── WishlistPage.jsx    # User wishlist
│   │   ├── styles/                  # CSS styling
│   │   │   ├── index.css           # Global styles
│   │   │   ├── Auth.css            # Auth pages styling
│   │   │   ├── Navbar.css          # Navigation styling
│   │   │   ├── HomePage.css        # Home page styling
│   │   │   ├── ProductCard.css     # Product card styling
│   │   │   ├── Cart.css            # Cart styling
│   │   │   ├── OrderPage.css       # Orders page styling
│   │   │   └── WishlistPage.css    # Wishlist page styling
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # App entry point
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   └── vite.config.js               # Vite configuration
│
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
└── QUICKSTART.md                    # Quick start guide
```

## 🏃‍♂️ Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
✅ Backend runs on: http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs on: http://localhost:3000

### Initialize Sample Data
```bash
POST http://localhost:5000/api/products/init
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/<id>` - Get user details
- `PUT /api/auth/user/<id>` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/filter/sort)
- `GET /api/products?category=Oils&search=rice&sort=price&order=asc`
- `GET /api/products/<id>` - Get product details
- `POST /api/products` - Create new product
- `POST /api/products/init` - Initialize sample products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/<id>` - Get order details
- `GET /api/orders/user/<user_id>` - Get user orders
- `PUT /api/orders/<id>/status` - Update order status

### Wishlist
- `GET /api/wishlists?user_id=<id>` - Get user wishlist
- `POST /api/wishlists` - Add to wishlist
- `DELETE /api/wishlists/<id>` - Remove from wishlist
- `GET /api/wishlists/check?user_id=<id>&product_id=<id>` - Check if in wishlist

### Reviews
- `GET /api/reviews/product/<product_id>` - Get product reviews
- `POST /api/reviews` - Add review
- `PUT /api/reviews/<id>` - Update review
- `DELETE /api/reviews/<id>` - Delete review
- `GET /api/reviews/product/<product_id>/average` - Get average rating

## 🛍 Sample Products

### Oils (5 products)
- Coconut Oil - ₹450
- Mustard Oil - ₹350
- Sunflower Oil - ₹400
- Olive Oil - ₹650
- Groundnut Oil - ₹380

### Dals (5 products)
- Moong Dal - ₹150
- Chana Dal - ₹120
- Toor Dal - ₹140
- Urad Dal - ₹160
- Masoor Dal - ₹130

### Other Items (10 products)
- Basmati Rice - ₹200
- Whole Wheat Flour - ₹80
- Sugar - ₹45
- Salt - ₹25
- Turmeric Powder - ₹60
- Red Chili Powder - ₹75
- Cumin Seeds - ₹85
- Coriander Powder - ₹55
- Garam Masala - ₹95
- Black Pepper - ₹120

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Works perfectly on mobile and desktop
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback

## 🔧 Development Features

- **Hot Reload**: Instant updates during development
- **ESLint**: Code quality and consistency
- **CORS Enabled**: Cross-origin requests allowed
- **Database Migrations**: Automatic table creation
- **Environment Variables**: Configurable settings
- **Modular Architecture**: Clean separation of concerns

## 🚀 Deployment

### Backend Deployment
```bash
# Set environment variables
export FLASK_ENV=production
export SECRET_KEY=your-secret-key

# Run with Gunicorn
gunicorn app:app
```

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to static hosting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash** for high-quality product images
- **React** and **Flask** communities for excellent documentation
- **Tailwind CSS** for the amazing utility-first approach

---

**Built with ❤️ using React & Python Flask**

*Last updated: May 2026*
- Search and filtering
- Inventory management

---

**Created**: 2026
**Full Stack Development**: React + Python Flask
