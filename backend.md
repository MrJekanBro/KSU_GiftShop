# Backend: Основи

---

## Вступ:
**Backend системи** **KSU GiftShop** реалізовано на фреймворку **Flask** (Python).
Сервер надає **RESTful API** для роботи з даними користувачів, а у майбутньому - з товарами, продажами та поставками.

У цьому документі подано:
- налаштування середовища розробки;
- код сервера (app.py, models.py);
- приклади тестування у Postman;
- інтеграцію з PostgreSQL через SQLAlchemy;
- пояснення ключових команд та ендпоінтів

---

## Налаштування:

### Для роботи сервера необхідно встановити наступні бібліотеки Python

Flask + CORS
```
pip install flask flask-cors
```

SQLAlchemy (ORM) + драйвер PostgreSQL
```
pip install sqlalchemy psycopg2-binary
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

Пояснення:
- @app.route() — створює URL-ендпоінт (маршрут) .
- jsonify() — Перетворює Python-словник в JSON-відповідь.
- request.json — отримання тіла POST/PUT запиту.

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
```

---

## Тестування:
### Перевірка в Postman
| Метод | URL | Опис | Статус |
|---|---|---|---|
| POST | /users/register | Створення нового користувача | 201 Created |
| GET | /users/(n) | Перегляд даних конкретного користувача | 200 OK |
| DELETE | /users/(n) | Видалення конкретного користувача | 200 OK |

### Скриншоти: 
### POST - створення користувача: 
![POST1](image/POST1.jpg)
![POST2](image/POST2.jpg)

### GET - перегляд користувача: 
![GET](image/GET.jpg)

### DELETE - видалення користувача: 
![DELETE1](image/DELETE1.jpg)
![DELETE2](image/DELETE2.jpg)

---

## Інтеграція з БД:
Реальна база даних - **souvenir_shop**
**SQLAlchemy** створює таблицю **users** згідно моделі

### Перевірка створення таблиці
У pgAdmin:
```
SELECT * FROM users;
```
Після успішного POST запиту в таблиці з’являється новий запис

Переваги ORM
- код Python = SQL-запити автоматично;
- не потрібно писати вручну INSERT/SELECT;
- інтеграція із UML та ER діаграмою (таблиця Users - клас User).

---

## Висновки:

### У ході практичної роботи було:
- розгорнуто середовище Flask;
- створено RESTful API відповідно до вимог;
- реалізовано базові CRUD-операції для сутності User;
- виконано підключення до PostgreSQL через SQLAlchemy;
- протестовано API через Postman;
- API відповідає UML та структурі БД з попередньої роботи.

### Отриманий backend стане основою для:
- авторизації,
- роботи з товарами,
- продажами,
- звітами,
- підключення frontend.
