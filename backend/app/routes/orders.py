from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('items'):
            return jsonify({'error': 'Missing user_id or items'}), 400
        
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create order
        order = Order(user_id=data['user_id'], total_amount=0)
        total_amount = 0
        
        # Add items to order
        for item_data in data['items']:
            product = Product.query.get(item_data['product_id'])
            
            if not product:
                return jsonify({'error': f'Product {item_data["product_id"]} not found'}), 404
            
            if product.quantity < item_data['quantity']:
                return jsonify({'error': f'Insufficient quantity for {product.name}'}), 400
            
            order_item = OrderItem(
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=product.price
            )
            order.items.append(order_item)
            total_amount += product.price * item_data['quantity']
            
            # Reduce product quantity
            product.quantity -= item_data['quantity']
        
        order.total_amount = total_amount
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get order details"""
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify(order.to_dict()), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    """Get all orders for a user"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        orders = Order.query.filter_by(user_id=user_id).all()
        
        return jsonify([order.to_dict() for order in orders]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status field required'}), 400
        
        order.status = data['status']
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated',
            'order': order.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
