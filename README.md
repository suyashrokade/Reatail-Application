# Retail Application

A complete Full Stack Retail Application built with React, Python Flask, and SQLite.

## Project Structure

```
Retail Application/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── components/      # Reusable React Components
│   │   │   ├── Navbar.jsx   # Navigation Bar
│   │   │   ├── ProductCard.jsx # Product Display Card
│   │   │   └── Cart.jsx     # Shopping Cart Component
│   │   ├── pages/           # Page Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── OrderPage.jsx
│   │   ├── styles/          # CSS Styling
│   │   │   ├── index.css
│   │   │   ├── Auth.css
│   │   │   ├── Navbar.css
│   │   │   ├── HomePage.css
│   │   │   ├── ProductCard.css
│   │   │   ├── Cart.css
│   │   │   └── OrderPage.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── backend/                 # Python Flask Backend API
    ├── app.py              # Main Flask Application
    ├── app/
    │   ├── models/         # Database Models
    │   │   ├── user.py     # User Model
    │   │   ├── product.py  # Product Model
    │   │   └── order.py    # Order Models
    │   └── routes/         # API Routes
    │       ├── auth.py     # Authentication Routes
    │       ├── products.py # Products Routes
    │       └── orders.py   # Orders Routes
    ├── requirements.txt
    └── README.md
```

## Features

### Frontend
- **User Authentication**: Login and Signup pages with form validation
- **Product Browsing**: Browse products by categories (Oils, Dals, Other Items)
- **Shopping Cart**: Add/remove items, update quantities, view total
- **Order Placement**: Checkout and place orders
- **Order History**: View previous orders and their status
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

### Backend
- **User Management**: Register and authenticate users
- **Product Catalog**: Manage products with categories
- **Shopping Orders**: Create and manage customer orders
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful API with CORS support

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite
- JavaScript ES6+

### Backend
- Python 3.8+
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/<id>` - Get user details
- `PUT /api/auth/user/<id>` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Oils` - Get products by category
- `GET /api/products/<id>` - Get product details
- `POST /api/products` - Create new product
- `POST /api/products/init` - Initialize sample products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/<id>` - Get order details
- `GET /api/orders/user/<user_id>` - Get user orders
- `PUT /api/orders/<id>/status` - Update order status

## Sample Data

The application comes with sample products:
- **Oils**: Coconut Oil, Mustard Oil, Sunflower Oil
- **Dals**: Moong Dal, Chana Dal, Toor Dal
- **Other Items**: Basmati Rice, Whole Wheat Flour

To initialize sample data, call:
```bash
POST http://localhost:5000/api/products/init
```

## Usage

1. **Signup**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Browse**: Browse products by category
4. **Add to Cart**: Click "Add to Cart" to add products
5. **Checkout**: Review your cart and proceed to checkout
6. **View Orders**: Go to "Orders" page to see order history

## Database Models

### User
- id, username, email, password_hash, full_name, phone, address, city, zip_code, created_at

### Product
- id, name, category, description, price, quantity, image_url, created_at

### Order
- id, user_id, total_amount, status, created_at, updated_at

### OrderItem
- id, order_id, product_id, quantity, price

## Development Notes

- Frontend uses Vite for fast development and building
- Backend uses Flask with SQLAlchemy for ORM
- CORS is enabled to allow frontend-backend communication
- Database is SQLite for easy setup and testing
- All styling is custom CSS with responsive design

## Future Enhancements

- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- User dashboard with analytics
- Admin panel for product management
- Search and filtering
- Inventory management

---

**Created**: 2026
**Full Stack Development**: React + Python Flask
