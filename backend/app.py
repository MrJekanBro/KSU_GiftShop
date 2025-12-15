from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Product
import jwt
from datetime import datetime, timedelta
from functools import wraps

from flask import send_from_directory
import os

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost/souvenir_shop"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

SECRET_KEY = "super-secret-key-2025"

with app.app_context():
    db.create_all()

#  AUTH
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password_hash == password:
        token = jwt.encode(
            {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(days=1)
            },
            SECRET_KEY,
            algorithm='HS256'
        )
        return jsonify({'token': token}), 200

    return jsonify({'error': 'Невірний логін або пароль'}), 401

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Токен відсутній'}), 401
        try:
            token = token.split(" ")[1]
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({'error': 'Токен неправильний'}), 401
        return f(*args, **kwargs)
    return decorated

# USERS
@app.route('/users/register', methods=['POST'])
def register_user():
    data = request.json
    if not data.get("username") or not data.get("email"):
        return jsonify({"error": "No email or username"}), 400

    user = User(
        username=data["username"],
        email=data["email"],
        full_name=data.get("full_name", ""),
        password_hash=data.get("password_hash", ""),
        role=data.get("role", "")
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "username": user.username}), 201

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200

# PRODUCTS
@app.route('/api/products', methods=['GET'])
@token_required
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "brand": p.brand,
            "price": float(p.price),
            "quantity": p.quantity,
            "description": p.description,
            "sku": p.sku,
            "image_url": p.image_url
        }
        for p in products
    ])

@app.route('/images/products/<path:filename>')
def product_images(filename):
    return send_from_directory(
        os.path.join(app.root_path, 'image/products'),
        filename
    )

if __name__ == '__main__':
    app.run(debug=True)
