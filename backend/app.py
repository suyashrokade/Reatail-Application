from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from database import db

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///retail_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Import models
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.wishlist import Wishlist
from app.models.review import Review

# Import routes
from app.routes.auth import auth_bp
from app.routes.products import products_bp, SAMPLE_PRODUCTS
from app.routes.orders import orders_bp
from app.routes.wishlists import wishlists_bp
from app.routes.reviews import reviews_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(wishlists_bp, url_prefix='/api/wishlists')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')


def cleanup_duplicate_products():
    """Remove duplicate products based on name and category."""
    duplicates = db.session.query(
        Product.name,
        Product.category,
        db.func.count(Product.id).label('count')
    ).group_by(Product.name, Product.category).having(db.func.count(Product.id) > 1).all()

    for name, category, _ in duplicates:
        products = Product.query.filter_by(name=name, category=category).order_by(Product.id).all()
        for duplicate_product in products[1:]:
            db.session.delete(duplicate_product)
    if duplicates:
        db.session.commit()


def initialize_sample_products():
    """Seed the database with sample products if none exist."""
    if Product.query.count() == 0:
        for product_data in SAMPLE_PRODUCTS:
            product = Product(**product_data)
            db.session.add(product)
        db.session.commit()


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'API is running'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        cleanup_duplicate_products()
        initialize_sample_products()
    app.run(debug=True, port=5000)


