from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, User
import config

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Створення таблиць
with app.app_context():
    db.create_all()

@app.route('/users/register', methods=['POST'])
def register_user():
    data = request.json

    if not data.get("username") or not data.get("email"):
        return jsonify({"error": "No email or username"}), 400
    
    valid_roles = ["admin", "manager", "seller", "warehouse", "supplier"]
    role = data.get("role", "seller")   # якщо не передали, буде "seller"

    if role not in valid_roles:
        return jsonify({"error": "Invalid role"}), 400
    
    user = User(
        username=data["username"],
        email=data["email"],
        full_name=data.get("full_name", ""),
        password_hash=data.get("password_hash", ""),
        role=role
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
        "password_hash": user.password_hash,
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

if __name__ == '__main__':
    app.run(debug=True)
