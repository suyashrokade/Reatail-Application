# Quick Start Guide - Retail Application

## Project Overview

You now have a complete **Full Stack Retail Application** with:
- ✅ React Frontend with modern UI
- ✅ Python Flask Backend with RESTful API
- ✅ SQLite Database
- ✅ User Authentication (Login/Signup)
- ✅ Product Browsing by Categories
- ✅ Shopping Cart & Checkout
- ✅ Order Management

---

## Getting Started

### Step 1: Backend Setup (Python)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

✅ Backend will run on: http://localhost:5000

**Initialize sample products:**
```bash
curl -X POST http://localhost:5000/api/products/init
```

---

### Step 2: Frontend Setup (React)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend will run on: http://localhost:3000

---

## Features Implemented

### 📝 Authentication Pages
- **Signup Page** - Register with username, email, password, full name, phone, address
- **Login Page** - Authenticate with credentials
- **Form Validation** - Client-side validation with error messages

### 🏪 Home Page
- **Product Categories** - Filter by Oils, Dals, Other Items
- **Product Grid** - Display products with emojis, price, description
- **Shopping Cart** - Add items, update quantity, remove items
- **Responsive Design** - Works on mobile and desktop

### 🛒 Shopping Cart Features
- Add/remove products
- Adjust quantities
- View total price
- Secure checkout with payment processing
- Multiple payment methods (Card, UPI, COD, Net Banking)
- Order confirmation with payment details

### 📦 Order Management
- View all user orders
- See order status (pending, completed, cancelled)
- Payment status tracking (pending, paid, failed, refunded)
- Payment method and transaction ID display
- Order details with items and prices
- Order history tracking

### 🎨 UI/UX Features
- Modern gradient design
- Smooth animations and transitions
- Responsive layout
- Loading states
- Error messages
- Sticky shopping cart

---

## Sample Test Accounts

### Users can signup with any details, or test with:

After clicking "Initialize products" endpoint:

**Sample Products Available:**

**Oils:**
- Coconut Oil - ₹450
- Mustard Oil - ₹350
- Sunflower Oil - ₹400

**Dals:**
- Moong Dal - ₹150
- Chana Dal - ₹120
- Toor Dal - ₹140

**Other Items:**
- Basmati Rice - ₹200
- Whole Wheat Flour - ₹80

---

## API Testing

### Initialize Products
```bash
POST http://localhost:5000/api/products/init
```

### Get All Products
```bash
GET http://localhost:5000/api/products
```

### Filter by Category
```bash
GET http://localhost:5000/api/products?category=Oils
```

### User Signup
```bash
POST http://localhost:5000/api/auth/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "9876543210",
  "city": "Mumbai"
}
```

### User Login
```bash
POST http://localhost:5000/api/auth/login
{
  "username": "john_doe",
  "password": "password123"
}
```

### Create Order
```bash
POST http://localhost:5000/api/orders
{
  "user_id": 1,
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 3, "quantity": 1}
  ]
}
```

---

## File Structure Summary

```
Retail Application/
├── backend/
│   ├── app.py                    # Main Flask app
│   ├── requirements.txt          # Python dependencies
│   └── app/
│       ├── models/               # Database models
│       └── routes/               # API endpoints
│
├── frontend/
│   ├── src/
│   │   ├── pages/                # React pages
│   │   ├── components/           # React components
│   │   └── styles/               # CSS files
│   ├── package.json
│   └── vite.config.js
│
├── README.md                     # Full documentation
└── .gitignore
```

---

## Workflow Overview

1. **User signs up** → Creates account in database
2. **User logs in** → Gets user data, stored in localStorage
3. **Browse products** → Fetches from `/api/products`
4. **Add to cart** → Updates cart in React state
5. **Checkout** → Creates order via POST `/api/orders`
6. **View orders** → Fetches user orders from `/api/orders/user/{id}`

---

## Customization Ideas

- Change colors in CSS files (primary color: #3b82f6)
- Add more product categories
- Implement payment gateway
- Add product search/filter
- Create admin dashboard
- Add product reviews/ratings
- Implement email notifications

---

## Troubleshooting

**Frontend won't connect to backend:**
- Ensure backend is running on port 5000
- Check CORS is enabled in Flask
- Verify API_URL in frontend components

**Database issues:**
- Delete `retail_app.db` file and restart backend
- Run `/api/products/init` to recreate sample data

**Port conflicts:**
- Backend: Change port in `app.py`
- Frontend: Change port in `vite.config.js`

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start backend server
3. ✅ Start frontend dev server
4. ✅ Open http://localhost:3000
5. ✅ Sign up or login
6. ✅ Browse and purchase products!

Happy Coding! 🚀
