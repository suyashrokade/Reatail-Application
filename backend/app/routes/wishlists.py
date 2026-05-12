from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db
from app.models.wishlist import Wishlist
from app.models.user import User
from app.models.product import Product

wishlists_bp = Blueprint('wishlists', __name__)

@wishlists_bp.route('', methods=['GET'])
def get_user_wishlist():
    """Get user's wishlist"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        if not user_id:
            return jsonify({'error': 'User ID required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        wishlists = Wishlist.query.filter_by(user_id=user_id).all()
        return jsonify([wishlist.to_dict() for wishlist in wishlists]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wishlists_bp.route('', methods=['POST'])
def add_to_wishlist():
    """Add product to user's wishlist"""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('product_id'):
            return jsonify({'error': 'User ID and Product ID required'}), 400
        
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if already in wishlist
        existing = Wishlist.query.filter_by(
            user_id=data['user_id'], 
            product_id=data['product_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'Product already in wishlist'}), 409
        
        wishlist_item = Wishlist(
            user_id=data['user_id'],
            product_id=data['product_id']
        )
        
        db.session.add(wishlist_item)
        db.session.commit()
        
        return jsonify({
            'message': 'Product added to wishlist',
            'wishlist_item': wishlist_item.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlists_bp.route('/<int:wishlist_id>', methods=['DELETE'])
def remove_from_wishlist(wishlist_id):
    """Remove product from wishlist"""
    try:
        wishlist_item = Wishlist.query.get(wishlist_id)
        
        if not wishlist_item:
            return jsonify({'error': 'Wishlist item not found'}), 404
        
        db.session.delete(wishlist_item)
        db.session.commit()
        
        return jsonify({'message': 'Product removed from wishlist'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlists_bp.route('/check', methods=['GET'])
def check_wishlist():
    """Check if product is in user's wishlist"""
    try:
        user_id = request.args.get('user_id', type=int)
        product_id = request.args.get('product_id', type=int)
        
        if not user_id or not product_id:
            return jsonify({'error': 'User ID and Product ID required'}), 400
        
        wishlist_item = Wishlist.query.filter_by(
            user_id=user_id, 
            product_id=product_id
        ).first()
        
        return jsonify({
            'in_wishlist': wishlist_item is not None,
            'wishlist_id': wishlist_item.id if wishlist_item else None
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
