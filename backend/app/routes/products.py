from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db
from app.models.product import Product

products_bp = Blueprint('products', __name__)

# Sample data for initial products
SAMPLE_PRODUCTS = [
    {'name': 'Coconut Oil', 'category': 'Oils', 'description': 'Pure coconut oil for cooking', 'price': 450.00, 'quantity': 50},
    {'name': 'Mustard Oil', 'category': 'Oils', 'description': 'Cold-pressed mustard oil', 'price': 350.00, 'quantity': 40},
    {'name': 'Sunflower Oil', 'category': 'Oils', 'description': 'Refined sunflower oil', 'price': 400.00, 'quantity': 60},
    {'name': 'Moong Dal', 'category': 'Dals', 'description': 'Yellow moong dal', 'price': 150.00, 'quantity': 100},
    {'name': 'Chana Dal', 'category': 'Dals', 'description': 'Roasted chana dal', 'price': 120.00, 'quantity': 80},
    {'name': 'Toor Dal', 'category': 'Dals', 'description': 'Premium toor dal', 'price': 140.00, 'quantity': 90},
    {'name': 'Basmati Rice', 'category': 'Other Items', 'description': 'Long grain basmati rice', 'price': 200.00, 'quantity': 70},
    {'name': 'Whole Wheat Flour', 'category': 'Other Items', 'description': 'Organic wheat flour', 'price': 80.00, 'quantity': 150},
]

@products_bp.route('/init', methods=['POST'])
def initialize_products():
    """Initialize database with sample products"""
    try:
        # Clear existing products
        Product.query.delete()
        
        # Add sample products
        for product_data in SAMPLE_PRODUCTS:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        
        return jsonify({'message': 'Products initialized successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('', methods=['GET'])
def get_all_products():
    """Get all products or filter by category"""
    try:
        category = request.args.get('category')
        
        if category:
            products = Product.query.filter_by(category=category).all()
        else:
            products = Product.query.all()
        
        return jsonify([product.to_dict() for product in products]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get product details"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product.to_dict()), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('', methods=['POST'])
def create_product():
    """Create a new product"""
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['name', 'category', 'price']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        product = Product(
            name=data['name'],
            category=data['category'],
            description=data.get('description', ''),
            price=data['price'],
            quantity=data.get('quantity', 0),
            image_url=data.get('image_url', '')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
