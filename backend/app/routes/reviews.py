from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db
from app.models.review import Review
from app.models.user import User
from app.models.product import Product

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    """Get all reviews for a product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        reviews = Review.query.filter_by(product_id=product_id).all()
        return jsonify([review.to_dict() for review in reviews]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('', methods=['POST'])
def add_review():
    """Add a review for a product"""
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['user_id', 'product_id', 'rating']):
            return jsonify({'error': 'User ID, Product ID, and rating required'}), 400
        
        if not 1 <= data['rating'] <= 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if user already reviewed this product
        existing_review = Review.query.filter_by(
            user_id=data['user_id'], 
            product_id=data['product_id']
        ).first()
        
        if existing_review:
            return jsonify({'error': 'You have already reviewed this product'}), 409
        
        review = Review(
            user_id=data['user_id'],
            product_id=data['product_id'],
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review added successfully',
            'review': review.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    """Update a review"""
    try:
        review = Review.query.get(review_id)
        
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        data = request.get_json()
        
        if 'rating' in data:
            if not 1 <= data['rating'] <= 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            review.rating = data['rating']
        
        if 'comment' in data:
            review.comment = data['comment']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Review updated successfully',
            'review': review.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    try:
        review = Review.query.get(review_id)
        
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Review deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/product/<int:product_id>/average', methods=['GET'])
def get_product_rating_average(product_id):
    """Get average rating for a product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        reviews = Review.query.filter_by(product_id=product_id).all()
        
        if not reviews:
            return jsonify({
                'average_rating': 0,
                'total_reviews': 0
            }), 200
        
        total_rating = sum(review.rating for review in reviews)
        average_rating = total_rating / len(reviews)
        
        return jsonify({
            'average_rating': round(average_rating, 1),
            'total_reviews': len(reviews)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
