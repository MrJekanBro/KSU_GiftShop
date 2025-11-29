# backend  

---

## Вступ:


---

## Налаштування:
Для роботи сервера необхідно встановити наступні пакети Python

SQLAlchemy:
```
pip install sqlalchemy psycopg2
```

Flask (CORS — для frontend):
```
pip install flask sqlalchemy psycopg2-binary flask-cors
```

SQLAlchemy: 
```
pip install sqlalchemy
```

---

## Код сервера:


### models.py (Визначення моделі даних)

```Python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(20))     # 'admin','manager','seller','warehouse','supplier'
```

---

### config.py (Конфігурація підключення)

```Python
DATABASE_URI = "postgresql://postgres:possword@localhost/souvenir_shop"
```

---

### app.py (Основний файл додатку)
Файл містить налаштування Flask, ініціалізацію БД та маршрути API.

```Python
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
```

---

## Тестування:
### Перевірка в Postman
| Метод | URL | Очікувано |
|---|---|---|
| POST | /users/register | створення нового користувача |
| GET | /users/(n) | перегляд конкретного користувача |
| DELETE | /users/(n) | видалення конкретного користувача |

## Скриншоти

### Додавання

### Перегляд

### Видалення



---

## Інтеграція з БД:



---

## Висновки:
