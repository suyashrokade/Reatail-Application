from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db
from app.models.product import Product

products_bp = Blueprint('products', __name__)

# Sample data for initial products
SAMPLE_PRODUCTS = [
    # Oils
    {'name': 'Coconut Oil', 'category': 'Oils', 'description': 'Pure virgin coconut oil for cooking and hair care', 'price': 450.00, 'quantity': 50, 'image_url': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop'},
    {'name': 'Mustard Oil', 'category': 'Oils', 'description': 'Cold-pressed mustard oil with rich flavor', 'price': 350.00, 'quantity': 40, 'image_url': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop'},
    {'name': 'Sunflower Oil', 'category': 'Oils', 'description': 'Refined sunflower oil, heart-healthy choice', 'price': 400.00, 'quantity': 60, 'image_url': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop'},
    {'name': 'Olive Oil', 'category': 'Oils', 'description': 'Extra virgin olive oil from Mediterranean', 'price': 650.00, 'quantity': 30, 'image_url': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop'},
    {'name': 'Groundnut Oil', 'category': 'Oils', 'description': 'Pure groundnut oil for authentic Indian cooking', 'price': 380.00, 'quantity': 45, 'image_url': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop'},

    # Dals
    {'name': 'Moong Dal', 'category': 'Dals', 'description': 'Yellow moong dal, easy to digest', 'price': 150.00, 'quantity': 100, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},
    {'name': 'Chana Dal', 'category': 'Dals', 'description': 'Roasted chana dal, perfect for snacks', 'price': 120.00, 'quantity': 80, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},
    {'name': 'Toor Dal', 'category': 'Dals', 'description': 'Premium toor dal for authentic dal tadka', 'price': 140.00, 'quantity': 90, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},
    {'name': 'Urad Dal', 'category': 'Dals', 'description': 'Black urad dal for rich, creamy dals', 'price': 160.00, 'quantity': 70, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},
    {'name': 'Masoor Dal', 'category': 'Dals', 'description': 'Red masoor dal, quick cooking option', 'price': 130.00, 'quantity': 85, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},

    # Other Items
    {'name': 'Basmati Rice', 'category': 'Other Items', 'description': 'Long grain basmati rice, aromatic and fluffy', 'price': 200.00, 'quantity': 70, 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'},
    {'name': 'Whole Wheat Flour', 'category': 'Other Items', 'description': 'Organic wheat flour for healthy chapatis', 'price': 80.00, 'quantity': 150, 'image_url': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'},
    {'name': 'Sugar', 'category': 'Other Items', 'description': 'Refined sugar, perfect for sweets and beverages', 'price': 45.00, 'quantity': 200, 'image_url': 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&h=400&fit=crop'},
    {'name': 'Salt', 'category': 'Other Items', 'description': 'Iodized salt for daily cooking needs', 'price': 25.00, 'quantity': 300, 'image_url': 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&h=400&fit=crop'},
    {'name': 'Turmeric Powder', 'category': 'Other Items', 'description': 'Pure turmeric powder, natural antioxidant', 'price': 60.00, 'quantity': 120, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
    {'name': 'Red Chili Powder', 'category': 'Other Items', 'description': 'Spicy red chili powder for authentic taste', 'price': 75.00, 'quantity': 90, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
    {'name': 'Cumin Seeds', 'category': 'Other Items', 'description': 'Whole cumin seeds for tempering and spice', 'price': 85.00, 'quantity': 80, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
    {'name': 'Coriander Powder', 'category': 'Other Items', 'description': 'Ground coriander for aromatic dishes', 'price': 55.00, 'quantity': 110, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
    {'name': 'Garam Masala', 'category': 'Other Items', 'description': 'Blend of aromatic spices for Indian cuisine', 'price': 95.00, 'quantity': 60, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
    {'name': 'Black Pepper', 'category': 'Other Items', 'description': 'Whole black peppercorns for seasoning', 'price': 120.00, 'quantity': 50, 'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'},
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
    """Get all products or filter by category, search, or sort"""
    try:
        category = request.args.get('category')
        search = request.args.get('search', '').strip()
        sort_by = request.args.get('sort', 'name')  # name, price, quantity
        sort_order = request.args.get('order', 'asc')  # asc, desc

        query = Product.query

        # Filter by category
        if category and category != 'All':
            query = query.filter_by(category=category)

        # Search functionality
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                db.or_(
                    Product.name.ilike(search_filter),
                    Product.description.ilike(search_filter),
                    Product.category.ilike(search_filter)
                )
            )

        # Sorting
        if sort_by == 'price':
            if sort_order == 'desc':
                query = query.order_by(Product.price.desc())
            else:
                query = query.order_by(Product.price.asc())
        elif sort_by == 'quantity':
            if sort_order == 'desc':
                query = query.order_by(Product.quantity.desc())
            else:
                query = query.order_by(Product.quantity.asc())
        else:  # default: name
            if sort_order == 'desc':
                query = query.order_by(Product.name.desc())
            else:
                query = query.order_by(Product.name.asc())

        products = query.all()
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
