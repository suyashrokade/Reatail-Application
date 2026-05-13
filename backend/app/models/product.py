from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from database import db

class Product(db.Model):
    __tablename__ = 'products'
    __table_args__ = (
        db.UniqueConstraint('name', 'category', name='uq_product_name_category'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Oils, Dals, Other Items
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    order_items = db.relationship('OrderItem', backref='product', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        total_reviews = len(self.reviews)
        average_rating = 0.0
        if total_reviews:
            average_rating = round(sum(review.rating for review in self.reviews) / total_reviews, 1)

        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'image_url': self.image_url,
            'average_rating': average_rating,
            'total_reviews': total_reviews,
            'created_at': self.created_at.isoformat()
        }
